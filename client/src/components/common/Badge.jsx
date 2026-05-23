function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-[#C69A4E]/25 bg-[#C69A4E]/10 px-3 py-1 text-xs font-semibold text-[#F1D08B] ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;