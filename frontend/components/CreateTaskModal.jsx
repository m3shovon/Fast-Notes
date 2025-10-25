import React, { useState } from "react";

export default function CreateTaskModal({ onClose, onCreate, defaultDate }) {
  const today = new Date().toISOString().slice(0, 10);
  const [task_date, setTaskDate] = useState(defaultDate || today);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [is_daily, setIsDaily] = useState(false); 
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return alert("Title required");
    setSubmitting(true);
    try {
      await onCreate({ title, details, task_date, is_daily }); 
      setTitle("");
      setDetails("");
      setIsDaily(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40">
      <div className="w-full md:max-w-md bg-white dark:bg-gray-800 rounded-t-2xl md:rounded-xl p-4 md:shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Create Task</h3>
          <button className="text-sm text-muted-foreground" onClick={onClose}>
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="date"
            value={task_date}
            onChange={(e) => setTaskDate(e.target.value)}
            className="w-full border rounded-lg p-2 dark:bg-gray-700"
            required
          />
          <input
            type="text"
            placeholder="Title"
            className="w-full border rounded-lg p-2 dark:bg-gray-700"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Details (optional)"
            className="w-full border rounded-lg p-2 dark:bg-gray-700"
            rows={4}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={is_daily}
              onChange={(e) => setIsDaily(e.target.checked)}
            />
            Task Tracking
          </label>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
