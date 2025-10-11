import React from "react";

function formatDateLabel(isoDate) {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
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
  vertical = false, // 🔹 New prop
}) {
  if (loading) {
    return <div className="text-sm text-gray-500 dark:text-gray-400">Loading dates…</div>;
  }

  if (!dates.length) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        No tasks yet. Tap the + button to create your first task.
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex gap-2">
        {dates.map((d) => (
          <button
            key={d.date}
            onClick={() => onSelect(d.date)}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-colors whitespace-nowrap ${
              selectedDate === d.date
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-blue-500 hover:text-white"
            }`}
          >
            {formatDateLabel(d.date)}
            <span className="ml-1 text-[0.6rem] font-normal opacity-70">{d.count}</span>
          </button>
        ))}
      </div>
    );
  }

  // 🔹 Use vertical layout if forced, or fallback to responsive behavior
  if (vertical) {
    return (
      <div className="space-y-2">
        {dates.map((d) => (
          <button
            key={d.date}
            onClick={() => onSelect(d.date)}
            className={`w-full text-left p-3 rounded-lg flex justify-between items-center ${
              selectedDate === d.date
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700"
            }`}
          >
            <span>{formatDateLabel(d.date)}</span>
            <span className="text-sm opacity-100">{d.count}</span>
          </button>
        ))}
      </div>
    );
  }

  // Default responsive behavior
  return (
    <>
      <div className="flex gap-2 overflow-x-auto pb-2 md:hidden">
        {dates.map((d) => (
          <button
            key={d.date}
            onClick={() => onSelect(d.date)}
            className={`flex-shrink-0 px-3 py-2 rounded-full text-sm font-medium ${
              selectedDate === d.date
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            }`}
          >
            <div className="leading-none">{formatDateLabel(d.date)}</div>
            <div className="text-xs opacity-80">{d.count} task{d.count > 1 ? "s" : ""}</div>
          </button>
        ))}
      </div>

      <div className="hidden md:block">
        <div className="space-y-2">
          {dates.map((d) => (
            <button
              key={d.date}
              onClick={() => onSelect(d.date)}
              className={`w-full text-left p-3 rounded-lg flex justify-between items-center ${
                selectedDate === d.date
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700"
              }`}
            >
              <span>{formatDateLabel(d.date)}</span>
              <span className="text-sm opacity-100">{d.count}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
