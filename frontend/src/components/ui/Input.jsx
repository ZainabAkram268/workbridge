// components/ui/Input.jsx

export default function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  hint,
  disabled = false,
  className = "",
}) {
  const borderCls = error
    ? "border-red-400 focus:border-red-400"
    : "border-gray-200 focus:border-teal-dark";

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-semibold text-gray-900 mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full px-3.5 py-3 min-h-[48px] border-[1.5px] rounded-xl text-sm text-gray-900 bg-white transition-colors duration-150 outline-none focus:border-teal-dark disabled:bg-gray-50 ${borderCls}`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}