import { useState } from "react";
import axios from "axios";

function Logbook() {
  const [content, setContent] = useState("");

  const submitLogbook = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/logbooks",
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Logbook Submitted Successfully");
    } catch (err) {
     console.log("Status:", err.response?.status);
     console.log("Data:", err.response?.data);
      alert("Failed to Submit Logbook");
    }
  };

  return (
    <div>
      <h2>Weekly Logbook</h2>

      <textarea
        rows="8"
        cols="50"
        placeholder="Write your weekly activities..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <br /><br />

      <button onClick={submitLogbook}>
        Submit Logbook
      </button>
    </div>
  );
}

export default Logbook;