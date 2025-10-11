import "../styles.css";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  const [theme, setTheme] = useState("dark"); // Default theme = dark

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const initialTheme = saved || "dark"; // Default to dark if nothing saved
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  function toggleTheme() {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  }

  return (
    <>
      <Head>
        <title>Task Manager</title>
        <link rel="icon" href="/QuickNotes.png" />
      </Head>

      <div className="min-h-screen">
        {/* Optional Header */}
        {/* <header className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h1 className="text-lg font-bold">Task Manager</h1>
          <button className="btn btn-secondary" onClick={toggleTheme}>
            {theme === "dark" ? "☀ Light" : "🌙 Dark"}
          </button>
        </header> */}
        <main className="p-4">
          <Component {...pageProps} />
        </main>
      </div>
    </>
  );
}
