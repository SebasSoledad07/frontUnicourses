import { Routes, Route, Navigate } from "react-router-dom";
import type { UserRole } from "./types/roles";

import Login from "./pages/Auth/LoginForm";
import Register from "./pages/Auth/RegisterForm";
import ForgotPasswordForm from "./pages/Auth/ForgotPassword";
import ResetPasswordForm from "./pages/Auth/ResetPassword";

import { RoleProtectedRoute } from "./context/RoleProtectedRoute";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminLayout from "./pages/Layout/AdminLayout";
import StudentLayout from "./pages/Layout/StudentLayout";

import ListaCursos from "./components/Admin/Cursos/ListaCursos";
import ListaAdministradores from "./components/Admin/GestiónAdmin/ListaAdministradores";
import ListaEstudiantes from "./components/Admin/GestiónEstudiantes/ListaEstudiantes";

import CoursesPage from "./components/StudentProfile/Cursos/CoursesPage";
import StudentCoursesView from "./components/StudentProfile/Cursos/StudentCourseView";
import PerfilView from "./components/StudentProfile/PerfilView";
import EditProfile from "./components/StudentProfile/EditProfile";
import TeacherLayout from "./pages/Layout/TeacherLayout";
import TeacherCoursesPage from "./components/Teacher/TeacherCoursesPage";
import CourseStudentsView from "./components/Teacher/CourseStudentsView";
import CourseModulesView from "./components/Teacher/CourseModulesView";
import ModuleContentManager from "./components/Teacher/ModuleContentManager";
import StudentCourseModules from "./components/StudentProfile/Cursos/StudentCourseModules";
import StudentModuleContentView from "./components/StudentProfile/Cursos/StudentModuleContent";

export function AppRoutes() {
  return (
    <Routes>
      {/* Públicas */}
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

      {/* Raíz: redirige según autenticación */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to="/student/courses" replace />
          </ProtectedRoute>
        }
      />

      {/* Estudiante */}
      <Route
        path="/student"
        element={
          <RoleProtectedRoute allowedRoles={["estudiante" as UserRole]}>
            <StudentLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<Navigate to="courses" replace />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="explore" element={<StudentCoursesView />} />
        <Route path="profile" element={<PerfilView />} />
        <Route path="edit-profile" element={<EditProfile />} />
        <Route
          path="courses/:cursoId/modules"
          element={<StudentCourseModules />}
        />
        <Route
          path="courses/:cursoId/modules/:moduleId"
          element={<StudentModuleContentView />}
        />
      </Route>

      {/* Administrador */}
      <Route
        path="/admin"
        element={
          <RoleProtectedRoute allowedRoles={["administrador" as UserRole]}>
            <AdminLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<Navigate to="cursos" replace />} />
        <Route path="cursos" element={<ListaCursos />} />
        <Route path="usuarios" element={<ListaEstudiantes />} />
        <Route path="crear-admin" element={<ListaAdministradores />} />
      </Route>

      {/* Profesor */}
      <Route
        path="/teacher"
        element={
          <RoleProtectedRoute allowedRoles={["profesor" as UserRole]}>
            <TeacherLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<Navigate to="courses" replace />} />
        <Route path="courses" element={<TeacherCoursesPage />} />
        <Route
          path="courses/:cursoId/students"
          element={<CourseStudentsView />}
        />
        <Route
          path="courses/:cursoId/modules"
          element={<CourseModulesView />}
        />
      </Route>
      <Route
        path="courses/:cursoId/modules/:moduloId/content"
        element={<ModuleContentManager />}
      />

      {/* Legacy / redirecciones */}
      <Route path="/home" element={<Navigate to="/student" replace />} />

      {/* 404 */}
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
  );
}
