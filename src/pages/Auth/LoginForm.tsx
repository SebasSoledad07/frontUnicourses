import { FaEnvelope, FaLock } from "react-icons/fa";
import { useState } from "react";
import supabase from "../../utils/supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // usa el contexto

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje("");

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      setMensaje("Correo o contraseña incorrectos.");
      return;
    }

    const userId = authData.user?.id;

    const { data: perfil, error: perfilError } = await supabase
      .from("perfiles")
      .select("rol")
      .eq("id", userId)
      .single();

    if (perfilError || !perfil) {
      setMensaje("No se pudo obtener el perfil del usuario.");
      return;
    }

    login(perfil.rol); // guarda en el contexto

    // Redirigir según el rol
    if (perfil.rol === "administrador") {
      navigate("/admin");
    } else {
      navigate("/home");
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

        <form onSubmit={handleLogin} className="space-y-4">
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
              Recuérdame
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Iniciar sesión
          </button>

          {mensaje && (
            <p className="text-center text-sm mt-3 text-red-600">{mensaje}</p>
          )}
        </form>

        <p className="mt-4 text-sm text-center">
          ¿No tienes una cuenta?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
