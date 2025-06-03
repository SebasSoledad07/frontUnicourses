import { useState } from "react";
import supabase from "../../utils/supabase";

const interestsList = [
  "Mathematics",
  "Science",
  "Programming",
  "Art",
  "Music",
  "Sports",
  "History",
  "Literature",
  "Languages",
];

const carreraList = [
  "Administración de Empresas",
  "Arquitectura",
  "Comercio Internacional",
  "Comunicación Social",
  "Contaduría Pública",
  "Derecho",
  "Enfermería",
  "Ingeniería Agroindustrial",
  "Ingeniería Agronómica",
  "Ingeniería Ambiental",
  "Ingeniería Biotecnológica",
  "Ingeniería Civil",
  "Ingeniería de Minas",
  "Ingeniería de Sistemas",
  "Ingeniería Electromecánica",
  "Ingeniería Electrónica",
  "Ingeniería Industrial",
  "Ingeniería Mecánica",
  "Licenciatura en Matemáticas",
  "Licenciatura en Ciencias Naturales",
  "Licenciatura en Educación Infantil",
  "Química Industrial",
  "Seguridad y Salud en el Trabajo",
  "Trabajo Social",
  "Zootecnia",
];

export default function RegisterForm() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedCarrera, setSelectedCarrera] = useState("");
  const [mensaje, setMensaje] = useState("");

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje("");

    if (password !== confirmPassword) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    if (!selectedCarrera || selectedInterests.length === 0) {
      setMensaje("Selecciona al menos una carrera e interés.");
      return;
    }

    try {
      // 1. Crear usuario con Supabase Auth
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (signUpError) {
        setMensaje("Error al registrar usuario: " + signUpError.message);
        return;
      }

      const user = signUpData.user;
      if (!user) {
        setMensaje("No se pudo crear el usuario.");
        return;
      }

      // 2. Insertar en la tabla perfiles
      const { error: perfilError } = await supabase.from("perfiles").insert([
        {
          id: user.id,
          nombre: `${nombre} ${apellido}`,
          rol: "estudiante",
          intereses: selectedInterests,
          carrera: selectedCarrera,
        },
      ]);

      if (perfilError) {
        setMensaje("Error al guardar perfil: " + perfilError.message);
        return;
      }

      setMensaje(
        "Usuario registrado con éxito. Revisa tu correo para confirmar."
      );
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      console.error(err);
      setMensaje("Error inesperado. Intenta de nuevo.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fbff] flex flex-col">
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <h1 className="font-bold text-lg">UniCourses</h1>
        </div>
        <nav className="space-x-6 text-sm text-gray-600">
          <a href="#">Ayuda</a>
          <a href="/login">Sign In</a>
        </nav>
      </header>

      <main className="flex-1 flex justify-center items-center px-6 py-12">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">
              Encuentra tu curso ideal
            </h2>
            <p className="text-gray-600">
              Recomendaciones personalizadas basadas en tus intereses.
            </p>
          </div>

          {/* Right (Formulario) */}
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Crea tu cuenta</h3>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm">Nombres</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full mt-1 px-3 py-2 border rounded outline-none"
                />
              </div>
              <div>
                <label className="block text-sm">Apellidos</label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                  className="w-full mt-1 px-3 py-2 border rounded outline-none"
                />
              </div>
              <div>
                <label className="block text-sm">Correo</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full mt-1 px-3 py-2 border rounded outline-none"
                />
              </div>
              <div>
                <label className="block text-sm">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full mt-1 px-3 py-2 border rounded outline-none"
                />
              </div>
              <div>
                <label className="block text-sm">Confirmar Contraseña</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full mt-1 px-3 py-2 border rounded outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Carrera
                </label>
                <select
                  value={selectedCarrera}
                  onChange={(e) => setSelectedCarrera(e.target.value)}
                  required
                  className="w-full mt-1 px-3 py-2 border rounded outline-none"
                >
                  <option value="" disabled>
                    Selecciona una carrera
                  </option>
                  {carreraList.map((carrera) => (
                    <option key={carrera} value={carrera}>
                      {carrera}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Intereses
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {interestsList.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-2 rounded-md border ${
                        selectedInterests.includes(interest)
                          ? "bg-blue-100 text-blue-600 border-blue-400"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <input type="checkbox" className="mr-2" required />
                Acepto las{" "}
                <a href="#" className="text-blue-600 underline">
                  Condiciones
                </a>{" "}
                y{" "}
                <a href="#" className="text-blue-600 underline">
                  Política de privacidad
                </a>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Crear cuenta
              </button>
              {mensaje && (
                <p
                  className={`mt-2 text-center ${
                    mensaje.includes("éxito")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {mensaje}
                </p>
              )}
            </form>
            <p className="mt-4 text-sm text-center">
              ¿Ya tienes cuenta?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Inicia sesión
              </a>
            </p>
          </div>
        </div>
      </main>

      <footer className="text-center text-sm text-gray-500 py-6">
        <p>© 2025 UniCourses. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
