import ItemCard from "./ItemCard";
import { Item } from "@/types/item";

const mockItems: Item[] = [
    {
        id: '1',
        title: "Air Jordan 5 Black Metallic Reimagined OG Retro 2025 ed. HF3975-001",
        price: 9.99,
        description: "This is a mock item description. ",
        images: ["/moon.svg", "/sun.svg", "/search.svg"]
    }
]

export default function ItemCardContainer() {
    return (
        <div className="grid grid-cols-4 gap-4 py-4 px-6">
            {[...Array(16)].map((_, index) => (
                <ItemCard 
                key={index}
                Item={mockItems[0]}
                />
            ))}
        </div>
    )
}
