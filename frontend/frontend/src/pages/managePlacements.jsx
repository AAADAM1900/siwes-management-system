import { useEffect, useState } from "react";
import axios from "axios";

function ManagePlacements() {
  const [placements, setPlacements] = useState([]);
  const [student, setStudent] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    loadPlacements();
  }, []);

  const loadPlacements = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/admin/placements",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPlacements(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load placements");
    }
  };
    const addPlacement = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/admin/placements",
        {
          student,
          company,
          location,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Placement Added Successfully");

      setStudent("");
      setCompany("");
      setLocation("");

      loadPlacements();
    } catch (err) {
      console.log(err);
      alert("Failed to Add Placement");
    }
  };
    const editPlacement = async (id) => {
    const newStudent = prompt("Enter Student Name");
    const newCompany = prompt("Enter Company Name");
    const newLocation = prompt("Enter Location");

    if (!newStudent || !newCompany || !newLocation) return;

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/admin/placements/${id}`,
        {
          student: newStudent,
          company: newCompany,
          location: newLocation,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Placement Updated Successfully");
      loadPlacements();
    } catch (err) {
      console.log(err);
      alert("Failed to Update Placement");
    }
  };

  const deletePlacement = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this placement?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/admin/placements/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Placement Deleted Successfully");
      loadPlacements();
    } catch (err) {
      console.log(err);
      alert("Failed to Delete Placement");
    }
  };
    return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Placements</h2>

      <h3>Add Placement</h3>

      <input
        type="text"
        placeholder="Student Name"
        value={student}
        onChange={(e) => setStudent(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Company Name"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <br /><br />

      <button onClick={addPlacement}>
        Add Placement
      </button>

      <hr />

      {placements.length === 0 ? (
        <p>No Placements Found</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Student</th>
              <th>Company</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {placements.map((placement) => (
              <tr key={placement._id}>
                <td>{placement.student}</td>
                <td>{placement.company}</td>
                <td>{placement.location}</td>

                <td>
                  <button
                    onClick={() => editPlacement(placement._id)}
                  >
                    Edit
                  </button>

                  <button
                    style={{ marginLeft: "10px" }}
                    onClick={() => deletePlacement(placement._id)}
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

export default ManagePlacements;