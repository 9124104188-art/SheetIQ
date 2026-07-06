import { Loader2 } from "lucide-react";
import "../styles/button.css";

function Button({
  children,
  icon,
  loading = false,
  variant = "primary",
  disabled = false,
  ...props
}) {
  return (
    <button
      className={`app-btn ${variant}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="spin" size={18} />
          Loading...
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}

export default Button;