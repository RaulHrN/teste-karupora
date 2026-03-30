import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: "light", toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("app-theme");
    return (stored === "dark" ? "dark" : "light") as Theme;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("app-theme", theme);

    // Apply the correct set of derived custom colors for the current theme
    try {
      const key = theme === "dark" ? "app-custom-colors-dark" : "app-custom-colors-light";
      const stored = localStorage.getItem(key);
      if (stored) {
        const colors = JSON.parse(stored);
        Object.entries(colors).forEach(([k, value]) => {
          root.style.setProperty(k, value as string);
        });
      } else {
        // Try base colors and regenerate
        const base = localStorage.getItem("app-custom-colors");
        if (base) {
          import("@/components/ThemeCustomizer").then(({ generateDerivedColors }) => {
            const { light, dark } = generateDerivedColors(JSON.parse(base));
            const toApply = theme === "dark" ? dark : light;
            Object.entries(toApply).forEach(([k, value]) => {
              root.style.setProperty(k, value);
            });
            localStorage.setItem("app-custom-colors-light", JSON.stringify(light));
            localStorage.setItem("app-custom-colors-dark", JSON.stringify(dark));
          });
        }
      }
    } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
