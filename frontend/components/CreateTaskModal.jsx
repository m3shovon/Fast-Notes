import React, { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

export default function CreateTaskModal({ onClose, onCreate, defaultDate }) {
  const today = new Date().toISOString().slice(0, 10);
  const [task_date, setTaskDate] = useState(defaultDate || today);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [is_daily, setIsDaily] = useState(false);
  const [priority, setPriority] = useState("Medium");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      setLoadingCategories(true);
      try {
        const res = await fetch(`${API_BASE}/categories/`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return alert("Title required");
    setSubmitting(true);
    try {
      await onCreate({
        title,
        details,
        task_date,
        is_daily,
        priority,
        category_id: categoryId || null,
      });
      setTitle("");
      setDetails("");
      setIsDaily(false);
      setPriority("Medium");
      setCategoryId("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">📝 Create New Task</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            {/* <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
              Task Date
            </label> */}
            <input
              type="date"
              value={task_date}
              onChange={(e) => setTaskDate(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />
          </div>

          {/* Title */}
          <div>
            {/* <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
              Title
            </label> */}
            <input
              type="text"
              placeholder="Enter task title"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Details */}
          <div>
            {/* <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
              Details (optional)
            </label> */}
            <textarea
              placeholder="Describe the task..."
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            {/* <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
              Category
            </label> */}
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              disabled={loadingCategories}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            {/* <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
              Priority
            </label> */}
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className={`w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:outline-none transition ${
                priority === "High"
                  ? "focus:ring-red-500"
                  : priority === "Medium"
                  ? "focus:ring-yellow-500"
                  : priority === "Low"
                  ? "focus:ring-green-500"
                  : "focus:ring-orange-500"
              }`}
            >
              <option value="Low">🟢 Low</option>
              <option value="Medium">🟡 Medium</option>
              <option value="High">🔴 High</option>
              <option value="Urgent">🔥 Urgent</option>
            </select>
          </div>

          {/* Daily Task Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={is_daily}
              onChange={(e) => setIsDaily(e.target.checked)}
              className="w-4 h-4 accent-blue-600"
            />
            <span className="text-gray-700 dark:text-gray-300">
              Enable Daily Task Tracking
            </span>
          </label>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-70"
            >
              {submitting ? "Creating…" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
