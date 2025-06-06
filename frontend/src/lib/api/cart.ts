import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
    const response = await fetch(`/api/cart`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch cart');
    }
    const data = await response.json();
    return data;
})

export const addItemCart = createAsyncThunk('cart/addItem', async ({itemId} : {itemId : number}) => {
    const response = await fetch(`/api/cart`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Failed to add item to cart');
    }
    const data = await response.json();
    console.log(data);
    return data;
})

export const removeItemCart = createAsyncThunk('cart/removeItem', async ({itemId} : {itemId: number}) => {
    const response = await fetch(`/api/cart?itemId=${itemId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Failed to remove item from cart');
    }
    const data = await response.json();
    return data;
})