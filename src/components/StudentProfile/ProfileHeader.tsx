import supabase from "../../utils/supabase";
import { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

export default function ProfileHeader() {
  const [profile, setProfile] = useState({
    nombre: "",
    intereses: [] as string[],
    carrera: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      console.log("User ID:", user?.id);

      if (!user || userError) return;

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
    };

    fetchProfile();
  }, []);
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "#f6f9ff",
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" className="text-gray-800 font-bold">
            🎓 UniCourses
            <br />
            Bienvenida: {profile.nombre || "Cargando..."}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
