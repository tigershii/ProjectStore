"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={isDarkMode}
        onChange={toggleTheme}
      />
      <div className="relative w-12 h-6 bg-black border-2 border-white dark:bg-white dark:border-black rounded-full">
        <div
          className={`absolute h-4 w-4 rounded-full transition-all duration-300 ${
            isDarkMode 
              ? "right-0.5 top-[0.13rem] bg-black" 
              : "left-0.5 top-[0.13rem] bg-white"
          }`}
        >
          <Image
            src="/sun.svg"
            alt="Light mode"
            width={11}
            height={11}
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
              isDarkMode ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <Image
            src="/moon.svg"
            alt="Dark mode"
            width={11}
            height={11}
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 invert ${
              isDarkMode ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      </div>
    </label>
  );
}