const Button = ({ children, className, ...props }) => {
  return (
    <button className={`btn btn-primary ${className}`} {...props}>
      {children}
    </button>
  );
};
export default Button;
