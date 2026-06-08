function Card({ children, className = "", ...props }) {
  return (
    <div className={`wd-card rounded-[1.6rem] ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Card;
