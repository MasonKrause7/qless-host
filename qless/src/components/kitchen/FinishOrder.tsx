import { OrderDetail, OrderStatus } from "../../App";
import { getListDetails, getOrderStatus, lastUpdateTime, formatPhoneNumber } from "../../pages/kitchen/CookDashboard";
import { Order } from "../../App";
import supabase from "../../utils/supabase";



export default function FinishOrder({
    setIsShowing,
    orderDetails,
    currentOrder,
    refreshOrders
}: {
    setIsShowing: React.Dispatch<React.SetStateAction<string>>;
    orderDetails: OrderDetail[];
    currentOrder: Order | undefined;
    refreshOrders: () => Promise<void>;
}) {

    if (currentOrder === undefined) {
        console.log("Invalid order");
        setIsShowing("list");
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
                    <ol>
                        <li>Order Number: {currentOrder.order_id}</li>
                        <li>Order Status: {getOrderStatus(currentOrder.status_id)}</li>
                        <li>Last Update: {lastUpdateTime(currentOrder)}</li>
                        <li>Phone Number: {formatPhoneNumber(currentOrder)}</li>
                    </ol>
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
                        <button onClick={() => setIsShowing("details")}>Back</button>
                        <button onClick={() => setIsShowing("list")}>View All Orders</button>
                    </div>
                </div>
            </div>
        </>
    );
}

function FinishOrderButton({
    setIsShowing,
    orderId,
    refreshOrders
}: {
    setIsShowing: React.Dispatch<React.SetStateAction<string>>;
    orderId: number;
    refreshOrders: () => Promise<void>;
}) {

    const click = async () => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({
                    status_id: OrderStatus.PickedUp,
                    time_picked_up: new Date()
                })
                .eq('order_id', orderId);
            if (error) {
                console.log(`Error updating order status for order num ${orderId}`, error);
            } else {
                await refreshOrders();
                setIsShowing("list");
            }
        }
        catch (err) {
            console.log("Error running update button click", err);
        }
    }

    return <button onClick={click}>Mark as Picked Up</button>
}