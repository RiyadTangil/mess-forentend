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
import MealSubmission from "./Pages/MealSubmission/MealSubmission";
import Profile from "./Pages/Profile/Profile";

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
          />npm run dev
          <Route
            path="/"
            element={<ProtectedRoute component={<MealAndDate />} />}
          />
          <Route
            path="/add-meals"
            element={<ProtectedRoute component={<MealAndDate />} />}
          />
          <Route
            path="/meals-dashboard"
            element={<ProtectedRoute component={<MealsDashboard />} />}
          />
          <Route
            path="/manage-meals"
            element={<ProtectedRoute component={<MealSubmission />} />}
          />
          <Route
            path="/meals-dashboard"
            element={<ProtectedRoute component={<MealsDashboard />} />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute component={<Profile />} />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
