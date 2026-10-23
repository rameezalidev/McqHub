export const APP_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000",
};

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
};

export const AUTH_TEXT = {
  BRAND_TITLE: "MCQHub",
  BRAND_SUBTITLE: "Learn • Practice • Improve",
  HERO_TITLE: "Welcome Back",
  HERO_DESCRIPTION: "Your next big step is just a login away.",
  PAGE_TITLE: "Login to your account",
  PAGE_DESCRIPTION: "Welcome back! Please enter your details.",
  EMAIL_LABEL: "Email Address",
  EMAIL_PLACEHOLDER: "you@example.com",
  PASSWORD_LABEL: "Password",
  PASSWORD_PLACEHOLDER: "Enter your password",
  SHOW_PASSWORD: "Show",
  HIDE_PASSWORD: "Hide",
  LOGIN_BUTTON: "Login →",
  LOGGING_IN_BUTTON: "Logging in...",
  NO_ACCOUNT_TEXT: "Don't have an account?",
  SIGN_UP_LINK: "Sign up",
  LOGIN_SUCCESS: "Login successful! Welcome back.",
  LOGIN_FAILED: "Login failed",
  GENERIC_ERROR: "Something went wrong",
};

export const AUTH_ENDPOINTS = {
  LOGIN: "/api/auth/login",
};

export const USER_ROLES = {
  ADMIN: "admin",
};
