import { createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const verifySession = createAsyncThunk('auth/verifySession', async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/verifySession`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
        },
    });
    
    if (!response.ok) {
        throw new Error('Session verification failed');
    }
    
    const data = await response.json();
    return data.user;
});

export const login = createAsyncThunk('auth/login', async (credentials: { username: string, password: string }) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Invalid credentials');
    }
    const data = await response.json();
    return data.user;
})

export const signup = createAsyncThunk('auth/signup', async (credentials: { username: string, password: string }) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Invalid credentials');
    }
    const data = await response.json();
    return data.user;
})

export const logout = createAsyncThunk('auth/logout', async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Failed to logout');
    }
})