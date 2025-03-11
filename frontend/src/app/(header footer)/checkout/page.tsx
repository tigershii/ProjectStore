"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { selectCartItems, selectCartTotalPrice } from "@/store/reducers/cartReducer";
import ItemCardCheckout from "@/components/(items)/ItemCardCheckout";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/api/orders";
import { useCartActions } from "@/store/reducers/cartReducer";
import { useToast } from "@/context/ToastContext";

export default function Checkout() {
  const { fetchCart } = useCartActions();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  
  const cartItems = useAppSelector(selectCartItems);
  const cartTotalPrice = useAppSelector(selectCartTotalPrice);
  
  useEffect(() => {
    let isMounted = true;
    
    const loadCart = async () => {
      try {
        await fetchCart();
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        if (isMounted) {
          toast({
            type: 'error',
            title: 'Error',
            message: 'Failed to load your cart. Please try again.',
            duration: 3000
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    loadCart();
    
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, []);
  
  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const result = await createOrder();
      
      if (result.success) {
        toast({
          type: 'success',
          title: 'Order Placed',
          message: 'Your order has been successfully placed!',
          duration: 5000
        });
        
        // Refresh the cart after checkout
        await fetchCart();
      } else {
        throw new Error(result.message || 'Failed to place order');
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      toast({
        type: 'error',
        title: 'Checkout Failed',
        message: error instanceof Error ? error.message : 'There was a problem processing your order.',
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg">Your cart is empty.</p>
          <Button 
            onClick={() => window.location.href = '/'}
            className="mt-4 bg-primary-light dark:bg-primary-dark"
          >
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full md:w-2/3 lg:w-1/2">
            {cartItems.map((item) => (
              <ItemCardCheckout key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t pt-4">
            <p className="text-xl font-semibold">Total: ${cartTotalPrice.toFixed(2)}</p>
            <Button 
              onClick={handleCheckout} 
              disabled={isLoading}
              className="text-black dark:text-white bg-secondary-light dark:bg-secondary-dark"
            >
              {isLoading ? 'Processing...' : 'Place Order'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}