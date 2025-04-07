import "../../styles/kitchen/cookDashboard.css";
import { Order, OrderDetail, OrderStatus } from "../../App";
import { getListDetails, getOrderStatus, UpdateOrderStatusButton, lastUpdateTime, formatPhoneNumber } from "../../pages/kitchen/CookDashboard";
import { useState, useEffect } from "react";

export default function ViewOrderDetails({
    orders,
    orderStatus,
    currentOrder,
    orderDetails,
    setIsShowing: setIsShowing,
    setOrderNum: setOrderNum,
    refreshOrders
}: {
    orders: Order[];
    orderStatus: OrderStatus;
    currentOrder: Order | undefined;
    orderDetails: OrderDetail[];
    setIsShowing: React.Dispatch<React.SetStateAction<string>>;
    setOrderNum: React.Dispatch<React.SetStateAction<number>>;
    refreshOrders: () => Promise<void>;
}) {

    if (currentOrder === undefined) {
        console.log("Invalid order");
        setIsShowing("list");
        return;
    }

    //filters the orders
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    useEffect(() => {
        setFilteredOrders(orders.filter(order =>
            order.status_id <= orderStatus
        ));
    }, [currentOrder]);


    //maps order details
    const listDetails = getListDetails(orderDetails, true);

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
                <div className="detailsButtons">
                    <UpdateOrderStatusButton
                        className="bigDetailsButton"
                        currentOrder={currentOrder}
                        refreshOrders={refreshOrders}
                        setIsShowing={setIsShowing}
                        setOrderNum={setOrderNum}
                    />
                    <div className="prevNextButton">
                        <PrevDetailsPageButton
                            filteredOrders={filteredOrders}
                            currentOrder={currentOrder}
                            setOrderNum={setOrderNum}
                        />
                        <NextDetailsPageButton
                            filteredOrders={filteredOrders}
                            currentOrder={currentOrder}
                            setOrderNum={setOrderNum}
                        />
                    </div>
                    <button className="bigDetailsButton" onClick={handleViewAllButton()}>View All Orders</button>
                </div>
            </div>
        </>
    );
}







//previous details button
function PrevDetailsPageButton({
    filteredOrders,
    currentOrder,
    setOrderNum
}: {
    filteredOrders: Order[];
    currentOrder: Order;
    setOrderNum: React.Dispatch<React.SetStateAction<number>>
}) {
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const curOrderIndex: number = filteredOrders.indexOf(currentOrder);

    let prevOrder: Order | null = null;

    useEffect(() => {
        if (curOrderIndex > 0) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [curOrderIndex]);  // Runs only when curOrderIndex changes

    if (curOrderIndex > 0) {
        prevOrder = filteredOrders[curOrderIndex - 1];
    }

    const click = () => {
        if (prevOrder) {
            setOrderNum(prevOrder.order_id);
        }
    };

    return <button onClick={click} disabled={isButtonDisabled}>Prev</button>;
}

//next details button
function NextDetailsPageButton({ filteredOrders, currentOrder, setOrderNum }:
    {
        filteredOrders: Order[];
        currentOrder: Order;
        setOrderNum: React.Dispatch<React.SetStateAction<number>>;
    }) {
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const curOrderIndex: number = filteredOrders.indexOf(currentOrder);

    let nextOrder: Order | null = null;

    useEffect(() => {
        if (curOrderIndex < filteredOrders.length - 1) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [curOrderIndex]);  // Runs only when curOrderIndex changes

    if (curOrderIndex < filteredOrders.length) {
        nextOrder = filteredOrders[curOrderIndex + 1];
    }

    const click = () => {
        if (nextOrder) {
            setOrderNum(nextOrder.order_id);
        }
    };

    return <button onClick={click} disabled={isButtonDisabled}>Next</button>;
}

