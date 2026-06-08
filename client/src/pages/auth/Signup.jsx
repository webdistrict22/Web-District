import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import PageMeta from "../../components/common/PageMeta";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";

const initialForm = {
  name: "",
  businessName: "",
  email: "",
  phone: "",
  password: "",
};

function Signup() {
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");

  const { signup } = useAuth();
  const { getErrorMessage, t } = useLanguage();
  const navigate = useNavigate();

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationMessage = t("auth.signup.validation");
    const nextErrors = {
      name: form.name ? "" : validationMessage,
      email: form.email ? "" : validationMessage,
      password: form.password ? "" : validationMessage,
    };

    if (nextErrors.name || nextErrors.email || nextErrors.password) {
      setFieldErrors(nextErrors);
      setFormError(validationMessage);
      toast.error(validationMessage);
      return;
    }

    if (form.password.length < 6) {
      const message = t("auth.signup.passwordLength");
      setFieldErrors((prev) => ({ ...prev, password: message }));
      setFormError(message);
      toast.error(message);
      return;
    }

    try {
      setIsLoading(true);
      setFormError("");
      await signup(form);
      navigate("/account", { replace: true });
    } catch (error) {
      const message = getErrorMessage(error, "auth.signup.error");
      setFormError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-[#080808]">
      <PageMeta
        title="Create Account"
        description="Create a Web District client account to manage requests, appointments, and proposals."
        robots="noindex,nofollow"
      />

      <section className="wd-section-black pt-32 pb-10">
        <Container>
        <div className="mx-auto max-w-2xl">
          <SectionHeader
            eyebrow={t("auth.signup.eyebrow")}
            title={t("auth.signup.title")}
            description={t("auth.signup.description")}
            center
          />
        </div>
        </Container>
      </section>

      <section className="wd-section-black py-12 md:pb-20">
        <Container>
        <div className="mx-auto max-w-2xl">
          <Card className="wd-card-on-black p-6 md:p-8">
            <form
              onSubmit={handleSubmit}
              noValidate
              aria-busy={isLoading}
              className="grid gap-5"
            >
              {formError && (
                <p
                  role="alert"
                  className="rounded-2xl border border-[#C4A77D]/25 bg-[#C4A77D]/8 p-3 text-sm text-[#F8F7F4]"
                >
                  {formError}
                </p>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label={t("start.requestForm.name")}
                  name="name"
                  autoComplete="name"
                  required
                  error={fieldErrors.name}
                  placeholder={t("start.requestForm.namePlaceholder")}
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />

                <Input
                  label={t("start.requestForm.businessName")}
                  name="businessName"
                  autoComplete="organization"
                  placeholder={t("start.requestForm.businessNamePlaceholder")}
                  value={form.businessName}
                  onChange={(e) => updateField("businessName", e.target.value)}
                />

                <Input
                  label={t("start.requestForm.email")}
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  error={fieldErrors.email}
                  placeholder={t("start.requestForm.emailPlaceholder")}
                  className="wd-ltr"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />

                <Input
                  label={t("common.labels.phone")}
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  placeholder={t("start.requestForm.phonePlaceholder")}
                  className="wd-ltr"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>

              <Input
                label={t("auth.signup.password")}
                type="password"
                name="password"
                autoComplete="new-password"
                required
                error={fieldErrors.password}
                placeholder={t("auth.signup.passwordPlaceholder")}
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading ? t("auth.signup.submitting") : t("auth.signup.submit")}
              </Button>
              <span className="sr-only" aria-live="polite">
                {isLoading ? t("auth.signup.submitting") : ""}
              </span>
            </form>

            <p className="mt-6 text-center text-sm text-[#D9D4CC]">
              {t("auth.signup.haveAccount")}{" "}
              <Link to="/login" className="font-semibold text-[#F8F7F4]">
                {t("auth.signup.login")}
              </Link>
            </p>
          </Card>
        </div>
        </Container>
      </section>
    </main>
  );
}

export default Signup;
