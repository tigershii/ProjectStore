"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Item } from "@/types/item";
import Image from "next/image";
import Link from "next/link";
import { useCartActions } from "@/store/reducers/cartReducer";
import { SheetClose } from "../ui/sheet";
export default function ItemCardCart({item} : {item: Item}) {
    const { removeItem } = useCartActions();

    const { id, title, price, images } = item;
    return (
        <SheetClose asChild>
            <Link href={`/item/${id}`}>
                <div className="container mx-auto align-items mb-4">
                    <Card className="dark:bg-secondary-dark">
                        <CardContent className="p-2">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="aspect-square relative">
                                    <Image 
                                        src={images[0]}
                                        alt="Product"
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="pl-4">
                                    <h1 className="text-md mb-2 text-black dark:text-white line-clamp-5">{title}</h1>
                                    <p className="text-md text-black dark:text-white">Price: ${price.toFixed(2)}</p>
                                    <p onClick={() => removeItem(item.id)} className="w-full text-sm underline text-black dark:text-white py-2">
                                        Remove
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Link>
        </SheetClose>
        
    )
}