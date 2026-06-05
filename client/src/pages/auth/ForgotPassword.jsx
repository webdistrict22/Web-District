import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import useLanguage from "../../hooks/useLanguage";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { getErrorMessage, t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error(t("auth.forgot.validation"));
      return;
    }

    try {
      setIsLoading(true);

      await api.post("/auth/forgot-password", { email });

      setMessage(t("auth.forgot.success"));
      setEmail("");
      toast.success(t("auth.forgot.success"));
    } catch (error) {
      toast.error(
        getErrorMessage(error, "auth.forgot.error")
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

              <form onSubmit={handleSubmit} className="grid gap-5">
                <Input
                  label={t("auth.login.email")}
                  type="email"
                  placeholder="you@example.com"
                  className="wd-ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? t("auth.forgot.submitting") : t("auth.forgot.submit")}
                </Button>
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
