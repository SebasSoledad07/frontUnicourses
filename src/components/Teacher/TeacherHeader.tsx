import { useEffect, useState } from "react";
import { getCurrentProfile } from "../../services/profileService";
import { signOut } from "../../services/authService";

interface TeacherHeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

interface TeacherProfileState {
  nombre: string;
  email: string;
}

export default function TeacherHeader({
  onToggleSidebar,
  sidebarOpen,
}: TeacherHeaderProps) {
  const [profile, setProfile] = useState<TeacherProfileState>({
    nombre: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const p = await getCurrentProfile();
        if (p) {
          setProfile({
            nombre: p.nombre || "",
            email: p.email || "",
          });
        }
      } catch (err) {
        console.error("Error fetching perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await signOut();
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
                    Profesor/a:{" "}
                    <span className="font-medium text-teal-600">
                      {profile.nombre || "Usuario"}
                    </span>
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Sección derecha: Badge de rol + Cerrar sesión */}
        <div className="flex items-center gap-4">
          {/* Badge de profesor */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-xs font-semibold">
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span>Profesor</span>
          </div>

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
