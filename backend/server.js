require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("./models/User");
const Placement = require("./models/Placement");
const Logbook = require("./models/Logbook");
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
console.log("MONGO_URI:", 
process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('DB Error:', err));

// DATABASE SCHEMAS

const EvaluationSchema = new mongoose.Schema({
  studentId: String,
  score: String,
  comments: String
});
const Evaluation = mongoose.model('Evaluation', EvaluationSchema);

// JWT Authentication Middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) throw new Error();

    console.log("Decoded:", decoded);
    console.log("User:", user);

    req.user = user;

    next();
  } catch (err) {
    res.status(401).json({ error: "Please authenticate" });
  }
};

// Register
app.post('/api/register', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    ...req.body,
    password: hashedPassword
  });

  await user.save();

  res.status(201).json({
    message: 'User registered',
    user
  });
});

// Login
app.post('/api/login', async (req, res) => {
  const user = await User.findOne({
    email: req.body.email
  });

  if (!user)
    return res.status(400).json({
      error: 'Invalid credentials'
    });

  const isMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isMatch)
    return res.status(400).json({
      error: 'Invalid credentials'
    });

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET
  );

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      role: user.role
    }
  });
});


// Create Placement
app.post('/api/placements', auth, async (req, res) => {
  try {
    const placement = new Placement({
      studentId: req.user.id,
      company: req.body.company,
      status: "Pending"
    });

    await placement.save();

    console.log("Placement Saved:", placement);

    res.status(201).json({
      message: "Placement submitted successfully",
      placement
    });

  } catch (err) {
    console.error("Placement Error:", err);

    res.status(500).json({
      error: err.message
    });
  }
});
// View My Placement
app.get('/api/placements', auth, async (req, res) => {
  try {
    const placements = await Placement.find({
      studentId: req.user.id
    });

    res.json(placements);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});
// Logbook
app.post('/api/logbooks', auth, async (req, res) => {
  try {
    const log = new Logbook({
      content: req.body.content,
      studentId: req.user.id,
      date: new Date(),
      status: "Pending"
    });

    await log.save();

    console.log("Saved Logbook:", log);

    res.status(201).json({
      message: "Log submitted",
      log
    });
  } catch (err) {
    console.error("Logbook Save Error:", err);
    res.status(500).json({
      error: err.message
    });
  }
});
// Evaluation
app.post('/api/evaluations', auth, async (req, res) => {
  try {
    const evaluation = new Evaluation({
      studentId: req.body.studentId,
      score: req.body.score,
      comments: req.body.comments
    });

    await evaluation.save();

    res.status(201).json({
      message: "Evaluation saved successfully",
      evaluation
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// View My Logbooks
app.get('/api/logbooks', auth, async (req, res) => {
  try {
    const logs = await Logbook.find({
      studentId: req.user.id
    });

    res.json(logs);
  } catch (err) {
    res.status(500).json({
      error: "Server Error"
    });
  }
});

// Supervisor - View All Logbooks
app.get('/api/supervisor/logbooks', auth, async (req, res) => {
  try {
    const logs = await Logbook.find();

    res.json(logs);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// Approve Logbook
app.put('/api/supervisor/logbooks/:id/approve', auth, async (req, res) => {
  try {
    const log = await Logbook.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    );

    res.json({
      message: "Logbook Approved",
      log
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// Reject Logbook
app.put('/api/supervisor/logbooks/:id/reject', auth, async (req, res) => {
  try {
    const log = await Logbook.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true }
    );

    res.json({
      message: "Logbook Rejected",
      log
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// View My Evaluations
app.get('/api/evaluations', auth, async (req, res) => {
  try {
    const evaluations = await Evaluation.find({
      studentId: req.user.id
    });

    res.json(evaluations);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// =========================
// ADMIN ROUTES
// =========================

// Admin - View All Students
app.get('/api/admin/students', auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access Denied"
      });
    }

    const students = await User.find({
      role: "student"
    }).select("-password");

    res.json(students);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// Admin - View All Supervisors
app.get('/api/admin/supervisors', auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access Denied"
      });
    }

    const supervisors = await User.find({
      role: "supervisor"
    }).select("-password");

    res.json(supervisors);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// Admin - View All Placements
app.get('/api/admin/placements', auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access Denied"
      });
    }

    const placements = await Placement.find();

    res.json(placements);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// Admin - View All Evaluations
app.get('/api/admin/evaluations', auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access Denied"
      });
    }

    const evaluations = await Evaluation.find();

    res.json(evaluations);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});
// =========================
// Admin - Add Student
// =========================
app.post("/api/admin/students", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access Denied",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const student = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: "student",
    });

    await student.save();

    res.status(201).json({
      message: "Student Added Successfully",
      student,
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
  });
 // =========================
// Admin - Update Student
// =========================
app.put("/api/admin/students/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access Denied",
      });
    }

    const student = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
      },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({
        error: "Student not found",
      });
    }

    res.json({
      message: "Student Updated Successfully",
      student,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// =========================
// Admin - Delete Student
// =========================
app.delete("/api/admin/students/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access Denied",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "Student Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
// =========================
// Admin Report Dashboard
// =========================
app.get("/api/admin/report", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access Denied",
      });
    }

    const students = await User.countDocuments({ role: "student" });
    const supervisors = await User.countDocuments({ role: "supervisor" });
    const placements = await Placement.countDocuments();
    const logbooks = await Logbook.countDocuments();

    res.json({
      students,
      supervisors,
      placements,
      logbooks,
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend API running on port ${PORT}`);
});
// =========================
// Admin - Add Supervisor
// =========================
app.post("/api/admin/supervisors", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access Denied",
      });
    }

    const bcrypt = require("bcryptjs");

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const supervisor = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: "supervisor",
    });

    await supervisor.save();

    res.json({
      message: "Supervisor Added Successfully",
      supervisor,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
// =========================
// Admin - Update Supervisor
// =========================
app.put("/api/admin/supervisors/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access Denied",
      });
    }

    const supervisor = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
      },
      { new: true }
    );

    if (!supervisor) {
      return res.status(404).json({
        error: "Supervisor not found",
      });
    }

    res.json({
      message: "Supervisor Updated Successfully",
      supervisor,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
// =========================
// Admin - Delete Supervisor
// =========================
app.delete("/api/admin/supervisors/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access Denied",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "Supervisor Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
// =========================
// Admin - Add Placement
// =========================
app.post("/api/admin/placements", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access Denied",
      });
    }

    const placement = new Placement({
      student: req.body.student,
      company: req.body.company,
      location: req.body.location,
    });

    await placement.save();

    res.json({
      message: "Placement Added Successfully",
      placement,
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
// =========================
// Admin - Update Placement
// =========================
app.put("/api/admin/placements/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access Denied",
      });
    }

    const placement = await Placement.findByIdAndUpdate(
      req.params.id,
      {
        student: req.body.student,
        company: req.body.company,
        location: req.body.location,
      },
      { new: true }
    );

    if (!placement) {
      return res.status(404).json({
        error: "Placement not found",
      });
    }

    res.json({
      message: "Placement Updated Successfully",
      placement,
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
// =========================
// Admin - Delete Placement
// =========================
app.delete("/api/admin/placements/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access Denied",
      });
    }

    await Placement.findByIdAndDelete(req.params.id);

    res.json({
      message: "Placement Deleted Successfully",
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});