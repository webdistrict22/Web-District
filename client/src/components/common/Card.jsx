function Card({ children, className = "" }) {
  return (
    <div className={`wd-card rounded-[1.6rem] ${className}`}>
      {children}
    </div>
  );
}

export default Card;