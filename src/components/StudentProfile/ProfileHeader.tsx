import supabase from "../../utils/supabase";
import { useEffect, useState } from "react";

interface ProfileHeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export default function ProfileHeader({
  onToggleSidebar,
  sidebarOpen,
}: ProfileHeaderProps) {
  const [profile, setProfile] = useState({
    nombre: "",
    intereses: [] as string[],
    carrera: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      console.log("User ID:", user?.id);

      if (!user || userError) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("perfiles")
        .select("nombre, intereses, carrera")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching perfil:", error.message);
      }

      console.log("Perfil:", data);

      if (data) {
        setProfile({
          nombre: data.nombre || "",
          intereses: data.intereses || [],
          carrera: data.carrera || "",
        });
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
      <div className="flex items-center justify-between px-6 h-16">
        {/* Sección izquierda: Botón toggle + Logo/Título */}
        <div className="flex items-center gap-4">
          {/* Botón de toggle del sidebar */}
          <button
            onClick={onToggleSidebar}
            className="
              p-2 rounded-lg hover:bg-gray-100 
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-teal-500/30
              lg:block
            "
            aria-label={sidebarOpen ? "Ocultar menú" : "Mostrar menú"}
          >
            {sidebarOpen ? (
              <svg
                className="w-6 h-6 text-gray-700"
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
              <svg
                className="w-6 h-6 text-gray-700"
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

          {/* Logo y bienvenida */}
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎓</span>
            <div>
              <h1 className="text-lg font-bold text-gray-800">UniCourses</h1>
              <p className="text-sm text-gray-600">
                {loading ? (
                  <span className="inline-block">Cargando...</span>
                ) : (
                  <span>
                    Bienvenido/a:{" "}
                    <span className="font-medium text-teal-600">
                      {profile.nombre || "Usuario"}
                    </span>
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Sección derecha: Info del perfil + Cerrar sesión */}
        <div className="flex items-center gap-4">
          {/* Info adicional del perfil (opcional) */}
          {!loading && profile.carrera && (
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span>{profile.carrera}</span>
            </div>
          )}

          {/* Botón de cerrar sesión */}
          <button
            onClick={handleLogout}
            className="
              flex items-center gap-2 px-4 py-2 
              bg-gray-100 hover:bg-gray-200 
              text-gray-700 rounded-lg 
              transition-colors duration-200
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
}
