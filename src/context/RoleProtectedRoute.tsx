// components/RoleProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

export const RoleProtectedRoute = ({
  children,
  role,
}: {
  children: JSX.Element;
  role: string;
}) => {
  const { isAuthenticated, role: userRole } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (userRole !== role) return <Navigate to="/unauthorized" />;

  return children;
};
