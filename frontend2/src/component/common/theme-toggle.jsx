import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Simple theme hook replacement
export function ThemeToggle() {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   setMounted(true);
  //   // Get theme from localStorage or default to light
  //   const savedTheme = localStorage.getItem("theme") || "light";
  //   setTheme(savedTheme);

  //   // Remove any existing theme classes
  //   document.body.classList.remove("light", "dark");
  //   document.documentElement.classList.remove("light", "dark");

  //   // Apply theme to body and html
  //   document.body.classList.add(savedTheme);
  //   document.documentElement.classList.add(savedTheme);

  //   // Also set data attribute for additional CSS targeting
  //   document.body.setAttribute("data-theme", savedTheme);
  //   document.documentElement.setAttribute("data-theme", savedTheme);

  //   // Also apply to the root div if it exists
  //   const rootDiv = document.getElementById("root");
  //   if (rootDiv) {
  //     rootDiv.classList.remove("light", "dark");
  //     rootDiv.classList.add(savedTheme);
  //     rootDiv.setAttribute("data-theme", savedTheme);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (mounted) {
  //     // Save theme to localStorage
  //     localStorage.setItem("theme", theme);

  //     // Remove any existing theme classes
  //     document.body.classList.remove("light", "dark");
  //     document.documentElement.classList.remove("light", "dark");

  //     // Apply new theme class
  //     document.body.classList.add(theme);
  //     document.documentElement.classList.add(theme);

  //     // Also set data attribute for additional CSS targeting
  //     document.body.setAttribute("data-theme", theme);
  //     document.documentElement.setAttribute("data-theme", theme);

  //     // Also apply to the root div if it exists
  //     const rootDiv = document.getElementById("root");
  //     if (rootDiv) {
  //       rootDiv.classList.remove("light", "dark");
  //       rootDiv.classList.add(theme);
  //       rootDiv.setAttribute("data-theme", theme);
  //     }

  //     // Force a re-render by updating the document title
  //     document.title = `Campus Bites - ${
  //       theme === "dark" ? "Dark" : "Light"
  //     } Mode`;

  //     // Force a style recalculation
  //     document.body.style.display = "none";
  //     document.body.offsetHeight; // Trigger reflow
  //     document.body.style.display = "";

  //     // Debug log
  //     console.log("Theme changed to:", theme);
  //     console.log("Body class:", document.body.className);
  //     console.log("HTML class:", document.documentElement.className);
  //     console.log(
  //       "Body background:",
  //       window.getComputedStyle(document.body).backgroundColor
  //     );
  //     console.log(
  //       "HTML background:",
  //       window.getComputedStyle(document.documentElement).backgroundColor
  //     );
  //   }
  // }, [theme, mounted]);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`
        relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ease-out
        ${
          isDark
            ? "bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 border-slate-600/50 shadow-lg shadow-slate-800/50"
            : "bg-gradient-to-br from-orange-200 via-yellow-100 to-orange-100 border-orange-300/50 shadow-lg shadow-orange-200/50"
        }
        hover:scale-110 active:scale-95 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      `}
      whileHover={{
        boxShadow: isDark
          ? "0 0 25px rgba(100, 116, 139, 0.5)"
          : "0 0 25px rgba(251, 146, 60, 0.5)",
      }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      role="button"
      tabIndex={0}
    >
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              isDark ? "bg-blue-400" : "bg-orange-400"
            }`}
            animate={{
              x: [0, Math.random() * 40 - 20],
              y: [0, Math.random() * 40 - 20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
          />
        ))}
      </div>

      {/* Icon container */}
      <motion.div
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="relative z-10"
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="relative"
            >
              <Moon className="w-5 h-5 text-blue-200 drop-shadow-sm" />
              {/* Moon glow */}
              <motion.div
                className="absolute inset-0 rounded-full bg-blue-400/20"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="relative"
            >
              <Sun className="w-5 h-5 text-orange-600 drop-shadow-sm" />
              {/* Sun rays */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-0.5 h-2 bg-orange-400/60 rounded-full"
                  style={{
                    left: "50%",
                    top: "50%",
                    transformOrigin: "center center",
                    transform: `translate(-50%, -50%) rotate(${
                      i * 45
                    }deg) translateY(-12px)`,
                  }}
                  animate={{
                    opacity: [0.4, 1, 0.4],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Ripple effect */}
      <motion.div
        className={`absolute inset-0 rounded-full ${
          isDark ? "bg-blue-500/20" : "bg-orange-500/20"
        }`}
        initial={{ scale: 0, opacity: 0.5 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.6 }}
        key={isDark ? "dark-ripple" : "light-ripple"}
      />
    </motion.button>
  );
}
