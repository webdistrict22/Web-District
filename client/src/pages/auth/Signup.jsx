import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
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

  const { signup } = useAuth();
  const { getErrorMessage, t } = useLanguage();
  const navigate = useNavigate();

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error(t("auth.signup.validation"));
      return;
    }

    if (form.password.length < 6) {
      toast.error(t("auth.signup.passwordLength"));
      return;
    }

    try {
      setIsLoading(true);
      await signup(form);
      navigate("/account", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "auth.signup.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-[#080808]">
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
            <form onSubmit={handleSubmit} className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label={t("start.requestForm.name")}
                  placeholder={t("start.requestForm.namePlaceholder")}
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />

                <Input
                  label={t("start.requestForm.businessName")}
                  placeholder={t("start.requestForm.businessNamePlaceholder")}
                  value={form.businessName}
                  onChange={(e) => updateField("businessName", e.target.value)}
                />

                <Input
                  label={t("start.requestForm.email")}
                  type="email"
                  placeholder={t("start.requestForm.emailPlaceholder")}
                  className="wd-ltr"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />

                <Input
                  label={t("common.labels.phone")}
                  placeholder={t("start.requestForm.phonePlaceholder")}
                  className="wd-ltr"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>

              <Input
                label={t("auth.signup.password")}
                type="password"
                placeholder={t("auth.signup.passwordPlaceholder")}
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading ? t("auth.signup.submitting") : t("auth.signup.submit")}
              </Button>
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
