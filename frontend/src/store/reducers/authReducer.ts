import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface AuthState {
    loggedIn: boolean;
}

const initialState: AuthState = {
    loggedIn: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state) {
            state.loggedIn = true;
        },
        logout(state) {
            state.loggedIn = false;
        }
    }
})

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectLoggedIn = (state: RootState) => state.auth.loggedIn;