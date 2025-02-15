"use client";

import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={isDarkMode}
        onChange={toggleTheme}
      />
      <div className="relative w-12 h-6 dark:bg-black border-2 dark:border-gray-600 border-gray-300 border-0.5 bg-white rounded-full">
        <div
          className={`absolute h-4 w-4 rounded-full transition-all duration-300 ${
            isDarkMode 
              ? "right-0.5 top-[0.13rem] bg-gray-100" 
              : "left-0.5 top-[0.13rem] bg-gray-500"
          }`}
        >
          <Image
            src="/sun.svg"
            alt="Light mode"
            width={11}
            height={11}
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 invert ${
              isDarkMode ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <Image
            src="/moon.svg"
            alt="Dark mode"
            width={11}
            height={11}
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
              isDarkMode ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      </div>
    </label>
  );
}