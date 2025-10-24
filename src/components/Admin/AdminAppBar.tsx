import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";

interface AdminAppBarProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

const AdminAppBar = ({ onToggleSidebar, sidebarOpen }: AdminAppBarProps) => {
  const [adminName, setAdminName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAdminName = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        window.location.href = "/login";
        return;
      }

      const { data, error: profileError } = await supabase
        .from("perfiles")
        .select("nombre")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error(profileError);
        setAdminName("Admin");
      } else {
        setAdminName(data?.nombre || "Admin");
      }

      setLoading(false);
    };

    getAdminName();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-teal-500 text-white shadow-md z-50">
      <div className="flex items-center justify-between px-6 h-16">
        {/* Sección izquierda: Botón toggle + Título */}
        <div className="flex items-center gap-4">
          {/* Botón de toggle del sidebar */}
          <button
            onClick={onToggleSidebar}
            className="
              p-2 rounded-lg hover:bg-white/10 
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-white/30
            "
            aria-label={sidebarOpen ? "Ocultar menú" : "Mostrar menú"}
          >
            {sidebarOpen ? (
              // Icono X para cerrar
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
            ) : (
              // Icono hamburguesa para abrir
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>

          {/* Título */}
          <h1 className="text-xl font-semibold">
            Panel Administrativo Unicourses
          </h1>
        </div>

        {/* Sección derecha: Nombre + Botón */}
        <div className="flex items-center gap-4">
          {/* Nombre del admin o loader */}
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-6 w-6 text-white"
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
          ) : (
            <span className="text-sm font-medium hidden sm:block">
              {adminName}
            </span>
          )}

          {/* Botón de cerrar sesión */}
          <button
            onClick={handleLogout}
            className="
              flex items-center gap-2 px-4 py-2 
              bg-white/10 hover:bg-white/20 
              rounded-lg transition-colors duration-200
              text-sm font-medium
            "
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminAppBar;
