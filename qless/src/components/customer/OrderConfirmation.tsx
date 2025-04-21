import { useCustomerOrder } from "../../hooks/CustomerOrderContext";
import { getOrderCostTotals } from "../../service/customerInterfaceService";


export default function OrderConfirmation() {
    const {
        truck,
        order
    } = useCustomerOrder();

    const {
        subtotal,
        tax,
        total
    } = getOrderCostTotals();

    return (
        <div className="orderConfirmationContainer">
            <div className="orderConfirmation">
                <div className="orderConfirmationInner">
                    <h1>Thank you for ordering from {truck?.truck_name}!</h1>
                    <div className="orderConfirmationDetails">
                        <p><strong>Order Number: </strong>{order.order_id}</p>
                        <p><strong>Time Placed: </strong>{order.time_received?.toLocaleString()}</p>
                        <div className="orderCost">
                            <div className="costRow">
                                <span>Subtotal:</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="costRow">
                                <span>Tax ({(order.tax_rate ?? 0) * 100}%):</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <hr />
                            <div className="costRow totalRow">
                                <span>Total:</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}