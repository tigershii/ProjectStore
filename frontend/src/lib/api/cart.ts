import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (userId : string) => {
    const response = await fetch('/api/cart', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    });
    if (!response.ok) {
        throw new Error('Failed to fetch cart');
    }
    const data = await response.json();
    return data;
})

export const addItem = createAsyncThunk('cart/addItem', async ({userId, itemId} : {userId: string, itemId: string}) => {
    const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, itemId }),
    });
    if (!response.ok) {
        throw new Error('Failed to add item to cart');
    }
    const data = await response.json();
    return data;
})

export const removeItem = createAsyncThunk('cart/removeItem', async ({userId, itemId} : {userId: string, itemId: string}) => {
    const response = await fetch('/api/cart/remove?itemId=${itemId}', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, itemId }),
    });
    if (!response.ok) {
        throw new Error('Failed to remove item from cart');
    }
    return itemId;
})