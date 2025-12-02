import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTeacherCourses,
  type TeacherCourse,
} from "../../services/teacherService";
import Toast from "../Toast";

interface ToastMessage {
  type: "success" | "error" | "warning" | "info";
  message: string;
}

export default function TeacherCoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await getTeacherCourses();
      setCourses(data);
    } catch (err) {
      console.error(err);
      setToast({
        type: "error",
        message: "Error al cargar cursos",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewStudents = (cursoId: string, cursoNombre: string) => {
    navigate(`/teacher/courses/${cursoId}/students`, {
      state: { cursoNombre },
    });
  };

  const handleViewModules = (cursoId: string, cursoNombre: string) => {
    navigate(`/teacher/courses/${cursoId}/modules`, {
      state: { cursoNombre },
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center py-12"></div>;
  }

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis cursos</h1>
          <p className="text-sm text-gray-600">
            Gestiona el contenido y los estudiantes de tus cursos.
          </p>
        </div>
      </div>

      {/* Stats resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-semibold">
            Cursos activos
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {courses.filter((c) => c.activo).length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-semibold">
            Total de cursos
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {courses.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-semibold">
            Estudiantes totales
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {courses.reduce((sum, c) => sum + (c.estudiantes_count || 0), 0)}
          </p>
        </div>
      </div>

      {/* Tabla de cursos */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">
            Lista de cursos
          </h2>
        </div>

        {courses.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">
            No tienes cursos asignados actualmente.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Curso
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Estudiantes
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">
                        {course.nombre}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {course.descripcion?.substring(0, 50)}
                        {course.descripcion?.length > 50 ? "..." : ""}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{course.codigo}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {course.estudiantes_count || 0}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          course.activo
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-50 text-gray-700"
                        }`}
                      >
                        {course.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() =>
                          handleViewModules(course.id, course.nombre)
                        }
                        className="inline-flex items-center px-3 py-1.5 rounded-lg border border-teal-200 text-xs font-medium text-teal-700 hover:bg-teal-50"
                      >
                        Módulos
                      </button>
                      <button
                        onClick={() =>
                          handleViewStudents(course.id, course.nombre)
                        }
                        className="inline-flex items-center px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-100"
                      >
                        Estudiantes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
