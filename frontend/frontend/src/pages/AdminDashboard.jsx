import { useState, useEffect } from "react";
import axios from "axios";
import ManageStudents from "./ManageStudents";
import ManageSupervisors from "./ManageSupervisors";
import ManagePlacements from "./ManagePlacements";
import ManageLogbooks from "./ManageLogbooks";
import ManageEvaluations from "./ManageEvaluations";
import ReportsDashboard from "./ReportsDashboard";
function AdminDashboard() {
  const [page, setPage] = useState("dashboard");
const [report, setReport] = useState({
  students: 0,
  supervisors: 0,
  placements: 0,
  logbooks: 0,
});

useEffect(() => {
  loadReport();
}, []);

const loadReport = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:5000/api/admin/report",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setReport(res.data);
  } catch (err) {
    console.log(err);
  }
};
  if (page === "students") {
    return <ManageStudents />;
  }

  if (page === "supervisors") {
    return <ManageSupervisors />;
  }

  if (page === "placements") {
    return <ManagePlacements />;
  }

  if (page === "logbooks") {
    return <ManageLogbooks />;
  }

  if (page === "evaluations") {
    return <ManageEvaluations />;
  }
if (page === "reports") {
  return <ReportsDashboard />;
}
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.reload();
  };

  return (
    <div className="container">
  <div className="card">

      <h1>Admin Dashboard</h1>
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
    gap: "20px",
    marginBottom: "30px",
  }}
>
  <div
  className="card"
  style={{ cursor: "pointer" }}
  onClick={() => setPage("students")}
>
  <h2>👨‍🎓 Students</h2>
<h1>{report.students}</h1>
</div>

  <div
  className="card"
  style={{ cursor: "pointer" }}
  onClick={() => setPage("supervisors")}
>
  <h2>👨‍🏫 Supervisors</h2>
<h1>{report.supervisors}</h1>
</div>

  <div
  className="card"
  style={{ cursor: "pointer" }}
  onClick={() => setPage("placements")}
>
  <h2>🏢 Placements</h2>
<h1>{report.placements}</h1>
</div>

  <div
  className="card"
  style={{ cursor: "pointer" }}
  onClick={() => setPage("reports")}
>
  <h2>📘 Logbooks</h2>
<h1>{report.logbooks}</h1>
</div>
</div>
      <button
  style={{
    width: "250px",
    marginBottom: "10px"
  }}
  onClick={() => setPage("students")}
>
        Manage Students
      </button>

      <br /><br />

      <button
  style={{ width: "250px", marginBottom: "10px" }}
  onClick={() => setPage("supervisors")}
>
        Manage Supervisors
      </button>

      <br /><br />

      <button
  style={{ width: "250px", marginBottom: "10px" }}
  onClick={() => setPage("placements")}
>
        Manage Placements
      </button>

      <br /><br />

      <button
  style={{ width: "250px", marginBottom: "10px" }}
  onClick={() => setPage("logbooks")}
>
        Manage Logbooks
      </button>

      <br /><br />

      <button
  style={{ width: "250px", marginBottom: "10px" }}
  onClick={() => setPage("Evaluations")}
>
        Manage Evaluations
      </button>

      <br /><br />
<button
  style={{ width: "250px", marginBottom: "10px" }}
  onClick={() => setPage("Reports Dashboard")}
>
  Reports Dashboard
</button>

<br /><br />
 <button
  style={{ width: "250px", marginBottom: "10px" }}
  onClick={() => setPage("Logout")}
>
        Logout
      </button>

    </div>
  </div>
);
}

export default AdminDashboard;