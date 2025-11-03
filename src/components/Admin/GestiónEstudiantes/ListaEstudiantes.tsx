import { useEffect, useState } from "react";
import supabase from "../../../utils/supabase";
import Toast from "../../Toast";

interface Estudiante {
  id: string;
  nombre: string;
  email: string;
  cursosMatriculados?: number;
}

interface ToastMessage {
  type: "success" | "error" | "warning" | "info";
  message: string;
}

export default function ListaEstudiantes() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [modalEliminar, setModalEliminar] = useState<{
    show: boolean;
    estudiante: Estudiante | null;
  }>({
    show: false,
    estudiante: null,
  });
  const [modalDetalle, setModalDetalle] = useState<{
    show: boolean;
    estudiante: Estudiante | null;
  }>({
    show: false,
    estudiante: null,
  });
  const [cursosEstudiante, setCursosEstudiante] = useState<any[]>([]);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  const fetchEstudiantes = async () => {
    setLoading(true);

    // Obtener todos los perfiles de estudiantes
    const { data: perfiles, error: perfilesError } = await supabase
      .from("perfiles")
      .select("id, nombre, email")
      .eq("rol", "estudiante")
      .order("nombre");

    if (perfilesError) {
      console.error("Error al cargar estudiantes:", perfilesError);
      setToast({ type: "error", message: "Error al cargar estudiantes" });
      setLoading(false);
      return;
    }

    // Obtener conteo de cursos matriculados para cada estudiante
    const estudiantesConCursos = await Promise.all(
      (perfiles || []).map(async (perfil) => {
        const { count } = await supabase
          .from("matriculas")
          .select("*", { count: "exact", head: true })
          .eq("perfil_id", perfil.id);

        return {
          ...perfil,
          cursosMatriculados: count || 0,
        };
      })
    );

    setEstudiantes(estudiantesConCursos);
    setLoading(false);
  };

  const handleVerDetalle = async (estudiante: Estudiante) => {
    setModalDetalle({ show: true, estudiante });

    // Obtener cursos del estudiante
    const { data: matriculas } = await supabase
      .from("matriculas")
      .select("curso_id")
      .eq("perfil_id", estudiante.id);

    if (matriculas && matriculas.length > 0) {
      const cursoIds = matriculas.map((m) => m.curso_id);
      const { data: cursos } = await supabase
        .from("cursos")
        .select("*")
        .in("id", cursoIds);

      setCursosEstudiante(cursos || []);
    } else {
      setCursosEstudiante([]);
    }
  };

  const handleEliminar = async () => {
    if (!modalEliminar.estudiante) return;

    setEliminando(true);

    // Eliminar matrículas
    await supabase
      .from("matriculas")
      .delete()
      .eq("perfil_id", modalEliminar.estudiante.id);

    // Eliminar perfil
    const { error: perfilError } = await supabase
      .from("perfiles")
      .delete()
      .eq("id", modalEliminar.estudiante.id);

    if (perfilError) {
      setToast({
        type: "error",
        message: "Error al eliminar estudiante: " + perfilError.message,
      });
    } else {
      // Intentar eliminar de auth
      try {
        await supabase.auth.admin.deleteUser(modalEliminar.estudiante.id);
      } catch (err) {
        console.warn("No se pudo eliminar de auth:", err);
      }

      setToast({
        type: "success",
        message: `Estudiante "${modalEliminar.estudiante.nombre}" eliminado exitosamente`,
      });
      fetchEstudiantes();
    }

    setModalEliminar({ show: false, estudiante: null });
    setEliminando(false);
  };

  const estudiantesFiltrados = estudiantes.filter(
    (est) =>
      est.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      est.email.toLowerCase().includes(busqueda.toLowerCase())
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
    <div className="max-w-7xl mx-auto">
      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Estudiantes</h1>
        <p className="text-gray-600 mt-1">
          {estudiantes.length} estudiante{estudiantes.length !== 1 ? "s" : ""}{" "}
          registrado
          {estudiantes.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6">
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
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o correo..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
          />
        </div>
      </div>

      {/* Lista de estudiantes */}
      {estudiantesFiltrados.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <svg
            className="w-20 h-20 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {busqueda ? "No se encontraron resultados" : "No hay estudiantes"}
          </h3>
          <p className="text-gray-500">
            {busqueda
              ? "Intenta con otros términos de búsqueda"
              : "Los estudiantes registrados aparecerán aquí"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {estudiantesFiltrados.map((estudiante) => (
            <div
              key={estudiante.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8 text-center">
                <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center mb-3">
                  <svg
                    className="w-10 h-10 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white truncate">
                  {estudiante.nombre}
                </h3>
              </div>

              {/* Información */}
              <div className="p-6">
                <div className="space-y-3 mb-4">
                  {/* Email */}
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                    <span className="text-sm text-gray-600 truncate">
                      {estudiante.email}
                    </span>
                  </div>

                  {/* Cursos */}
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <span className="text-sm text-gray-600">
                      {estudiante.cursosMatriculados} curso
                      {estudiante.cursosMatriculados !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVerDetalle(estudiante)}
                    className="flex-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    Ver detalle
                  </button>
                  <button
                    onClick={() => setModalEliminar({ show: true, estudiante })}
                    className="flex-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalle */}
      {modalDetalle.show && modalDetalle.estudiante && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  Detalle del Estudiante
                </h3>
                <button
                  onClick={() =>
                    setModalDetalle({ show: false, estudiante: null })
                  }
                  className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Información del estudiante */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Información Personal
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Nombre</p>
                    <p className="font-medium text-gray-900">
                      {modalDetalle.estudiante.nombre}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Correo electrónico</p>
                    <p className="font-medium text-gray-900">
                      {modalDetalle.estudiante.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cursos matriculados */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Cursos Matriculados ({cursosEstudiante.length})
                </h4>
                {cursosEstudiante.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No está matriculado en ningún curso
                  </p>
                ) : (
                  <div className="space-y-3">
                    {cursosEstudiante.map((curso) => (
                      <div key={curso.id} className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900">
                          {curso.nombre}
                        </h5>
                        <p className="text-sm text-gray-600 mt-1">
                          {curso.categoria}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button
                onClick={() =>
                  setModalDetalle({ show: false, estudiante: null })
                }
                className="px-6 py-2.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg transition-colors duration-200 font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de eliminación */}
      {modalEliminar.show && modalEliminar.estudiante && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Eliminar Estudiante
                </h3>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-2">
                ¿Estás seguro de que deseas eliminar a este estudiante?
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-900">
                  {modalEliminar.estudiante.nombre}
                </p>
                <p className="text-sm text-gray-600">
                  {modalEliminar.estudiante.email}
                </p>
              </div>
              <p className="text-sm text-red-600 mt-4">
                ⚠️ Esta acción eliminará todas sus matrículas y no se puede
                deshacer.
              </p>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex gap-3">
              <button
                onClick={() =>
                  setModalEliminar({ show: false, estudiante: null })
                }
                disabled={eliminando}
                className="flex-1 px-6 py-3 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg transition-colors duration-200 font-medium disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminar}
                disabled={eliminando}
                className={`
                  flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200
                  flex items-center justify-center gap-2
                  ${
                    eliminando
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl"
                  }
                  text-white
                `}
              >
                {eliminando ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
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
                    Eliminando...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Sí, eliminar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
