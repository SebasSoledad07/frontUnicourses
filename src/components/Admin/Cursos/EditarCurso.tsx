import { useEffect, useState } from "react";
import supabase from "../../../utils/supabase";

interface Curso {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  profesor_asignado: string;
  activo: boolean;
  cupo_maximo: number;
}

interface EditarCursoProps {
  curso: Curso;
  onCursoActualizado: () => void;
  onCancelar: () => void;
}

export default function EditarCurso({
  curso,
  onCursoActualizado,
  onCancelar,
}: EditarCursoProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [profesorAsignado, setProfesorAsignado] = useState("");
  const [activo, setActivo] = useState(true);
  const [cupoMaximo, setCupoMaximo] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (curso) {
      setNombre(curso.nombre);
      setDescripcion(curso.descripcion);
      setCategoria(curso.categoria);
      setProfesorAsignado(curso.profesor_asignado);
      setActivo(curso.activo);
      setCupoMaximo(curso.cupo_maximo);
    }
  }, [curso]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("cursos")
      .update({
        nombre,
        descripcion,
        categoria,
        profesor_asignado: profesorAsignado,
        activo,
        cupo_maximo: cupoMaximo,
      })
      .eq("id", curso.id);

    setLoading(false);

    if (error) {
      alert("Error al actualizar el curso: " + error.message);
    } else {
      onCursoActualizado();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Editar Curso</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
            required
          />
        </div>
        <div>
          <label className="block font-medium">Categoría</label>
          <input
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Profesor Asignado</label>
          <input
            type="text"
            value={profesorAsignado}
            onChange={(e) => setProfesorAsignado(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Máximo de Cupos</label>
          <input
            type="number"
            value={cupoMaximo}
            onChange={(e) => setCupoMaximo(Number(e.target.value))}
            className="w-full border border-gray-300 rounded px-3 py-2"
            min={0}
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
            id="activo"
          />
          <label htmlFor="activo" className="font-medium">
            Activo
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancelar}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
