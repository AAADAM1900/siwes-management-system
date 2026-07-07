import { useEffect, useState } from "react";
import axios from "axios";

function ViewLogbooks() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadLogbooks();
  }, []);

  const loadLogbooks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/logbooks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLogs(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load logbooks");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Logbooks</h2>

      {logs.length === 0 ? (
        <p>No Logbooks Found</p>
      ) : (
        logs.map((log) => (
          <div
            key={log._id}
            style={{
              border: "1px solid black",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h4>{new Date(log.date).toLocaleDateString()}</h4>
            <p>{log.content}</p>
            <p>Status: {log.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ViewLogbooks;