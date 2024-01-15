// ProtectedRoute.tsx
import React from "react";
import { Route, Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  component: React.ReactNode;
  redirectTo: string;
  path: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component,
  redirectTo,
  ...rest
}) => {
  const isAuthenticated = localStorage.getItem("messInfo") !== null; // Adjust based on your storage logic

  return isAuthenticated ? (
    <>{component}</>
  ) : (
    <Navigate to={"/register"} replace />
  );
};

export default ProtectedRoute;
