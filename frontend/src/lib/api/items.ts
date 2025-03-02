const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function getItems(page: number, category?: string) {
  try {
    const url = new URL(`${API_BASE_URL}/api/items`);
    url.searchParams.append('page', page.toString());
    if (category) {
      url.searchParams.append('category', category);
    }
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      items: data.items,
      pagination: data.pagination
    };
  } catch (error) {
    console.error("Error fetching items:", error);
    return {
      items: [],
      pagination: {
        currentPage: page,
        totalPages: 0,
        totalItems: 0,
        hasNextPage: false,
        hasPrevPage: false
      }
    };
  }
}

export async function getItem(id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/items/${id}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching item:", error);
    throw new Error("Failed to fetch item");
  }
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

export async function createItem({name, price, description, category, images}: {name: string, price: number, description: string, category: string, images: string[]}) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name, price, description, category, images}),
      credentials: 'include',
    });
    return await response.json();
  } catch (error) {
    console.log("Error creating item:", error);
    throw new Error("Failed to create item");
  }
}

export async function deleteItem(itemId: number) {
  try {
    const response = await fetch(`api/items/${itemId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return await response.json();
  } catch (error) {
    console.error("Error deleting item:", error);
    throw new Error("Failed to delete item");
  }
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