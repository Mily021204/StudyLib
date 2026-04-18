import { Routes, Route } from "react-router-dom";


import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import LessonPage from "./LessonPage";
import SubjectPage from "./SubjectPage";
import Profile from "./Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/subject/:id" element={<SubjectPage />} />
      <Route path="/lesson/:id" element={<LessonPage />} />
    </Routes>
  );
}

export default App;