import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface ButtonProps {
  children: React.ReactNode;
  to?: string;
  type?: "button" | "submit" | "reset"; // Optional but constrained to valid button types
  onClick?: () => void;
  variant?: "primary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  to,
  type = "button", // Default to "button" if not provided
  onClick,
  variant = "primary",
  size = "md",
  className = "",
}) => {
  const baseClasses =
    "inline-flex items-center transition duration-300 justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = {
    primary:
      "bg-secondary text-white hover:bg-hover hover:text-brand focus:ring-blue-500 transition duration-300",
    outline:
      "border border-primary text-brand hover:bg-blue-50 focus:ring-blue-500 transition duration-300",
  };
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const buttonContent = (
    <motion.span
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center"
    >
      {children}
    </motion.span>
  );

  if (to) {
    return (
      <Link to={to} className={buttonClasses}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={buttonClasses}>
      {buttonContent}
    </button>
  );
};

export default Button;
