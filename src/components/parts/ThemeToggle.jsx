import { useThemeStore } from "@hooks/useThemeStore";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="flex cursor-pointer items-center justify-center rounded-lg border border-gray-700 bg-gray-800 p-2 text-yellow-400 transition-all hover:bg-gray-700 dark:border-gray-300 dark:bg-gray-300 dark:text-gray-600 dark:hover:bg-gray-400 dark:hover:text-yellow-400"
      title="Toggle Dark Mode"
    >
      {theme === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
    </button>
  );
}
