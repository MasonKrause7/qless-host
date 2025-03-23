import "../../styles/kitchen/cookDashboard.css";
import { Order } from "../../pages/kitchen/CookDashboard";
import { getOrderStatus } from "../../pages/kitchen/CookDashboard";

export default function ViewOrderDetailsSidebar({ order, setIsShowing: setIsShowing }:
    {
        order: Order | undefined;
        setIsShowing: React.Dispatch<React.SetStateAction<string>>;
    }) {

    if (order === undefined) {
        console.log("Invalid order");
        setIsShowing("list");
        return;
    }

    //handles "View All Orders" button
    function handleViewAllButton(){
        const click = () =>{
            setIsShowing("list");
        } 
        return click;
    }

    return (
        <>
            <div className="details">
                <ol>
                    <li>Order Number: {order.order_id}</li>
                    <li>Order Status: {getOrderStatus(order.status_id)}</li>
                    <li>Last Update: {lastUpdateTime(order)}</li>
                    <li>Phone Number: {formatPhoneNumber(order)}</li>
                </ol>
            </div>
            <div className="buttons">
                <button>Change Status</button>
                <div className="prevNextButton">
                    <button>Prev</button>
                    <button>Next</button>
                </div>
                <button onClick={handleViewAllButton()}>View All Orders</button>
            </div>
        </>
    );
}

/*Order Status:
    1: Recieved
    2: Being Cooked
    3: Ready
    4: Picked Up
*/

function lastUpdateTime(order: Order): string {
    let time = null;
    switch (order.status_id) {
        case 1:
            time = new Date(order.time_received);
            break;
        case 2:
            if (order.time_being_cooked)
                time = new Date(order.time_being_cooked);
            break;
        case 3:
            if (order.time_ready)
                time = new Date(order.time_ready);
            break;
        case 4:
            if (order.time_picked_up)
                time = new Date(order.time_picked_up);
            break;
    }
    return time ? time.toLocaleTimeString() : "Error: No Time";
}

function formatPhoneNumber(order: Order): string {
    const phone = order.customer_phone_number;
    return `(${phone.slice(0,3)})-${phone.slice(3,6)}-${phone.slice(6)}`;
}