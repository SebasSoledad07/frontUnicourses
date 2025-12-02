// components/RoleProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";
import type { UserRole } from "../types/roles";

interface RoleProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: UserRole[]; // ej. ['administrador', 'profesor']
}

export const RoleProtectedRoute = ({
  children,
  allowedRoles,
}: RoleProtectedRouteProps) => {
  const { isAuthenticated, role: userRole } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};
