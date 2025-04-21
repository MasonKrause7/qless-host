import { useCustomerOrder } from "../hooks/CustomerOrderContext";

export enum CustomerInterfaceView {
    Landing = "landing",
    Menu = "menu",
    Cart = "cart",
    Confirmation = "confirmation"
}


export function getOrderCostTotals(){
    const {
        order
    } = useCustomerOrder();


    const subtotal: number = order.subtotal ?? 0;
    const tax: number = Math.round(subtotal * (order.tax_rate ?? 0) * 100) / 100;
    const total: number = subtotal + tax;

    return{
        subtotal,
        tax,
        total
    };
}