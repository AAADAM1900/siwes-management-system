import { useEffect, useState } from "react";
import axios from "axios";

function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
      useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/admin/students",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStudents(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load students");
    }
  };

  const addStudent = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/admin/students",
        {
          name,
          email,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Student Added Successfully");

      setName("");
      setEmail("");
      setPassword("");

      loadStudents();
    } catch (err) {
      console.log(err);
      alert("Failed to Add Student");
    }
  };
    const editStudent = async (id) => {
    const newName = prompt("Enter New Name");
    const newEmail = prompt("Enter New Email");

    if (!newName || !newEmail) return;

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/admin/students/${id}`,
        {
          name: newName,
          email: newEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Student Updated Successfully");
      loadStudents();
    } catch (err) {
      console.log(err);
      alert("Failed to Update Student");
    }
  };

  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/admin/students/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Student Deleted Successfully");
      loadStudents();
    } catch (err) {
      console.log(err);
      alert("Failed to Delete Student");
    }
  };
    return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Students</h2>

      <h3>Add Student</h3>

      <input
        type="text"
        placeholder="Student Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        type="email"
        placeholder="Student Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={addStudent}>Add Student</button>

      <hr />

      {students.length === 0 ? (
        <p>No Students Found</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.role}</td>
                <td>
                  <button onClick={() => editStudent(student._id)}>
                    Edit
                  </button>

                  <button
                    style={{ marginLeft: "10px" }}
                    onClick={() => deleteStudent(student._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageStudents;