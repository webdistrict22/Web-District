import { useEffect, useRef, useState } from "react";
import { CheckCircle2, LoaderCircle, XCircle } from "lucide-react";
import { useParams } from "react-router";
import api from "../../lib/axios";
import AuthShell, { AuthPanel } from "../../components/auth/AuthShell";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";

function VerifyEmail() {
  const { token } = useParams();
  const { setUser } = useAuth();
  const { isArabic, t } = useLanguage();
  const started = useRef(false);
  const [state, setState] = useState({ loading: true, error: "" });

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    api
      .post("/auth/verify-email", { token }, { skipAuthRefresh: true })
      .then(({ data }) => {
        if (data.user) setUser(data.user);
        setState({ loading: false, error: "" });
      })
      .catch((error) => {
        setState({
          loading: false,
          error: error.response?.data?.message || t("auth.verify.errorDescription"),
        });
      });
  }, [setUser, t, token]);

  const mode = state.loading ? "loading" : state.error ? "error" : "success";
  const title = t(`auth.verify.${mode}Title`);
  const description = state.error && !isArabic
    ? state.error
    : t(`auth.verify.${mode}Description`);
  const StatusIcon = mode === "loading" ? LoaderCircle : mode === "error" ? XCircle : CheckCircle2;

  return (
    <AuthShell
      eyebrow={t("auth.verify.eyebrow")}
      title={title}
      description={description}
      metaTitle={title}
    >
      <AuthPanel className="wd-auth-result" aria-live="polite">
        <StatusIcon
          className={`wd-auth-result__icon${mode === "loading" ? " is-loading" : ""}`}
          aria-hidden="true"
        />
        <p className="wd-auth-result__label">{t(`auth.verify.${mode}Label`)}</p>
        {!state.loading ? (
          <Button
            to={state.error ? "/login" : "/account"}
            className="wd-auth-submit wd-auth-result__action"
          >
            {state.error ? t("auth.verify.backToLogin") : t("auth.verify.openAccount")}
          </Button>
        ) : null}
      </AuthPanel>
    </AuthShell>
  );
}

export default VerifyEmail;
