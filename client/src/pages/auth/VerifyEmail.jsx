import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import api from "../../lib/axios";
import Container from "../../components/common/Container";
import Card from "../../components/common/Card";
import PageMeta from "../../components/common/PageMeta";
import Loader from "../../components/common/Loader";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";

function VerifyEmail() {
  const { token } = useParams();
  const { setUser } = useAuth();
  const { isArabic } = useLanguage();
  const started = useRef(false);
  const [state, setState] = useState({ loading: true, error: "", claimed: null });

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    api.post("/auth/verify-email", { token }, { skipAuthRefresh: true })
      .then(({ data }) => {
        if (data.user) setUser(data.user);
        setState({ loading: false, error: "", claimed: data.claimedRecords });
      })
      .catch((error) => setState({ loading: false, error: error.response?.data?.message || "Verification failed", claimed: null }));
  }, [setUser, token]);

  const title = state.error
    ? (isArabic ? "تعذر تأكيد البريد الإلكتروني" : "Email verification failed")
    : (isArabic ? "تم تأكيد بريدك الإلكتروني" : "Your email is verified");

  return (
    <>
      <PageMeta title={title} robots="noindex,nofollow" />
      <section className="wd-section-black min-h-[70vh] pt-36 pb-20">
        <Container>
          <Card className="wd-card-on-black mx-auto max-w-xl p-6 text-center md:p-8">
            {state.loading ? <Loader text={isArabic ? "جارٍ التحقق..." : "Verifying your email..."} /> : (
              <div aria-live="polite">
                <h1 className="font-display text-3xl font-bold">{title}</h1>
                <p className="mt-4 text-[#D9D4CC]">
                  {state.error || (isArabic ? "يمكنك الآن الوصول بأمان إلى السجلات المرتبطة ببريدك." : "You can now securely access records linked to your verified email.")}
                </p>
                <Link to={state.error ? "/login" : "/account"} className="mt-6 inline-flex rounded-full bg-[#C4A77D] px-6 py-3 font-semibold text-[#080808]">
                  {state.error ? (isArabic ? "العودة لتسجيل الدخول" : "Back to login") : (isArabic ? "فتح الحساب" : "Open account")}
                </Link>
              </div>
            )}
          </Card>
        </Container>
      </section>
    </>
  );
}

export default VerifyEmail;
