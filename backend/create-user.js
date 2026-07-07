require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

mongoose.connect(process.env.MONGO_URI);

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
});

const User = mongoose.model("User", UserSchema);

async function createUser() {
  const hashedPassword = await bcrypt.hash("123456", 10);

  const user = new User({
    name: "Admin User",
    email: "admin@test.com",
    password: hashedPassword,
    role: "admin",
  });

  await user.save();

  console.log("✅ Supervisor Created Successfully!");

  mongoose.connection.close();
}

createUser();