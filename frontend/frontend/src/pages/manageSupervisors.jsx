import { useEffect, useState } from "react";
import axios from "axios";

function ManageSupervisors() {
  const [supervisors, setSupervisors] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    loadSupervisors();
  }, []);

  const loadSupervisors = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/admin/supervisors",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSupervisors(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load supervisors");
    }
  };
   const addSupervisor = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/admin/supervisors",
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

      alert("Supervisor Added Successfully");

      setName("");
      setEmail("");
      setPassword("");

      loadSupervisors();
    } catch (err) {
      console.log(err);
      alert("Failed to Add Supervisor");
    }
  };
     const editSupervisor = async (id) => {
    const newName = prompt("Enter New Name");
    const newEmail = prompt("Enter New Email");

    if (!newName || !newEmail) return;

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/admin/supervisors/${id}`,
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

      alert("Supervisor Updated Successfully");
      loadSupervisors();
    } catch (err) {
      console.log(err);
      alert("Failed to Update Supervisor");
    }
  };

  const deleteSupervisor = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this supervisor?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/admin/supervisors/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Supervisor Deleted Successfully");
      loadSupervisors();
    } catch (err) {
      console.log(err);
      alert("Failed to Delete Supervisor");
    }
  };
    return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Supervisors</h2>

      <h3>Add Supervisor</h3>

      <input
        type="text"
        placeholder="Supervisor Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        type="email"
        placeholder="Supervisor Email"
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

      <button onClick={addSupervisor}>
        Add Supervisor
      </button>

      <hr />

      {supervisors.length === 0 ? (
        <p>No Supervisors Found</p>
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
            {supervisors.map((supervisor) => (
              <tr key={supervisor._id}>
                <td>{supervisor.name}</td>
                <td>{supervisor.email}</td>
                <td>{supervisor.role}</td>
                <td>
                  <button
                    onClick={() => editSupervisor(supervisor._id)}
                  >
                    Edit
                  </button>

                  <button
                    style={{ marginLeft: "10px" }}
                    onClick={() => deleteSupervisor(supervisor._id)}
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

export default ManageSupervisors;