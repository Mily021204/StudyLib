import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          name,
          email,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);
      nav("/dashboard");
    } catch (err) {
      console.error(err);
      let message = "Registration failed";
      if (err.response?.data) {
        message = typeof err.response.data === "string" ? err.response.data : JSON.stringify(err.response.data);
      } else if (err.message) {
        message = err.message;
      }
      alert(message);
    }
  };

  return (
    <div className="form-container">
      <h2>StudyLib Register</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

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

      <button onClick={handleRegister}>Register</button>

     
      <p style={{ textAlign: "center", marginTop: "15px" }}>
        Already have an account?{" "}
        <Link to="/" style={{ color: "#ffa500", fontWeight: "bold" }}>
          Login here
        </Link>
      </p>
    </div>
  );
}