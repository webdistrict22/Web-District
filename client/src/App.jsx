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
              background: "#080808",
              color: "#F8F7F4",
              border: "1px solid rgba(248,247,244,0.14)",
            },
            success: {
              iconTheme: {
                primary: "#C4A77D",
                secondary: "#080808",
              },
            },
            error: {
              iconTheme: {
                primary: "#64131A",
                secondary: "#F8F7F4",
              },
            },
          }}
        />
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
