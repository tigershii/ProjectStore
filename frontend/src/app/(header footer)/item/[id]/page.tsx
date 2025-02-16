import ImageCarousel from "@/components/ImageCarousel";
import { Item } from "@/types/item";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
async function getItem(id: string) : Promise<Item> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: parseInt(id),
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
      <div className="container mx-auto align-items">
        <Card className="dark:bg-secondary-dark">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:border-r md:border-gray-200 dark:md:border-gray-700 pr-8">
                <ImageCarousel images={item.images} />
              </div>

              <div className="pl-4">
                <h1 className="text-2xl font-bold mb-2 text-black dark:text-white">{item.title}</h1>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{item.description}</p>
                <p className="text-xl font-semibold mb-4 text-black dark:text-white">Price: ${item.price.toFixed(2)}</p>

                <Button type="submit" className="w-full text-white dark:text-black py-2">
                  Add to Cart
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error("Error fetching item:", error);
    return <div>Error loading item</div>;
  }
}