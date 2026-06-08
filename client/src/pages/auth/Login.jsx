import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  email: "",
  password: "",
};

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
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationMessage = t("auth.login.validation");
    const nextErrors = {
      email: form.email ? "" : validationMessage,
      password: form.password ? "" : validationMessage,
    };

    if (nextErrors.email || nextErrors.password) {
      setFieldErrors(nextErrors);
      setFormError(validationMessage);
      toast.error(validationMessage);
      return;
    }

    try {
      setIsLoading(true);
      setFormError("");
      const result = await login(form);

      const from = location.state?.from;

      if (from) {
        navigate(from, { replace: true });
        return;
      }

      navigate(result.user.role === "admin" ? "/admin" : "/account", {
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
    <main className="bg-[#080808]">
      <PageMeta
        title="Login"
        description="Login to your Web District client account."
        robots="noindex,nofollow"
      />

      <section className="wd-section-black pt-32 pb-10">
        <Container>
        <div className="mx-auto max-w-xl">
          <SectionHeader
            eyebrow={t("auth.login.eyebrow")}
            title={t("auth.login.title")}
            description={t("auth.login.description")}
            center
          />
        </div>
        </Container>
      </section>

      <section className="wd-section-black py-12 md:pb-20">
        <Container>
        <div className="mx-auto max-w-xl">
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

              <Input
                label={t("auth.login.email")}
                type="email"
                name="email"
                autoComplete="email"
                required
                error={fieldErrors.email}
                placeholder="you@example.com"
                className="wd-ltr"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
              />

              <Input
                label={t("auth.login.password")}
                type="password"
                name="password"
                autoComplete="current-password"
                required
                error={fieldErrors.password}
                placeholder={t("auth.login.passwordPlaceholder")}
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
              />

              <div className="-mt-2 text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-[#D9D4CC] transition hover:text-[#C4A77D]"
                >
                  {t("auth.login.forgotPassword")}
                </Link>
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? t("auth.login.submitting") : t("auth.login.submit")}
              </Button>
              <span className="sr-only" aria-live="polite">
                {isLoading ? t("auth.login.submitting") : ""}
              </span>
            </form>

            <p className="mt-6 text-center text-sm text-[#D9D4CC]">
              {t("auth.login.noAccount")}{" "}
              <Link to="/signup" className="font-semibold text-[#F8F7F4]">
                {t("auth.login.createOne")}
              </Link>
            </p>
          </Card>
        </div>
        </Container>
      </section>
    </main>
  );
}

export default Login;
