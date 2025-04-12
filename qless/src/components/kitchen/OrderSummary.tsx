import { Order } from "../../App";
import { getOrderStatus } from "../../service/orderStatusService";
import { lastUpdateTime } from "../../service/cookDashboardService";
import { formatPhoneNumber } from "../../service/formatter";

export function OrderSummary({ order }: { order: Order }) {
    return (
        <ol>
            <li>Order Number: {order.order_id}</li>
            <li>Order Status: <span className={`statusLabel status-${order.status_id}`}>{getOrderStatus(order.status_id)}</span></li>
            <li>Last Update: {lastUpdateTime(order)}</li>
            <li>Phone Number: {formatPhoneNumber(order.customer_phone_number)}</li>
        </ol>
    );
}