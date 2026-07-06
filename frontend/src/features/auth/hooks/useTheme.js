import { useEffect, useState } from "react";
import { getTheme, saveTheme } from "../services/themeService";

const useTheme = () => {
  const [theme, setTheme] = useState(getTheme());

  useEffect(() => {
    document.body.classList.toggle("light", theme === "light");
    saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return {
    theme,
    toggleTheme,
  };
};

export default useTheme;