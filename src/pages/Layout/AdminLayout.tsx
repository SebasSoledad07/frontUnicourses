import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Admin/Sidebar";
import AdminAppBar from "../../components/Admin/AdminAppBar";

const AdminLayout = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <AdminAppBar />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* Espacio para la AppBar */}
        <Outlet /> {/* Renderiza la ruta hija */}
      </Box>
    </Box>
  );
};

export default AdminLayout;
