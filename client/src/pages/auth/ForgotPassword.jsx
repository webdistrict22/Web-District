import { useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import AuthShell, { AuthPanel } from "../../components/auth/AuthShell";
import AuthStatus from "../../components/auth/AuthStatus";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import useLanguage from "../../hooks/useLanguage";
import { focusFirstInvalidControl } from "../../lib/a11y";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const { getErrorMessage, t } = useLanguage();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;

    if (!email) {
      const validationMessage = t("auth.forgot.validation");
      setEmailError(validationMessage);
      setFormError(validationMessage);
      focusFirstInvalidControl(formElement, ["email"]);
      return;
    }

    try {
      setIsLoading(true);
      setEmailError("");
      setFormError("");
      await api.post("/auth/forgot-password", { email });
      const successMessage = t("auth.forgot.success");
      setMessage(successMessage);
      setEmail("");
      toast.success(t("auth.forgot.successToast"));
    } catch (error) {
      const errorMessage = getErrorMessage(error, "auth.forgot.error");
      setFormError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow={t("auth.forgot.eyebrow")}
      title={t("auth.forgot.title")}
      description={t("auth.forgot.description")}
    >
      <AuthPanel>
        {message ? <AuthStatus tone="success">{message}</AuthStatus> : null}

        <form onSubmit={handleSubmit} noValidate aria-busy={isLoading} className="wd-auth-form wd-auth-form--after-status">
          {formError ? <AuthStatus>{formError}</AuthStatus> : null}
          <Input
            tone="light"
            label={t("auth.login.email")}
            type="email"
            name="email"
            autoComplete="email"
            required
            error={emailError}
            placeholder="you@example.com"
            className="wd-ltr"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setEmailError("");
              setFormError("");
            }}
          />

          <Button type="submit" disabled={isLoading} className="wd-auth-submit">
            {isLoading ? t("auth.forgot.submitting") : t("auth.forgot.submit")}
          </Button>
          <span className="sr-only" aria-live="polite">
            {isLoading ? t("auth.forgot.submitting") : ""}
          </span>
        </form>

        <p className="wd-auth-panel-footer">
          {t("auth.forgot.remember")} <Link to="/login">{t("auth.signup.login")}</Link>
        </p>
      </AuthPanel>
    </AuthShell>
  );
}

export default ForgotPassword;
