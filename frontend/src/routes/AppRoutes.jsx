import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import { ROUTES } from "../constants/routes";
import Dashboard from "../pages/Dashboard/Dashboard";
import LogIn from "../pages/LogIn/LogIn";
import Quiz from "../pages/Quiz/Quiz";
import SignUp from "../pages/SignUp/SignUp";
import Error from "../pages/Error/Error";
import Admin from "../pages/Admin/Admin";

function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      <Route path={ROUTES.SIGNUP} element={<SignUp />} />
      <Route path={ROUTES.LOGIN} element={<LogIn />} />

      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.QUIZ}
        element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        }
      />

      <Route path={ROUTES.ADMIN} element={<Admin />} />
      <Route path={ROUTES.NOT_FOUND} element={<Error />} />
    </Routes>
  );
}

export default AppRoutes;
