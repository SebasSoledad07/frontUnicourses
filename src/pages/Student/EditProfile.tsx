import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { useNavigate } from "react-router-dom";

export default function PerfilUsuario() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    nombre: "",
    intereses: [] as string[],
    carrera: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("perfiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data && !error) {
        setProfile({
          nombre: data.nombre || "",
          intereses: data.intereses || [],
          carrera: data.carrera || "",
        });
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Actualizar perfil
    const { error: updateError } = await supabase
      .from("perfiles")
      .update({
        nombre: profile.nombre,
        intereses: profile.intereses,
        carrera: profile.carrera,
      })
      .eq("id", user.id);

    if (updateError) {
      alert("Error al actualizar el perfil");
    } else {
      alert("Perfil actualizado con éxito");
      navigate("/student-profile");
    }
  };
  const toggleInterest = (interest: string) => {
    setProfile((prev) => {
      const intereses = prev.intereses.includes(interest)
        ? prev.intereses.filter((i) => i !== interest)
        : [...prev.intereses, interest];
      return { ...prev, intereses };
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md"
      >
        <input
          type="text"
          name="fullname"
          value={profile.nombre}
          onChange={(e) => setProfile({ ...profile, nombre: e.target.value })}
          className="border px-3 py-2 rounded-md w-full mb-4"
          placeholder="Full Name"
        />

        <select
          name="career_interest"
          value={profile.carrera}
          onChange={(e) =>
            setProfile((prev) => ({ ...prev, carrera: e.target.value }))
          }
          className="w-full border px-3 py-2 rounded-md mb-6"
        >
          <option value="">Selecciona tu Carrera</option>
          <option value="Administración de Empresas">
            Administración de Empresas
          </option>
          <option value="Arquitectura">Arquitectura</option>
          <option value="Comercio Internacional">Comercio Internacional</option>
          <option value="Comunicación Social">Comunicación Social</option>
          <option value="Contaduría Pública">Contaduría Pública</option>
          <option value="Derecho">Derecho</option>
          <option value="Enfermería">Enfermería</option>
          <option value="Ingeniería Agroindustrial">
            Ingeniería Agroindustrial
          </option>
          <option value="Ingeniería Agronómica">Ingeniería Agronómica</option>
          <option value="Ingeniería Ambiental">Ingeniería Ambiental</option>
          <option value="Ingeniería Biotecnológica">
            Ingeniería Biotecnológica
          </option>
          <option value="Ingeniería Civil">Ingeniería Civil</option>
          <option value="Ingeniería de Minas">Ingeniería de Minas</option>
          <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
          <option value="Ingeniería Electromecánica">
            Ingeniería Electromecánica
          </option>
          <option value="Ingeniería Electrónica">Ingeniería Electrónica</option>
          <option value="Ingeniería Industrial">Ingeniería Industrial</option>
          <option value="Ingeniería Mecánica">Ingeniería Mecánica</option>
          <option value="Licenciatura en Matemáticas">
            Licenciatura en Matemáticas
          </option>
          <option value="Licenciatura en Ciencias Naturales">
            Licenciatura en Ciencias Naturales
          </option>
          <option value="Licenciatura en Educación Infantil">
            Licenciatura en Educación Infantil
          </option>
          <option value="Química Industrial">Química Industrial</option>
          <option value="Seguridad y Salud en el Trabajo">
            Seguridad y Salud en el Trabajo
          </option>
          <option value="Trabajo Social">Trabajo Social</option>
          <option value="Zootecnia">Zootecnia</option>
        </select>

        <p className="font-medium mb-2">Your Interests</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
          {[
            "Mathematics",
            "Science",
            "Programming",
            "Art",
            "Music",
            "Sports",
            "History",
            "Literature",
            "Languages",
          ].map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={`px-3 py-2 rounded-md border ${
                profile.intereses.includes(interest)
                  ? "bg-blue-100 text-blue-600 border-blue-400"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {interest}
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
