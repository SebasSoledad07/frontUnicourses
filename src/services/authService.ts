import supabase from './supabase';
import type { UserRole } from "../types/roles";
export interface LoginResponse {
  role: UserRole
}
interface RegisterPayload {
  email: string;
  password: string;
  nombreCompleto: string;
  intereses: string[];
  carrera: string;
}
export async function signOut() {
  await supabase.auth.signOut();
}

export async function getCurrentSessionWithRole(): Promise<{
  isAuthenticated: boolean;
  role: UserRole | null;
}> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { isAuthenticated: false, role: null };
  }

  const userId = session.user.id;

  const { data: perfil, error } = await supabase
    .from("perfiles")
    .select("rol")
    .eq("id", userId)
    .single();

  if (error || !perfil?.rol) {
    return { isAuthenticated: true, role: null };
  }

  return { isAuthenticated: true, role: perfil.rol as UserRole };
}
export async function ensureRecoverySession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("Sesión de recuperación no válida");
  }
}
export function onAuthRecovery(callback: () => void) {
  const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
    if (event === "PASSWORD_RECOVERY") {
      callback();
    }
  });

  return () => authListener?.subscription.unsubscribe();
}

// Actualiza la contraseña del usuario actual
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error("Error al actualizar contraseña: " + error.message);
}
export async function loginWithEmailPassword(
  email: string,
  password: string
): Promise<LoginResponse> {
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (authError) throw new Error("Correo o contraseña incorrectos.");

  const userId = authData.user?.id;

  const { data: perfil, error: perfilError } = await supabase
    .from("perfiles")
    .select("rol")
    .eq("id", userId)
    .single();

  if (perfilError || !perfil) {
    throw new Error("No se pudo obtener el perfil del usuario.");
  }

  return { role: perfil.rol };
}

export async function signUpWithProfile(payload: RegisterPayload) {
  const { email, password, nombreCompleto, intereses, carrera } = payload;

  // 1. Crear usuario
  const { data: signUpData, error: signUpError } =
    await supabase.auth.signUp({ email, password });

  if (signUpError || !signUpData.user) {
    throw new Error(
      "Error al registrar usuario: " + (signUpError?.message ?? "")
    );
  }

  const user = signUpData.user;

  // 2. Insertar perfil
  const { error: perfilError } = await supabase.from("perfiles").insert([
    {
      id: user.id,
      nombre: nombreCompleto,
      rol: "estudiante",
      intereses,
      carrera,
    },
  ]);

  if (perfilError) {
    throw new Error("Error al guardar perfil: " + perfilError.message);
  }

  return user;
}


export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) throw new Error(error.message);
}

export async function updateAuthEmailIfChanged(newEmail: string) {
  const { data: auth } = await supabase.auth.getUser();
  const actual = auth.user?.email;
  if (!actual || actual.toLowerCase() === newEmail.toLowerCase()) return;

  const { error } = await supabase.auth.updateUser({ email: newEmail });
  if (error) throw new Error(error.message);
}
