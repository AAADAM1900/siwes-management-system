import { useState } from "react";
import axios from "axios";

function Placement() {
  const [company, setCompany] = useState("");

  const submitPlacement = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/placements",
        {
          company,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Placement Submitted Successfully");
      setCompany("");
    } catch (err) {
      console.log(err);
      alert("Failed to Submit Placement");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Placement</h2>

      <input
        type="text"
        placeholder="Company Name"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <br /><br />

      <button onClick={submitPlacement}>
        Submit Placement
      </button>
    </div>
  );
}

export default Placement;