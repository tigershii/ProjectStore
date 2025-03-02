import ItemBox from "@/components/(items)/ItemBox";
import { getItem } from "@/lib/api/items";

export default async function ItemPage({ params }: { params: { id: number } }) {
  const { id } = await params;
  try {
    const item = await getItem(id);

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