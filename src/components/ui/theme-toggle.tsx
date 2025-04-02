
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      return storedTheme === "dark" || (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
        ? "dark"
        : "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="rounded-full w-10 h-10 border-primary/30 hover:bg-primary/10 relative overflow-hidden bg-gradient-to-br from-background to-background/80"
      >
        <div className="absolute inset-0 bg-gradient-shift opacity-10 pointer-events-none"></div>
        
        <motion.div
          initial={false}
          animate={{ 
            rotate: theme === "dark" ? 45 : 0,
            opacity: theme === "dark" ? 0 : 1,
            y: theme === "dark" ? -30 : 0,
            scale: theme === "dark" ? 0.5 : 1
          }}
          transition={{ 
            duration: 0.5,
            ease: "easeInOut" 
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Sun className="h-5 w-5 text-yellow-500" />
        </motion.div>
        
        <motion.div
          initial={false}
          animate={{ 
            rotate: theme === "dark" ? 0 : -45, 
            opacity: theme === "dark" ? 1 : 0,
            y: theme === "dark" ? 0 : 30,
            scale: theme === "dark" ? 1 : 0.5
          }}
          transition={{ 
            duration: 0.5,
            ease: "easeInOut" 
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Moon className="h-5 w-5 text-sky-300" />
        </motion.div>
        <span className="sr-only">Toggle theme</span>
      </Button>
    </motion.div>
  );
}
