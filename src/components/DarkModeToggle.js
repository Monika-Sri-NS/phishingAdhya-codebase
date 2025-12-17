// src/components/DarkModeToggle.jsx
import { useEffect, useState } from "react";

function DarkModeToggle() {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
    >
      {isDark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}

export default DarkModeToggle;

