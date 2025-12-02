import { useEffect, useState } from "react";
import Toast from "../Toast";
import {
  getCurrentProfile,
  getEnrolledCourses,
  type Perfil,
  type CursoLite,
} from "../../services/profileService";

interface ToastMessage {
  type: "success" | "error" | "warning" | "info";
  message: string;
}

export default function PerfilView() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [matriculados, setMatriculados] = useState<CursoLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      try {
        const p = await getCurrentProfile();
        if (!p) {
          setToast({
            type: "error",
            message: "Debes iniciar sesión para ver tu perfil",
          });
          setPerfil(null);
          setMatriculados([]);
        } else {
          setPerfil(p);
          const cursos = await getEnrolledCourses();
          setMatriculados(cursos);
        }
      } catch (err) {
        console.error(err);
        setToast({ type: "error", message: "Error al cargar perfil" });
        setPerfil(null);
        setMatriculados([]);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

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

  if (!perfil) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <p className="text-gray-600">No se encontró información de perfil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 mb-8">
        {/* Intereses */}
        {perfil.intereses && perfil.intereses.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Intereses
            </h3>
            <div className="flex flex-wrap gap-2">
              {perfil.intereses.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bio */}
        {perfil.bio && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Sobre mí
            </h3>
            <p className="text-gray-700 leading-6">{perfil.bio}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Matriculados */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Cursos matriculados
            </h2>
            <span className="text-sm text-gray-500">{matriculados.length}</span>
          </div>
          {matriculados.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No tienes cursos matriculados aún.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {matriculados.map((c) => (
                <li
                  key={c.id}
                  className="py-3 flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-gray-900 font-medium truncate">
                      {c.nombre}
                    </p>
                    {c.categoria && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {c.categoria}
                      </p>
                    )}
                  </div>
                  <a
                    href={`/cursos/${c.id}`}
                    className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                  >
                    Ver curso
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
