'use client';

import { Provider } from "react-redux";
import store from "@/store/store";
import { ThemeProvider } from "@/context/ThemeContext";
import { SessionProvider } from "@/context/SessionContext";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <SessionProvider>
                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </SessionProvider>
        </Provider>
    );
} 