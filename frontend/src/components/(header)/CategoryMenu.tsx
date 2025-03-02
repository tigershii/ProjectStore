"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const categories = [
  "Home",
  "Electronics",
  "Fashion",
  "Food",
  "Books",
  "Toys",
  "Sports",
  "Other"
];

export default function CategoryMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={cn(
          "group inline-flex h-8 w-max items-center justify-center rounded-md py-1 text-base font-medium transition-colors hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
        )}
      >
        Category
        <ChevronDown
          className={cn(
            "relative top-[1px] ml-1 h-3 w-3 transition duration-300",
            isOpen && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div 
          className="absolute left-1/2 -translate-x-1/2 top-full w-48 mt-1 origin-top"
        >
          <div className="relative rounded-md border border-neutral-200 bg-white text-neutral-950 shadow-md data-[state=open]:animate-in dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50">
            <div className="p-1 max-h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {categories.map((category) => (
                <Link
                  key={category}
                  href='/'
                  className="block select-none rounded-sm px-2 py-1.5 text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
