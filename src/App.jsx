// App.tsx
import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import "./App.css";

import MealAndDate from "./Pages/MealAndDate/MealAndDate";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import ProtectedRoute from "./Pages/Auth/ProtectedRoute";
import Login from "./Pages/Login/Login";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route: RegisterPage */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/meal-and-date"
          element={<ProtectedRoute component={<MealAndDate />} />}
        />

        {/* Protected route: MealAndDate */}
        {/* <ProtectedRoute
          path="/meal-and-date"
          element={<MealAndDate />}
          redirectTo="/register"
        /> */}

        {/* Default route: Redirect to /meal-and-date if authenticated, otherwise to /register */}
        {/* <ProtectedRoute
          path="/"
          element={<Navigate to="/meal-and-date" replace />}
          redirectTo="/register"
        /> */}
      </Routes>
    </Router>
  );
}

export default App;
