'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { getOrders } from '@/lib/api/orders';
import { Order } from "@/types/order";
import { useToast } from '@/context/ToastContext';
import { useAppSelector } from '@/store/hooks';
import { selectLoggedIn } from '@/store/reducers/authReducer';

export default function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const isLoggedIn = useAppSelector(selectLoggedIn);
    const { toast } = useToast();

    useEffect(() => {
        const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await getOrders();
            if (response && response.orders) {
            setOrders(response.orders);
            } else {
            throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error("Failed to fetch user orders:", error);
            setHasError(true);
            toast({
            type: 'error',
            title: 'Error',
            message: 'Failed to load your orders. Please try again.',
            duration: 2000
            });
        } finally {
            setIsLoading(false);
        }
        };

        fetchOrders();
        // eslint-disable-next-line
    }, [isLoggedIn]);

    if (isLoading) {
        return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
            <div className="flex justify-center items-center h-40">
            <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
            </div>
        </div>
        );
    }

    if (hasError) {
        return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
            <p className="text-md mb-4">Unable to load your orders at this time, please try again later.</p>
        </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Your Orders</h1>
        </div>
        <div>
            {orders.length === 0 ? (
            <div className="text-center py-8">
                <p className="text-lg">You have no orders yet.</p>
            </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orders.map((order) => (
                <div 
                    key={order.id} 
                    className="border rounded-lg p-4 shadow-sm"
                >
                    <div className="flex gap-4">
                        <div className="">
                            <div className="flex mb-2">
                                <h3 className="font-semibold">{new Date(order.orderDate).toLocaleDateString()}</h3>
                            </div>
                            <div className="mb-3">
                                <p className="text-sm font-medium">Total: ${order.total}</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-2 items-start">
                            {order.items.map((item) => (
                            <Link
                                key={item.id} 
                                className="relative h-16 w-16 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 hover:opacity-80 transition-opacity"
                                href={"/item/" + item.id}
                            >
                                <Image 
                                src={item.images && item.images.length > 0 ? item.images[0] : "/placeholder.png"} 
                                alt={item.name}
                                fill
                                sizes="64px"
                                className="object-cover"
                                />
                            </Link>
                            ))}
                        </div>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>
        </div>
    );
}