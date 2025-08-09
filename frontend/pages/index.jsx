import React, { useEffect, useState } from "react";
import DateList from "../components/DateList";
import TaskList from "../components/TaskList";
import CreateTaskModal from "../components/CreateTaskModal";
import { Plus } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

export default function Home() {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);

  async function loadDates() {
    try {
      setLoadingDates(true);
      const res = await fetch(`${API_BASE}/tasks/dates/`);
      const data = await res.json();
      setDates(data);
      if (data.length && !selectedDate) {
        setSelectedDate(data[0].date);
      }
    } finally {
      setLoadingDates(false);
    }
  }

  async function loadTasks(forDate) {
    try {
      setLoadingTasks(true);
      if (!forDate) {
        setTasks([]);
        return;
      }
      const res = await fetch(`${API_BASE}/tasks/?date=${forDate}`);
      const data = await res.json();
      setTasks(data);
    } finally {
      setLoadingTasks(false);
    }
  }

  useEffect(() => {
    loadDates();
  }, []);

  useEffect(() => {
    loadTasks(selectedDate);
  }, [selectedDate]);

  async function handleCreateTask(payload) {
    try {
      const res = await fetch(`${API_BASE}/tasks/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await loadDates();
        setSelectedDate(payload.task_date);
        setShowModal(false);
      } else {
        alert("Failed to create task");
      }
    } catch {
      alert("Failed to create task");
    }
  }

  async function toggleTask(id) {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}/toggle/`, {
        method: "POST",
      });
      if (res.ok) {
        await loadTasks(selectedDate);
        await loadDates();
      } else {
        alert("Failed to toggle task");
      }
    } catch {
      alert("Failed to toggle task");
    }
  }

  async function handleDeleteTask(id) {
    if (!confirm("Delete task?")) return;
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}/`, { method: "DELETE" });
      if (res.ok) {
        await loadTasks(selectedDate);
        await loadDates();
      } else {
        alert("Failed to delete");
      }
    } catch {
      alert("Failed to delete");
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <header className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <button
          className="btn btn-primary flex items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} /> Create Task
        </button>
      </header>

      {/* DateList in a small top card */}
      <div className="card mb-4 p-2 overflow-x-auto">
        <DateList
          dates={dates}
          selectedDate={selectedDate}
          onSelect={(d) => setSelectedDate(d)}
          loading={loadingDates}
          compact
        />
      </div>

      {/* Tasks */}
      <main>
        <div className="card p-4">
          <h2 className="text-lg font-semibold mb-3">
            Tasks for {selectedDate || "—"}
          </h2>

          <TaskList
            tasks={tasks}
            onToggle={toggleTask}
            onDelete={handleDeleteTask}
            loading={loadingTasks}
          />
        </div>
      </main>

      {/* Floating action button (mobile) */}
      <button
        className="fixed bottom-6 right-4 z-40 inline-flex items-center justify-center w-14 h-14 rounded-full shadow-lg bg-blue-600 text-white sm:hidden"
        onClick={() => setShowModal(true)}
        aria-label="Create task"
      >
        <Plus size={20} />
      </button>

      {showModal && (
        <CreateTaskModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateTask}
          defaultDate={selectedDate}
        />
      )}
    </div>
  );
}
