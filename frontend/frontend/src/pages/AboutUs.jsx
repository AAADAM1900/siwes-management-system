import { useState } from "react";
import Login from "../Login";

function AboutUs() {
  const [back, setBack] = useState(false);

  if (back) {
    return <Login />;
  }

  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "auto" }}>
      <h1>About Us</h1>

      <h2>SIWES Management System</h2>

      <p>
        This SIWES Management System was developed as a practicum project to
        simplify the management of Students Industrial Work Experience Scheme
        (SIWES) activities.
      </p>

      <h3>Project Objectives</h3>

      <ul>
        <li>Manage student SIWES placement.</li>
        <li>Submit weekly logbooks.</li>
        <li>Allow supervisors to approve or reject logbooks.</li>
        <li>Evaluate students.</li>
        <li>Provide an Admin Management Dashboard.</li>
      </ul>

      <h3>Group Members</h3>

      <ol>
        <li>Member 1 – Matric Number</li>
        <li>Member 2 – Matric Number</li>
        <li>Member 3 – Matric Number</li>
        <li>Member 4 – Matric Number</li>
        <li>Member 5 – Matric Number</li>
      </ol>

      <h3>Supervisor</h3>

      <p>Lecturer's Name</p>

      <h3>Institution</h3>

      <p>Iconic Open University</p>

      <h3>Academic Session</h3>

      <p>2025/2026</p>

      <br />

      <button onClick={() => setBack(true)}>
        Back to Login
      </button>
    </div>
  );
}

export default AboutUs;