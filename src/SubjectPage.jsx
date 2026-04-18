import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function SubjectPage() {
  const { id } = useParams();
  const [lessons, setLessons] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const nav = useNavigate();
  const invalidId = !id || id === "${id}" || id === "{id}";
  const backendUrl = "http://localhost:5000";

  useEffect(() => {
    if (!id || id === "${id}" || id === "{id}") return;

    const loadLessons = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/lessons/subject/${id}`);
        setLessons(res.data);
      } catch (err) {
        console.error("Error fetching lessons:", err);
      }
    };

    loadLessons();
  }, [id]);

  const addLesson = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("subject", id);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axios.post(`${backendUrl}/api/lessons`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTitle("");
      setContent("");
      setImageFile(null);

      const res = await axios.get(`${backendUrl}/api/lessons/subject/${id}`);
      setLessons(res.data);
    } catch (err) {
      console.error("Error adding lesson:", err);
    }
  };

  if (invalidId) return <div className="page-container">Invalid subject selected.</div>;

  
  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ margin: 0 }}>Lessons</h2>
        <button className="secondary" onClick={() => nav(-1)}>← Back</button>
      </div>

      <div className="input-group">
        <label>Lesson Title</label>
        <input
          placeholder="Lesson Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Lesson Content</label>
        <textarea
          placeholder="Lesson Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Lesson Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0] || null)}
        />
      </div>
      <button onClick={addLesson} className="add-button">Add Lesson</button>

      <div className="cards-grid" style={{ marginTop: "40px" }}>
        {lessons.map((l, idx) => {
          const gradients = ["gradient-1", "gradient-2", "gradient-3", "gradient-4", "gradient-5", "gradient-6"];
          return (
            <div
              key={l._id}
              className={`card ${gradients[idx % gradients.length]}`}
              style={{ cursor: "pointer", flexDirection: "column", minHeight: "auto", padding: "16px" }}
              onClick={() => nav(`/lesson/${l._id}`)}
            >
              <div style={{ marginBottom: "12px", fontSize: "16px" }}>{l.title}</div>
              {l.imageUrl && (
                <img
                  src={`${backendUrl}${l.imageUrl}`}
                  alt={l.title}
                  style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: "8px" }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}