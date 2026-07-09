import { useState } from "react";
import ViewAllLogbooks from "./ViewAllLogbooks";
import Evaluation from "./Evaluation";

function SupervisorDashboard() {
  const [page, setPage] = useState("dashboard");

  if (page === "logs") {
    return <ViewAllLogbooks />;
  }

  if (page === "evaluation") {
    return <Evaluation />;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Supervisor Dashboard</h1>

      <button onClick={() => setPage("logs")}>
        View Student Logbooks
      </button>

      <br /><br />

      <button onClick={() => setPage("evaluation")}>
        Evaluate Student
      </button>

      <br /><br />

      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          window.location.reload();
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default SupervisorDashboard;