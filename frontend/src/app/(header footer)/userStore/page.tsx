import { getUserItems } from "@/lib/api/item";
import ItemCardCheckout from "@/components/(items)/ItemCardCheckout";
import { Button } from "@/components/ui/button";
import { Item } from "@/types/item";
import { RefreshCcw } from "lucide-react";

export default async function Store() {
  let items = [];
  let hasError = false;

  try {
    items = await getUserItems("1");
  } catch (error) {
    console.error("Failed to fetch user items:", error);
    hasError = true;
  }

  if (hasError) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Your Listings</h1>
        <p className="text-md mb-4">Unable to load your items at this time, please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Your Listings</h1>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-1/2">
          {items.length > 0 ? (
            items.map((item: Item) => (
              <ItemCardCheckout key={item.id} item={item} />
            ))
          ) : (
            <p>You don't have any active listings yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}