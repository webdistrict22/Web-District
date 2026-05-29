import { useEffect, useState } from "react";

function ProjectCover({
  image,
  name,
  className = "",
  children,
  imageLoading = "lazy",
  fetchPriority = "auto",
}) {
  const [canShowImage, setCanShowImage] = useState(Boolean(image));

  useEffect(() => {
    setCanShowImage(Boolean(image));
  }, [image]);

  return (
    <div
      className={`relative overflow-hidden bg-[radial-gradient(circle_at_72%_18%,rgba(196,167,125,0.24),transparent_30%),radial-gradient(circle_at_16%_86%,rgba(100,19,26,0.18),transparent_30%),linear-gradient(135deg,#080808,#0B0B0B)] ${className}`}
    >
      <div className="absolute inset-0 p-5">
        <div className="flex h-full flex-col justify-between rounded-[1.2rem] border border-white/10 bg-white/[0.035] p-5">
          <div className="flex gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#C4A77D]" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#D9D4CC]/60" />
          </div>
          <div className="grid gap-3">
            <span className="h-12 rounded-2xl bg-white/[0.08]" />
            <span className="h-20 rounded-2xl bg-[#C4A77D]/14" />
          </div>
        </div>
      </div>

      {canShowImage && (
        <img
          src={image}
          alt={name}
          loading={imageLoading}
          decoding="async"
          fetchPriority={fetchPriority}
          onError={() => setCanShowImage(false)}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/90 via-[#080808]/20 to-transparent" />
      {children}
    </div>
  );
}

export default ProjectCover;
