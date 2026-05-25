import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";

const initialForm = {
  email: "",
  password: "",
};

function Login() {
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
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
      toast.error("Please enter email and password.");
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
      toast.error(error.response?.data?.message || "Failed to login.");
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
            eyebrow="Login"
            title="Access your Web District account."
            description="Login to track requests, appointments, contracts, and project updates."
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
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-[#D9D4CC]">
              Don't have an account?{" "}
              <Link to="/signup" className="font-semibold text-[#F8F7F4]">
                Create one
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
