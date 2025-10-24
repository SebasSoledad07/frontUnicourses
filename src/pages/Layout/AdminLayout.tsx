import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Admin/Sidebar";
import AdminAppBar from "../../components/Admin/AdminAppBar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminAppBar onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Contenido principal - padding dinámico según estado del sidebar */}
      <main
        className={`
          pt-16 transition-all duration-300 ease-in-out
          ${sidebarOpen ? "pl-60" : "pl-0"}
        `}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
