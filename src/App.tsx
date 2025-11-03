import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Auth/LoginForm";
import Register from "./pages/Auth/RegisterForm";
import { AuthProvider } from "./context/AuthContext";
import EditProfile from "./components/StudentProfile/EditProfile";
import { RoleProtectedRoute } from "./context/RoleProtectedRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./pages/Layout/AdminLayout";
import ListaCursos from "./components/Admin/Cursos/ListaCursos";
import StudentLayout from "./pages/Layout/StudentLayout";
import CoursesPage from "./components/StudentProfile/CoursesPage";
import StudentCoursesView from "./components/StudentProfile/StudentCourseView";
import ForgotPasswordForm from "./pages/Auth/ForgotPassword";
import ResetPasswordForm from "./pages/Auth/ResetPassword";
import ListaAdministradores from "./components/Admin/GestiónAdmin/ListaAdministradores";
import ListaEstudiantes from "./components/Admin/GestiónEstudiantes/ListaEstudiantes";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ============================================
              RUTAS PÚBLICAS (Sin autenticación)
          ============================================ */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          <Route
            path="/unauthorized"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-red-600 mb-4">
                    Acceso no autorizado
                  </h1>
                  <p className="text-gray-600 mb-6">
                    No tienes permisos para acceder a esta página
                  </p>
                  <a
                    href="/login"
                    className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                  >
                    Volver al inicio de sesión
                  </a>
                </div>
              </div>
            }
          />

          {/* ============================================
              RUTA RAÍZ - Redirige según autenticación
          ============================================ */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                {/* Aquí puedes redirigir según el rol del usuario */}
                <Navigate to="/student/courses" replace />
              </ProtectedRoute>
            }
          />

          {/* ============================================
              RUTAS DE ESTUDIANTE (Protegidas por rol)
          ============================================ */}
          <Route
            path="/student"
            element={
              <RoleProtectedRoute role="estudiante">
                <StudentLayout />
              </RoleProtectedRoute>
            }
          >
            {/* Ruta por defecto del estudiante */}
            <Route index element={<Navigate to="courses" replace />} />

            {/* Mis cursos matriculados */}
            <Route path="courses" element={<CoursesPage />} />

            {/* Explorar cursos disponibles */}
            <Route path="explore" element={<StudentCoursesView />} />

            {/* Perfil del estudiante */}

            {/* Editar perfil */}
            <Route path="edit-profile" element={<EditProfile />} />
          </Route>

          {/* ============================================
              RUTAS DE ADMINISTRADOR (Protegidas por rol)
          ============================================ */}
          <Route
            path="/admin"
            element={
              <RoleProtectedRoute role="administrador">
                <AdminLayout />
              </RoleProtectedRoute>
            }
          >
            {/* Ruta por defecto del admin */}
            <Route index element={<Navigate to="cursos" replace />} />
            {/* Gestionar cursos */}
            <Route path="cursos" element={<ListaCursos />} />
            {/* Crear nuevo curso */}
            {/* Gestionar usuarios (comentado - descomentarlo cuando esté listo) */}
            <Route path="usuarios" element={<ListaEstudiantes />} />
            {/* Crear administrador (agregar cuando esté listo) */}
            <Route path="crear-admin" element={<ListaAdministradores />} /> */
          </Route>

          {/* ============================================
              REDIRECCIONES Y RUTAS LEGACY
          ============================================ */}
          <Route path="/home" element={<Navigate to="/student" replace />} />

          {/* ============================================
              RUTA 404 - Página no encontrada
          ============================================ */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                  <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Página no encontrada
                  </h2>
                  <p className="text-gray-600 mb-6">
                    La página que buscas no existe
                  </p>
                  <a
                    href="/"
                    className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                  >
                    Volver al inicio
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
