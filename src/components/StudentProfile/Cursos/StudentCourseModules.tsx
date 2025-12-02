import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getStudentCourseModules,
  isEnrolledInCourse,
  type StudentModule,
} from "../../../services/studentService";
import Toast from "../../Toast";

interface ToastMessage {
  type: "success" | "error" | "warning" | "info";
  message: string;
}

export default function StudentCourseModules() {
  const { cursoId } = useParams<{ cursoId: string }>();
  const navigate = useNavigate();
  const [modules, setModules] = useState<StudentModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    if (cursoId) {
      loadModules();
    }
  }, [cursoId]);

  const loadModules = async () => {
    if (!cursoId) return;

    setLoading(true);
    try {
      const realId = cursoId;

      const isEnrolled = await isEnrolledInCourse(realId);
      if (!isEnrolled) {
        setToast({
          type: "error",
          message: "No estás matriculado en este curso",
        });
        setTimeout(() => navigate("/student/courses"), 2000);
        return;
      }

      const data = await getStudentCourseModules(realId);
      setModules(data);
    } catch (err) {
      console.error(err);
      setToast({
        type: "error",
        message: "Error al cargar módulos",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewContent = (moduleId: number, moduleName: string) => {
    navigate(`/student/courses/${cursoId}/modules/${moduleId}`, {
      state: { moduleName },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <svg
          className="animate-spin h-10 w-10 text-teal-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
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

      {/* Botón volver */}
      <button
        onClick={() => navigate("/student/courses")}
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Volver a Mis Cursos
      </button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Módulos del curso
          </h1>
          <p className="text-sm text-gray-600">
            Accede al contenido de cada módulo
          </p>
        </div>
      </div>

      {/* Modules list */}
      <div className="space-y-4">
        {modules.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-500 text-sm">
              Aún no hay módulos disponibles para este curso.
            </p>
          </div>
        ) : (
          modules.map((module, index) => (
            <div
              key={module.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleViewContent(module.id, module.titulo)}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-lg">
                    {index + 1}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {module.titulo}
                  </h3>
                  {module.descripcion && (
                    <p className="text-gray-600 text-sm mb-3">
                      {module.descripcion}
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
