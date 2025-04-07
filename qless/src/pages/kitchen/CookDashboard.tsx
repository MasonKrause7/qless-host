import ListOrders from '../../components/kitchen/ListOrders';
import '../../styles/kitchen/cookDashboard.css';
import { useState, useEffect } from 'react';
import supabase from '../../utils/supabase';
import { useNavigate } from 'react-router-dom';
import ViewOrderDetails from '../../components/kitchen/ViewOrderDetails';
import { Order, OrderDetail, OrderStatus } from '../../App';
import FinishOrder from '../../components/kitchen/FinishOrder';


export default function CookDashboard() {
    const [isShowing, setIsShowing] = useState("list");
    const [orderNum, setOrderNum] = useState(0);
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
    const [currentOrder, setCurrentOrder] = useState<Order>();
    const navigate = useNavigate();

    //pulls orders from db and saves as array in the orders state
    useEffect(() => {
        //verify that user is authenticated, if not reroute to login page
        const checkAuth = async () => {
            const { error } = await supabase.auth.getUser();
            if (error) {
                navigate("/");
            }
        }
        checkAuth();

        fetchOrders();//use on mount

    }, []);

    //pull orders from the database and store in "orders" state
    const fetchOrders = async () => {
        try {
            const { data } = await supabase.from('orders').select();
            if (data) {
                let orderList: Order[] = data.map(order => ({
                    order_id: order.order_id,
                    subtotal: order.subtotal,
                    tax_rate: order.tax_rate,
                    customer_phone_number: order.customer_phone_number,
                    time_received: order.time_received,
                    time_being_cooked: order.time_being_cooked,
                    time_ready: order.time_ready,
                    time_picked_up: order.time_picked_up,
                    status_id: order.status_id,
                    truck_id: order.truck_id
                }));
                orderList.sort((a, b) => a.order_id - b.order_id);
                setOrders(orderList);
                setOrderNum(orderList[0].order_id);
            }
            else {
                console.log("Failed to fetch orders.");
            }
        }
        catch (err) {
            console.log("Unable to complete fetch orders process...", err);
        }
    }

    //updates the orders
    const refreshOrders = async () => {
        try {
            const { data } = await supabase.from('orders').select();
            if (data) {
                const orderList: Order[] = data.map(order => ({
                    order_id: order.order_id,
                    subtotal: order.subtotal,
                    tax_rate: order.tax_rate,
                    customer_phone_number: order.customer_phone_number,
                    time_received: order.time_received,
                    time_being_cooked: order.time_being_cooked,
                    time_ready: order.time_ready,
                    time_picked_up: order.time_picked_up,
                    status_id: order.status_id,
                    truck_id: order.truck_id
                }));
                orderList.sort((a, b) => a.order_id - b.order_id);
                setOrders(orderList);

                const updatedCurrent = orderList.find(i => i.order_id === orderNum);
                if (updatedCurrent) setCurrentOrder(updatedCurrent);
            }
        } catch (err) {
            console.log("Error refreshing orders", err);
        }
    };

    //pull order details from db whenever order num changes
    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (orderNum !== 0) {
                try {

                    const { data } = await supabase.from('order_product').select(`
                    order_product_id,
                    qty,
                    product(
                        product_name,
                        price,
                        image_path
                    )`).eq('order_id', orderNum);
                    if (data) {
                        const currOrder = data.map(detail => ({
                            order_product_id: detail.order_product_id,
                            qty: detail.qty,
                            product: Array.isArray(detail.product) ? detail.product[0] : detail.product
                        }))
                        setOrderDetails(currOrder);

                    }
                    else console.log("Failed to fetch details");
                }
                catch (err) {
                    console.log("Unable to complete fetch orders process...", err);
                }
            }
        }
        fetchOrderDetails();
        setCurrentOrder(orders.find(i => i.order_id === orderNum));
    }, [orderNum]);


    return (
        <div className="pageContainer">
            <div className='cookDashContainer'>
                {isShowing === "list" && <ListOrders
                    setIsShowing={setIsShowing}
                    setOrderNum={setOrderNum}
                    orders={orders}
                    orderStatus={OrderStatus.Ready}
                    refreshOrders={refreshOrders}
                />}

                {isShowing === "details" && <ViewOrderDetails
                    orders={orders}
                    orderStatus={OrderStatus.Ready}
                    currentOrder={currentOrder}
                    orderDetails={orderDetails}
                    setIsShowing={setIsShowing}
                    setOrderNum={setOrderNum}
                    refreshOrders={refreshOrders}
                />}

                {isShowing === "finish" && <FinishOrder
                    setIsShowing={setIsShowing}
                    orderDetails={orderDetails}
                    currentOrder={currentOrder}
                    refreshOrders={refreshOrders}
                />}
            </div>
        </div>
    )
}



//converts an order status number to its coresponding string
export function getOrderStatus(id: OrderStatus): string {
    let status = "";
    switch (id) {
        case OrderStatus.Received:
            status = "Received";
            break;
        case OrderStatus.BeingCooked:
            status = "Being Cooked";
            break;
        case OrderStatus.Ready:
            status = "Ready";
            break;
        case OrderStatus.PickedUp:
            status = "Picked Up";
            break;
    }
    return status;
}


export function UpdateOrderStatusButton({
    className,
    currentOrder,
    refreshOrders,
    setIsShowing,
    setOrderNum
}: {
    className: string;
    currentOrder: Order;
    refreshOrders: () => Promise<void>;
    setIsShowing: React.Dispatch<React.SetStateAction<string>>;
    setOrderNum: React.Dispatch<React.SetStateAction<number>>
}) {
    const [currentStatus, setCurrentStatus] = useState<OrderStatus>(OrderStatus.Received);
    const isButtonDisabled: boolean = currentStatus >= 4;

    //when the current order updates, change the current status to reflect new order
    useEffect(() => {
        setCurrentStatus(currentOrder.status_id);
    }, [currentOrder]);

    //handle click
    const click = async () => {
        const newStatus = getNextStatus(currentStatus);
        if (!newStatus) return;

        //if status is Ready, switch view to FinishOrder
        if (newStatus === OrderStatus.PickedUp) {
            setOrderNum(currentOrder.order_id);
            setIsShowing("finish");
            return;
        }

        //otherwise, update
        const updateData: any = { status_id: newStatus };
        if (newStatus === OrderStatus.BeingCooked)
            updateData.time_being_cooked = new Date();
        else if (newStatus === OrderStatus.Ready)
            updateData.time_ready = new Date();
        try {
            const { error } = await supabase
                .from('orders')
                .update(updateData)
                .eq('order_id', currentOrder.order_id);
            if (error) {
                console.log(`Error updating order status for order num ${currentOrder.order_id}`, error);
            } else {
                setCurrentStatus(newStatus);
                await refreshOrders();


            }
        }
        catch (err) {
            console.log("Error running update button click", err);
        }
    }

    return <button
        onClick={click}
        className={className}
        disabled={isButtonDisabled}
    >
        {getStatusText(currentStatus)}
    </button>
}

const getStatusText = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.Received: return "Start Cooking";
        case OrderStatus.BeingCooked: return "Mark as Ready";
        case OrderStatus.Ready: return "Finish Order";
        case OrderStatus.PickedUp: return "Order Completed";
        default: return "Invalid Status";
    }
};

const getNextStatus = (status: OrderStatus): OrderStatus | null => {
    switch (status) {
        case OrderStatus.Received: return OrderStatus.BeingCooked;
        case OrderStatus.BeingCooked: return OrderStatus.Ready;
        case OrderStatus.Ready: return OrderStatus.PickedUp;
        case OrderStatus.PickedUp: return null; // no further status
        default: return null;
    }
};

export const getListDetails = (orderDetails: OrderDetail[], hidePrice: boolean) => {
    return orderDetails.map(detail =>

        <li className="listItem" key={detail.order_product_id}>
            <div className="detailInfo">
                <div className="detailImg">
                    <img src={detail.product.image_path.includes("/image/path") ? "/src/defaultImgs/noimg.png" : detail.product.image_path} alt="Product Image" />
                </div>
                <div className="details">
                    <ol>
                        <li>{detail.product.product_name}</li>
                        <li>Quantity: {detail.qty}</li>
                    </ol>
                </div>
                {!hidePrice && (
                    <div className="price">
                        ${detail.product.price * detail.qty}
                    </div>
                )}
            </div>
        </li>

    );
}

export function lastUpdateTime(order: Order): string {
    let time = null;
    switch (order.status_id) {
        case OrderStatus.Received:
            time = new Date(order.time_received);
            break;
        case OrderStatus.BeingCooked:
            if (order.time_being_cooked)
                time = new Date(order.time_being_cooked);
            break;
        case OrderStatus.Ready:
            if (order.time_ready)
                time = new Date(order.time_ready);
            break;
        case OrderStatus.PickedUp:
            if (order.time_picked_up)
                time = new Date(order.time_picked_up);
            break;
    }
    return time ? time.toLocaleTimeString() : "Error: No Time";
}

export function formatPhoneNumber(order: Order): string {
    const phone = order.customer_phone_number;
    return `(${phone.slice(0, 3)})-${phone.slice(3, 6)}-${phone.slice(6)}`;
}