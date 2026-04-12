// components/ui/StarRating.jsx

import { Star } from "lucide-react";

export default function StarRating({
  value = 0,
  onChange,
  readOnly = false,
  size = 20,
}) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="inline-flex items-center gap-0.5">
      {stars.map((star) => {
        const active = star <= Math.round(value);
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange && onChange(star)}
            className={`transition-colors duration-100 disabled:cursor-default ${
              active ? "text-amber-400" : "text-gray-300"
            } ${!readOnly ? "hover:text-amber-400 cursor-pointer" : ""}`}
            style={{ fontSize: size }}
            aria-label={`${star} star`}
          >
            <Star
              fill={active ? "currentColor" : "none"}
              style={{ width: size, height: size }}
            />
          </button>
        );
      })}
    </div>
  );
}