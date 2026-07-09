import { useState } from "react";
import Logbook from "./Logbook";
import ViewLogbooks from "./ViewLogbooks";
import Placement from "./Placement";
import ViewPlacement from "./ViewPlacement";
import ViewEvaluation from "./ViewEvaluation";

function StudentDashboard() {
  const [page, setPage] = useState("dashboard");

  if (page === "logbook") {
    return <Logbook />;
  }

  if (page === "viewlogbooks") {
    return <ViewLogbooks />;
  }

  if (page === "placement") {
    return <Placement />;
  }

  if (page === "viewplacement") {
    return <ViewPlacement />;
  }

  if (page === "evaluation") {
    return <ViewEvaluation />;
  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.reload();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Student Dashboard</h1>

      <button onClick={() => setPage("logbook")}>
        Submit Logbook
      </button>

      <br /><br />

      <button onClick={() => setPage("viewlogbooks")}>
        View My Logbooks
      </button>

      <br /><br />

      <button onClick={() => setPage("placement")}>
        Submit Placement
      </button>

      <br /><br />

      <button onClick={() => setPage("viewplacement")}>
        View Placement
      </button>

      <br /><br />

      <button onClick={() => setPage("evaluation")}>
        View Evaluation
      </button>

      <br /><br />

      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default StudentDashboard;