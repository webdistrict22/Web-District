import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import AuthShell, { AuthPanel } from "../../components/auth/AuthShell";
import AuthStatus from "../../components/auth/AuthStatus";
import PasswordField from "../../components/auth/PasswordField";
import Button from "../../components/common/Button";
import useLanguage from "../../hooks/useLanguage";
import { focusFirstInvalidControl } from "../../lib/a11y";
import {
  getPasswordConfirmationIssue,
  getPasswordPolicyIssue,
  getPasswordServerIssue,
  passwordIssueKey,
} from "../../lib/passwordPolicy";

const initialForm = { password: "", confirmPassword: "" };

function ResetPassword() {
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();
  const { getErrorMessage, t } = useLanguage();
  const issueMessage = (issue) => t(passwordIssueKey(issue));

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setFieldErrors((previous) => ({ ...previous, [field]: "" }));
    setFormError("");
  };

  const showPasswordError = (field, issue) => {
    const message = issueMessage(issue);
    setFieldErrors((previous) => ({ ...previous, [field]: message }));
    setFormError(message);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;

    if (!form.password || !form.confirmPassword) {
      const message = t("auth.reset.validation");
      const nextErrors = {
        password: form.password ? "" : message,
        confirmPassword: form.confirmPassword ? "" : message,
      };
      setFieldErrors(nextErrors);
      setFormError(message);
      focusFirstInvalidControl(
        formElement,
        Object.keys(nextErrors).filter((field) => nextErrors[field]),
      );
      return;
    }

    const passwordIssue = getPasswordPolicyIssue(form.password);
    if (passwordIssue) {
      showPasswordError("password", passwordIssue);
      focusFirstInvalidControl(formElement, ["password"]);
      return;
    }

    const confirmationIssue = getPasswordConfirmationIssue(
      form.password,
      form.confirmPassword,
    );
    if (confirmationIssue) {
      showPasswordError("confirmPassword", confirmationIssue);
      focusFirstInvalidControl(formElement, ["confirmPassword"]);
      return;
    }

    try {
      setIsLoading(true);
      setFormError("");
      await api.put(`/auth/reset-password/${token}`, form, {
        skipAuthRefresh: true,
      });
      toast.success(t("auth.reset.success"));
      navigate("/login", { replace: true });
    } catch (error) {
      const serverIssue = getPasswordServerIssue(error?.response?.data?.message);
      const message = serverIssue
        ? issueMessage(serverIssue)
        : getErrorMessage(error, "auth.reset.error");
      const field = serverIssue === "mismatch" ? "confirmPassword" : "password";
      if (serverIssue) setFieldErrors((previous) => ({ ...previous, [field]: message }));
      setFormError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow={t("auth.reset.eyebrow")}
      title={t("auth.reset.title")}
      description={t("auth.reset.description")}
    >
      <AuthPanel>
        <form onSubmit={handleSubmit} noValidate aria-busy={isLoading} className="wd-auth-form">
          {formError ? <AuthStatus>{formError}</AuthStatus> : null}
          <PasswordField
            label={t("auth.reset.newPassword")}
            name="password"
            autoComplete="new-password"
            required
            error={fieldErrors.password}
            helper={t("auth.passwordPolicy.helper")}
            placeholder={t("auth.signup.passwordPlaceholder")}
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            showLabel={t("auth.passwordVisibility.show")}
            hideLabel={t("auth.passwordVisibility.hide")}
          />
          <PasswordField
            label={t("auth.reset.confirmPassword")}
            name="confirmPassword"
            autoComplete="new-password"
            required
            error={fieldErrors.confirmPassword}
            placeholder={t("auth.reset.confirmPlaceholder")}
            value={form.confirmPassword}
            onChange={(event) => updateField("confirmPassword", event.target.value)}
            showLabel={t("auth.passwordVisibility.show")}
            hideLabel={t("auth.passwordVisibility.hide")}
          />

          <Button type="submit" disabled={isLoading} className="wd-auth-submit">
            {isLoading ? t("auth.reset.submitting") : t("auth.reset.submit")}
          </Button>
          <span className="sr-only" aria-live="polite">
            {isLoading ? t("auth.reset.submitting") : ""}
          </span>
        </form>

        <p className="wd-auth-panel-footer">
          {t("auth.reset.goBack")} <Link to="/login">{t("auth.signup.login")}</Link>
        </p>
      </AuthPanel>
    </AuthShell>
  );
}

export default ResetPassword;
