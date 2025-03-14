import { Item } from "@/types/item";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { fetchCart, addItemCart, removeItemCart } from "@/lib/api/cart";

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
    items: [],
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
        builder.addCase(addItemCart.pending, (state) => {
            state.loading = 'loading';
            state.error = null;
        })
        builder.addCase(addItemCart.fulfilled, (state, action: PayloadAction<Item>) => {
            state.items.push(action.payload);
            state.quantity += 1;
            state.totalPrice += action.payload.price;
        })
        builder.addCase(addItemCart.rejected, (state, action) => {
            state.loading = 'failed';
            state.error = action.error.message || 'An error occurred';
        })
        builder.addCase(removeItemCart.pending, (state) => {
            state.loading = 'loading';
            state.error = null;
        })
        builder.addCase(removeItemCart.fulfilled, (state, action: PayloadAction<{items: Item[], quantity: number, totalPrice: number}>) => {
            state.loading = 'succeeded';
            state.items = action.payload.items;
            state.quantity = action.payload.quantity;
            state.totalPrice = action.payload.totalPrice;
        })
        builder.addCase(removeItemCart.rejected, (state, action) => {
            state.loading = 'failed';
            state.error = action.error.message || 'An error occurred';
        })
    }
})

export const useCartActions = () => {
    const dispatch = useDispatch<AppDispatch>();
    return {
        fetchCart: () => dispatch(fetchCart()),
        addItemCart: (itemId: number) => dispatch(addItemCart({itemId})),
        removeItemCart: (itemId: number) => dispatch(removeItemCart({itemId})),
    }
}

export default cartSlice.reducer;
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartQuantity = (state: RootState) => state.cart.quantity;
export const selectCartTotalPrice = (state: RootState) => state.cart.totalPrice;
export const selectCartLoading = (state: RootState) => state.cart.loading;
export const selectCartError = (state: RootState) => state.cart.error;