// components/ui/Badge.jsx

const variantClasses = {
  available: "bg-green-100 text-green-800",
  busy: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-800",
  "in-progress": "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-500",
  expired: "bg-orange-100 text-orange-800",
  verified: "bg-green-100 text-green-800",
  default: "bg-gray-100 text-gray-700",
};

export default function Badge({ children, variant = "default", dot = false, className = "" }) {
  const colorCls = variantClasses[variant] ?? variantClasses.default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${colorCls} ${className}`}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
      )}
      {children}
    </span>
  );
}