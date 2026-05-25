function SectionHeader({
  eyebrow,
  title,
  description,
  center = false,
  className = "",
}) {
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      {eyebrow && (
        <div className={`mb-4 flex items-center gap-3 ${center ? "justify-center" : ""}`}>
          <span className="wd-accent-line" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#C4A77D]" />
          <p className="text-xs font-bold uppercase tracking-[0.34em] text-[#C4A77D]">
            {eyebrow}
          </p>
        </div>
      )}

      <h2 className="font-display text-3xl font-bold tracking-[-0.05em] text-[#F8F7F4] md:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-5 text-base leading-8 text-[#D9D4CC] md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionHeader;
