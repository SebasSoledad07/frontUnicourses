import supabase from "./supabase";

export interface Perfil {
  id: string;
  nombre: string;
  email: string;
  bio?: string | null;
  rol?: string | null;
  intereses?: string[] | null;
}
export interface CursoLite {
  id: number;
  nombre: string;
  categoria?: string | null;
}

export async function getCurrentProfile(): Promise<Perfil | null> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data, error } = await supabase
    .from("perfiles")
    .select("id, nombre, email, bio, rol, intereses")
    .eq("id", auth.user.id)
    .maybeSingle();

  if (error) throw new Error("Error al cargar perfil");

  return (data as Perfil) ?? null;
}
export async function updateProfile(
  id: string,
  payload: {
    nombre: string;
    email: string;
    bio: string | null;
    intereses: string[];
  }
) {
  const { error } = await supabase
    .from("perfiles")
    .update(payload)
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function getEnrolledCourses(): Promise<CursoLite[]> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return [];

  const { data: m } = await supabase
    .from("matriculas")
    .select("curso_id")
    .eq("perfil_id", auth.user.id);

  const ids = (m || []).map((x: any) => x.curso_id);
  if (ids.length === 0) return [];

  const { data: cursos } = await supabase
    .from("cursos")
    .select("id, nombre, categoria")
    .in("id", ids)
    .order("nombre");

  return (cursos || []) as CursoLite[];
}
