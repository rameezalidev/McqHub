
import Dashboard from './pages/Dashboard/Dashboard';
import LogIn from './pages/LogIn/LogIn';
import Quiz from './pages/Quiz/Quiz';
import SignUp from './pages/SignUp/SignUp';
import Error from './pages/Error/Error';
import NavBar from './components/NavBar'

import { Routes, Route, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Admin from './pages/Admin/Admin';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const navigate = useNavigate();


  return (
    <>

      <Routes>
        
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz/:categoryId"
          element={
            <ProtectedRoute>
              
              <Quiz />
            </ProtectedRoute>
          }
        />

 

        <Route path="/admin" element={<Admin />} />
        
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
}

export default App;
