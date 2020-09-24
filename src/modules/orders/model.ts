import { Address } from '../address/model';
import { Product } from '../products/model';
import { User } from '../user/model';

export interface OrderItem {
    id: string;
    quantity: number;
    product: Product;
}

export interface Order {
    id: string;
    orderNumber: string;
    shippingCosts: number;
    total: number;
    coupon: string | null;
    orderItems: OrderItem[];
    deliveryAddress: Address;
    user: User;
    createdAt: number;
    updatedAt: number;
}

export type CreateOrderResponse = {
    success: true;
    order: Order;
} | {
    success: false;
    error: string;
};

interface PaymentInfo {
    name: string;
    cardNumber: string;
    expirationDate: string;
    securityCode: string;
}

export interface CreateOrderBody {
    orderItems: {
        productId: string;
        quantity: number;
    }[];
    addressId: string;
    shippingCosts: number;
    paymentInfo: PaymentInfo;
}

export type GetOrderResponse = {
    success: true;
    order: Order;
} | {
    success: false;
    error: string;
};

export type GetUserOrdersResponse = {
    success: true;
    orders: Order[];
} | {
    success: false;
    error: string;
};
