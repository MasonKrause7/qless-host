import { OrderDetail, Order } from "../../App";
import { CookDashboardView, getListDetails } from '../../service/cookDashboardService';
import { updateOrderStatus } from "../../service/supabaseService";
import { OrderStatus } from "../../service/orderStatusService";
import { OrderSummary } from "./OrderSummary";

type FinishOrderProps = {
    setIsShowing: React.Dispatch<React.SetStateAction<CookDashboardView>>;
    orderDetails: OrderDetail[];
    currentOrder: Order | undefined;
    refreshOrders: () => Promise<void>;
    setOrderStatusFilter: React.Dispatch<React.SetStateAction<OrderStatus>>;
}

export default function FinishOrder({
    setIsShowing,
    orderDetails,
    currentOrder,
    refreshOrders,
    setOrderStatusFilter
}: FinishOrderProps) {

    if (currentOrder === undefined) {
        console.log("Order undefined");
        setIsShowing(CookDashboardView.List);
        setOrderStatusFilter(OrderStatus.Ready);
        return;
    }

    const listDetails = getListDetails(orderDetails, false);
    const subtotal: number = currentOrder.subtotal;
    const tax: number = Math.round(currentOrder.subtotal * currentOrder.tax_rate * 100) / 100;
    const total: number = subtotal + tax;
    return (
        <>
            <div className="cookFinishLeft">
                <ol>{listDetails}</ol>
            </div>
            <div className="cookFinishRight">
                <div className="details">
                    <OrderSummary order={currentOrder}/>
                    <br />
                    <ol>
                        <li><h4>Subtotal: ${subtotal.toFixed(2)}</h4></li>
                        <li><h4>Tax ({currentOrder.tax_rate * 100}%): ${tax.toFixed(2)}</h4></li>
                        <hr />
                        <li><h4>Total: ${total.toFixed(2)}</h4></li>
                    </ol>
                </div>
                <div className="finishButtons">
                    <FinishOrderButton
                        setIsShowing={setIsShowing}
                        orderId={currentOrder.order_id}
                        refreshOrders={refreshOrders}
                    />
                    <div className="finishNavButtons">
                        <button onClick={() => setIsShowing(CookDashboardView.Details)}>View Order Details</button>
                        <button onClick={() => setIsShowing(CookDashboardView.List)}>View All Orders</button>
                    </div>
                </div>
            </div>
        </>
    );
}

type FinishOrderButtonProps = {
    setIsShowing: React.Dispatch<React.SetStateAction<CookDashboardView>>;
    orderId: number;
    refreshOrders: () => Promise<void>;
}

function FinishOrderButton({
    setIsShowing,
    orderId,
    refreshOrders
}: FinishOrderButtonProps) {

    const click = async () => {
        const updateData = {
            status_id: OrderStatus.PickedUp,
            time_picked_up: new Date()
        }
        const didOrderUpdate = await updateOrderStatus(orderId, updateData);
        if (didOrderUpdate) {
            await refreshOrders();
            setIsShowing(CookDashboardView.List);
        }
    }

    return <button onClick={click}>Mark as Picked Up</button>
}