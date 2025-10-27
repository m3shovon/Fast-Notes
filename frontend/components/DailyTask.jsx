import React, { useEffect, useState } from "react";
import { CheckCircle2, Circle, Tag, CalendarDays } from "lucide-react";

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

  const truncateText = (text, maxLength = 100) =>
    !text ? "—" : text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  const getPriorityStyle = (priority) => {
    const styles = {
      Low: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
      Medium: "bg-blue-100 text-blue-700 dark:bg-blue-800/50 dark:text-blue-300",
      High: "bg-yellow-100 text-yellow-700 dark:bg-yellow-800/50 dark:text-yellow-300",
      Urgent: "bg-red-100 text-red-700 dark:bg-red-800/50 dark:text-red-300",
    };
    return styles[priority] || "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
  };

  return (
    <aside className="hidden md:block w-full lg:w-[420px] xl:w-[840px] flex-shrink-0">
      <div className="card p-5 sticky top-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-lg rounded-2xl border dark:border-gray-700 transition-all duration-300 backdrop-blur-md">
        <h2 className="text-2xl font-bold mb-5 text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <CalendarDays className="text-blue-500 w-6 h-6" /> Daily Task Tracker
        </h2>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading tasks...</p>
        ) : dailyTasks.length ? (
          <div className="space-y-4">
            {dailyTasks.map((task) => (
              <div
                key={task.id}
                className={`group p-4 rounded-2xl border dark:border-gray-700 shadow-sm transition-all duration-300 
                hover:shadow-xl hover:-translate-y-1 relative overflow-hidden
                ${
                  task.is_done
                    ? "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/20"
                    : "bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700"
                }`}
              >
                {/* Accent glow */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none blur-2xl ${
                    task.is_done
                      ? "bg-green-200/20 dark:bg-green-400/10"
                      : "bg-blue-200/20 dark:bg-blue-400/10"
                  }`}
                />

                {/* Header */}
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    {task.is_done ? (
                      <CheckCircle2 className="text-green-500 w-5 h-5 flex-shrink-0" />
                    ) : (
                      <Circle className="text-gray-400 w-5 h-5 flex-shrink-0" />
                    )}
                    <h3
                      className={`font-semibold text-sm leading-tight ${
                        task.is_done
                          ? "line-through text-gray-400"
                          : "text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      {task.title}
                    </h3>
                  </div>
                </div>

                {/* Details */}
                <p
                  className={`mt-2 text-sm leading-snug relative z-10 ${
                    task.is_done
                      ? "line-through text-gray-400"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {truncateText(task.details)}
                </p>

                {/* Footer Badges */}
                <div className="flex justify-between items-center mt-3 relative z-10">
                  <div className="flex flex-wrap gap-2">
                    {task.category && (
                      <span
                        className="text-[11px] px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-800/50 dark:text-purple-300 flex items-center gap-1"
                        title={task.category.name}
                      >
                        <Tag size={10} /> {task.category.name}
                      </span>
                    )}
                    {task.priority && (
                      <span
                        className={`text-[11px] px-2 py-1 rounded-full font-medium ${getPriorityStyle(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    )}
                  </div>

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
          <p className="text-sm text-gray-500 dark:text-gray-400">No daily tasks yet.</p>
        )}
      </div>
    </aside>
  );
}
