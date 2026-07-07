import { useEffect, useState } from "react";
import axios from "axios";

function ReportsDashboard() {
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
      alert("Failed to load report");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Reports Dashboard</h2>

      <h3>Total Students: {report.students}</h3>

      <h3>Total Supervisors: {report.supervisors}</h3>

      <h3>Total Placements: {report.placements}</h3>

      <h3>Total Logbooks: {report.logbooks}</h3>

    </div>
  );
}

export default ReportsDashboard;