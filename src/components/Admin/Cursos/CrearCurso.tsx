import { useState } from "react";
import supabase from "../../../utils/supabase";

export default function CrearCurso() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [profesorAsignado, setProfesorAsignado] = useState("");
  const [cupoMaximo, setCupoMaximo] = useState(30);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setError(false);

    const { error } = await supabase.from("cursos").insert([
      {
        nombre,
        descripcion,
        categoria,
        profesor_asignado: profesorAsignado,
        cupo_maximo: cupoMaximo,
        activo: true,
        fecha_creacion: new Date().toISOString(),
      },
    ]);

    if (error) {
      setMensaje(`Error al crear curso: ${error.message}`);
      setError(true);
    } else {
      setMensaje("Curso creado exitosamente.");
      setNombre("");
      setDescripcion("");
      setCategoria("");
      setProfesorAsignado("");
      setCupoMaximo(30);
    }

    setOpen(true);

    // Auto-cerrar notificación después de 4 segundos
    setTimeout(() => setOpen(false), 4000);
  };

  return (
    <div className="flex justify-center items-start py-10 px-4 min-h-screen">
      {/* Card del formulario */}
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Crear Nuevo Curso
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre del curso */}
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre del curso <span className="text-red-500">*</span>
            </label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="
                w-full px-4 py-2 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                transition-colors duration-200
                text-gray-900 placeholder-gray-400
              "
              placeholder="Ej: Programación Web con React"
            />
          </div>

          {/* Descripción */}
          <div>
            <label
              htmlFor="descripcion"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              rows={4}
              className="
                w-full px-4 py-2 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                transition-colors duration-200
                text-gray-900 placeholder-gray-400
                resize-none
              "
              placeholder="Describe el contenido y objetivos del curso..."
            />
          </div>

          {/* Categoría */}
          <div>
            <label
              htmlFor="categoria"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Categoría <span className="text-red-500">*</span>
            </label>
            <input
              id="categoria"
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
              className="
                w-full px-4 py-2 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                transition-colors duration-200
                text-gray-900 placeholder-gray-400
              "
              placeholder="Ej: Programación Web, Frontend, Backend"
            />
          </div>

          {/* Profesor asignado */}
          <div>
            <label
              htmlFor="profesor"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Profesor asignado <span className="text-red-500">*</span>
            </label>
            <input
              id="profesor"
              type="text"
              value={profesorAsignado}
              onChange={(e) => setProfesorAsignado(e.target.value)}
              required
              className="
                w-full px-4 py-2 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                transition-colors duration-200
                text-gray-900 placeholder-gray-400
              "
              placeholder="Nombre del profesor"
            />
          </div>

          {/* Cupo máximo */}
          <div>
            <label
              htmlFor="cupo"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Cupo máximo <span className="text-red-500">*</span>
            </label>
            <input
              id="cupo"
              type="number"
              value={cupoMaximo}
              onChange={(e) => setCupoMaximo(Number(e.target.value))}
              min={1}
              required
              className="
                w-full px-4 py-2 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                transition-colors duration-200
                text-gray-900
              "
            />
          </div>

          {/* Botón de envío */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="
                px-6 py-3 bg-teal-500 hover:bg-teal-600 
                text-white font-medium rounded-lg
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
                flex items-center gap-2
              "
            >
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Crear Curso
            </button>
          </div>
        </form>
      </div>

      {/* Notificación tipo Toast */}
      {open && (
        <div
          className={`
            fixed bottom-6 right-6 z-50
            px-6 py-4 rounded-lg shadow-lg
            flex items-center gap-3
            animate-slide-up
            ${
              error
                ? "bg-red-50 border-l-4 border-red-500"
                : "bg-green-50 border-l-4 border-green-500"
            }
          `}
        >
          {/* Icono */}
          {error ? (
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

          {/* Mensaje */}
          <p
            className={`
              text-sm font-medium
              ${error ? "text-red-800" : "text-green-800"}
            `}
          >
            {mensaje}
          </p>

          {/* Botón cerrar */}
          <button
            onClick={() => setOpen(false)}
            className={`
              ml-4 hover:opacity-70 transition-opacity
              ${error ? "text-red-500" : "text-green-500"}
            `}
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
