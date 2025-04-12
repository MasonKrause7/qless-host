import { OrderDetail, Order } from "../../App";
import { CookDashboardView, getListDetails } from '../../service/cookDashboardService';
import { updateOrderStatus } from "../../service/supabaseService";
import { OrderStatus } from "../../service/orderStatusService";
import { OrderSummary } from "./OrderSummary";
import { useEffect } from "react";

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

    useEffect(() => {
        if (currentOrder === undefined) {
            console.log("Order undefined");
            setIsShowing(CookDashboardView.List);
            setOrderStatusFilter(OrderStatus.Ready);
        }
    }, [currentOrder]);


    if (currentOrder === undefined) return null;

    const listDetails = getListDetails(orderDetails, false);
    const subtotal: number = currentOrder.subtotal;
    const tax: number = Math.round(currentOrder.subtotal * currentOrder.tax_rate * 100) / 100;
    const total: number = subtotal + tax;
    return (
        <>
            <div className="cookDashLeft">
                <ol>{listDetails}</ol>
            </div>
            <div className="cookDashRight">
                <div className="cookDashRightInner">
                    <div className="orderDetails">
                        <OrderSummary order={currentOrder} />
                        <div className="orderCost">
                            <div className="costRow">
                                <span>Subtotal:</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="costRow">
                                <span>Tax ({currentOrder.tax_rate * 100}%):</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <hr />
                            <div className="costRow totalRow">
                                <span>Total:</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                    </div>
                    <div className="finishButtons">
                        <FinishOrderButton
                            setIsShowing={setIsShowing}
                            orderId={currentOrder.order_id}
                            refreshOrders={refreshOrders}
                        />
                        <div className="finishNavButtons">
                            <button onClick={() => setIsShowing(CookDashboardView.Details)}>View Details</button>
                            <button onClick={() => setIsShowing(CookDashboardView.List)}>View All Orders</button>
                        </div>
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