const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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
      name: "Air Jordan 5 Black Metallic Reimagined OG Retro 2025 ed. HF3975-001",
      price: 9.99,
      description: "This is a mock item description. ",
      images: ["/moon.svg", "/sun.svg", "/search.svg"],
      sellerId: "1"
  }
  const mockItems = []
  for (let i = 0; i < 50; i++) {
    const newItem = {...mockItem}
    newItem.id = 'Item' + i;
    newItem.name = `Item ${i + 1}`;
    mockItems.push(newItem);
  }
  return {items: mockItems.slice((page - 1) * 16, page * 16), totalItems: 50}
}

export async function getItem(id: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: id,
        name: "Mock Item",
        price: 99.99,
        description: "This is a mock item description. ",
        images: ["/moon.svg", "/sun.svg", "/search.svg"],
        sellerId: "1",
      });
    }, 100);
  });
}

export async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`);
  return await response.json();
}

export async function getUserItems(userId: number, token?: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/items/user/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      credentials: 'include',
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching user items:", error);
    throw new Error("Failed to fetch user items");
  }
}

export async function createItem({name, price, description, images}: {name: string, price: number, description: string, images: string[]}) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name, price, description, images}),
      credentials: 'include',
    });
    return await response.json();
  } catch (error) {
    console.log("Error creating item:", error);
    throw new Error("Failed to create item");
  }
}

export async function deleteItem(itemId: number) {
  const response = await fetch(`api/items/${itemId}`, {
    method: 'DELETE',
  });
  return await response.json();
}

export async function getPresignedUrls(fileCount: number, fileTypes: string[]) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/items/presignedURL`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({fileCount, fileTypes}),
    });

    return await response.json();
  } catch (error) {
    console.error("Error fetching presigned URLs:", error);
    throw new Error("Failed to fetch presigned URLs");
  }
}

export async function sendToS3(presignedUrl: string, file: File) {
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }
}