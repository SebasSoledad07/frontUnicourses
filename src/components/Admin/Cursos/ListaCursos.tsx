import { useEffect, useState } from "react";
import supabase from "../../../utils/supabase";
import EditarCurso from "./EditarCurso";

interface Curso {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  fecha_creacion: string;
  profesor_asignado: string;
  activo: boolean;
  cupo_maximo: number;
}

export default function ListaCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState<Curso | null>(
    null
  );

  const abrirModal = (curso: Curso) => {
    setCursoSeleccionado(curso);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setCursoSeleccionado(null);
    setMostrarModal(false);
  };

  const handleCursoActualizado = () => {
    fetchCursos();
    cerrarModal();
  };

  async function fetchCursos() {
    setLoading(true);
    const { data, error } = await supabase.from("cursos").select("*");
    if (error) {
      console.error("Error al cargar cursos:", error.message);
    } else {
      setCursos(data);
    }
    setLoading(false);
  }

  const eliminarCurso = async (id: number) => {
    const confirmacion = confirm("¿Estás seguro de eliminar este curso?");
    if (!confirmacion) return;

    const { error } = await supabase.from("cursos").delete().eq("id", id);
    if (error) {
      alert("Error al eliminar el curso");
    } else {
      alert("Curso eliminado con éxito");
      fetchCursos();
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Lista de Cursos</h2>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-teal-500"
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
      ) : cursos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hay cursos disponibles.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cursos.map((curso) => (
            <div
              key={curso.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              {/* Header de la card */}
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white truncate">
                  {curso.nombre}
                </h3>
              </div>

              {/* Contenido */}
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 min-h-[60px]">
                  {curso.descripcion}
                </p>

                <div className="space-y-2 mb-6">
                  {/* Categoría */}
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    <span className="text-xs text-gray-500">
                      {Array.isArray(curso.categoria)
                        ? curso.categoria.join(", ")
                        : curso.categoria}
                    </span>
                  </div>

                  {/* Profesor */}
                  {curso.profesor_asignado && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-400"
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
                      <span className="text-xs text-gray-500">
                        {curso.profesor_asignado}
                      </span>
                    </div>
                  )}

                  {/* Cupo */}
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
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
                    <span className="text-xs text-gray-500">
                      Cupo: {curso.cupo_maximo}
                    </span>
                  </div>

                  {/* Estado */}
                  <div className="pt-2">
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
                      {curso.activo ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2">
                  <button
                    onClick={() => abrirModal(curso)}
                    className="
                      flex-1 flex items-center justify-center gap-2
                      bg-teal-500 hover:bg-teal-600 
                      text-white px-4 py-2 rounded-lg
                      transition-colors duration-200
                      text-sm font-medium
                    "
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Editar
                  </button>

                  <button
                    onClick={() => eliminarCurso(curso.id)}
                    className="
                      flex items-center justify-center
                      bg-red-50 hover:bg-red-100 
                      text-red-600 px-4 py-2 rounded-lg
                      transition-colors duration-200
                      text-sm font-medium
                    "
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de edición */}
      {mostrarModal && cursoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={cerrarModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
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

            <EditarCurso
              curso={cursoSeleccionado}
              onCursoActualizado={handleCursoActualizado}
              onCancelar={cerrarModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
