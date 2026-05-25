import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Container from "../../components/common/Container";
import SectionHeader from "../../components/common/SectionHeader";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";

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
      toast.error("Please enter name, email, and password.");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      setIsLoading(true);
      await signup(form);
      navigate("/account", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create account.");
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
            eyebrow="Signup"
            title="Create your client account."
            description="Use your account later to track requests, appointments, contracts, and project updates."
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
                  label="Name *"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />

                <Input
                  label="Business name"
                  placeholder="Business / brand name"
                  value={form.businessName}
                  onChange={(e) => updateField("businessName", e.target.value)}
                />

                <Input
                  label="Email *"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />

                <Input
                  label="Phone / WhatsApp"
                  placeholder="011..."
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>

              <Input
                label="Password *"
                type="password"
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-[#D9D4CC]">
              Already have an account?{" "}
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

export default Signup;
