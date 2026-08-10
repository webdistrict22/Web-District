import { useState } from "react";

const logoSrc = "/images/logo/web-district-logo.webp";

function Loader({ text = "Loading...", page = false }) {
  const [logoFailed, setLogoFailed] = useState(false);

  const mark = (
    <span className="relative flex h-16 w-28 items-center justify-center overflow-hidden rounded-2xl border border-[#D6A75D]/30 bg-[#050505] shadow-[0_24px_70px_rgba(0,0,0,0.42)]">
      {!logoFailed ? (
        <img
          src={logoSrc}
          alt=""
          aria-hidden="true"
          width="112"
          height="64"
          loading="eager"
          decoding="async"
          onError={() => setLogoFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-display text-lg font-black tracking-[-0.08em] text-[#F7F2EC]">
          WD
        </span>
      )}
    </span>
  );

  const content = (
    <div
      className="relative z-10 flex flex-col items-center text-center"
      role="status"
      aria-live="polite"
    >
      {mark}

      <div className="mt-7 h-px w-32 overflow-hidden rounded-full bg-[#EEE8DF]/12">
        <span className="block h-full w-16 animate-[wdLoader_1.15s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-[#D6A75D] to-transparent" />
      </div>

      <p className="mt-4 text-xs font-bold uppercase tracking-[0.32em] text-[#AAA39C]">
        {text}
      </p>
    </div>
  );

  if (page) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-6 text-[#F7F2EC]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D6A75D]/55 to-transparent" />
        {content}
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-[1.6rem] border border-[#EEE8DF]/10 bg-[#050505] p-8 text-center text-[#F7F2EC] shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
      {content}
    </div>
  );
}

export default Loader;
