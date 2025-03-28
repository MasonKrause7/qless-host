import "../../styles/kitchen/cookDashboard.css";
import { Order, OrderDetail } from "../../App";
import { getOrderStatus } from "../../pages/kitchen/CookDashboard";
import { useState, useEffect } from "react";

export default function ViewOrderDetails({
    orders,
    orderStatus,
    order: currentOrder,
    orderDetails,
    setIsShowing: setIsShowing,
    setOrderNum: setOrderNum }:
    {
        orders: Order[];
        orderStatus: number;
        order: Order | undefined;
        orderDetails: OrderDetail[];
        setIsShowing: React.Dispatch<React.SetStateAction<string>>;
        setOrderNum: React.Dispatch<React.SetStateAction<number>>;
    }) {

    if (currentOrder === undefined) {
        console.log("Invalid order");
        setIsShowing("list");
        return;
    }

    //maps order details
    const listDetails = orderDetails.map(detail =>

        <li className="listItem" key={detail.order_product_id}>
            <div className="detailInfo">
                <div className="detailImg">
                    <img src={detail.product.image_path.includes("/image/path") ? "/src/tempimg/img.jpg" : detail.product.image_path} alt="Product Image" />
                </div>
                <div className="details">
                    <ol>
                        <li>{detail.product.product_name}</li>
                        <li>Quantity: {detail.qty}</li>
                    </ol>
                </div>
                <div className="price">${(detail.product.price * detail.qty)}</div>
            </div>
            <button>Delete</button>
        </li>

    );

    //handles "View All Orders" button
    function handleViewAllButton() {
        const click = () => {
            setIsShowing("list");
        }
        return click;
    }

    return (
        <>
            <div className="cookDashLeft">
                <ol>{listDetails}</ol>
            </div>
            <div className="cookDashRight">
                <div className="details">
                    <ol>
                        <li>Order Number: {currentOrder.order_id}</li>
                        <li>Order Status: {getOrderStatus(currentOrder.status_id)}</li>
                        <li>Last Update: {lastUpdateTime(currentOrder)}</li>
                        <li>Phone Number: {formatPhoneNumber(currentOrder)}</li>
                    </ol>
                </div>
                <div className="buttons">
                    <button>Change Status</button>
                    <div className="prevNextButton">
                        <PrevDetailsPageButton
                            orders={orders}
                            currentOrder={currentOrder}
                            setOrderNum={setOrderNum}
                        />
                        <NextDetailsPageButton
                            orders={orders}
                            currentOrder={currentOrder}
                            setOrderNum={setOrderNum}
                            orderStatus={orderStatus}
                        />
                    </div>
                    <button onClick={handleViewAllButton()}>View All Orders</button>
                </div>
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
    return `(${phone.slice(0, 3)})-${phone.slice(3, 6)}-${phone.slice(6)}`;
}

//handle the previous button click
function PrevDetailsPageButton({ orders, currentOrder, setOrderNum }:
    {
        orders: Order[];
        currentOrder: Order;
        setOrderNum: React.Dispatch<React.SetStateAction<number>>
    }) {
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const curOrderIndex: number = orders.indexOf(currentOrder);

    let prevOrder: Order | null = null;

    useEffect(() => {
        if (curOrderIndex > 0) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [curOrderIndex]);  // Runs only when curOrderIndex changes

    if (curOrderIndex > 0) {
        prevOrder = orders[curOrderIndex - 1];
    }

    const click = () => {
        if (prevOrder) {
            setOrderNum(prevOrder.order_id);
        }
    };

    return <button onClick={click} disabled={isButtonDisabled}>Prev</button>;
}

//handle the next button click
function NextDetailsPageButton({ orders, currentOrder, setOrderNum, orderStatus }:
    {
        orders: Order[];
        currentOrder: Order;
        setOrderNum: React.Dispatch<React.SetStateAction<number>>;
        orderStatus: number;
    }) {
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const curOrderIndex: number = orders.indexOf(currentOrder);

    let nextOrder: Order | null = null;

    useEffect(() => {
        if (curOrderIndex < orders.length - 1 &&
            orders[curOrderIndex + 1].order_id <= orderStatus) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [curOrderIndex]);  // Runs only when curOrderIndex changes

    if (curOrderIndex < orders.length) {
        nextOrder = orders[curOrderIndex + 1];
    }

    const click = () => {
        if (nextOrder) {
            setOrderNum(nextOrder.order_id);
        }
    };

    return <button onClick={click} disabled={isButtonDisabled}>Next</button>;
}