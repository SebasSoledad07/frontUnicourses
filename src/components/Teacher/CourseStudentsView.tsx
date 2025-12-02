import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  getCourseStudents,
  type CourseStudent,
} from "../../services/teacherService";
import Toast from "../Toast";

interface ToastMessage {
  type: "success" | "error" | "warning" | "info";
  message: string;
}

export default function CourseStudentsView() {
  const { cursoId } = useParams<{ cursoId: string }>();
  const location = useLocation();
  const cursoNombre = location.state?.cursoNombre || "Curso";

  const [students, setStudents] = useState<CourseStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    if (cursoId) {
      loadStudents();
    }
  }, [cursoId]);

  const loadStudents = async () => {
    if (!cursoId) return;
    setLoading(true);
    try {
      const data = await getCourseStudents(cursoId);
      setStudents(data);
    } catch (err) {
      console.error(err);
      setToast({
        type: "error",
        message: "Error al cargar estudiantes",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.carrera &&
        student.carrera.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{cursoNombre}</h1>
          <p className="text-sm text-gray-600">
            {students.length} estudiante{students.length !== 1 ? "s" : ""}{" "}
            matriculado{students.length !== 1 ? "s" : ""}
          </p>
        </div>

        <button className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Exportar lista
        </button>
      </div>

      {/* Stats resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-semibold">
            Total estudiantes
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {students.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-semibold">
            Matrículas recientes (7 días)
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, email o carrera..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
          />
        </div>
      </div>

      {/* Students list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800">
            Lista de estudiantes
          </h2>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            {students.length === 0
              ? "No hay estudiantes matriculados en este curso."
              : "No se encontraron estudiantes que coincidan con la búsqueda."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Carrera
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Fecha de matrícula
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold text-sm">
                          {student.nombre.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {student.nombre}
                          </p>
                          <p className="text-xs text-gray-500">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      {student.carrera || "N/A"}
                    </td>

                    <td className="px-4 py-4 text-right space-x-2">
                      <button className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-teal-600 hover:bg-teal-50 transition-colors">
                        Ver perfil
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
