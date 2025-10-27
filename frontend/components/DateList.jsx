import React from "react";
import { CalendarDays } from "lucide-react";

function formatDateLabel(isoDate) {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return isoDate;
  }
}

export default function DateList({
  dates = [],
  selectedDate,
  onSelect,
  loading,
  compact,
  vertical = false,
}) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <CalendarDays size={16} className="animate-spin text-blue-500" />
        Loading dates…
      </div>
    );
  }

  if (!dates.length) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        No tasks yet. Tap the <span className="font-semibold">+</span> button to
        create your first task.
      </div>
    );
  }

  // 🌟 Vertical version (used in mobile filter)
  if (vertical) {
    return (
      <div className="space-y-2">
        {dates.map((d) => {
          const active = selectedDate === d.date;
          return (
            <button
              key={d.date}
              onClick={() => onSelect(d.date)}
              className={`w-full flex justify-between items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                active
                  ? "bg-blue-600 text-white shadow-md scale-[1.02]"
                  : "bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
              }`}
            >
              <span className="font-medium">{formatDateLabel(d.date)}</span>
              <span
                className={`text-sm font-semibold ${
                  active ? "text-blue-100" : "text-blue-600 dark:text-blue-400"
                }`}
              >
                {d.count}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // 🌈 Default horizontal layout (desktop + mobile)
  return (
    <div className="relative">
      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-blue-300 dark:scrollbar-thumb-blue-700">
        {dates.map((d) => {
          const active = selectedDate === d.date;
          return (
            <button
              key={d.date}
              onClick={() => onSelect(d.date)}
              className={`flex-shrink-0 px-4 py-2 rounded-2xl border transition-all duration-200 shadow-sm ${
                active
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white border-blue-600 scale-[1.05]"
                  : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700"
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="text-sm font-semibold">
                  {formatDateLabel(d.date)}
                </div>
                <div
                  className={`text-xs ${
                    active ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {d.count} task{d.count > 1 ? "s" : ""}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
