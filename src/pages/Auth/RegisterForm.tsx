import { useState } from "react";

export default function RegisterForm() {
  const [fullName, setFull] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje(""); // Reiniciar mensaje

    try {
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("Usuario registrado con éxito");
      } else {
        setMensaje(data.message || data.error || "Error al registrar");
      }
    } catch (error) {
      setMensaje("Error al conectar con el servidor.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fbff] flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <h1 className="font-bold text-lg">UniCourses</h1>
        </div>
        <nav className="space-x-6 text-sm text-gray-600">
          <a href="#">Ayuda</a>
          <a href="#">Sign In</a>
        </nav>
      </header>

      {/* Main */}
      <main className="flex-1 flex justify-center items-center px-6 py-12">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">
              Encuentre su curso universitario ideal
            </h2>
            <p className="text-gray-600">
              Únete a los muchos estudiantes que han encontrado su curso ideal
              gracias a las recomendaciones personalizadas de UniCourses.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-xl">🎯</span>
                <div>
                  <strong>Recomendaciones personalizadas</strong>
                  <p className="text-sm text-gray-600">
                    Obtén recomendaciones de cursos basadas en tus intereses
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Right Section (Register Form) */}
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Crea tu cuenta</h3>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm">Nombres y Apellidos</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFull(e.target.value)}
                  required
                  className="w-full mt-1 px-3 py-2 border rounded outline-none"
                />
              </div>
              <div>
                <label className="block text-sm">Correo institucional</label>
                <input
                  type="email"
                  placeholder="your.email@school.edu"
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
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full mt-1 px-3 py-2 border rounded outline-none"
                />
              </div>
              <div className="text-sm text-gray-600">
                <input type="checkbox" className="mr-2" />
                Acepto las{" "}
                <a href="#" className="text-blue-600 underline">
                  Condiciones de servicio
                </a>{" "}
                y la{" "}
                <a href="#" className="text-blue-600 underline">
                  Política de privacidad
                </a>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 ">
                Create Account
              </button>
              {mensaje && <p>{mensaje}</p>}
            </form>
            <p className="mt-4 text-sm text-center">
              ¿Ya tenias una cuenta?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-6">
        <p>© 2025 UniCourses. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="#" className="hover:underline">
            Terms
          </a>
          <a href="#" className="hover:underline">
            Privacy
          </a>
          <a href="#" className="hover:underline">
            Help Center
          </a>
          <a href="#" className="hover:underline">
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
}
