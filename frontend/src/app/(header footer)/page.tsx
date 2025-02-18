//import Image from "next/image";
import ItemCardContainer from "@/components/(items)/ItemCardContainer";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function Home() {
  return (
    <div>
      <ItemCardContainer/>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#"/>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#"/>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#"/>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
    
    
  );
}
