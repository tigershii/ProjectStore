//import Image from "next/image";
import ItemCardContainer from "@/components/(items)/ItemCardContainer";

interface Props {
  searchParams: {
    page?: string
  };
}

async function getItems(page: number) {
  // try {
  //   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items?page=${page}`);
  //   return await response.json();
  // } catch (error) {
  //   console.error("Error fetching items:", error);
  //   return {
  //     items: [],
  //     totalPages: 0
  //   }
  // }
  const mockItem = {
      id: '1',
      title: "Air Jordan 5 Black Metallic Reimagined OG Retro 2025 ed. HF3975-001",
      price: 9.99,
      description: "This is a mock item description. ",
      images: ["/moon.svg", "/sun.svg", "/search.svg"],
      sellerId: "1"
  }
  const mockItems = []
  for (let i = 0; i < 50; i++) {
    const newItem = {...mockItem}
    newItem.id = 'Item' + i;
    newItem.title = `Item ${i + 1}`;
    mockItems.push(newItem);
  }
  return {items: mockItems.slice((page - 1) * 16, page * 16), totalItems: 50}
}

export default async function Home({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1;
  const { items, totalItems } = await getItems(page);
  const totalPages = Math.ceil(totalItems / 16)

  return (
    <div className="flex flex-col w-full">
      <ItemCardContainer items={items} page={page} totalPages={totalPages} />
    </div>
    
    
  );
}
