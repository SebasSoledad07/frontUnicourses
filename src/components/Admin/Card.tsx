const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`bg-white border rounded-lg shadow p-4 ${className}`}>
    {children}
  </div>
);
export default Card;
