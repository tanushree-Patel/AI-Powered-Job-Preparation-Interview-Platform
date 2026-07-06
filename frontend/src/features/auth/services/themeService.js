export const getTheme = () => {
  return localStorage.getItem("theme") || "dark";
};

export const saveTheme = (theme) => {
  localStorage.setItem("theme", theme);
};