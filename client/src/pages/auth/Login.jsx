import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";

const initialForm = {
  email: "",
  password: "",
};

function Login() {
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { getErrorMessage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error(t("auth.login.validation"));
      return;
    }

    try {
      setIsLoading(true);
      const user = await login(form);

      const from = location.state?.from;

      if (from) {
        navigate(from, { replace: true });
        return;
      }

      navigate(user.role === "admin" ? "/admin" : "/account", {
        replace: true,
      });
    } catch (error) {
      toast.error(getErrorMessage(error, "auth.login.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-[#080808]">
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
            <form onSubmit={handleSubmit} className="grid gap-5">
              <Input
                label={t("auth.login.email")}
                type="email"
                placeholder="you@example.com"
                className="wd-ltr"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
              />

              <Input
                label={t("auth.login.password")}
                type="password"
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
