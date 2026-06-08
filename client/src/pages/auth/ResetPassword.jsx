import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import { STORAGE_KEYS } from "../../lib/constants";
import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import PageMeta from "../../components/common/PageMeta";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";

const initialForm = {
  password: "",
  confirmPassword: "",
};

function ResetPassword() {
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");

  const { token } = useParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { getErrorMessage, t } = useLanguage();

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

    if (!form.password || !form.confirmPassword) {
      const message = t("auth.reset.validation");
      setFieldErrors({
        password: form.password ? "" : message,
        confirmPassword: form.confirmPassword ? "" : message,
      });
      setFormError(message);
      toast.error(message);
      return;
    }

    if (form.password !== form.confirmPassword) {
      const message = t("auth.reset.noMatch");
      setFieldErrors({ confirmPassword: message });
      setFormError(message);
      toast.error(message);
      return;
    }

    if (form.password.length < 6) {
      const message = t("auth.reset.passwordLength");
      setFieldErrors({ password: message });
      setFormError(message);
      toast.error(message);
      return;
    }

    try {
      setIsLoading(true);
      setFormError("");

      const { data } = await api.put(`/auth/reset-password/${token}`, form);

      localStorage.setItem(STORAGE_KEYS.token, data.token);
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user));
      setUser(data.user);

      toast.success(t("auth.reset.success"));

      navigate(data.user.role === "admin" ? "/admin" : "/account", {
        replace: true,
      });
    } catch (error) {
      const message = getErrorMessage(error, "auth.reset.error");
      setFormError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-[#080808]">
      <PageMeta
        title="Reset Password"
        description="Set a new password for your Web District account."
        robots="noindex,nofollow"
      />

      <section className="wd-section-black pt-32 pb-10">
        <Container>
          <div className="mx-auto max-w-xl">
            <SectionHeader
              eyebrow={t("auth.reset.eyebrow")}
              title={t("auth.reset.title")}
              description={t("auth.reset.description")}
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
                  label={t("auth.reset.newPassword")}
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  required
                  error={fieldErrors.password}
                  placeholder={t("auth.signup.passwordPlaceholder")}
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                />

                <Input
                  label={t("auth.reset.confirmPassword")}
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  required
                  error={fieldErrors.confirmPassword}
                  placeholder={t("auth.reset.confirmPlaceholder")}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    updateField("confirmPassword", e.target.value)
                  }
                />

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? t("auth.reset.submitting") : t("auth.reset.submit")}
                </Button>
                <span className="sr-only" aria-live="polite">
                  {isLoading ? t("auth.reset.submitting") : ""}
                </span>
              </form>

              <p className="mt-6 text-center text-sm text-[#D9D4CC]">
                {t("auth.reset.goBack")}{" "}
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

export default ResetPassword;
