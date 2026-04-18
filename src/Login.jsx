import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      nav("/dashboard");
    } catch (err) {
      console.error(err);
      const message = err.response?.data || err.message || "Login failed";
      alert(message);
    }
  };

  return (
    <div className="form-container">
      <h2>StudyLib Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>

      
      <p style={{ textAlign: "center", marginTop: "15px" }}>
        Don’t have an account?{" "}
        <Link to="/register" style={{ color: "#ffa500", fontWeight: "bold" }}>
          Register here
        </Link>
      </p>
    </div>
  );
}