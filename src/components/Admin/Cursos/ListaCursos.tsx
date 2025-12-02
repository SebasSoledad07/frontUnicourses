import { useEffect, useState } from "react";
import supabase from "../../../services/supabase";
import CrearCurso from "./CrearCurso";
import EditarCurso from "./EditarCurso";
import Toast from "../../Toast";

interface Curso {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  profesor_asignado: string;
  activo: boolean;
  cupo_maximo: number;
}

interface ToastMessage {
  type: "success" | "error" | "warning" | "info";
  message: string;
}

export default function ListaCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState<Curso | null>(
    null
  );
  const [busqueda, setBusqueda] = useState("");
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [modalEliminar, setModalEliminar] = useState<{
    show: boolean;
    curso: Curso | null;
  }>({
    show: false,
    curso: null,
  });
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("cursos")
      .select("*")
      .order("nombre");

    if (error) {
      console.error("Error al cargar cursos:", error);
      setToast({ type: "error", message: "Error al cargar cursos" });
    } else {
      setCursos(data || []);
    }
    setLoading(false);
  };

  const handleEliminar = async () => {
    if (!modalEliminar.curso) return;

    setEliminando(true);

    const { error } = await supabase
      .from("cursos")
      .delete()
      .eq("id", modalEliminar.curso.id);

    if (error) {
      setToast({
        type: "error",
        message: "Error al eliminar curso: " + error.message,
      });
    } else {
      setToast({
        type: "success",
        message: `Curso "${modalEliminar.curso.nombre}" eliminado exitosamente`,
      });
      fetchCursos();
    }

    setModalEliminar({ show: false, curso: null });
    setEliminando(false);
  };

  const handleEditar = (curso: Curso) => {
    setCursoSeleccionado(curso);
    setModalEditar(true);
  };

  const cursosFiltrados = cursos.filter(
    (curso) =>
      curso.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      curso.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      curso.categoria.toLowerCase().includes(busqueda.toLowerCase())
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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Cursos</h1>
          <p className="text-gray-600 mt-1">
            {cursos.length} curso{cursos.length !== 1 ? "s" : ""} registrado
            {cursos.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setModalCrear(true)}
          className="flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors duration-200 font-medium shadow-md"
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Nuevo Curso
        </button>
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
            placeholder="Buscar por nombre, descripción o categoría..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
          />
        </div>
      </div>

      {/* Grid de cursos */}
      {cursosFiltrados.length === 0 ? (
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
            {busqueda ? "No se encontraron resultados" : "No hay cursos"}
          </h3>
          <p className="text-gray-500">
            {busqueda
              ? "Intenta con otros términos de búsqueda"
              : "Crea el primer curso"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cursosFiltrados.map((curso) => (
            <div
              key={curso.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white line-clamp-2">
                  {curso.nombre}
                </h3>
              </div>

              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 min-h-[60px]">
                  {curso.descripcion}
                </p>

                <div className="space-y-3 mb-4">
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
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    <span className="text-xs text-gray-600">
                      {curso.categoria}
                    </span>
                  </div>

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
                      Cupo: {curso.cupo_maximo}
                    </span>
                  </div>
                </div>

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

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditar(curso)}
                    className="flex-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => setModalEliminar({ show: true, curso })}
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

      {/* Modal Crear */}
      {modalCrear && (
        <CrearCurso
          onClose={() => setModalCrear(false)}
          onSuccess={(nombre) => {
            fetchCursos();
            setModalCrear(false);
            setToast({
              type: "success",
              message: `Curso "${nombre}" creado exitosamente`,
            });
          }}
        />
      )}

      {/* Modal Editar */}
      {modalEditar && cursoSeleccionado && (
        <EditarCurso
          curso={cursoSeleccionado}
          onClose={() => {
            setModalEditar(false);
            setCursoSeleccionado(null);
          }}
          onSuccess={(nombre) => {
            fetchCursos();
            setModalEditar(false);
            setCursoSeleccionado(null);
            setToast({
              type: "success",
              message: `Curso "${nombre}" actualizado exitosamente`,
            });
          }}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      {modalEliminar.show && modalEliminar.curso && (
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
                <h3 className="text-xl font-bold text-white">Eliminar Curso</h3>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-2">
                ¿Estás seguro de que deseas eliminar este curso?
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-900">
                  {modalEliminar.curso.nombre}
                </p>
                <p className="text-sm text-gray-600">
                  {modalEliminar.curso.categoria}
                </p>
              </div>
              <p className="text-sm text-red-600 mt-4">
                ⚠️ Esta acción no se puede deshacer. Se eliminarán todas las
                matrículas asociadas.
              </p>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex gap-3">
              <button
                onClick={() => setModalEliminar({ show: false, curso: null })}
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
