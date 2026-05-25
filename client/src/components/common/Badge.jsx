function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-[#C4A77D]/25 bg-[#C4A77D]/10 px-3 py-1 text-xs font-semibold text-[#F8F7F4] ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;