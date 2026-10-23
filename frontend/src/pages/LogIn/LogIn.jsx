import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { APP_CONFIG, AUTH_ENDPOINTS, AUTH_TEXT, STORAGE_KEYS, USER_ROLES } from "../../constants/app";
import { ROUTES } from "../../constants/routes";
import { useFetch } from "../../hooks/useFetch";
import AuthBrandPanel from "./components/AuthBrandPanel";
import AuthFormPanel from "./components/AuthFormPanel";
import "./LogIn.css";

function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { execute, loading } = useFetch();

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      const result = await execute({
        url: `${APP_CONFIG.API_BASE_URL}${AUTH_ENDPOINTS.LOGIN}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        throwOnError: false,
      });

      if (!result.response.ok) {
        throw new Error(result.data?.message || AUTH_TEXT.LOGIN_FAILED);
      }

      localStorage.setItem(STORAGE_KEYS.TOKEN, result.data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.data.user));

      toast.success(AUTH_TEXT.LOGIN_SUCCESS);

      if (result.data.user?.role === USER_ROLES.ADMIN) {
        navigate(ROUTES.ADMIN);
      } else {
        navigate(ROUTES.DASHBOARD);
      }
    } catch (error) {
      const errMsg = error.message || AUTH_TEXT.GENERIC_ERROR;
      setMessage(errMsg);
      toast.error(errMsg);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <AuthBrandPanel />

        <AuthFormPanel
          email={email}
          password={password}
          showPassword={showPassword}
          message={message}
          loading={loading}
          setEmail={setEmail}
          setPassword={setPassword}
          setShowPassword={setShowPassword}
          handleSubmit={handleSubmit}
          navigate={navigate}
        />
      </div>
    </div>
  );
}

export default LogIn;
