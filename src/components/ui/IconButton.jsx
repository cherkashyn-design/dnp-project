export function IconButton({
  label,
  onClick,
  children,
  className = "",
  disabled = false,
  type = "button",
}) {
  return (
    <button
      type={type}
      className={["icon-button", className].filter(Boolean).join(" ")}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
