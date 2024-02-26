// App.tsx

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import "./App.css";

import AddMeals from "./Pages/AddMeals/AddMeals";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import ProtectedRoute from "./Pages/Auth/ProtectedRoute";
import Login from "./Pages/Login/Login";
import { Toaster } from "react-hot-toast";
import Users from "./Pages/Users/Users";
import MealsDashboard from "./Pages/Meals/Meals";
import ManageMeals from "./Pages/ManageMeals/ManageMeals";
import Profile from "./Pages/Profile/Profile";
import Expenditures from "./Pages/Expenditures/Expenditures";

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
          <Route
            path="/"
            element={<ProtectedRoute component={<AddMeals />} />}
          />
          <Route
            path="/add-meals"
            element={<ProtectedRoute component={<AddMeals />} />}
          />
          <Route
            path="/meals-dashboard"
            element={<ProtectedRoute component={<MealsDashboard />} />}
          />
          <Route
            path="/manage-meals"
            element={<ProtectedRoute component={<ManageMeals />} />}
          />
          <Route
            path="/meals-dashboard"
            element={<ProtectedRoute component={<MealsDashboard />} />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute component={<Profile />} />}
          />
          <Route
            path="/expenditure"
            element={<ProtectedRoute component={<Expenditures />} />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
