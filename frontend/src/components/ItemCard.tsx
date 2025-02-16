import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function ItemCard({id, title, price, image} : {id: number, title: string, price: number, image: string}) {

    return (
        <Link href={`/item/${id}`}>
            <Card className="overflow-hidden rounded-lg cursor-pointer bg-secondary-light dark:bg-secondary-dark text-gray-800 dark:text-gray-300">
                <div className="aspect-square relative">
                    <Image 
                        src={image}
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