import { useState } from "react";
import axios from "axios";

function Evaluation() {
  const [studentId, setStudentId] = useState("");
  const [score, setScore] = useState("");
  const [comments, setComments] = useState("");

  const submitEvaluation = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/evaluations",
        {
          studentId,
          score,
          comments,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Evaluation Submitted Successfully");

      setStudentId("");
      setScore("");
      setComments("");
    } catch (err) {
      console.log(err);
      alert("Failed to Submit Evaluation");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Student Evaluation</h2>

      <input
        type="text"
        placeholder="Student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Score"
        value={score}
        onChange={(e) => setScore(e.target.value)}
      />

      <br /><br />

      <textarea
        rows="5"
        cols="50"
        placeholder="Comments"
        value={comments}
        onChange={(e) => setComments(e.target.value)}
      />

      <br /><br />

      <button onClick={submitEvaluation}>
        Submit Evaluation
      </button>
    </div>
  );
}

export default Evaluation;