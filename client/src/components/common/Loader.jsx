import { useState } from "react";

const logoSrc = "/images/logo/web-district-logo.webp";

function Loader({ text = "Loading...", page = false }) {
  const [logoFailed, setLogoFailed] = useState(false);

  const mark = (
    <span className="relative flex h-16 w-28 items-center justify-center overflow-hidden rounded-2xl border border-[#C4A77D]/25 bg-[#080808] shadow-[0_24px_70px_rgba(0,0,0,0.42)]">
      {!logoFailed ? (
        <img
          src={logoSrc}
          alt="Web District"
          width="112"
          height="64"
          loading="eager"
          decoding="async"
          onError={() => setLogoFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-display text-lg font-black tracking-[-0.08em] text-[#F8F7F4]">
          WD
        </span>
      )}
    </span>
  );

  const content = (
    <div className="relative z-10 flex flex-col items-center text-center">
      {mark}

      <div className="mt-7 h-px w-32 overflow-hidden rounded-full bg-[#F8F7F4]/10">
        <span className="block h-full w-16 animate-[wdLoader_1.15s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-[#A8874F] to-transparent" />
      </div>

      <p className="mt-4 text-xs font-bold uppercase tracking-[0.32em] text-[#D9D4CC]">
        {text}
      </p>
    </div>
  );

  if (page) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080808] px-6 text-[#F8F7F4]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(100,19,26,0.16),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(196,167,125,0.14),transparent_30%),linear-gradient(180deg,rgba(248,247,244,0.035),transparent_42%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C4A77D]/55 to-transparent" />
        {content}
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-[1.6rem] border border-[#F8F7F4]/10 bg-[#0B0B0B] p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(100,19,26,0.12),transparent_34%),radial-gradient(circle_at_76%_12%,rgba(196,167,125,0.10),transparent_30%)]" />
      {content}
    </div>
  );
}

export default Loader;
