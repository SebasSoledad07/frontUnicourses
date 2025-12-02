import supabase from "./supabase";

export interface StudentCourse {
  id: string;
  nombre: string;
  codigo: string;
  descripcion: string;
  profesor_asignado: string;
  }

export interface StudentModule {
  id: number;
  titulo: string;
  descripcion: string;
  orden: number;
  visible: boolean;
}

export interface StudentModuleContent {
  id: number;
  tipo: 'pdf' | 'video' | 'link' | 'texto';
  titulo: string;
  descripcion?: string;
  url?: string;
  archivo_nombre?: string;
  archivo_size?: number;
  orden: number;
}

// Obtener cursos matriculados del estudiante
export async function getEnrolledCourses(): Promise<StudentCourse[]> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("No autenticado");

  // Obtener IDs de cursos matriculados
  const { data: matriculas } = await supabase
    .from("matriculas")
    .select("curso_id, created_at")
    .eq("perfil_id", auth.user.id);

  if (!matriculas || matriculas.length === 0) return [];

  const cursoIds = matriculas.map((m) => m.curso_id);

  // Obtener información de los cursos
  const { data: cursos, error } = await supabase
    .from("cursos")
    .select("id, nombre, codigo, descripcion, profesor_asignado")
    .in("id", cursoIds);

  if (error) throw new Error("Error al cargar cursos: " + error.message);

  // Combinar con fecha de matrícula
  return (cursos || []).map((curso) => {
    const matricula = matriculas.find((m) => m.curso_id === curso.id);
    return {
      ...curso,
      fecha_matricula: matricula?.created_at || "",
    };
  }) as StudentCourse[];
}

// Obtener módulos visibles de un curso
export async function getStudentCourseModules(
  cursoId: string
): Promise<StudentModule[]> {
  const { data, error } = await supabase
    .from("modulos_curso")
    .select("id, titulo, descripcion, orden, visible")
    .eq("curso_id", cursoId)
    .eq("visible", true)
    .order("orden", { ascending: true });

  if (error) throw new Error("Error al cargar módulos: " + error.message);

  return (data || []) as StudentModule[];
}

// Obtener contenido visible de un módulo
export async function getStudentModuleContent(
  moduloId: number
): Promise<StudentModuleContent[]> {
  const { data, error } = await supabase
    .from("contenido_modulo")
    .select("id, tipo, titulo, descripcion, url, archivo_nombre, archivo_size, orden")
    .eq("modulo_id", moduloId)
    .eq("visible", true)
    .order("orden", { ascending: true });

  if (error) throw new Error("Error al cargar contenido: " + error.message);

  return (data || []) as StudentModuleContent[];
}

// Verificar si el estudiante está matriculado en el curso
export async function isEnrolledInCourse(cursoId: string): Promise<boolean> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return false;

  const { data, error } = await supabase
    .from("matriculas")
    .select("id")
    .eq("perfil_id", auth.user.id)
    .eq("curso_id", cursoId)
    .maybeSingle();

  return !error && !!data;
}
