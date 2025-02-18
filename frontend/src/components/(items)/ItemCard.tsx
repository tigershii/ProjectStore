import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Item } from "@/types/item";

export default function ItemCard({Item} : {Item: Item}) {
    const { id, title, price, images } = Item;

    return (
        <Link href={`/item/${id}`}>
            <Card className="overflow-hidden rounded-lg cursor-pointer bg-secondary-light dark:bg-secondary-dark text-gray-800 dark:text-gray-300">
                <div className="aspect-square relative">
                    <Image 
                        src={images[0]}
                        alt="Product" 
                        fill
                        className="object-cover"
                    />
                </div>
                <CardHeader className="p-4">
                    <CardTitle className="text-md font-medium line-clamp-2 break-words">
                        {title}
                    </CardTitle>
                    <CardDescription>
                        ${price.toFixed(2)}
                    </CardDescription>
                </CardHeader>
            </Card>
        </Link>
        
    )
}