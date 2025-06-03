const Badge = ({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline";
}) => {
  const base = "text-sm px-2 py-1 rounded-full";
  const variants = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    outline: "border border-gray-400 text-gray-800",
  };
  return <span className={`${base} ${variants[variant]}`}>{children}</span>;
};

export default Badge;
