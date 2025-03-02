//import Image from "next/image";
import ItemCardContainer from "@/components/(items)/ItemCardContainer";
import { getItems } from "@/lib/api/items";

interface Props {
  searchParams: {
    page?: string
  };
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { items, pagination } = await getItems(page);
  console.log(pagination);
  
  return (
    <div className="flex flex-col w-full">
      <ItemCardContainer 
        items={items} 
        page={pagination.currentPage} 
        totalPages={pagination.totalPages} 
        hasNextPage={pagination.hasNextPage}
        hasPrevPage={pagination.hasPrevPage}
      />
    </div>
  );
}
