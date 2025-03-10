export interface Item {
    id: number;
    name: string;
    price: number;
    description: string;
    images: string[];
    available: boolean;
    sellerId: number;
    sellerUsername: string;
  }