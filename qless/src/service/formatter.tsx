import { Order } from "../App";

export function formatPhoneNumber(order: Order): string {
    const phone = order.customer_phone_number;
    return `(${phone.slice(0, 3)})-${phone.slice(3, 6)}-${phone.slice(6)}`;
}