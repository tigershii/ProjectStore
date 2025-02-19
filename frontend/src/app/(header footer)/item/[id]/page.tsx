import ItemBox from "@/components/(items)/itemBox";
import { getItem } from "@/lib/api/item";

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