"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Item } from "@/types/item";
import ImageCarousel from "@/components/(items)/ImageCarousel";
import { useCartActions } from "@/store/reducers/cartReducer";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/reducers/authReducer";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";

export default function ItemBox({item} : {item: Item}) {
  const user = useAppSelector(selectUser);
  const { toast } = useToast();
  const { addItemCart } = useCartActions();
  const router = useRouter();
  const handleAddToCart = async() => {
    try {
      const result = await addItemCart(item.id);
      if (result.type === 'cart/addItem/fulfilled') {
        toast({
          type: 'success',
          title: 'Item Added',
          message: 'Item has been added to your cart.',
          duration: 2000
        })
        router.push('/');
      } else {
        toast({
          type: 'warning',
          title: 'Item Not Added',
          message: 'This item could not be added to your cart.',
          duration: 2000
        })
      }
    } catch {
      toast({
        type: 'error',
        title: 'Error',
        message: 'An unexpected error occurred. Please try again.',
        duration: 2000
      })
    }
  }

  return (
      <div className="mx-auto flex items-center justify-center w-full">
      <Card className="dark:bg-secondary-dark justify-center w-full mx-5 py-5">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:border-r md:border-gray-200 dark:md:border-gray-700 pr-8">
              <ImageCarousel images={item.images} />
            </div>

            <div className="pl-4">
              <h1 className="text-2xl font-bold mb-2 text-black dark:text-white">{item.name}</h1>
              <p className="text-gray-700 dark:text-gray-300 mb-4 ">
                Seller: {' '}
                <Link 
                  href={`/store/${item.sellerId}`}
                  className="underline hover:text-gray-800 dark:hover:text-gray-200"
                >
                  {item.sellerUsername}
                </Link>
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{item.description}</p>
              <p className="text-xl font-semibold mb-4 text-black dark:text-white">Price: ${item.price}</p>
              {item.available ?
                <Button type="submit" onClick={handleAddToCart} disabled={user?.id === item.sellerId} className="w-full text-white dark:text-black py-2">
                  Add to Cart
                </Button>
                :
                <p className="text-red-500 dark:text-red-400">Item is not available</p>
              }
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}