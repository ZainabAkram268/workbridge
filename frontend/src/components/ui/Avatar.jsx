// components/ui/Avatar.jsx

const sizeClasses = {
  sm: "w-9 h-9 text-sm",
  md: "w-11 h-11 text-base",
  lg: "w-16 h-16 text-xl",
  xl: "w-20 h-20 text-2xl",
};

function getInitials(name = "") {
  const words = name.trim().split(/\s+/);
  const first = words[0]?.[0] ?? "";
  const second = words[1]?.[0] ?? "";
  return (first + second).toUpperCase();
}

export default function Avatar({ name = "", size = "md" }) {
  const sizeCls = sizeClasses[size] ?? sizeClasses.md;
  const initials = getInitials(name);

  return (
    <div
      className={`${sizeCls} rounded-full bg-teal-light text-teal-dark font-bold flex items-center justify-center shrink-0 select-none`}
    >
      {initials}
    </div>
  );
}