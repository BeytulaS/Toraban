import { useEffect, useState } from "react";
import { HiSun, HiMoon } from "react-icons/hi";

function ThemeSwitcher() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem("isDarkMode") === "true";
    setIsDarkMode(isDarkMode);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("isDarkMode", isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button onClick={toggleTheme} type="button">
      {isDarkMode ? <HiSun /> : <HiMoon />}
    </button>
  );
}

export default ThemeSwitcher;
