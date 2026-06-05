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
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";

const initialForm = {
  password: "",
  confirmPassword: "",
};

function ResetPassword() {
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { getErrorMessage, t } = useLanguage();

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.password || !form.confirmPassword) {
      toast.error(t("auth.reset.validation"));
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error(t("auth.reset.noMatch"));
      return;
    }

    if (form.password.length < 6) {
      toast.error(t("auth.reset.passwordLength"));
      return;
    }

    try {
      setIsLoading(true);

      const { data } = await api.put(`/auth/reset-password/${token}`, form);

      localStorage.setItem(STORAGE_KEYS.token, data.token);
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user));
      setUser(data.user);

      toast.success(t("auth.reset.success"));

      navigate(data.user.role === "admin" ? "/admin" : "/account", {
        replace: true,
      });
    } catch (error) {
      toast.error(
        getErrorMessage(error, "auth.reset.error")
      );
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
              <form onSubmit={handleSubmit} className="grid gap-5">
                <Input
                  label={t("auth.reset.newPassword")}
                  type="password"
                  placeholder={t("auth.signup.passwordPlaceholder")}
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                />

                <Input
                  label={t("auth.reset.confirmPassword")}
                  type="password"
                  placeholder={t("auth.reset.confirmPlaceholder")}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    updateField("confirmPassword", e.target.value)
                  }
                />

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? t("auth.reset.submitting") : t("auth.reset.submit")}
                </Button>
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
