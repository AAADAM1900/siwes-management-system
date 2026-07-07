import { useEffect, useState } from "react";
import axios from "axios";

function ViewPlacement() {
  const [placements, setPlacements] = useState([]);

  useEffect(() => {
    fetchPlacements();
  }, []);

  const fetchPlacements = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/placements",
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

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Placements</h2>

      {placements.length === 0 ? (
        <p>No Placement Found</p>
      ) : (
        placements.map((placement) => (
          <div
            key={placement._id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p><strong>Company:</strong> {placement.company}</p>
            <p><strong>Status:</strong> {placement.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ViewPlacement;