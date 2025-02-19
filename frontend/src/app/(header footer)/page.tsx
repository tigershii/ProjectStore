//import Image from "next/image";
import ItemCardContainer from "@/components/(items)/ItemCardContainer";
import { getItems } from "@/lib/api/item";

interface Props {
  searchParams: {
    page?: string
  };
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { items, totalItems } = await getItems(page);
  const totalPages = Math.ceil(totalItems / 16)

  return (
    <div className="flex flex-col w-full">
      <ItemCardContainer items={items} page={page} totalPages={totalPages} />
    </div>
    
    
  );
}
