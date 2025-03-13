import ItemBox from "@/components/(items)/ItemBox";
import { getItem } from "@/lib/api/items";

interface Props {
  params: Promise<{id: string}>
}

export default async function ItemPage({ params }: Props) {
  const { id } = await params;
  const itemId = parseInt(id);
  try {
    const item = await getItem(itemId);

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