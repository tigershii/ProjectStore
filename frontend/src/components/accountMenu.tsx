"use client";

import { useState } from "react";

export default function AccountMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center hover:text-gray-600 dark:hover:text-gray-300 py-1"
      >
        Account
      </button>

      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-64 bg-white dark:bg-black rounded-md shadow-lg border border-gray-300 dark:border-gray-600">
          <div className="p-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-black dark:text-white"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-black dark:text-white"
            />
            <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
              Log In
            </button>
            <div className="mt-2 text-sm text-center">
              <a href="#" className="text-blue-500 hover:text-blue-600">
                Create Account
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
