import { useState } from "react";
import api from "../../lib/axios";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";

function VerificationNotice() {
  const { user } = useAuth();
  const { isArabic } = useLanguage();
  const [status, setStatus] = useState("");
  if (!user || user.role !== "client" || user.emailVerified) return null;

  const resend = async () => {
    setStatus("loading");
    try {
      await api.post("/auth/resend-verification");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div role="status" className="mb-6 rounded-2xl border border-[#C4A77D]/30 bg-[#C4A77D]/10 p-4 text-sm text-[#F8F7F4]">
      <p>{isArabic ? "أكد بريدك الإلكتروني لربط الطلبات والمواعيد السابقة بأمان." : "Verify your email to securely link earlier requests and appointments."}</p>
      <button type="button" onClick={resend} disabled={status === "loading"} className="mt-3 font-semibold text-[#C4A77D] underline-offset-4 hover:underline disabled:opacity-60">
        {status === "sent" ? (isArabic ? "تم إرسال الرابط" : "Verification link queued") : (isArabic ? "إعادة إرسال رابط التأكيد" : "Resend verification link")}
      </button>
      {status === "error" && <p role="alert" className="mt-2 text-red-300">{isArabic ? "تعذر إرسال الرابط الآن." : "The link could not be queued right now."}</p>}
    </div>
  );
}

export default VerificationNotice;
