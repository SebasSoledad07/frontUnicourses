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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

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
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      return;
    }

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
      showNotification("Error al actualizar el perfil", "error");
    } else {
      showNotification("Perfil actualizado con éxito", "success");
      setTimeout(() => navigate("/student/profile"), 1500);
    }
    setSaving(false);
  };

  const toggleInterest = (interest: string) => {
    setProfile((prev) => {
      const intereses = prev.intereses.includes(interest)
        ? prev.intereses.filter((i) => i !== interest)
        : [...prev.intereses, interest];
      return { ...prev, intereses };
    });
  };

  const interestsList = [
    "Matemáticas",
    "Ciencias",
    "Programación",
    "Arte",
    "Música",
    "Deportes",
    "Historia",
    "Literatura",
    "Idiomas",
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <svg
          className="animate-spin h-10 w-10 text-teal-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Editar Perfil</h1>
        <p className="text-gray-600 mt-1">
          Actualiza tu información personal y preferencias
        </p>
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
      >
        <div className="p-6 space-y-6">
          {/* Nombre completo */}
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre completo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="nombre"
                value={profile.nombre}
                onChange={(e) =>
                  setProfile({ ...profile, nombre: e.target.value })
                }
                required
                className="
                  w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg
                  focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                  transition-colors duration-200
                  text-gray-900 placeholder-gray-400
                "
                placeholder="Ej: Juan Pérez"
              />
            </div>
          </div>

          {/* Carrera */}
          <div>
            <label
              htmlFor="carrera"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Carrera <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <select
                id="carrera"
                value={profile.carrera}
                onChange={(e) =>
                  setProfile({ ...profile, carrera: e.target.value })
                }
                required
                className="
                  w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg
                  focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                  transition-colors duration-200
                  text-gray-900 appearance-none
                  bg-white
                "
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23374151' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                  backgroundSize: "1rem",
                }}
              >
                <option value="">Selecciona tu carrera</option>
                <option value="Administración de Empresas">
                  Administración de Empresas
                </option>
                <option value="Arquitectura">Arquitectura</option>
                <option value="Comercio Internacional">
                  Comercio Internacional
                </option>
                <option value="Comunicación Social">Comunicación Social</option>
                <option value="Contaduría Pública">Contaduría Pública</option>
                <option value="Derecho">Derecho</option>
                <option value="Enfermería">Enfermería</option>
                <option value="Ingeniería Agroindustrial">
                  Ingeniería Agroindustrial
                </option>
                <option value="Ingeniería Agronómica">
                  Ingeniería Agronómica
                </option>
                <option value="Ingeniería Ambiental">
                  Ingeniería Ambiental
                </option>
                <option value="Ingeniería Biotecnológica">
                  Ingeniería Biotecnológica
                </option>
                <option value="Ingeniería Civil">Ingeniería Civil</option>
                <option value="Ingeniería de Minas">Ingeniería de Minas</option>
                <option value="Ingeniería de Sistemas">
                  Ingeniería de Sistemas
                </option>
                <option value="Ingeniería Electromecánica">
                  Ingeniería Electromecánica
                </option>
                <option value="Ingeniería Electrónica">
                  Ingeniería Electrónica
                </option>
                <option value="Ingeniería Industrial">
                  Ingeniería Industrial
                </option>
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
            </div>
          </div>

          {/* Intereses */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tus intereses
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Selecciona tus áreas de interés para recibir recomendaciones
              personalizadas
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interestsList.map((interest) => {
                const isSelected = profile.intereses.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`
                      px-4 py-2.5 rounded-lg border-2 font-medium text-sm
                      transition-all duration-200
                      ${
                        isSelected
                          ? "bg-teal-50 text-teal-700 border-teal-500 ring-2 ring-teal-200"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                      }
                    `}
                  >
                    {isSelected && <span className="mr-1.5">✓</span>}
                    {interest}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {profile.intereses.length}{" "}
              {profile.intereses.length === 1
                ? "interés seleccionado"
                : "intereses seleccionados"}
            </p>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate("/student/profile")}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`
              px-6 py-2.5 rounded-lg font-medium
              transition-colors duration-200
              flex items-center gap-2
              ${
                saving
                  ? "bg-teal-400 cursor-not-allowed"
                  : "bg-teal-500 hover:bg-teal-600"
              }
              text-white
            `}
          >
            {saving ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Guardando...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Guardar cambios
              </>
            )}
          </button>
        </div>
      </form>

      {/* Notificación Toast */}
      {notification.show && (
        <div
          className={`
            fixed bottom-6 right-6 z-50
            px-6 py-4 rounded-lg shadow-lg
            flex items-center gap-3
            animate-slide-up
            ${
              notification.type === "error"
                ? "bg-red-50 border-l-4 border-red-500"
                : "bg-green-50 border-l-4 border-green-500"
            }
          `}
        >
          {notification.type === "error" ? (
            <svg
              className="w-6 h-6 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
          <p
            className={`
              text-sm font-medium
              ${
                notification.type === "error"
                  ? "text-red-800"
                  : "text-green-800"
              }
            `}
          >
            {notification.message}
          </p>
        </div>
      )}
    </div>
  );
}
