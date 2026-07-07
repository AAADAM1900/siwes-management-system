import { useEffect, useState } from "react";
import axios from "axios";

function ViewEvaluation() {
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/evaluations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEvaluations(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load evaluations");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Evaluations</h2>

      {evaluations.length === 0 ? (
        <p>No Evaluation Found</p>
      ) : (
        evaluations.map((evaluation) => (
          <div
            key={evaluation._id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p><strong>Score:</strong> {evaluation.score}</p>
            <p><strong>Comments:</strong> {evaluation.comments}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ViewEvaluation;