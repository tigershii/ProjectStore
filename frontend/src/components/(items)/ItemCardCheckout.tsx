'use client';
import { Item } from "@/types/item";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import Link from "next/link";
import { useCartActions } from "@/store/reducers/cartReducer";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/reducers/authReducer";

export default function ItemCardCheckout({item} : {item: Item}) {
    const { id, title, price, images } = item;
    const { removeItem } = useCartActions();
    const userId = useAppSelector(selectUser)?.id || "";
    return (
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
                            <button onClick={(e) => {
                                e.preventDefault(); // Prevent navigation
                                removeItem(userId, item.id);
                            }} className="w-full text-sm underline text-black dark:text-white py-2 text-left">
                                Remove
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </Link>
    )
}