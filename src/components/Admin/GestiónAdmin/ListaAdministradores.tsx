import { useEffect, useState } from "react";
import supabase from "../../../utils/supabase";
import CrearAdministrador from "./CrearAdmin";
import EditarAdministrador from "./EditarAdmin";
import Toast from "../../Toast";

interface Administrador {
  id: string;
  nombre: string;
  email: string;
  rol: string;
}

interface ToastMessage {
  type: "success" | "error" | "warning" | "info";
  message: string;
}

export default function ListaAdministradores() {
  const [administradores, setAdministradores] = useState<Administrador[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [adminSeleccionado, setAdminSeleccionado] =
    useState<Administrador | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [modalEliminar, setModalEliminar] = useState<{
    show: boolean;
    admin: Administrador | null;
  }>({
    show: false,
    admin: null,
  });
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    fetchAdministradores();
  }, []);

  const fetchAdministradores = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("perfiles")
      .select("id, nombre, email, rol")
      .eq("rol", "administrador")
      .order("nombre");

    if (error) {
      console.error("Error al cargar administradores:", error);
      setToast({ type: "error", message: "Error al cargar administradores" });
    } else {
      setAdministradores(data || []);
    }
    setLoading(false);
  };

  const handleEliminar = async () => {
    if (!modalEliminar.admin) return;

    setEliminando(true);

    // Primero eliminar de la tabla perfiles
    const { error: perfilError } = await supabase
      .from("perfiles")
      .delete()
      .eq("id", modalEliminar.admin.id);

    if (perfilError) {
      setToast({
        type: "error",
        message: "Error al eliminar perfil: " + perfilError.message,
      });
      setEliminando(false);
      return;
    }

    // Intentar eliminar de auth (puede fallar si no se ha confirmado el email)
    try {
      const { error: authError } = await supabase.auth.admin.deleteUser(
        modalEliminar.admin.id
      );

      if (authError) {
        console.warn(
          "No se pudo eliminar de auth (probablemente usuario no confirmado):",
          authError
        );
      }
    } catch (err) {
      console.warn("Error al eliminar de auth:", err);
    }

    setToast({
      type: "success",
      message: `Administrador "${modalEliminar.admin.nombre}" eliminado exitosamente`,
    });

    setModalEliminar({ show: false, admin: null });
    setEliminando(false);
    fetchAdministradores();
  };

  const handleEditar = (admin: Administrador) => {
    setAdminSeleccionado(admin);
    setModalEditar(true);
  };

  const administradoresFiltrados = administradores.filter(
    (admin) =>
      admin.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      admin.email.toLowerCase().includes(busqueda.toLowerCase())
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
          <h1 className="text-3xl font-bold text-gray-800">Administradores</h1>
          <p className="text-gray-600 mt-1">
            {administradores.length} administrador
            {administradores.length !== 1 ? "es" : ""} registrado
            {administradores.length !== 1 ? "s" : ""}
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
          Nuevo Administrador
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
            placeholder="Buscar por nombre o correo..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
          />
        </div>
      </div>

      {/* Lista de administradores */}
      {administradoresFiltrados.length === 0 ? (
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {busqueda
              ? "No se encontraron resultados"
              : "No hay administradores"}
          </h3>
          <p className="text-gray-500">
            {busqueda
              ? "Intenta con otros términos de búsqueda"
              : "Crea el primer administrador"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {administradoresFiltrados.map((admin) => (
            <div
              key={admin.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              {/* Avatar y header */}
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-8 text-center">
                <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center mb-3">
                  <svg
                    className="w-10 h-10 text-teal-600"
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
                  {admin.nombre}
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
                      {admin.email}
                    </span>
                  </div>

                  {/* Rol */}
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
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-teal-600">
                      Administrador
                    </span>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditar(admin)}
                    className="flex-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => setModalEliminar({ show: true, admin })}
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
        <CrearAdministrador
          onClose={() => setModalCrear(false)}
          onSuccess={(nombre: any) => {
            fetchAdministradores();
            setModalCrear(false);
            setToast({
              type: "success",
              message: `Administrador "${nombre}" creado exitosamente`,
            });
          }}
        />
      )}

      {/* Modal Editar */}
      {modalEditar && adminSeleccionado && (
        <EditarAdministrador
          admin={adminSeleccionado}
          onClose={() => {
            setModalEditar(false);
            setAdminSeleccionado(null);
          }}
          onSuccess={(nombre: any) => {
            fetchAdministradores();
            setModalEditar(false);
            setAdminSeleccionado(null);
            setToast({
              type: "success",
              message: `Administrador "${nombre}" actualizado exitosamente`,
            });
          }}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      {modalEliminar.show && modalEliminar.admin && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            {/* Header */}
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
                  Eliminar Administrador
                </h3>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6">
              <p className="text-gray-700 mb-2">
                ¿Estás seguro de que deseas eliminar al administrador?
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-900">
                  {modalEliminar.admin.nombre}
                </p>
                <p className="text-sm text-gray-600">
                  {modalEliminar.admin.email}
                </p>
              </div>
              <p className="text-sm text-red-600 mt-4">
                ⚠️ Esta acción no se puede deshacer.
              </p>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex gap-3">
              <button
                onClick={() => setModalEliminar({ show: false, admin: null })}
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
