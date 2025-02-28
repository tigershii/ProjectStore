import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { login, logout, signup, verifySession } from "@/lib/api/auth";
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

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(signup.pending, (state) => {
            state.loading = 'loading';
            state.error = null; 
        })
        builder.addCase(signup.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading = 'succeeded';
            state.isLoggedIn = false;
            state.user = action.payload;
            state.error = null;
        })
        builder.addCase(signup.rejected, (state, action) => {
            state.loading = 'failed';
            state.isLoggedIn = false;
            state.user = null;
            state.error = action.error.message || 'An error occurred';
        })
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
            state.isLoggedIn = false;
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
        builder.addCase(verifySession.pending, (state) => {
            state.loading = 'loading';
        })
        builder.addCase(verifySession.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading = 'succeeded';
            state.isLoggedIn = true;
            state.user = action.payload;
            state.error = null;
        })
        builder.addCase(verifySession.rejected, (state) => {
            state.loading = 'failed';
            state.isLoggedIn = false;
            state.user = null;
            state.error = null; // No need to show error for session verification
        });
    }
})

export const useAuthActions = () => {
    const dispatch = useDispatch<AppDispatch>();
    return {
        login: (credentials: { username: string, password: string }) => dispatch(login(credentials)),
        logout: () => dispatch(logout()),
        signup: (credentials: { username: string, password: string }) => dispatch(signup(credentials)),
        verifySession: () => dispatch(verifySession())
    }
}

export default authSlice.reducer;

export const selectLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectUser = (state: RootState) => state.auth.user;
export const selectLoading = (state: RootState) => state.auth.loading;
export const selectError = (state: RootState) => state.auth.error;