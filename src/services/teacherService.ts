import supabase from "./supabase";

export interface TeacherCourse {
  id: string;
  nombre: string;
  codigo: string;
  descripcion: string;
  cupo_maximo: number;
  activo: boolean;
  fecha_creacion: string;
  profesor_asignado: string;
  estudiantes_count?: number;
}

export interface CourseStudent {
  fecha_matricula: any;
  id: string;
  nombre: string;
  email: string;
  carrera?: string;
}

export interface CourseModule {
  id: number;
  curso_id: string;
  titulo: string;
  descripcion: string;
  orden: number;
  visible: boolean;
  
}

export interface ModuleContent {
  id: number;
  modulo_id: number;
  tipo: 'pdf' | 'video' | 'link' | 'texto';
  titulo: string;
  descripcion?: string;
  url?: string;
  archivo_nombre?: string;
  archivo_size?: number;
  orden: number;
  visible: boolean;
  created_at: string;
}

// Obtener cursos del profesor actual
export async function getTeacherCourses(): Promise<TeacherCourse[]> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("No autenticado");

  // Obtener perfil del profesor
  const { data: perfil } = await supabase
    .from("perfiles")
    .select("nombre")
    .eq("id", auth.user.id)
    .single();

  if (!perfil) throw new Error("Perfil no encontrado");

  // Obtener cursos donde este profesor está asignado
  const { data: cursos, error } = await supabase
    .from("cursos")
    .select("*")
    .eq("profesor_asignado", perfil.nombre)
    .order("fecha_creacion", { ascending: false });

  if (error) throw new Error("Error al cargar cursos: " + error.message);

  // Obtener conteo de estudiantes por curso
  const cursosConConteo = await Promise.all(
    (cursos || []).map(async (curso) => {
      const { count } = await supabase
        .from("matriculas")
        .select("*", { count: "exact", head: true })
        .eq("curso_id", curso.id);

      return { ...curso, estudiantes_count: count ?? 0 };
    })
  );

  return cursosConConteo as TeacherCourse[];
}

// Obtener estudiantes de un curso específico
export async function getCourseStudents(
  cursoId: string
): Promise<CourseStudent[]> {
  // Obtener matrículas del curso
  const { data: matriculas, error: matError } = await supabase
    .from("matriculas")
    .select("perfil_id, created_at")
    .eq("curso_id", cursoId);

  if (matError) throw new Error("Error al cargar estudiantes");

  if (!matriculas || matriculas.length === 0) return [];

  // Obtener perfiles de los estudiantes
  const perfilIds = matriculas.map((m) => m.perfil_id);

  const { data: perfiles, error: perfilError } = await supabase
    .from("perfiles")
    .select("id, nombre, email, carrera")
    .in("id", perfilIds);

  if (perfilError) throw new Error("Error al cargar perfiles");

  // Combinar datos
  return (perfiles || []).map((perfil) => {
    const matricula = matriculas.find((m) => m.perfil_id === perfil.id);
    return {
      id: perfil.id,
      nombre: perfil.nombre,
      email: perfil.email,
      carrera: perfil.carrera,
      fecha_matricula: matricula?.created_at || "",
    };
  });
}

// Obtener módulos de un curso
export async function getCourseModules(
  cursoId: string
): Promise<CourseModule[]> {
  const { data, error } = await supabase
    .from("modulos_curso")
    .select("*")
    .eq("curso_id", cursoId)
    .order("orden", { ascending: true });

  if (error) throw new Error("Error al cargar módulos: " + error.message);

  return (data || []) as CourseModule[];
}

// Crear nuevo módulo
export async function createCourseModule(
  cursoId: string,
  titulo: string,
  descripcion: string
): Promise<CourseModule> {
  // Obtener el orden máximo actual
  const { data: maxOrden } = await supabase
    .from("modulos_curso")
    .select("orden")
    .eq("curso_id", cursoId)
    .order("orden", { ascending: false })
    .limit(1)
    .single();

  const nuevoOrden = (maxOrden?.orden ?? 0) + 1;

  const { data, error } = await supabase
    .from("modulos_curso")
    .insert({
      curso_id: cursoId,
      titulo,
      descripcion,
      orden: nuevoOrden,
      visible: true,
    })
    .select()
    .single();

  if (error) throw new Error("Error al crear módulo: " + error.message);

  return data as CourseModule;
}

// Actualizar módulo
export async function updateCourseModule(
  moduloId: number,
  updates: Partial<Pick<CourseModule, "titulo" | "descripcion" | "visible">>
): Promise<void> {
  const { error } = await supabase
    .from("modulos_curso")
    .update(updates)
    .eq("id", moduloId);

  if (error) throw new Error("Error al actualizar módulo: " + error.message);
}

// Eliminar módulo
export async function deleteCourseModule(moduloId: number): Promise<void> {
  const { error } = await supabase
    .from("modulos_curso")
    .delete()
    .eq("id", moduloId);

  if (error) throw new Error("Error al eliminar módulo: " + error.message);
}
export async function getModuleContent(
  moduloId: number
): Promise<ModuleContent[]> {
  const { data, error } = await supabase
    .from("contenido_modulo")
    .select("*")
    .eq("modulo_id", moduloId)
    .order("orden", { ascending: true });

  if (error) throw new Error("Error al cargar contenido: " + error.message);

  return (data || []) as ModuleContent[];
}

// Subir archivo a Storage
export async function uploadFile(
  cursoId: string,
  moduloId: number,
  file: File
): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${cursoId}/${moduloId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("course-content")
    .upload(filePath, file);

  if (uploadError) throw new Error("Error al subir archivo: " + uploadError.message);

  const { data: { publicUrl } } = supabase.storage
    .from("course-content")
    .getPublicUrl(filePath);

  return publicUrl;
}

// Crear contenido tipo archivo (PDF, video)
export async function createFileContent(
  moduloId: number,
  tipo: 'pdf' | 'video',
  titulo: string,
  descripcion: string,
  url: string,
  archivoNombre: string,
  archivoSize: number
): Promise<ModuleContent> {
  // Obtener el orden máximo actual
  const { data: maxOrden } = await supabase
    .from("contenido_modulo")
    .select("orden")
    .eq("modulo_id", moduloId)
    .order("orden", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nuevoOrden = (maxOrden?.orden ?? 0) + 1;

  const { data, error } = await supabase
    .from("contenido_modulo")
    .insert({
      modulo_id: moduloId,
      tipo,
      titulo,
      descripcion,
      url,
      archivo_nombre: archivoNombre,
      archivo_size: archivoSize,
      orden: nuevoOrden,
      visible: true,
    })
    .select()
    .single();

  if (error) throw new Error("Error al crear contenido: " + error.message);

  return data as ModuleContent;
}

// Crear contenido tipo link o texto
export async function createLinkOrTextContent(
  moduloId: number,
  tipo: 'link' | 'texto',
  titulo: string,
  descripcion: string,
  url?: string
): Promise<ModuleContent> {
  const { data: maxOrden } = await supabase
    .from("contenido_modulo")
    .select("orden")
    .eq("modulo_id", moduloId)
    .order("orden", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nuevoOrden = (maxOrden?.orden ?? 0) + 1;

  const { data, error } = await supabase
    .from("contenido_modulo")
    .insert({
      modulo_id: moduloId,
      tipo,
      titulo,
      descripcion,
      url: url || null,
      orden: nuevoOrden,
      visible: true,
    })
    .select()
    .single();

  if (error) throw new Error("Error al crear contenido: " + error.message);

  return data as ModuleContent;
}

// Eliminar contenido
export async function deleteModuleContent(contenidoId: number): Promise<void> {
  const { error } = await supabase
    .from("contenido_modulo")
    .delete()
    .eq("id", contenidoId);

  if (error) throw new Error("Error al eliminar contenido: " + error.message);
}

// Toggle visibilidad de contenido
export async function toggleContentVisibility(
  contenidoId: number,
  visible: boolean
): Promise<void> {
  const { error } = await supabase
    .from("contenido_modulo")
    .update({ visible })
    .eq("id", contenidoId);

  if (error) throw new Error("Error al actualizar visibilidad: " + error.message);
}