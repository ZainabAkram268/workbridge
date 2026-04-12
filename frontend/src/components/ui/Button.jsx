// components/ui/Button.jsx

const variantClasses = {
  dark: "bg-gray-900 text-white hover:bg-gray-800",
  outline: "bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-50",
  teal: "bg-teal text-white hover:bg-teal-dark",
  danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
  ghost: "bg-transparent text-gray-500 border border-gray-200 hover:bg-gray-50",
};

const sizeClasses = {
  sm: "text-sm px-4 py-2 min-h-[36px]",
  md: "text-sm px-6 py-3 min-h-[48px]",
  lg: "text-base px-8 py-3.5 min-h-[54px]",
};

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "dark",
  size = "md",
  disabled = false,
  fullWidth = false,
  ...rest
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";
  const variantCls = variantClasses[variant] ?? variantClasses.dark;
  const sizeCls = sizeClasses[size] ?? sizeClasses.md;
  const widthCls = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variantCls} ${sizeCls} ${widthCls}`}
      {...rest}
    >
      {children}
    </button>
  );
}