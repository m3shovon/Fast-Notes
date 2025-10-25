import React, { useEffect, useState } from "react";
import DateList from "../components/DateList";
import TaskList from "../components/TaskList";
import CreateTaskModal from "../components/CreateTaskModal";
import DailyTask from "../components/DailyTask";
import { Plus, Filter } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

export default function Home() {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [showFilter, setShowFilter] = useState(false); 
  const [refreshDaily, setRefreshDaily] = useState(0);

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
        // Reload both task lists after creation
        await loadDates();
        await loadTasks(selectedDate); // refresh tasks for selected date
        setSelectedDate(payload.task_date);
        setShowModal(false);
        setRefreshDaily((prev) => prev + 1);
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
    <div className="flex flex-col sm:flex-row max-w-6xl mx-auto px-4 py-6 gap-4">
      {/* Sidebar (Desktop) */}
      <aside className="hidden sm:block w-64 flex-shrink-0">
        <header className="flex items-center justify-between mb-4">
          
          <div className="flex gap-2">
            {/* Mobile filter button */}
            <button
              className="btn btn-secondary sm:hidden flex items-center gap-1"
              onClick={() => setShowFilter(true)}
            >
              <Filter size={16} /> Filter
            </button>

            {/* Create Task */}
            <button
              className="btn btn-primary flex items-center gap-2"
              onClick={() => setShowModal(true)}
            >
              <Plus size={16} /> Create Task
            </button>
          </div>
        </header>
        <div className="card p-3 sticky top-6">
          <h2 className="text-lg font-semibold mb-2">Dates</h2>
          <DateList
            dates={dates}
            selectedDate={selectedDate}
            onSelect={(d) => setSelectedDate(d)}
            loading={loadingDates}
          />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        
        <header className="flex items-center justify-between mb-4">Task Manager</header>
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
      </div>
      <DailyTask refreshKey={refreshDaily} />
      {/* Floating action button (mobile) */}


      {/* Mobile Filter Drawer */}
      {showFilter && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-end sm:hidden">
          <div className="w-3/4 max-w-xs bg-white dark:bg-gray-900 h-full p-4 shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Filter by Date</h2>
              <button onClick={() => setShowFilter(false)}>✕</button>
            </div>
            <DateList
              dates={dates}
              selectedDate={selectedDate}
              onSelect={(d) => {
                setSelectedDate(d);
                setShowFilter(false);
              }}
              loading={loadingDates}
              vertical 
            />
          </div>
        </div>
      )}

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
