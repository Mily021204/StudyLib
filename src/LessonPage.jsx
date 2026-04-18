import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function LessonPage() {
  const { id } = useParams(); 
  const [lesson, setLesson] = useState(null);
  const nav = useNavigate();
  const invalidId = !id || id === "${id}" || id === "{id}";

  useEffect(() => {
    if (!id || id === "${id}" || id === "{id}") return;

    const loadLesson = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/lessons/${id}`
        );
        setLesson(res.data);
      } catch (err) {
        console.error("Error fetching lesson:", err);
      }
    };

    loadLesson();
  }, [id]);

  if (invalidId) return <div className="page-container">Invalid lesson selected.</div>;

 
  if (!lesson) return <div className="page-container">Loading...</div>;

  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ margin: 0 }}>{lesson.title}</h2>
        <button className="secondary" onClick={() => nav(-1)}>← Back</button>
      </div>
      {lesson.imageUrl && (
        <img
          src={`http://localhost:5000${lesson.imageUrl}`}
          alt={lesson.title}
          style={{ width: "100%", height: 300, objectFit: "cover", borderRadius: "12px", marginBottom: "24px" }}
        />
      )}
      <p>{lesson.content}</p>
    </div>
  );
}