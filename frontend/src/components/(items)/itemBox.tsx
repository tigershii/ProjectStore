"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Item } from "@/types/item";
import ImageCarousel from "@/components/(items)/ImageCarousel";
import { useCartActions } from "@/store/reducers/cartReducer";
import { useRouter } from "next/navigation";
export default function ItemBox({item} : {item: Item}) {
    const { addItem } = useCartActions();
    const router = useRouter();
    const handleAddToCart = () => {
        addItem(item.id);
        router.push('/');
    }

    return (
        <div className="container mx-auto align-items">
        <Card className="dark:bg-secondary-dark">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:border-r md:border-gray-200 dark:md:border-gray-700 pr-8">
                <ImageCarousel images={item.images} />
              </div>

              <div className="pl-4">
                <h1 className="text-2xl font-bold mb-2 text-black dark:text-white">{item.title}</h1>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{item.description}</p>
                <p className="text-xl font-semibold mb-4 text-black dark:text-white">Price: ${item.price.toFixed(2)}</p>

                <Button type="submit" onClick={handleAddToCart} className="w-full text-white dark:text-black py-2">
                  Add to Cart
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
}