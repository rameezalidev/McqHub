import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AUTH_CONFIG, AUTH_ENDPOINTS, AUTH_TEXT } from "../../constants/auth";
import { ROUTES } from "../../constants/routes";
import { useFetch } from "../../hooks/useFetch";
import AuthBrandPanel from "./components/AuthBrandPanel";
import AuthFormPanel from "./components/AuthFormPanel";
import "./SignUp.css";

const initialState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  showPassword: false,
  isSubmitting: false,
  message: "",
  isSuccess: false,
};

function formReducer(state, action) {
  switch (action.type) {
    case "FIELD_CHANGE":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "TOGGLE_PASSWORD_VISIBILITY":
      return {
        ...state,
        showPassword: !state.showPassword,
      };
    case "SUBMIT_START":
      return {
        ...state,
        message: "",
        isSuccess: false,
        isSubmitting: true,
      };
    case "SUBMIT_FAILURE":
      return {
        ...state,
        message: action.message,
        isSuccess: false,
        isSubmitting: false,
      };
    case "SUBMIT_SUCCESS":
      return {
        ...state,
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        message: action.message,
        isSuccess: true,
        isSubmitting: false,
      };
    default:
      return state;
  }
}

function SignUp() {
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const navigate = useNavigate();
  const { execute } = useFetch();

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: "SUBMIT_START" });

    if (formState.password !== formState.confirmPassword) {
      const msg = AUTH_TEXT.PASSWORDS_DO_NOT_MATCH;
      dispatch({ type: "SUBMIT_FAILURE", message: msg });
      toast.error(msg);
      return;
    }

    try {
      const result = await execute({
        url: `${AUTH_CONFIG.API_BASE_URL}${AUTH_ENDPOINTS.SIGNUP}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          password: formState.password,
          confirmPassword: formState.confirmPassword,
        }),
        throwOnError: false,
      });

      if (!result.response.ok) {
        throw new Error(result.data?.message || AUTH_TEXT.SIGNUP_FAILED);
      }

      const successMsg = AUTH_TEXT.SIGNUP_SUCCESS;
      dispatch({ type: "SUBMIT_SUCCESS", message: successMsg });
      toast.success(successMsg);

      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 1500);
    } catch (error) {
      const errMsg = error.message || AUTH_TEXT.GENERIC_ERROR;
      dispatch({ type: "SUBMIT_FAILURE", message: errMsg });
      toast.error(errMsg);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <AuthBrandPanel />

        <AuthFormPanel
          formState={formState}
          dispatch={dispatch}
          handleSubmit={handleSubmit}
          navigate={navigate}
        />
      </div>
    </div>
  );
}

export default SignUp;
