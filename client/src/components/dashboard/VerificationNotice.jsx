import { useState } from "react";
import api from "../../lib/axios";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";

function VerificationNotice() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [status, setStatus] = useState("");
  if (!user || user.role !== "client" || user.emailVerified) return null;

  const resend = async () => {
    setStatus("loading");
    try {
      await api.post("/auth/resend-verification");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div role="status" className="wd-portal-verification">
      <div>
        <p>{t("auth.verificationNotice.description")}</p>
        <p>{t("auth.verificationNotice.spamGuidance")}</p>
      </div>
      <button type="button" onClick={resend} disabled={status === "loading"}>
        {status === "sent" ? t("auth.verificationNotice.sent") : t("auth.verificationNotice.resend")}
      </button>
      {status === "sent" ? (
        <p>{t("auth.verificationNotice.resentGuidance")}</p>
      ) : null}
      {status === "error" ? <p role="alert">{t("auth.verificationNotice.error")}</p> : null}
    </div>
  );
}

export default VerificationNotice;
