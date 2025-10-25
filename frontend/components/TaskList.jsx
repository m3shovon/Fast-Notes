import React from "react";
import { CheckSquare, Trash2, Square } from "lucide-react";

export default function TaskList({ tasks = [], onToggle, onDelete, loading }) {
  if (loading) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Loading tasks…
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        No tasks for this date.
      </div>
    );
  }

  // helper for truncating details
  const truncateText = (text, length = 20) => {
    if (!text) return "";
    return text.length > length ? text.slice(0, length) + "…" : text;
  };

  return (
    <div className="space-y-3">
      {tasks.map((t) => (
        <div
          key={t.id}
          className={`group p-4 rounded-xl transition-all duration-300 border dark:border-gray-700 shadow-sm hover:shadow-lg flex items-start gap-3 ${
            t.is_done
              ? "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/20"
              : "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700/60"
          }`}
        >
          {/* ✅ Left clickable area (toggle task) */}
          <div
            className="flex-1 min-w-0 cursor-pointer"
            onClick={() => onToggle(t.id)}
          >
            <div className="flex items-center justify-between mb-1">
              <h3
                className={`font-semibold text-base ${
                  t.is_done
                    ? "line-through text-gray-500 dark:text-gray-400"
                    : "text-gray-800 dark:text-gray-100"
                }`}
              >
                {t.title}
              </h3>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                {new Date(t.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            {t.details && (
              <p
                className={`text-sm ${
                  t.is_done
                    ? "line-through text-gray-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {truncateText(t.details, 20)}
              </p>
            )}
          </div>

          {/* 🎯 Right-side buttons */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <button
              onClick={() => onToggle(t.id)}
              className={`transition-all duration-200 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium
                ${
                  t.is_done
                    ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-800/40 dark:text-green-300"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-800/40 dark:text-blue-300"
                }`}
            >
              {t.is_done ? (
                <CheckSquare size={16} className="opacity-80" />
              ) : (
                <Square size={16} className="opacity-80" />
              )}
              <span className="hidden sm:inline">
                {t.is_done ? "Undo" : "Done"}
              </span>
            </button>

            <button
              onClick={() => onDelete(t.id)}
              className="transition-all duration-200 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-800/40 dark:text-red-300"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
