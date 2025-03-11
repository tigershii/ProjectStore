import ItemCard from "./ItemCard";
import { Item } from "@/types/item";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface ItemCardContainerProps {
  items: Item[];
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function ItemCardContainer({ 
  items, 
  page, 
  totalPages,
  hasNextPage,
  hasPrevPage 
}: ItemCardContainerProps) {
    return (
        <div className="flex flex-col items-center w-full h-full">
            <div className="grid grid-cols-4 gap-4 py-4 px-6 w-full flex-1">
                {items.length === 0 ? 
                    <p className="col-span-4">No items found.</p>
                    : (
                    items.map((item) => (
                        <ItemCard 
                        key={item.id}
                        Item={item}
                        />
                    ))
                    )
                }
            </div>
            <Pagination className="flex justify-center">
                <PaginationContent>
                    <PaginationItem className="w-30">
                        <PaginationPrevious 
                            href={hasPrevPage ? `/?page=${page - 1}` : `/?page=${page}`}
                            className={cn(
                                !hasPrevPage && "pointer-events-none opacity-50"
                            )}
                        />
                    </PaginationItem>
                    <PaginationItem className="w-30">
                        <div className="flex items-center justify-center h-9 px-4">
                            {page} of {totalPages || 1}
                        </div>
                    </PaginationItem>
                    <PaginationItem className="w-30">
                        <PaginationNext 
                            href={hasNextPage ? `/?page=${page + 1}` : `/?page=${page}`}
                            className={cn(
                                !hasNextPage && "pointer-events-none opacity-50"
                            )}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}
