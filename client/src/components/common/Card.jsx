function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`wd-card min-w-0 max-w-full rounded-[1.6rem] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
