export const AUTH_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000",
};

export const AUTH_ENDPOINTS = {
  LOGIN: "/api/auth/login",
  SIGNUP: "/api/auth/signup",
};

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
};

export const USER_ROLES = {
  ADMIN: "admin",
};

export const AUTH_TEXT = {
  BRAND_TITLE: "MCQHub",
  BRAND_SUBTITLE: "Learn • Practice • Improve",
  LOGIN_TAB: "Login",
  SIGNUP_TAB: "Sign Up",
  HERO_TITLE: "Create your account",
  HERO_DESCRIPTION: "Join MCQHub and start your learning journey today.",
  PAGE_TITLE: "Start practicing today",
  PAGE_DESCRIPTION: "Create your free student account in seconds.",
  FULL_NAME_LABEL: "Full Name",
  FULL_NAME_PLACEHOLDER: "John Doe",
  EMAIL_LABEL: "Email Address",
  EMAIL_PLACEHOLDER: "you@example.com",
  PASSWORD_LABEL: "Password",
  PASSWORD_PLACEHOLDER: "Create a password",
  CONFIRM_PASSWORD_LABEL: "Confirm Password",
  CONFIRM_PASSWORD_PLACEHOLDER: "Confirm your password",
  SHOW_PASSWORD: "Show",
  HIDE_PASSWORD: "Hide",
  PASSWORDS_DO_NOT_MATCH: "Passwords do not match!",
  SIGNUP_SUCCESS: "Account created successfully! Redirecting to login...",
  SIGNUP_FAILED: "Signup failed",
  GENERIC_ERROR: "Something went wrong",
  CREATE_ACCOUNT_BUTTON: "Create Account →",
  CREATING_ACCOUNT_BUTTON: "Creating Account...",
  ALREADY_HAVE_ACCOUNT_TEXT: "Already have an account?",
  LOGIN_LINK: "Login",
};
