'use client';

import { Provider } from "react-redux";
import store from "@/store/store";
import { ThemeProvider } from "@/context/ThemeContext";
import { SessionProvider } from "@/context/SessionContext";
import { ToastProvider } from "./ToastContext";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <ToastProvider>
                <SessionProvider>
                    <ThemeProvider>
                        {children}
                    </ThemeProvider>
                </SessionProvider>
            </ToastProvider>
        </Provider>
    );
} 