import "../../styles/kitchen/cookDashboard.css";
import { Order, OrderDetail } from "../../App";
import { UpdateOrderStatusButton } from "./UpdateOrderStatusButton";
import { useState, useEffect } from "react";
import { OrderStatus } from "../../service/orderStatusService";
import { CookDashboardView, getListDetails } from "../../service/cookDashboardService";
import { OrderSummary } from "./OrderSummary";

type ViewOrderDetailsProps = {
    orders: Order[];
    orderStatusFilter: OrderStatus;
    currentOrder: Order | undefined;
    orderDetails: OrderDetail[];
    setIsShowing: React.Dispatch<React.SetStateAction<CookDashboardView>>;
    setOrderNum: React.Dispatch<React.SetStateAction<number>>;
    refreshOrders: () => Promise<void>;
    setOrderStatusFilter: React.Dispatch<React.SetStateAction<OrderStatus>>;
}

export default function ViewOrderDetails({
    orders,
    orderStatusFilter,
    currentOrder,
    orderDetails,
    setIsShowing,
    setOrderNum,
    refreshOrders,
    setOrderStatusFilter: setOrderStatusFilter
}: ViewOrderDetailsProps) {

    if (currentOrder === undefined) {
        console.log("Order undefined");
        setIsShowing(CookDashboardView.List);
        setOrderStatusFilter(OrderStatus.Ready);
        return;
    }

    //filters the orders
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    useEffect(() => {
        setFilteredOrders(orders.filter(order =>
            order.status_id <= orderStatusFilter
        ));
    }, [currentOrder, orders, orderStatusFilter]);


    //get order details
    const listDetails = getListDetails(orderDetails, true);

    return (
        <>
            <div className="cookDashLeft">
                <ol>{listDetails}</ol>
            </div>
            <div className="cookDashRight">
                <div className="details">
                    <OrderSummary order={currentOrder} />
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
                    <button className="bigDetailsButton" onClick={() => setIsShowing(CookDashboardView.List)}>View All Orders</button>
                </div>
            </div>
        </>
    );
}


type DetailsPageButtonProps = {
    filteredOrders: Order[];
    currentOrder: Order;
    setOrderNum: React.Dispatch<React.SetStateAction<number>>;
}

//previous details button
function PrevDetailsPageButton({
    filteredOrders,
    currentOrder,
    setOrderNum
}: DetailsPageButtonProps) {
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
function NextDetailsPageButton({
    filteredOrders,
    currentOrder,
    setOrderNum
}: DetailsPageButtonProps) {
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

