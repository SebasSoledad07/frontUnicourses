import { FaEnvelope, FaLock } from "react-icons/fa";
import { useState } from "react";
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setMensaje("¡Login exitoso!");
      // Aquí puedes guardar el token o el estado de autenticación
      console.log("Login exitoso:", data);

      // Aquí puedes redirigir al usuario o guardar el estado de login
    } else {
      setMensaje(data.message || "Error al iniciar sesión");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f6f9ff]">
      <div className="bg-white shadow-xl rounded-xl p-8 w-[350px]">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎓</div>
          <h1 className="text-xl font-bold">UniCourses</h1>
          <p className="text-sm text-gray-500">
            Sistema de recomendación de cursos
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="text-sm">Correo institucional</label>
          <div className="flex items-center border rounded px-3 py-2 mt-1 mb-4">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full outline-none"
            />
          </div>

          <label className="text-sm">Contraseña</label>
          <div className="flex items-center border rounded px-3 py-2 mt-1 mb-2">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full outline-none"
            />
          </div>

          <div className="flex justify-between text-sm mb-4">
            <label>
              <input type="checkbox" className="mr-1" />
              Recuerdame
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Sign in
          </button>
          {mensaje && <p>{mensaje}</p>}

          <div className="my-4 text-center text-sm text-gray-500">
            Or continue with
          </div>

          <button className="w-full flex items-center justify-center border py-2 rounded">
            <img
              src="https://img.icons8.com/color/16/000000/google-logo.png"
              alt="google"
              className="mr-2"
            />
            Google
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          ¿No tienes una cuenta?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
