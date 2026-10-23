import { Toaster } from "react-hot-toast";

function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: "#ffffff",
          color: "var(--text-main)",
          border: "1px solid var(--border-light)",
          boxShadow: "var(--shadow-card)",
          borderRadius: "12px",
          fontSize: "0.92rem",
          fontWeight: 500,
          padding: "12px 16px",
        },
        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#e11d48",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}

export default AppToaster;
