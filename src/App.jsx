// App.tsx

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import "./App.css";

import MealAndDate from "./Pages/MealAndDate/MealAndDate";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import ProtectedRoute from "./Pages/Auth/ProtectedRoute";
import Login from "./Pages/Login/Login";
import { Toaster } from "react-hot-toast";
import Users from "./Pages/Users/Users";
import MealsDashboard from "./Pages/Meals/Meals";

function App() {
  return (
    <>
      <Toaster />
      <Router>
        <Routes>
          {/* Public route: RegisterPage */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/users"
            element={<ProtectedRoute component={<Users />} />}
          />
          <Route path="/" element={<Login />} />
          <Route
            path="/meal-and-date"
            element={<ProtectedRoute component={<MealAndDate />} />}
          />
          <Route
            path="/meals"
            element={<ProtectedRoute component={<MealsDashboard />} />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
