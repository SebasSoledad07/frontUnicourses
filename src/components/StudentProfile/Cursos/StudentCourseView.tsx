import { useEffect, useState } from "react";
import supabase from "../../../services/supabase";
import Toast from "../../Toast";

interface Curso {
  id: number;
  nombre: string;
  descripcion: string;
  profesor_asignado: string;
  fecha_creacion: string;
  activo: boolean;
  cupo_maximo: number;
  cupos_ocupados?: number;
}

interface ToastMessage {
  type: "success" | "error" | "warning" | "info";
  message: string;
}

export default function StudentCoursesView() {
  const [disponibles, setDisponibles] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [matriculando, setMatriculando] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [modalMatricular, setModalMatricular] = useState<{
    show: boolean;
    curso: Curso | null;
  }>({
    show: false,
    curso: null,
  });

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    // Obtener IDs de cursos matriculados
    const { data: matriculas } = await supabase
      .from("matriculas")
      .select("curso_id")
      .eq("perfil_id", user.id);

    const cursoIds = matriculas?.map((m) => m.curso_id) || [];

    // Cursos disponibles
    const { data: cursosDisponibles } = await supabase
      .from("cursos")
      .select("*")
      .eq("activo", true);

    const disponiblesConCupo = await Promise.all(
      (cursosDisponibles || [])
        .filter((c) => !cursoIds.includes(c.id))
        .map(async (curso) => {
          const { count } = await supabase
            .from("matriculas")
            .select("*", { count: "exact", head: true })
            .eq("curso_id", curso.id);

          return { ...curso, cupos_ocupados: count ?? 0 };
        })
    );

    setDisponibles(disponiblesConCupo);
    setLoading(false);
  };

  const handleOpenModal = (curso: Curso) => {
    setSelectedCurso(curso);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCurso(null);
  };

  const handleMatricular = async () => {
    if (!modalMatricular.curso) return;

    setMatriculando(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setToast({ type: "error", message: "Debes iniciar sesión" });
      setMatriculando(false);
      return;
    }

    // Verificar si ya está matriculado
    const { data: existente, error: errorVerificar } = await supabase
      .from("matriculas")
      .select("id")
      .eq("perfil_id", user.id)
      .eq("curso_id", modalMatricular.curso.id)
      .maybeSingle();

    if (errorVerificar && errorVerificar.code !== "PGRST116") {
      setToast({ type: "error", message: "Error al verificar matrícula" });
      setMatriculando(false);
      setModalMatricular({ show: false, curso: null });
      return;
    }

    if (existente) {
      setToast({
        type: "warning",
        message: "Ya estás matriculado en este curso",
      });
      setMatriculando(false);
      setModalMatricular({ show: false, curso: null });
      return;
    }

    // Matricular
    const { error } = await supabase.from("matriculas").insert({
      perfil_id: user.id,
      curso_id: modalMatricular.curso.id,
    });

    if (error) {
      if (error.code === "23505" || error.message.includes("duplicate key")) {
        setToast({
          type: "warning",
          message: "Ya estás matriculado en este curso",
        });
      } else {
        setToast({
          type: "error",
          message: "Error al matricular: " + error.message,
        });
      }
    } else {
      setToast({
        type: "success",
        message: `¡Te matriculaste exitosamente en "${modalMatricular.curso.nombre}"!`,
      });
      fetchCursos();
      handleCloseModal();
    }
    setMatriculando(false);
    setModalMatricular({ show: false, curso: null });
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
    <div className="space-y-8">
      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Sección: Cursos Disponibles */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Más Cursos Disponibles
        </h2>
        {disponibles.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No hay otros cursos disponibles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {disponibles.map((curso) => {
              const cuposRestantes =
                curso.cupo_maximo - (curso.cupos_ocupados || 0);
              const cursoLleno = cuposRestantes <= 0;

              return (
                <div
                  key={curso.id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
                    <h3 className="text-lg font-semibold text-white truncate">
                      {curso.nombre}
                    </h3>
                  </div>

                  <div className="p-6">
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">
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
                        <span className="text-sm text-gray-600">
                          Cupos: {curso.cupos_ocupados}/{curso.cupo_maximo}
                        </span>
                      </div>
                    </div>

                    {cursoLleno ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-4">
                        Cupo lleno
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-4">
                        {cuposRestantes} cupos disponibles
                      </span>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setModalMatricular({ show: true, curso })
                        }
                        disabled={cursoLleno || matriculando}
                        className={`
                          flex-1 px-4 py-2 rounded-lg text-sm font-medium
                          transition-colors duration-200
                          ${
                            cursoLleno || matriculando
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-teal-500 hover:bg-teal-600 text-white"
                          }
                        `}
                      >
                        {cursoLleno ? "No disponible" : "Matricular"}
                      </button>
                      <button
                        onClick={() => handleOpenModal(curso)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 text-sm font-medium"
                      >
                        Detalles
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Modal de confirmación de matrícula */}
      {modalMatricular.show && modalMatricular.curso && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Confirmar Matrícula
                </h3>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-2">
                ¿Deseas matricularte en el siguiente curso?
              </p>
              <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                <p className="font-semibold text-gray-900">
                  {modalMatricular.curso.nombre}
                </p>
                <p className="text-sm text-gray-600">
                  Profesor: {modalMatricular.curso.profesor_asignado}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex gap-3">
              <button
                onClick={() => setModalMatricular({ show: false, curso: null })}
                disabled={matriculando}
                className="flex-1 px-6 py-3 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg transition-colors duration-200 font-medium disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleMatricular}
                disabled={matriculando}
                className={`
                  flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200
                  flex items-center justify-center gap-2
                  ${
                    matriculando
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg hover:shadow-xl"
                  }
                  text-white
                `}
              >
                {matriculando ? (
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
                    Matriculando...
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Sí, matricular
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles - igual que antes */}
      {modalOpen && selectedCurso && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
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

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-teal-500 mt-0.5"
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
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Profesor
                    </p>
                    <p className="text-gray-900">
                      {selectedCurso.profesor_asignado}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-teal-500 mt-0.5"
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
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Fecha de creación
                    </p>
                    <p className="text-gray-900">
                      {new Date(
                        selectedCurso.fecha_creacion
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-teal-500 mt-0.5"
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
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Cupo máximo
                    </p>
                    <p className="text-gray-900">
                      {selectedCurso.cupo_maximo} estudiantes
                    </p>
                  </div>
                </div>
              </div>
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
