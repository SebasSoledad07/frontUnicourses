import Header from "../../components/StudentProfile/ProfileHeader"; // Ajusta la ruta si es diferente
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  ListItemButton,
} from "@mui/material";
// Asegúrate que esta ruta esté bien

const drawerWidth = 240;

const StudentLayout = () => {
  const location = useLocation();

  const menuItems = [
    { text: "Mis Cursos", path: "/student/courses" },
    { text: "Explorar Cursos", path: "/student/explore" },
    { text: "Perfil", path: "/student/profile" },
    { text: "Editar Perfil", path: "/student/edit-profile" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Header />

      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            mt: 8, // espacio para el Header
          },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
              >
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px`, mt: 8 }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default StudentLayout;
