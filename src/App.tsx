import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/LoginForm";
import Register from "./pages/Auth/RegisterForm";
import { AuthProvider } from "./context/AuthContext";
import StudentProfile from "./pages/Student/StudentProfile";
import EditProfile from "./pages/Student/EditProfile";
import CoursesPage from "./pages/Student/CoursesPage";
import Admin from "./pages/Admin/Admin";
import { RoleProtectedRoute } from "./context/RoleProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas por autenticación */}
          <Route
            path="/home"
            element={
              <RoleProtectedRoute role="estudiante">
                <CoursesPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/student-profile"
            element={
              <RoleProtectedRoute role="estudiante">
                <StudentProfile />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <RoleProtectedRoute role="estudiante">
                <EditProfile />
              </RoleProtectedRoute>
            }
          />

          {/* Ruta protegida para admin */}
          <Route
            path="/admin"
            element={
              <RoleProtectedRoute role="administrador">
                <Admin />
              </RoleProtectedRoute>
            }
          />

          {/* Página principal protegida por login (cualquier rol) */}
          <Route
            path="/"
            element={
              <h1 className="text-center mt-10">
                Bienvenido al sistema de recomendación de cursos
              </h1>
            }
          />

          {/* Página en caso de acceso no autorizado */}
          <Route path="/unauthorized" element={<h1>Acceso no autorizado</h1>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
