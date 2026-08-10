import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import AuthShell, { AuthPanel } from "../../components/auth/AuthShell";
import AuthStatus from "../../components/auth/AuthStatus";
import PasswordField from "../../components/auth/PasswordField";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";
import { focusFirstInvalidControl } from "../../lib/a11y";

const initialForm = { email: "", password: "" };

function Login() {
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const { login } = useAuth();
  const { getErrorMessage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setFieldErrors((previous) => ({ ...previous, [field]: "" }));
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const validationMessage = t("auth.login.validation");
    const nextErrors = {
      email: form.email ? "" : validationMessage,
      password: form.password ? "" : validationMessage,
    };

    if (nextErrors.email || nextErrors.password) {
      const invalidFields = Object.keys(nextErrors).filter((field) => nextErrors[field]);
      setFieldErrors(nextErrors);
      setFormError(validationMessage);
      focusFirstInvalidControl(formElement, invalidFields);
      return;
    }

    try {
      setIsLoading(true);
      setFormError("");
      const result = await login(form);
      const from = location.state?.from;
      navigate(from || (result.user.role === "admin" ? "/admin" : "/account"), {
        replace: true,
      });
    } catch (error) {
      const message = getErrorMessage(error, "auth.login.error");
      setFormError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow={t("auth.login.eyebrow")}
      title={t("auth.login.title")}
      description={t("auth.login.description")}
    >
      <AuthPanel>
        <form onSubmit={handleSubmit} noValidate aria-busy={isLoading} className="wd-auth-form">
          {formError ? <AuthStatus>{formError}</AuthStatus> : null}

          <Input
            tone="light"
            label={t("auth.login.email")}
            type="email"
            name="email"
            autoComplete="email"
            required
            error={fieldErrors.email}
            placeholder="you@example.com"
            className="wd-ltr"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
          />

          <PasswordField
            label={t("auth.login.password")}
            name="password"
            autoComplete="current-password"
            required
            error={fieldErrors.password}
            placeholder={t("auth.login.passwordPlaceholder")}
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            showLabel={t("auth.passwordVisibility.show")}
            hideLabel={t("auth.passwordVisibility.hide")}
          />

          <Link to="/forgot-password" className="wd-auth-panel-link">
            {t("auth.login.forgotPassword")}
          </Link>

          <Button type="submit" disabled={isLoading} className="wd-auth-submit">
            {isLoading ? t("auth.login.submitting") : t("auth.login.submit")}
          </Button>
          <span className="sr-only" aria-live="polite">
            {isLoading ? t("auth.login.submitting") : ""}
          </span>
        </form>

        <p className="wd-auth-panel-footer">
          {t("auth.login.noAccount")} <Link to="/signup">{t("auth.login.createOne")}</Link>
        </p>
      </AuthPanel>
    </AuthShell>
  );
}

export default Login;
