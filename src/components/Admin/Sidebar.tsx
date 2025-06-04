import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import { Link, useLocation } from "react-router-dom";

const drawerWidth = 240;

const Sidebar = () => {
  const location = useLocation();

  const links = [
    {
      to: "/admin/cursos",
      label: "Gestionar Cursos",
      icon: <SchoolIcon />,
    },
    {
      to: "/admin/cursos-create",
      label: "Crear Cursos",
      icon: <SchoolIcon />,
    },
    {
      to: "/admin/usuarios",
      label: "Gestionar Usuarios",
      icon: <GroupIcon />,
    },
    {
      to: "/admin/crear-admin",
      label: "Crear Administrador",
      icon: <AdminPanelSettingsIcon />,
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto", p: 1 }}>
        <List>
          {links.map(({ to, label, icon }) => (
            <ListItemButton
              key={to}
              component={Link}
              to={to}
              selected={location.pathname === to}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
