import ItemCard from "./ItemCard";
import { Item } from "@/types/item";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink, PaginationEllipsis } from "@/components/ui/pagination";

const mockItems: Item[] = [
    {
        id: '1',
        title: "Air Jordan 5 Black Metallic Reimagined OG Retro 2025 ed. HF3975-001",
        price: 9.99,
        description: "This is a mock item description. ",
        images: ["/moon.svg", "/sun.svg", "/search.svg"],
        sellerId: "1"
    }
]

export default function ItemCardContainer({ items, page, totalPages }: { items: Item[], page: number, totalPages: number }) {
    return (
        <div className="flex flex-col items-center w-full h-full">
            <div className="grid grid-cols-4 gap-4 py-4 px-6 w-full flex-1">
                {items.map((item) => (
                    <ItemCard 
                    key={item.id}
                    Item={item}
                    />
                ))}
            </div>
            <Pagination className="">
                <PaginationContent>
                    {page > 1 ?
                        <PaginationItem className="">
                            <PaginationPrevious href={`/?page=${page - 1}`}/>
                        </PaginationItem>
                        : null}
                <PaginationItem>
                    <div> {page} </div>
                </PaginationItem>
                {page < totalPages ? (
                    <PaginationItem className="mr-6">
                        <PaginationNext href={`/?page=${page + 1}`}/>
                    </PaginationItem>) 
                : null}
                </PaginationContent>
            </Pagination>
        </div>
    )
}
