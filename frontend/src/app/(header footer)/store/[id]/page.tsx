import { cookies } from 'next/headers';
import { getUserItems } from "@/lib/api/items";
import ItemCardStore from "@/components/(items)/ItemCardStore";
import { Item } from "@/types/item";
import CreateItemMenu from "@/components/(items)/CreateItemMenu";

interface Props {
  params: {
    id: number;
  }
}

export default async function Store({ params }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const { id } = await params;

  let items = [] as Item[];
  let isOwner = false;
  let username = 'Your';
  let hasError = false;

  try {
    const response = await getUserItems(id, token?.value);
    items = response.items;
    isOwner = response.isOwner;
    username = response.username;
  } catch (error) {
    console.error("Failed to fetch user items:", error);
    hasError = true;
  }

  if (hasError) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">{isOwner ? 'Your Listings' : `${username}'s Listings`}</h1>
        <p className="text-md mb-4">Unable to load your items at this time, please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{isOwner ? 'Your Listings' : `${username}'s Listings`}</h1>
        {isOwner ? 
          <CreateItemMenu/>
        : null}
      </div>
      <div>
        <div className="grid grid-cols-4 gap-4">
          {items.length > 0 ? (
            items.map((item: Item) => (
              <ItemCardStore key={item.id} item={item} isOwner={isOwner}/>
            ))
          ) : (
            <p className="col-span-3">{isOwner ? `You don't` : `${username} doesn't`} have any active listings.</p>
          )}
        </div>
      </div>
    </div>
  );
}