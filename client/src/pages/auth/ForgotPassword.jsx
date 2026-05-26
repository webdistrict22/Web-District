import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      setIsLoading(true);

      const { data } = await api.post("/auth/forgot-password", { email });

      setMessage(data.message);
      setEmail("");
      toast.success("Reset instructions sent.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send reset instructions."
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
              eyebrow="Password reset"
              title="Reset your password."
              description="Enter your account email and we will send a secure reset link if the account exists."
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
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send reset link"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-[#D9D4CC]">
                Remember your password?{" "}
                <Link to="/login" className="font-semibold text-[#F8F7F4]">
                  Login
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
