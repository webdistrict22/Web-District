import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import PageMeta from "../../components/common/PageMeta";
import useLanguage from "../../hooks/useLanguage";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const { getErrorMessage, t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      const validationMessage = t("auth.forgot.validation");
      setEmailError(validationMessage);
      setFormError(validationMessage);
      toast.error(validationMessage);
      return;
    }

    try {
      setIsLoading(true);
      setEmailError("");
      setFormError("");

      await api.post("/auth/forgot-password", { email });

      setMessage(t("auth.forgot.success"));
      setEmail("");
      toast.success(t("auth.forgot.success"));
    } catch (error) {
      const errorMessage = getErrorMessage(error, "auth.forgot.error");
      setFormError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-[#080808]">
      <PageMeta
        title="Forgot Password"
        description="Request a secure password reset link for your Web District account."
        robots="noindex,nofollow"
      />

      <section className="wd-section-black pt-32 pb-10">
        <Container>
          <div className="mx-auto max-w-xl">
            <SectionHeader
              eyebrow={t("auth.forgot.eyebrow")}
              title={t("auth.forgot.title")}
              description={t("auth.forgot.description")}
              center
            />
          </div>
        </Container>
      </section>

      <section className="wd-section-black py-12 md:pb-20">
        <Container>
          <div className="mx-auto max-w-xl">
            <Card className="wd-card-on-black p-6 md:p-8">
              {message && (
                <div className="mb-5 rounded-2xl border border-[#C4A77D]/20 bg-[#C4A77D]/10 p-4 text-sm leading-6 text-[#F8F7F4]">
                  {message}
                </div>
              )}

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
                  error={emailError}
                  placeholder="you@example.com"
                  className="wd-ltr"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                    setFormError("");
                  }}
                />

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? t("auth.forgot.submitting") : t("auth.forgot.submit")}
                </Button>
                <span className="sr-only" aria-live="polite">
                  {isLoading ? t("auth.forgot.submitting") : ""}
                </span>
              </form>

              <p className="mt-6 text-center text-sm text-[#D9D4CC]">
                {t("auth.forgot.remember")}{" "}
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

export default ForgotPassword;
