// ProtectedRoute.tsx
import React, { useState } from "react";
import { Route, Navigate } from "react-router-dom";
import Dashboard from "../../Layout/Dashboard/Dashboard";

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
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };
  return isAuthenticated ? (
    <>
      <Dashboard />
      {component}
    </>
  ) : (
    <Navigate to={"/register"} replace />
  );
};

export default ProtectedRoute;
