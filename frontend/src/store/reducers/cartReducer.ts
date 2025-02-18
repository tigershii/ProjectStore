import { Item } from "@/types/item";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";

interface cartState {
    quantity: number;
    totalPrice: number;
    items: Item[];
    loading: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: cartState = {
    quantity: 0,
    totalPrice: 0,
    items: [    {
        id: '1',
        title: "Air Jordan 5 Black Metallic Reimagined OG Retro 2025 ed. HF3975-001",
        price: 9.99,
        description: "This is a mock item description. ",
        images: ["/moon.svg", "/sun.svg", "/search.svg"]
    }],
    loading: 'idle',
    error: null,
}

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
    const response = await fetch('/api/cart');
    if (!response.ok) {
        throw new Error('Failed to fetch cart');
    }
    const data = await response.json();
    return data;
})

export const addItem = createAsyncThunk('cart/addItem', async (itemId : string) => {
    const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
    });
    if (!response.ok) {
        throw new Error('Failed to add item to cart');
    }
    const data = await response.json();
    return data;
})

export const removeItem = createAsyncThunk('cart/removeItem', async (itemId : string) => {
    const response = await fetch('/api/cart/remove?itemId=${itemId}', {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to remove item from cart');
    }
    return itemId;
})


const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCart.pending, (state) => {
            state.loading = 'loading';
            state.error = null;
        })
        builder.addCase(fetchCart.fulfilled, (state, action: PayloadAction<{items: Item[], quantity: number, totalPrice: number}>) => {
            state.loading = 'succeeded';
            state.items = action.payload.items;
            state.quantity = action.payload.quantity;
            state.totalPrice = action.payload.totalPrice;
        })
        builder.addCase(fetchCart.rejected, (state, action) => {
            state.loading = 'failed';
            state.error = action.error.message || 'An error occurred';
        })
        builder.addCase(addItem.pending, (state) => {
            state.loading = 'loading';
            state.error = null;
        })
        builder.addCase(addItem.fulfilled, (state, action: PayloadAction<Item>) => {
            state.items.push(action.payload);
            state.quantity += 1;
            state.totalPrice += action.payload.price;
        })
        builder.addCase(addItem.rejected, (state, action) => {
            state.loading = 'failed';
            state.error = action.error.message || 'An error occurred';
        })
        builder.addCase(removeItem.pending, (state) => {
            state.loading = 'loading';
            state.error = null;
        })
        builder.addCase(removeItem.fulfilled, (state, action: PayloadAction<string>) => {
            state.totalPrice -= state.items.find(item => item.id === action.payload)?.price || 0;
            state.items = state.items.filter(item => item.id !== action.payload);
            state.quantity -= 1;
        })
        builder.addCase(removeItem.rejected, (state, action) => {
            state.loading = 'failed';
            state.error = action.error.message || 'An error occurred';
        })
    }
})

export const useCartActions = () => {
    const dispatch = useDispatch<AppDispatch>();
    return {
        fetchCart: () => dispatch(fetchCart()),
        addItem: (itemId: string) => dispatch(addItem(itemId)),
        removeItem: (itemId: string) => dispatch(removeItem(itemId)),
    }
}

export default cartSlice.reducer;
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartQuantity = (state: RootState) => state.cart.quantity;
export const selectCartTotalPrice = (state: RootState) => state.cart.totalPrice;
export const selectCartLoading = (state: RootState) => state.cart.loading;
export const selectCartError = (state: RootState) => state.cart.error;