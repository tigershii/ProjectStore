const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function getOrders() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            method: 'GET',
            credentials: 'include'
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching orders:", error);
    }
}

export async function createOrder() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        return await response.json();
    } catch (error) {
        console.error("Error creating order:", error);
    }
}