import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Item } from "@/types/item";

export default function ItemCard({Item} : {Item: Item}) {
    const { id, name, price, images } = Item;

    return (
        <div className="inline-block w-full">
            <Link href={`/item/${id}`} className="inline-block w-full">
                <Card className="overflow-hidden rounded-lg cursor-pointer bg-secondary-light dark:bg-secondary-dark text-gray-800 dark:text-gray-300 transition-transform hover:scale-[1.02] p-2">
                    <div className="aspect-square relative overflow-hidden">
                        <Image 
                            src={images?.length > 0 ? images[0] : "/placeholder.png"}
                            alt={name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform"
                            priority={false}
                        />
                    </div>
                    <CardHeader className="p-4">
                        <CardTitle className="text-md font-medium line-clamp-2 break-words">
                            {name}
                        </CardTitle>
                        <CardDescription className="text-lg font-bold mt-2">
                            ${typeof price === 'number' ? price.toFixed(2) : '0.00'}
                        </CardDescription>
                    </CardHeader>
                </Card>
            </Link>
        </div>
    )
}