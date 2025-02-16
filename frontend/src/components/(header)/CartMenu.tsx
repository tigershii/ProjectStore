"use client";

import { 
  Sheet, 
  SheetTrigger, 
  SheetContent, 
  SheetHeader, 
  SheetFooter,
  SheetTitle 
} from "@/components/ui/sheet";
import Image from "next/image";
import { Button } from "../ui/button";

export default function CartMenu() {
  return (
    <Sheet>
      <SheetTrigger className="mt-1">
        <Image 
          src="/cart.png" 
          alt="cart" 
          width={20} 
          height={20} 
          className="brightness-0 opacity-50 dark:invert dark:opacity-60 hover:opacity-60 dark:hover:opacity-80"
        />
      </SheetTrigger>
      <SheetContent className="text-black dark:text-white dark:bg-primary-dark">
        <div className="flex flex-col h-full">
          <SheetHeader className="flex-none">
            <SheetTitle>Your Cart</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto py-4 pr-0 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {/* Test content */}
            {[...Array(20)].map((_, i) => (
              <div key={i} className="mb-4 p-4 mr-4 border rounded">
                Item {i + 1}
              </div>
            ))}
          </div>
          <SheetFooter className="flex-none mt-2 mr-5">
            <Button type="submit" className="w-full text-white dark:text-black" onClick={() => {}}>
              Checkout
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}