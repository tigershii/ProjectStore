import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "../store";
import { User } from "@/types/user";
import { useDispatch } from "react-redux";
interface AuthState {
    isLoggedIn: boolean;
    user: User | null;
    loading: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AuthState = {
    isLoggedIn: false,
    user: null,
    loading: 'idle',
    error: null,
}

export const login = createAsyncThunk('auth/login', async (credentials: { username: string, password: string }) => {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (!response.ok) {
        throw new Error('Invalid credentials');
    }
    const data = await response.json();
    return data.user;
})

export const logout = createAsyncThunk('auth/logout', async () => {
    const response = await fetch('/api/logout', {
        method: 'POST',
    });
    if (!response.ok) {
        throw new Error('Failed to logout');
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state) => {
            state.loading = 'loading';
            state.error = null; 
        })
        builder.addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading = 'succeeded';
            state.isLoggedIn = true;
            state.user = action.payload;
            state.error = null;
        })
        builder.addCase(login.rejected, (state, action) => {
            state.loading = 'failed';
            state.isLoggedIn = true;
            state.user = null;
            state.error = action.error.message || 'An error occurred';
        })
        builder.addCase(logout.pending, (state) => {
            state.loading = 'loading';
            state.error = null;
        })
        builder.addCase(logout.fulfilled, (state) => {
            state.loading = 'succeeded';
            state.isLoggedIn = false;
            state.user = null;
            state.error = null;
        })
        builder.addCase(logout.rejected, (state, action) => {
            state.loading = 'failed';
            state.error = action.error.message || 'An error occurred';
        })
    }
})

export const useAuthActions = () => {
    const dispatch = useDispatch<AppDispatch>();
    return {
        login: (credentials: { username: string, password: string }) => dispatch(login(credentials)),
        logout: () => dispatch(logout()),
    }
}

export default authSlice.reducer;

export const selectLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectUser = (state: RootState) => state.auth.user;
export const selectLoading = (state: RootState) => state.auth.loading;
export const selectError = (state: RootState) => state.auth.error;