import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { to: "/admin/cursos", label: "Gestionar Cursos" },
    { to: "/admin/usuarios", label: "Gestionar Usuarios" },
    { to: "/admin/crear-admin", label: "Crear Administrador" },
  ];

  return (
    <aside className="w-64 bg-gray-100 min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Panel Admin</h2>
      <ul>
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className={`block px-4 py-2 rounded hover:bg-gray-300 ${
                location.pathname === link.to ? "bg-blue-100 text-blue-700" : ""
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
