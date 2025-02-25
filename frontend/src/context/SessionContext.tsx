'use client';

import { useEffect } from 'react';
import { useAuthActions } from '@/store/reducers/authReducer';

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const { verifySession } = useAuthActions();

    useEffect(() => {
        verifySession();
    }, [verifySession]);

    return <>{children}</>;
}