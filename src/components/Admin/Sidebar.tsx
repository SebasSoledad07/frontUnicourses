import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();

  const links = [
    {
      to: "/admin/cursos",
      label: "Gestionar Cursos",
      icon: (
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
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      to: "/admin/cursos-create",
      label: "Crear Cursos",
      icon: (
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
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
    },
    {
      to: "/admin/usuarios",
      label: "Gestionar Usuarios",
      icon: (
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      to: "/admin/crear-admin",
      label: "Crear Administrador",
      icon: (
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
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Overlay para móviles - cierra el sidebar al hacer click */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - SE OCULTA en todas las pantallas cuando isOpen es false */}
      <aside
        className={`
          fixed left-0 top-0 h-screen bg-white border-r border-gray-200 
          overflow-y-auto z-40 transition-transform duration-300 ease-in-out
          w-60
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Espaciado superior (altura del header) */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-center">
          <span className="text-teal-600 font-bold text-lg">Unicourses</span>
        </div>

        {/* Lista de navegación */}
        <nav className="p-2">
          <ul className="space-y-1">
            {links.map(({ to, label, icon }) => {
              const isActive = location.pathname === to;

              return (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={() => {
                      // Cerrar sidebar en móviles al hacer click en un link
                      if (window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-colors duration-200
                      ${
                        isActive
                          ? "bg-teal-50 text-teal-700 font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    <span
                      className={isActive ? "text-teal-700" : "text-gray-500"}
                    >
                      {icon}
                    </span>
                    <span className="text-sm">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
