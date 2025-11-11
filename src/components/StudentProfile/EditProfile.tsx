// src/components/StudentProfile/EditarPerfil.tsx
import { useEffect, useState, type KeyboardEvent } from "react";
import supabase from "../../utils/supabase";
import Toast from "../Toast";

interface Perfil {
  id: string;
  nombre: string;
  email: string;
  bio?: string | null;
  rol?: string | null;
  intereses?: string[] | null;
}

interface ToastMessage {
  type: "success" | "error" | "warning" | "info";
  message: string;
}

export default function EditarPerfil() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [intereses, setIntereses] = useState<string[]>([]);
  const [inputInteres, setInputInteres] = useState("");
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    setLoading(true);
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      setToast({
        type: "error",
        message: "Debes iniciar sesión para editar tu perfil",
      });
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("perfiles")
      .select("id, nombre, email, bio, rol, intereses")
      .eq("id", auth.user.id)
      .maybeSingle();

    if (error) {
      setToast({ type: "error", message: "Error al cargar perfil" });
    } else if (data) {
      const p = data as Perfil;
      setPerfil(p);
      setNombre(p.nombre || "");
      setEmail(p.email || auth.user.email || "");
      setBio(p.bio || "");
      setIntereses(Array.isArray(p.intereses) ? p.intereses : []);
    }
    setLoading(false);
  };

  const actualizarEmailAuthSiCambio = async (nuevoEmail: string) => {
    const { data: auth } = await supabase.auth.getUser();
    const actual = auth.user?.email;
    if (!actual || actual.toLowerCase() === nuevoEmail.toLowerCase()) return;
    const { error } = await supabase.auth.updateUser({ email: nuevoEmail });
    if (error) throw new Error(error.message);
  };

  const handleAddInteres = () => {
    const v = inputInteres.trim();
    if (!v) return;
    if (intereses.includes(v)) {
      setInputInteres("");
      return;
    }
    setIntereses((prev) => [...prev, v]);
    setInputInteres("");
  };

  const handleInteresKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddInteres();
    }
  };

  const removeInteres = (value: string) => {
    setIntereses((prev) => prev.filter((x) => x !== value));
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!perfil) return;

    if (!nombre.trim()) {
      setToast({ type: "warning", message: "El nombre es obligatorio" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setToast({ type: "warning", message: "Correo electrónico no válido" });
      return;
    }

    setGuardando(true);
    try {
      const { error: upError } = await supabase
        .from("perfiles")
        .update({
          nombre: nombre.trim(),
          email: email.trim(),
          bio: bio.trim() || null,
          intereses: intereses, // text[]
        })
        .eq("id", perfil.id);

      if (upError) throw new Error(upError.message);

      try {
        await actualizarEmailAuthSiCambio(email.trim());
      } catch {
        setToast({
          type: "info",
          message:
            "Perfil actualizado. Revisa tu correo para confirmar el cambio de email",
        });
      }

      setToast({ type: "success", message: "Perfil actualizado exitosamente" });
      await cargarPerfil();
    } catch (err: any) {
      setToast({
        type: "error",
        message:
          "No se pudo actualizar el perfil: " + (err?.message || "Error"),
      });
    } finally {
      setGuardando(false);
    }
  };

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
    <div className="max-w-4xl mx-auto py-8 px-4">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Editar perfil</h1>
        <p className="text-gray-600 mt-1">Actualiza tu información personal</p>
      </div>

      <form
        onSubmit={handleGuardar}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
      >
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre completo
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
            placeholder="Ej: Juan Pérez"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correo electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
            placeholder="estudiante@correo.com"
          />
          <p className="text-xs text-gray-500 mt-1">
            Si cambias tu correo, podrías recibir un email para confirmarlo.
          </p>
        </div>

        {/* Intereses (chips) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intereses
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputInteres}
              onChange={(e) => setInputInteres(e.target.value)}
              onKeyDown={handleInteresKey}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              placeholder="Escribe un interés y presiona Enter"
            />
            <button
              type="button"
              onClick={handleAddInteres}
              className="px-4 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
            >
              Agregar
            </button>
          </div>
          {intereses.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {intereses.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeInteres(tag)}
                    className="text-teal-700 hover:text-teal-900"
                    aria-label={`Quitar ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Ejemplos: Frontend, Linux, IA, Matemáticas.
          </p>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Biografía
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-none"
            placeholder="Cuéntanos sobre ti, intereses, objetivos, etc."
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={cargarPerfil}
            disabled={guardando}
            className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg transition-colors font-medium disabled:opacity-50"
          >
            Restaurar
          </button>
          <button
            type="submit"
            disabled={guardando}
            className={`px-6 py-3 rounded-lg font-medium transition-all text-white
              ${
                guardando
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg hover:shadow-xl"
              }`}
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
