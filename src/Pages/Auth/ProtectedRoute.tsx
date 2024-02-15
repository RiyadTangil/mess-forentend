// ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { Route, Navigate } from "react-router-dom";
import Dashboard from "../../Layout/Dashboard/Dashboard";
import BottomNavigation from "../../Components/BottomNavigation/BottomNavigation";

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
  //Mobile View Check
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return isAuthenticated ? (
    <>
      {isMobile ? (
        <BottomNavigation component={component} />
      ) : (
        <>
          <Dashboard />
          {component}
        </>
      )}
    </>
  ) : (
    <Navigate to={"/login"} replace />
  );
};

export default ProtectedRoute;
