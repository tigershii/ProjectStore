"use client";

import { 
  Sheet, 
  SheetTrigger, 
  SheetContent, 
  SheetHeader, 
  SheetFooter,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Button } from "../ui/button";
import { selectCartItems, selectCartQuantity, selectCartTotalPrice} from "@/store/reducers/cartReducer";
import { selectLoggedIn } from "@/store/reducers/authReducer";
import { useAppSelector } from "@/store/hooks";
import ItemCardCart from "../(items)/ItemCardCart";
import { useRouter } from "next/navigation";

export default function CartMenu() {
  const cartItems = useAppSelector(selectCartItems);
  const cartQuantity = useAppSelector(selectCartQuantity);
  const cartTotalPrice = useAppSelector(selectCartTotalPrice);
  const isLoggedIn = useAppSelector(selectLoggedIn);
  const router = useRouter();

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
          {isLoggedIn ? 
            <div>
              <div className="flex-1 overflow-y-auto py-4 pr-0 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                  {cartItems.map((item) => {
                    return (
                        <ItemCardCart key={item.id} item={item} />
                    )
                  })}
              </div>
              <SheetFooter className="flex-none mt-2 flex flex-col">
                <div className="mb-2 flex justify-between ml-3">
                  <div>Total Items: {cartQuantity}</div>
                  <div>Total Price: ${cartTotalPrice.toFixed(2)}</div>
                </div>
                <SheetClose asChild>
                  <Button type="submit" className="w-full text-white dark:text-black" onClick={() => {router.push("/checkout")}}>
                    Checkout
                  </Button>
                </SheetClose>
              </SheetFooter>
            </div>
          : 
            <div className="text-center text-lg flex items-center justify-center h-full">Log in to view your cart</div>}
        </div>
      </SheetContent>
    </Sheet>
  )
}