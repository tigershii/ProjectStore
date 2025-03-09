"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    router.push('/?search=' + searchQuery);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full min-w-[400px] max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="w-full px-6 py-1 pr-12 rounded-2xl border-2 border-gray-300 focus:border-gray-400 focus:outline-none dark:bg-primary-dark dark:border-gray-600 dark:focus:border-gray-500 dark:text-white transition-colors text-base bg-white"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <Image
            src="/search.svg"
            alt="Search"
            width={20}
            height={20}
            className="dark:invert"
          />
        </button>
      </div>
    </form>
  );
}
