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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎓</span>
            <h1 className="font-bold text-xl text-gray-800">UniCourses</h1>
          </div>
          <nav className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-teal-600 transition-colors"
            >
              Ayuda
            </a>
            <a
              href="/login"
              className="text-sm px-4 py-2 text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50 transition-colors"
            >
              Iniciar sesión
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Hero Section */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Plataforma de aprendizaje personalizado
            </div>

            <h2 className="text-5xl font-bold text-gray-900 leading-tight">
              Encuentra tu curso ideal
            </h2>

            <p className="text-xl text-gray-600 leading-relaxed">
              Recomendaciones personalizadas basadas en tus intereses académicos
              y profesionales.
            </p>

            {/* Features */}
            <div className="space-y-4 pt-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-teal-600"
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
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Cursos personalizados
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Recomendaciones basadas en tu perfil académico
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Matrícula fácil
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Inscríbete en tus cursos favoritos en segundos
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Seguimiento en tiempo real
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Monitorea tu progreso académico constantemente
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 lg:p-10">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Crea tu cuenta
              </h3>
              <p className="text-gray-600">Comienza tu viaje educativo hoy</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Nombres y Apellidos en Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombres <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="Juan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellidos <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="Pérez"
                  />
                </div>
              </div>

              {/* Correo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico <span className="text-red-500">*</span>
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
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="tu@correo.com"
                  />
                </div>
              </div>

              {/* Contraseñas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Carrera */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carrera <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedCarrera}
                  onChange={(e) => setSelectedCarrera(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors appearance-none bg-white"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23374151' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.75rem center",
                    backgroundSize: "1rem",
                  }}
                >
                  <option value="" disabled>
                    Selecciona tu carrera
                  </option>
                  {carreraList.map((carrera) => (
                    <option key={carrera} value={carrera}>
                      {carrera}
                    </option>
                  ))}
                </select>
              </div>

              {/* Intereses */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Áreas de interés
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {interestsList.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`
                        px-3 py-2 rounded-lg border-2 text-sm font-medium
                        transition-all duration-200
                        ${
                          isSelected
                            ? "bg-teal-50 text-teal-700 border-teal-500 ring-2 ring-teal-200"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                        }
                      `}
                      >
                        {isSelected && <span className="mr-1">✓</span>}
                        {interest}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {selectedInterests.length}{" "}
                  {selectedInterests.length === 1
                    ? "interés seleccionado"
                    : "intereses seleccionados"}
                </p>
              </div>

              {/* Términos y condiciones */}
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                <input
                  type="checkbox"
                  required
                  className="mt-1 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <label className="text-sm text-gray-600">
                  Acepto las{" "}
                  <a
                    href="#"
                    className="text-teal-600 hover:underline font-medium"
                  >
                    Condiciones de uso
                  </a>{" "}
                  y la{" "}
                  <a
                    href="#"
                    className="text-teal-600 hover:underline font-medium"
                  >
                    Política de privacidad
                  </a>
                </label>
              </div>

              {/* Botón de envío */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Crear cuenta
              </button>

              {/* Mensaje de respuesta */}
              {mensaje && (
                <div
                  className={`
                  p-4 rounded-lg text-sm font-medium text-center
                  ${
                    mensaje.includes("éxito")
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }
                `}
                >
                  {mensaje}
                </div>
              )}
            </form>

            {/* Login link */}
            <p className="mt-6 text-center text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <a
                href="/login"
                className="text-teal-600 hover:underline font-semibold"
              >
                Inicia sesión aquí
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-gray-600">
          <p>© 2025 UniCourses. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
