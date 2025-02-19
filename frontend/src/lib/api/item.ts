import { Item } from "@/types/item";

export async function getItems(page: number) {
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

export async function getItem(id: string) : Promise<Item> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: id,
        title: "Mock Item",
        price: 99.99,
        description: "This is a mock item description. ",
        images: ["/moon.svg", "/sun.svg", "/search.svg"],
        sellerId: "1",
      });
    }, 100);
  });
}

export async function getCategories() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
  return await response.json();
}

export async function getUserItems(userId: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/user/${userId}`);
  return await response.json();
}

export async function createItem(item: Item) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({item}),
  });
  return await response.json();
}

export async function deleteItem(itemId: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/${itemId}`, {
    method: 'DELETE',
  });
  return await response.json();
}