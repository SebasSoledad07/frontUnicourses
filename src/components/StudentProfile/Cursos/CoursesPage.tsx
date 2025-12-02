import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../../services/supabase";

type Curso = {
  id: number;
  nombre: string;
  descripcion: string;
  profesor_asignado: string;
  fecha_creacion: string;
  activo: boolean;
  cupo_maximo: number;
};

export default function MisCursos() {
  const navigate = useNavigate();
  const [cursosMatriculados, setCursosMatriculados] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchCursos();
  }, []);

  async function fetchCursos() {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Error obteniendo usuario:", userError);
      setCursosMatriculados([]);
      setLoading(false);
      return;
    }

    // ✅ PASO 1: Obtener matrículas del usuario
    const { data: matriculas, error: errorMatriculas } = await supabase
      .from("matriculas")
      .select("curso_id")
      .eq("perfil_id", user.id);

    if (errorMatriculas) {
      console.error("Error al obtener matrículas:", errorMatriculas);
      setCursosMatriculados([]);
      setLoading(false);
      return;
    }

    if (!matriculas || matriculas.length === 0) {
      setCursosMatriculados([]);
      setLoading(false);
      return;
    }

    // ✅ PASO 2: Obtener IDs de cursos
    const cursoIds = matriculas.map((m) => m.curso_id);
    console.log("IDs de cursos matriculados:", cursoIds);

    // ✅ PASO 3: Obtener información completa de los cursos
    const { data: cursos, error: errorCursos } = await supabase
      .from("cursos")
      .select("*")
      .in("id", cursoIds);

    if (errorCursos) {
      console.error("Error al obtener cursos:", errorCursos);
      setCursosMatriculados([]);
    } else {
      console.log("Cursos obtenidos:", cursos);
      setCursosMatriculados(cursos || []);
    }

    setLoading(false);
  }
  const handleViewModules = (cursoId: string | number, cursoNombre: string) => {
    navigate(`/student/courses/${cursoId}/modules`, {
      state: { cursoNombre },
    });
  };
  const handleOpenModal = (curso: Curso) => {
    setSelectedCurso(curso);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCurso(null);
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

  if (cursosMatriculados.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
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
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No tienes cursos matriculados
          </h3>
          <p className="text-gray-500 mb-6">
            Explora nuestro catálogo y matricúlate en los cursos que te
            interesen.
          </p>
          <a
            href="/student/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors duration-200 font-medium"
          >
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Explorar Cursos
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Mis Cursos Matriculados
        </h1>
        <p className="text-gray-600 mt-1">
          {cursosMatriculados.length}{" "}
          {cursosMatriculados.length === 1 ? "curso" : "cursos"} activos
        </p>
      </div>

      {/* Grid de cursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cursosMatriculados.map((curso) => (
          <div
            key={curso.id}
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            {/* Header de la card con gradiente */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
              <h3 className="text-lg font-semibold text-white line-clamp-2">
                {curso.nombre}
              </h3>
            </div>

            {/* Contenido de la card */}
            <div className="p-6">
              {/* Descripción */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3 min-h-[60px]">
                {curso.descripcion}
              </p>

              {/* Información del curso */}
              <div className="space-y-3 mb-4">
                {/* Profesor */}
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-xs text-gray-600">
                    {curso.profesor_asignado}
                  </span>
                </div>

                {/* Fecha de creación */}
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-xs text-gray-600">
                    Inicio:{" "}
                    {new Date(curso.fecha_creacion).toLocaleDateString()}
                  </span>
                </div>

                {/* Cupo */}
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="text-xs text-gray-600">
                    Cupo: {curso.cupo_maximo} estudiantes
                  </span>
                </div>
              </div>

              {/* Badge de estado */}
              <div className="mb-4">
                <span
                  className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${
                      curso.activo
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  `}
                >
                  {curso.activo ? "✓ Activo" : "Inactivo"}
                </span>
              </div>

              {/* Botones de acción */}
              {/* Botones de acción - REEMPLAZA ESTA SECCIÓN */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(curso)}
                  className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                  Ver detalles
                </button>
                <button
                  onClick={() => handleViewModules(curso.id, curso.nombre)}
                  className="flex-1 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                  Ver módulos
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal - igual que antes */}
      {modalOpen && selectedCurso && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  Detalles del Curso
                </h3>
                <button
                  onClick={handleCloseModal}
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
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedCurso.nombre}
                </h4>
                <p className="text-gray-600">{selectedCurso.descripcion}</p>
              </div>
              {/* ... resto del modal igual que antes ... */}
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-200 font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
