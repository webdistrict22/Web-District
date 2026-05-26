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

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.password || !form.confirmPassword) {
      toast.error("Please enter and confirm your new password.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      setIsLoading(true);

      const { data } = await api.put(`/auth/reset-password/${token}`, form);

      localStorage.setItem(STORAGE_KEYS.token, data.token);
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user));
      setUser(data.user);

      toast.success("Password reset successfully.");

      navigate(data.user.role === "admin" ? "/admin" : "/account", {
        replace: true,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to reset password. The link may be invalid or expired."
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
              eyebrow="New password"
              title="Create a new password."
              description="Choose a secure password to regain access to your Web District account."
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
                  label="New password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                />

                <Input
                  label="Confirm password"
                  type="password"
                  placeholder="Repeat your new password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    updateField("confirmPassword", e.target.value)
                  }
                />

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Resetting..." : "Reset password"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-[#D9D4CC]">
                Go back to{" "}
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

export default ResetPassword;
