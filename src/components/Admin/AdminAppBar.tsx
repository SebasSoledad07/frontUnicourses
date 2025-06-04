// src/components/AdminAppBar.tsx
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useEffect, useState } from "react";
import supabase from "../../utils/supabase"; // Asegúrate de que la ruta sea correcta

const AdminAppBar = () => {
  const [adminName, setAdminName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAdminName = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        window.location.href = "/login"; // Redirige si no está autenticado
        return;
      }

      // Supón que guardas el nombre del admin en la tabla `perfiles` o en `user.user_metadata`
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
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Panel Administrativo Unicourses
        </Typography>
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          <Typography variant="body1" sx={{ mr: 2 }}>
            {adminName}
          </Typography>
        )}
        <Button
          color="inherit"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Cerrar sesión
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default AdminAppBar;
