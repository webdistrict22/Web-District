import { Toaster } from "react-hot-toast";
import AuthProvider from "./context/AuthContext";
import SettingsProvider from "./context/SettingsContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <AppRoutes />

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0A1A2D",
              color: "#F5F8FC",
              border: "1px solid rgba(245, 248, 252, 0.1)",
            },
            success: {
              iconTheme: {
                primary: "#C69A4E",
                secondary: "#020817",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
