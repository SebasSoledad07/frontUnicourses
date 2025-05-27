import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/LoginForm";
import Register from "./pages/Auth/RegisterForm";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import StudentProfile from "./pages/Student/StudentProfile";
import EditProfile from "./pages/Student/EditProfile";
import CoursesPage from "./pages/Student/CoursesPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<CoursesPage />} />
          <Route path="/student-profile" element={<StudentProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          {/* Protected route for the main page */}

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <h1>Bienvenido al sistema de recomendación de cursos</h1>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
