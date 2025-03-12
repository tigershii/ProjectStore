import { Item } from './item';

export interface Order {
    id: number;
    items: Item[];
    total: number;
    orderDate: string;
}