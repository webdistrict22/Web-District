import { useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import AuthShell, { AuthPanel } from "../../components/auth/AuthShell";
import AuthStatus from "../../components/auth/AuthStatus";
import PasswordField from "../../components/auth/PasswordField";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";
import { focusFirstInvalidControl } from "../../lib/a11y";
import {
  getPasswordConfirmationIssue,
  getPasswordPolicyIssue,
  getPasswordServerIssue,
  passwordIssueKey,
} from "../../lib/passwordPolicy";

const initialForm = {
  name: "",
  businessName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

function Signup() {
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const { signup } = useAuth();
  const { getErrorMessage, t } = useLanguage();
  const navigate = useNavigate();
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
    return message;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const validationMessage = t("auth.signup.validation");
    const nextErrors = {
      name: form.name ? "" : validationMessage,
      email: form.email ? "" : validationMessage,
      password: form.password ? "" : validationMessage,
      confirmPassword: form.confirmPassword ? "" : validationMessage,
    };

    if (Object.values(nextErrors).some(Boolean)) {
      const invalidFields = Object.keys(nextErrors).filter((field) => nextErrors[field]);
      setFieldErrors(nextErrors);
      setFormError(validationMessage);
      focusFirstInvalidControl(formElement, invalidFields);
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
      await signup(form);
      navigate("/account", { replace: true });
    } catch (error) {
      const serverIssue = getPasswordServerIssue(error?.response?.data?.message);
      const message = serverIssue
        ? issueMessage(serverIssue)
        : getErrorMessage(error, "auth.signup.error");
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
      eyebrow={t("auth.signup.eyebrow")}
      title={t("auth.signup.title")}
      description={t("auth.signup.description")}
    >
      <AuthPanel>
        <form onSubmit={handleSubmit} noValidate aria-busy={isLoading} className="wd-auth-form">
          {formError ? <AuthStatus>{formError}</AuthStatus> : null}

          <div className="wd-auth-form-grid">
            <Input tone="light" label={t("start.requestForm.name")} name="name" autoComplete="name" required error={fieldErrors.name} placeholder={t("start.requestForm.namePlaceholder")} value={form.name} onChange={(event) => updateField("name", event.target.value)} />
            <Input tone="light" label={t("start.requestForm.businessName")} name="businessName" autoComplete="organization" placeholder={t("start.requestForm.businessNamePlaceholder")} value={form.businessName} onChange={(event) => updateField("businessName", event.target.value)} />
            <Input tone="light" label={t("start.requestForm.email")} type="email" name="email" autoComplete="email" required error={fieldErrors.email} placeholder={t("start.requestForm.emailPlaceholder")} className="wd-ltr" value={form.email} onChange={(event) => updateField("email", event.target.value)} />
            <Input tone="light" label={t("common.labels.phone")} type="tel" name="phone" autoComplete="tel" placeholder={t("start.requestForm.phonePlaceholder")} className="wd-ltr" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} />
          </div>

          <PasswordField
            label={t("auth.signup.password")}
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
            label={t("auth.signup.confirmPassword")}
            name="confirmPassword"
            autoComplete="new-password"
            required
            error={fieldErrors.confirmPassword}
            placeholder={t("auth.signup.confirmPlaceholder")}
            value={form.confirmPassword}
            onChange={(event) => updateField("confirmPassword", event.target.value)}
            showLabel={t("auth.passwordVisibility.show")}
            hideLabel={t("auth.passwordVisibility.hide")}
          />

          <Button type="submit" disabled={isLoading} className="wd-auth-submit">
            {isLoading ? t("auth.signup.submitting") : t("auth.signup.submit")}
          </Button>
          <span className="sr-only" aria-live="polite">
            {isLoading ? t("auth.signup.submitting") : ""}
          </span>
        </form>

        <p className="wd-auth-panel-footer">
          {t("auth.signup.haveAccount")} <Link to="/login">{t("auth.signup.login")}</Link>
        </p>
      </AuthPanel>
    </AuthShell>
  );
}

export default Signup;
