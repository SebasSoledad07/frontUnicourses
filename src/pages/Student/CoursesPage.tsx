import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";

type Curso = {
  id: number;
  nombre: string;
  descripcion: string;
  profesor_asignado: string;
  fecha_creacion: string;
  activo: boolean;
  cupo_maximo: number;
};

type Matricula = {
  curso: Curso;
};

export default function MisCursos() {
  const [cursosMatriculados, setCursosMatriculados] = useState<Matricula[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCursos() {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error obteniendo usuario:", userError);
        setCursosMatriculados([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("matriculas")
        .select(
          `
          curso:curso_id (
            id,
            nombre,
            descripcion,
            profesor_asignado,
            fecha_creacion,
            activo,
            cupo_maximo
          )
        `
        )
        .eq("usuario_id", user.id);

      if (error) {
        console.error("Error al obtener cursos matriculados:", error);
        setCursosMatriculados([]);
      } else {
        // Extrae el primer elemento del array 'curso' para cada matrícula
        setCursosMatriculados(
          (data as any[]).map((matricula) => ({
            curso: Array.isArray(matricula.curso)
              ? matricula.curso[0]
              : matricula.curso,
          }))
        );
      }

      setLoading(false);
    }

    fetchCursos();
  }, []);

  if (loading) return <p>Cargando cursos matriculados...</p>;

  if (cursosMatriculados.length === 0)
    return <p>No estás matriculado en ningún curso.</p>;

  return (
    <div>
      <h2>Mis Cursos Matriculados</h2>
      <ul>
        {cursosMatriculados.map(({ curso }) => (
          <li key={curso.id}>
            <h3>{curso.nombre}</h3>
            <p>{curso.descripcion}</p>
            <p>
              Profesor: {curso.profesor_asignado} | Fecha:{" "}
              {new Date(curso.fecha_creacion).toLocaleDateString()}
            </p>
            <p>Máximo cupos: {curso.cupo_maximo}</p>
            <p>Estado: {curso.activo ? "Activo" : "Inactivo"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
