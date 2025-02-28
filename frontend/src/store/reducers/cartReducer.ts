import { Item } from "@/types/item";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { fetchCart, addItem, removeItem } from "@/lib/api/cart";

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
    items: [{id: 1, title: "Item 1", price: 100, description: "Description 1", images: ["/moon.svg"], sellerId: "1"}, {id: 2, title: "Item 2", price: 200, description: "Description 2", images: ["/moon.svg"], sellerId: "2"}],
    loading: 'idle',
    error: null,
}

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
        builder.addCase(removeItem.fulfilled, (state, action: PayloadAction<number>) => {
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
        addItem: (itemId: number) => dispatch(addItem({itemId})),
        removeItem: (itemId: number) => dispatch(removeItem({itemId})),
    }
}

export default cartSlice.reducer;
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartQuantity = (state: RootState) => state.cart.quantity;
export const selectCartTotalPrice = (state: RootState) => state.cart.totalPrice;
export const selectCartLoading = (state: RootState) => state.cart.loading;
export const selectCartError = (state: RootState) => state.cart.error;