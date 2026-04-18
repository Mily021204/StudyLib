import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const backendUrl = "http://localhost:5000";

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const loadProfile = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/auth/me`, {
          headers: { Authorization: token },
        });

        setUser(res.data);
        setName(res.data.name || "");
        setBio(res.data.bio || "");
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };

    loadProfile();
  }, [token, navigate]);

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      if (profileFile) {
        formData.append("profile", profileFile);
      }

      const res = await axios.put(`${backendUrl}/api/auth/me`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(res.data);
      setMessage("Profile updated successfully.");
      setProfileFile(null);
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage("Failed to update profile.");
    }
  };

  if (!user) return <div className="container">Loading profile...</div>;

  return (
    <div className="container profile-page">
      <h2>My Profile</h2>
      <div className="profile-header">
        {user.profileUrl && (
          <img
            className="profile-avatar"
            src={`${backendUrl}${user.profileUrl}`}
            alt="Profile"
          />
        )}
      </div>

      <div className="profile-form">
        <div className="form-group">
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
          />
        </div>

        <div className="form-group">
          <label>Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfileFile(e.target.files[0] || null)}
          />
        </div>

        <div className="profile-actions">
          <button onClick={handleSave}>Save Profile</button>
          <button className="secondary" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
        </div>

        {message && <p className="form-message">{message}</p>}
      </div>
    </div>
  );
}
