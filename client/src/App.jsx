import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import AuthProvider from "./context/AuthContext";
import LanguageProvider from "./context/LanguageContext";
import SettingsProvider from "./context/SettingsContext";
import WelcomeIntro from "./components/common/WelcomeIntro";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SettingsProvider>
          <WelcomeIntro />
          <AppRoutes />

          <Toaster
            position="top-right"
            gutter={12}
            toastOptions={{
              duration: 4200,
              style: {
                background:
                  "linear-gradient(145deg, rgba(11,11,11,0.98), rgba(32,32,32,0.92))",
                color: "#F8F7F4",
                border: "1px solid rgba(196,167,125,0.28)",
                borderRadius: "18px",
                boxShadow: "0 22px 70px rgba(0,0,0,0.36)",
                padding: "14px 16px",
                fontSize: "14px",
                fontWeight: 700,
              },
              success: {
                style: {
                  border: "1px solid rgba(196,167,125,0.42)",
                  background:
                    "linear-gradient(145deg, rgba(11,11,11,0.98), rgba(168,135,79,0.16))",
                },
                iconTheme: {
                  primary: "#A8874F",
                  secondary: "#080808",
                },
              },
              error: {
                style: {
                  border: "1px solid rgba(100,19,26,0.55)",
                  background:
                    "linear-gradient(145deg, rgba(11,11,11,0.98), rgba(100,19,26,0.20))",
                },
                iconTheme: {
                  primary: "#64131A",
                  secondary: "#F8F7F4",
                },
              },
            }}
          />

          <Analytics />
          <SpeedInsights />
        </SettingsProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
