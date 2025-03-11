'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useAuthActions } from '@/store/reducers/authReducer';
import { useToast } from './ToastContext';

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const { verifySession } = useAuthActions();
    const { toast } = useToast();
    const sessionCheckedRef = useRef(false);

    const handleSuccessfulVerification = useCallback(() => {
        toast({
            type: 'success',
            title: 'Session Recovered',
            message: 'Your session has been verified successfully.',
            duration: 2000
        });
    }, [toast]);

    useEffect(() => {
        if (sessionCheckedRef.current) return;

        const checkSession = async () => {
            try {
                sessionCheckedRef.current = true;
                const result = await verifySession();
                if (result.type === 'auth/verifySession/fulfilled') {
                    handleSuccessfulVerification();
                }
            // eslint-disable-next-line
            } catch (error) {
                
            }
        };
        
        checkSession();
    }, [verifySession, handleSuccessfulVerification]);

    return <>{children}</>;
}