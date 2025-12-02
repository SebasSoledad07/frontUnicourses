import { createContext, useContext, useEffect, useState } from "react";
import type { UserRole } from "../types/roles";
import { getCurrentSessionWithRole, signOut } from "../services/authService";

interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (rol: UserRole) => void;
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
  const [role, setRole] = useState<UserRole | null>(null);

  const login = (rol: UserRole) => {
    setIsAuthenticated(true);
    setRole(rol);
  };

  const logout = async () => {
    await signOut();
    setIsAuthenticated(false);
    setRole(null);
  };

  useEffect(() => {
    const init = async () => {
      const { isAuthenticated, role } = await getCurrentSessionWithRole();
      setIsAuthenticated(isAuthenticated);
      setRole(role);
    };
    init();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
