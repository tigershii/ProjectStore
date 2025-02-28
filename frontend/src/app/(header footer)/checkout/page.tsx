"use client";

import { useAppSelector } from "@/store/hooks";
import { selectCartItems, selectCartTotalPrice } from "@/store/reducers/cartReducer";
import ItemCardCheckout from "@/components/(items)/ItemCardCheckout";
import { Button } from "@/components/ui/button";
import { useCartActions } from "@/store/reducers/cartReducer";
import { useEffect } from "react";

export default function Checkout() {
  const cartItems = useAppSelector(selectCartItems);
  const cartTotalPrice = useAppSelector(selectCartTotalPrice);
  const { fetchCart } = useCartActions();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleCheckout = () => {
    console.log("Checkout button clicked!");
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-1/2">
            {cartItems.map((item) => (
              <ItemCardCheckout key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <p className="text-lg font-semibold">Total: ${cartTotalPrice.toFixed(2)}</p>
            <Button onClick={handleCheckout} className="text-black dark:text-white bg-secondary-light dark:bg-secondary-dark">Checkout</Button>
          </div>
        </div>
      )}
    </div>
  );
} 