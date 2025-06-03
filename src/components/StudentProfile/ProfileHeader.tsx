import { useNavigate } from "react-router-dom";
import supabase from "../../utils/supabase";
import { useEffect, useState } from "react";

export default function ProfileHeader() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    nombre: "",
    intereses: [] as string[],
    carrera: "",
    foto_perfil: "",
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
        .select("nombre, intereses, carrera, foto_perfil")
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
          foto_perfil: data.foto_perfil || "",
        });
      }
    };

    fetchProfile();
  }, []);
  return (
    <div className="bg-white rounded-xl p-6 flex justify-between items-center shadow">
      <div className="flex items-center gap-4">
        <img
          src={profile.foto_perfil || "https://via.placeholder.com/150"}
          alt="User"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold">{profile.nombre}</h2>
          <p className="text-sm text-gray-500">Estudiante Universitario</p>
          <p className="text-sm text-gray-500">📍 Colombia</p>
        </div>
      </div>
      <button
        onClick={() => navigate("/edit-profile")}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Edit Profile
      </button>
    </div>
  );
}
