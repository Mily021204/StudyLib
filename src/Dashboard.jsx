import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const loadUser = async () => {
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: token },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };

    const loadSubjects = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/subjects");
        setSubjects(res.data);
      } catch (err) {
        console.error("Error fetching subjects:", err);
      }
    };

    loadUser();
    loadSubjects();
  }, []);
  const addSubject = async () => {
  try {
    await axios.post("http://localhost:5000/api/subjects", { name });
    setName("");

    const res = await axios.get("http://localhost:5000/api/subjects");
    setSubjects(res.data);
  } catch (err) {
    console.error("Error adding subject:", err);
  }
};

  const deleteSubject = async (subjectId) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/subjects/${subjectId}`);
        console.log("Delete response:", response);
        const res = await axios.get("http://localhost:5000/api/subjects");
        setSubjects(res.data);
        alert("Subject deleted successfully");
      } catch (err) {
        console.error("Error deleting subject:", err.response || err);
        alert("Failed to delete subject: " + (err.response?.data?.error || err.message));
      }
    }
  };
 
  return (
    <div className="container">
      {user ? (
        <div className="hero">
          <div className="hero-content">
            <h1>
              Investing in <span className="accent">Knowledge and Your Future</span>
            </h1>
            <p>
              Our e-learning program has been developed to help unlock the skills you need to thrive in today's digital world.
            </p>
            <button onClick={() => nav("/profile")}>Edit Profile</button>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">50+</div>
                <div className="stat-label">Total Subjects</div>
              </div>
              <div className="stat">
                <div className="stat-number">{subjects.length}</div>
                <div className="stat-label">Active Subjects</div>
              </div>
            </div>
          </div>
          <div className="hero-image">
            {user.profileUrl ? (
              <img src={`http://localhost:5000${user.profileUrl}`} alt={user.name} />
            ) : (
              <div style={{ width: 300, height: 300, background: "rgba(255, 165, 0, 0.1)", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", color: "#808080" }}>
                No Profile Image
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", marginTop: "60px" }}>
          <h1>Welcome to StudyLib</h1>
          <p>Please log in to see your account details.</p>
        </div>
      )}

      <div className="section-title">Browse Top Essential Subjects</div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <input
          placeholder="New Subject"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ flex: 1 }}
        />
        <button onClick={addSubject} style={{ width: "auto", margin: 0 }}>Add</button>
      </div>

      <div className="cards-grid">
        {subjects.map((s, idx) => {
          const gradients = ["gradient-1", "gradient-2", "gradient-3", "gradient-4", "gradient-5", "gradient-6"];
          return (
            <div key={s._id} style={{ position: "relative" }}>
              <div
                className={`card ${gradients[idx % gradients.length]}`}
                onClick={() => nav(`/subject/${s._id}`)}
                style={{ cursor: "pointer" }}
              >
                {s.name}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSubject(s._id);
                }}
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  background: "rgba(0, 0, 0, 0.5)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  padding: 0
                }}
                title="Delete subject"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}