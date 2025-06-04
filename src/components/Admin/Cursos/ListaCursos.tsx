import { useEffect, useState } from "react";
import supabase from "../../../utils/supabase";
import EditarCurso from "./EditarCurso";

interface Curso {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  fecha_creacion: string;
  profesor_asignado: string;
  activo: boolean;
  cupo_maximo: number;
}

export default function ListaCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState<Curso | null>(
    null
  );

  const abrirModal = (curso: Curso) => {
    setCursoSeleccionado(curso);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setCursoSeleccionado(null);
    setMostrarModal(false);
  };

  const handleCursoActualizado = () => {
    fetchCursos();
    cerrarModal();
  };

  async function fetchCursos() {
    setLoading(true);
    const { data, error } = await supabase.from("cursos").select("*");
    if (error) {
      console.error("Error al cargar cursos:", error.message);
    } else {
      setCursos(data);
    }
    setLoading(false);
  }

  const eliminarCurso = async (id: number) => {
    const confirmacion = confirm("¿Estás seguro de eliminar este curso?");
    if (!confirmacion) return;

    const { error } = await supabase.from("cursos").delete().eq("id", id);
    if (error) {
      alert("Error al eliminar el curso");
    } else {
      alert("Curso eliminado con éxito");
      fetchCursos();
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Lista de Cursos</h2>

      {loading ? (
        <p>Cargando cursos...</p>
      ) : cursos.length === 0 ? (
        <p>No hay cursos disponibles.</p>
      ) : (
        <table className="w-full table-auto border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Descripción</th>
              <th className="px-4 py-2 text-left">Categoría</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map((curso) => (
              <tr key={curso.id} className="border-t">
                <td className="px-4 py-2">{curso.nombre}</td>
                <td className="px-4 py-2">{curso.descripcion}</td>
                <td className="px-4 py-2">
                  {Array.isArray(curso.categoria)
                    ? curso.categoria.join(", ")
                    : curso.categoria}
                </td>
                <td className="px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => abrirModal(curso)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => eliminarCurso(curso.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {mostrarModal && cursoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative">
            <button
              onClick={cerrarModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
            >
              &times;
            </button>

            <EditarCurso
              curso={cursoSeleccionado}
              onCursoActualizado={handleCursoActualizado}
              onCancelar={cerrarModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
