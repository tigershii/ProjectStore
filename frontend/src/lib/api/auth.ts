import { createAsyncThunk } from '@reduxjs/toolkit';

export const verifySession = createAsyncThunk('auth/verifySession', async () => {
    const response = await fetch('/api/auth/verifySession', {
        credentials: 'include',
    });
    
    if (!response.ok) {
        throw new Error('Session verification failed');
    }
    
    const data = await response.json();
    return data.user;
});

export const login = createAsyncThunk('auth/login', async (credentials: { username: string, password: string }) => {
    const response = await fetch('api/auth/login', {
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

export const signup = createAsyncThunk('auth/signup', async (credentials: { username: string, password: string }) => {
    const response = await fetch('/api/auth/signup', {
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
    console.log(data);
    return data.user;
})

export const logout = createAsyncThunk('auth/logout', async () => {
    const response = await fetch('/api/auth/logout', {
        method: 'POST',
    });
    if (!response.ok) {
        throw new Error('Failed to logout');
    }
})