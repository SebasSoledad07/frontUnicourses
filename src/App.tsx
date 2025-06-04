import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Auth/LoginForm";
import Register from "./pages/Auth/RegisterForm";

import { AuthProvider } from "./context/AuthContext";
import StudentProfile from "./pages/Student/StudentProfile";
import EditProfile from "./pages/Student/EditProfile";

import { RoleProtectedRoute } from "./context/RoleProtectedRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./pages/Layout/AdminLayout";
import ListaCursos from "./components/Admin/Cursos/ListaCursos";
import StudentLayout from "./pages/Layout/StudentLayout";
import CoursesPage from "./pages/Student/CoursesPage";
import StudentCoursesView from "./pages/Student/StudentCourseView";
import CrearCurso from "./components/Admin/Cursos/CrearCurso";

//import Usuarios from "./components/Admin/Usuarios";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <h1 className="text-center mt-10">
                  Bienvenido al sistema de recomendación de cursos
                </h1>
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<h1>Acceso no autorizado</h1>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Navigate to="/student" replace />} />
          <Route
            path="/student"
            element={
              <RoleProtectedRoute role="estudiante">
                <StudentLayout />
              </RoleProtectedRoute>
            }
          >
            <Route path="profile" element={<StudentProfile />} />
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="explore" element={<StudentCoursesView />} />
          </Route>

          {/* RUTAS ADMINISTRADOR CON LAYOUT */}
          <Route
            path="/admin"
            element={
              <RoleProtectedRoute role="administrador">
                <AdminLayout />
              </RoleProtectedRoute>
            }
          >
            <Route path="cursos" element={<ListaCursos />} />
            <Route path="cursos-create" element={<CrearCurso />} />
          </Route>

          {/* Ruta principal */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
