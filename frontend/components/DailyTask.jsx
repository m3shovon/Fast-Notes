import React, { useEffect, useState } from "react";
import { CheckCircle2, Circle } from "lucide-react"; // for icons

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

export default function DailyTask({ refreshKey }) {
  const [dailyTasks, setDailyTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadDailyTasks() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/tasks/daily/`);
      const data = await res.json();
      setDailyTasks(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDailyTasks();
  }, [refreshKey]);

  // 🧠 Helper to truncate text cleanly
  const truncateText = (text, maxLength = 20) => {
    if (!text) return "—";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <aside className="hidden md:block w-72 flex-shrink-0">
      <div className="card p-4 sticky top-6 bg-white dark:bg-gray-900 shadow-md rounded-2xl border dark:border-gray-700 transition-all duration-300">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          🗓 Tracking Tasks
        </h2>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        ) : dailyTasks.length ? (
          <div className="grid gap-3">
            {dailyTasks.map((task) => (
              <div
                key={task.id}
                className={`p-3 rounded-xl border dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-md ${
                  task.is_done
                    ? "bg-green-50 dark:bg-green-900/30"
                    : "bg-gray-50 dark:bg-gray-800"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {task.is_done ? (
                    <CheckCircle2 className="text-green-500 w-5 h-5" />
                  ) : (
                    <Circle className="text-gray-400 w-5 h-5" />
                  )}
                  <h3
                    className={`font-semibold text-sm ${
                      task.is_done
                        ? "line-through text-gray-400"
                        : "text-gray-800 dark:text-gray-100"
                    }`}
                  >
                    {task.title}
                  </h3>
                </div>

                {/* ✂️ Truncated details */}
                <p
                  className={`text-xs mb-1 ${
                    task.is_done
                      ? "line-through text-gray-400"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                  title={task.details} // full text on hover
                >
                  {truncateText(task.details)}
                </p>

                <div className="flex justify-end">
                  <span
                    className={`text-[11px] px-2 py-1 rounded-full ${
                      task.is_done
                        ? "bg-green-100 text-green-700 dark:bg-green-800/50 dark:text-green-300"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-800/50 dark:text-blue-300"
                    }`}
                  >
                    {task.task_date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No daily tasks yet.
          </p>
        )}
      </div>
    </aside>
  );
}
