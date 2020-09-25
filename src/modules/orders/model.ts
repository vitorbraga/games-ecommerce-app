import { Address } from '../address/model';
import { Product } from '../products/model';
import { User } from '../user/model';

export enum OrderStatusEnum {
    AWAITING_PAYMENT = 'AWAITING_PAYMENT',
    AWAITING_DELIVERY = 'AWAITING_DELIVERY',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
};

export type OrderStatus = keyof typeof OrderStatusEnum;

export const orderStatusMapper: { [key in OrderStatus]: { label: string, color: string} } = {
    AWAITING_PAYMENT: { label: 'Awaiting Payment', color: '#c46f00' },
    AWAITING_DELIVERY: { label: 'Awaiting Delivery', color: '#fcba03' },
    DELIVERED: { label: 'Delivered', color: '#00c40a' },
    CANCELLED: { label: 'Cancelled', color: '#ab0e00' }
};

export interface OrderItem {
    id: string;
    quantity: number;
    product: Product;
}

export interface Order {
    id: string;
    status: string;
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
