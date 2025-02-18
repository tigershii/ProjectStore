import { Item } from "@/types/item";
import ItemBox from "@/components/(items)/itemBox";

async function getItem(id: string) : Promise<Item> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: id,
        title: "Mock Item",
        price: 99.99,
        description: "This is a mock item description. ",
        images: ["/moon.svg", "/sun.svg", "/search.svg"],
      });
    }, 100);
  });
}


export default async function ItemPage({ params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const item = await getItem(id);
    console.log("Item data:", item);

    if (!item) {
      return <div>Item not found</div>;
    }

    return (
      <ItemBox item={item} />
    );
  } catch (error) {
    console.error("Error fetching item:", error);
    return <div>Error loading item</div>;
  }
}