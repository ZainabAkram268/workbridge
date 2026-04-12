import React from "react";
import { Clock, CalendarDays, Calendar, CalendarRange } from "lucide-react";

const TYPES = [
  { id: "Hourly",  icon: Clock,        label: "Hourly"  },
  { id: "Daily",   icon: CalendarDays, label: "Daily"   },
  { id: "Weekly",  icon: Calendar,     label: "Weekly"  },
  { id: "Monthly", icon: CalendarRange,label: "Monthly" },
];

export default function HireTypeSelector({ value, onChange }) {
  return (
    <div className="flex gap-3">
      {TYPES.map(t => {
        const Icon = t.icon;

        return (
          <div
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`
              flex-1 p-5 rounded-xl cursor-pointer text-center transition-all duration-150
              border
              ${value === t.id ? "border-transparent bg-[#1e1e1e] text-white" : "border-gray-200 bg-white text-gray-900"}
            `}
          >
            <div className="flex justify-center text-[28px] mb-2">
              <Icon />
            </div>
            <div className="text-[13px] font-semibold">{t.label}</div>
          </div>
        );
      })}
    </div>
  );
}