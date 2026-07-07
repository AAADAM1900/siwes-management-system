import { useEffect, useState } from "react";
import axios from "axios";

function ViewAllLogbooks() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/supervisor/logbooks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLogs(res.data);
    } catch (err) {
      alert("Failed to load logbooks");
      console.log(err);
    }
  };

  const approveLogbook = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/supervisor/logbooks/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Logbook Approved");
      fetchLogs();
    } catch (err) {
      alert("Failed to approve logbook");
      console.log(err);
    }
  };

  const rejectLogbook = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/supervisor/logbooks/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Logbook Rejected");
      fetchLogs();
    } catch (err) {
      alert("Failed to reject logbook");
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Student Logbooks</h2>

      {logs.length === 0 ? (
        <p>No logbooks available.</p>
      ) : (
        logs.map((log) => (
          <div
            key={log._id}
            style={{
              border: "1px solid #000",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p><strong>Student ID:</strong> {log.studentId}</p>
            <p><strong>Content:</strong> {log.content}</p>
            <p><strong>Status:</strong> {log.status}</p>

            <button onClick={() => approveLogbook(log._id)}>
              Approve
            </button>

            <button
              style={{ marginLeft: "10px" }}
              onClick={() => rejectLogbook(log._id)}
            >
              Reject
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default ViewAllLogbooks;