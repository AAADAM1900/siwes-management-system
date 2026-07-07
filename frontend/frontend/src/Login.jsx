import { useState } from "react";
import axios from "axios";

import StudentDashboard from "./pages/StudentDashboard";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AboutUs from "./pages/AboutUs";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  if (showAbout) {
    return <AboutUs />;
  }

  if (loggedIn) {
    const role = localStorage.getItem("role");

    if (role === "admin") {
      return <AdminDashboard />;
    }

    if (role === "supervisor") {
      return <SupervisorDashboard />;
    }

    return <StudentDashboard />;
  }

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      setLoggedIn(true);
    } catch (err) {
      alert("Login Failed");
      console.log(err);
    }
  };

  return (
    <div style={{ width: "350px", margin: "100px auto" }}>
      <h2>SIWES Management Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>Login</button>

      <br /><br />

      <button onClick={() => setShowAbout(true)}>
        About Us
      </button>
    </div>
  );
}

export default Login;