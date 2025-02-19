import ItemCard from "./ItemCard";
import { Item } from "@/types/item";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext} from "@/components/ui/pagination";

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
            <Pagination className="flex justify-center">
                <PaginationContent>
                    {page > 1 ?
                        <PaginationItem className="w-30">
                            <PaginationPrevious href={`/?page=${page - 1}`}/>
                        </PaginationItem>
                        : null}
                <PaginationItem className="w-30">
                    <div> {page} </div>
                </PaginationItem>
                {page < totalPages ? (
                    <PaginationItem className="w-30">
                        <PaginationNext href={`/?page=${page + 1}`}/>
                    </PaginationItem>) 
                : null}
                </PaginationContent>
            </Pagination>
        </div>
    )
}
