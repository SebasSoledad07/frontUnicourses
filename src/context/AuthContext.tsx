import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../utils/supabase"; // Asegúrate de que la ruta sea correcta

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  login: (rol: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  role: null,
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  const login = (rol: string) => {
    setIsAuthenticated(true);
    setRole(rol);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setRole(null);
  };

  // Verifica si hay sesión activa al cargar la app
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        // Opcional: podrías recuperar el rol del perfil aquí también
        setIsAuthenticated(true);
        const userId = session.user.id;

        const { data: perfil } = await supabase
          .from("perfiles")
          .select("rol")
          .eq("id", userId)
          .single();

        if (perfil?.rol) setRole(perfil.rol);
      }
    };

    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
