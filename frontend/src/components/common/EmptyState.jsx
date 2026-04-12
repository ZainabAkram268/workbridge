import React from "react";
import { Inbox } from "lucide-react";

export default function EmptyState({ icon = "📭", title = "Nothing here yet", subtitle = "", action }) {
  return (
    <div className="flex flex-col items-center justify-center py-18 px-6 text-center">
      <div className="text-5xl mb-4 leading-none">{icon}</div>
      <h3 className="text-gray-900 text-[17px] font-bold mb-2">{title}</h3>
      {subtitle && (
        <p className="text-gray-400 text-sm leading-relaxed mb-5">{subtitle}</p>
      )}
      {action}
    </div>
  );
}