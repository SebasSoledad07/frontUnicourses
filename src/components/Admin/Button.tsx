const Button = ({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all"
    {...props}
  >
    {children}
  </button>
);
export default Button;
