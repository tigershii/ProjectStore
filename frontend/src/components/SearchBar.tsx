"use client";

import Image from "next/image";
import { useState } from "react";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-8xl relative right-0">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
        className="w-full px-4 py-1 pr-12 rounded-full border-2 border-gray-300 focus:border-gray-400 focus:outline-none dark:bg-black dark:border-gray-600 dark:focus:border-gray-500 dark:text-white transition-colors"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
      >
        <Image
          src="/search.svg"
          alt="Search"
          width={20}
          height={20}
          className="dark:invert"
        />
      </button>
    </form>
  );
}
