// frontend/components/TaskList.jsx
import React from "react";
import { CheckSquare, Trash2 } from "lucide-react";

export default function TaskList({ tasks = [], onToggle, onDelete, loading }) {
  if (loading) {
    return <div className="text-sm text-gray-500">Loading tasks…</div>;
  }

  if (!tasks || tasks.length === 0) {
    return <div className="text-sm text-gray-500">No tasks for this date.</div>;
  }

  return (
    <div className="space-y-3">
      {tasks.map((t) => (
        <div
          key={t.id}
          className={`p-3 rounded-lg flex items-start gap-3 ${
            t.is_done ? "bg-green-50 dark:bg-green-900/30" : "bg-gray-50 dark:bg-gray-800"
          }`}
        >
          {/* Left clickable area toggles task */}
          <div
            className="flex-1 min-w-0"
            role="button"
            onClick={() => onToggle(t.id)}
            style={{ cursor: "pointer" }}
          >
            <div className="flex items-center justify-between">
              <h3 className={`truncate font-semibold ${t.is_done ? "line-through text-gray-500" : ""}`}>
                {t.title}
              </h3>
              <div className="text-xs text-muted-foreground">
                {new Date(t.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
            {t.details ? (
              <p className={`mt-1 text-sm truncate ${t.is_done ? "line-through text-gray-500" : "text-gray-700 dark:text-gray-200"}`}>
                {t.details}
              </p>
            ) : null}
          </div>

          {/* Buttons (compact on mobile, full labels on desktop) */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <button
              onClick={() => onToggle(t.id)}
              className="inline-flex items-center gap-2 btn btn-secondary p-2"
              aria-label={t.is_done ? "Undo" : "Mark done"}
            >
              <CheckSquare size={16} />
              <span className="hidden sm:inline">{t.is_done ? "Undo" : "Done"}</span>
            </button>

            <button
              onClick={() => onDelete(t.id)}
              className="inline-flex items-center gap-2 btn btn-secondary p-2"
              aria-label="Delete"
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
