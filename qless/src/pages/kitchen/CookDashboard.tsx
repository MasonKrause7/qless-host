import ListOrders from '../../components/kitchen/ListOrders';
import '../../styles/kitchen/cookDashboard.css';
import { useState, useEffect } from 'react';
import supabase from '../../utils/supabase';
import { useNavigate } from 'react-router-dom';
import ViewOrderDetails from '../../components/kitchen/ViewOrderDetails';
import { Order, OrderDetail } from '../../App';
import { OrderStatus } from '../../service/orderStatusService';
import FinishOrder from '../../components/kitchen/FinishOrder';
import { getOrders } from '../../service/supabaseService';
import ErrorMessage from '../../components/commonUI/ErrorMessage'; 


export default function CookDashboard() {
    const [isShowing, setIsShowing] = useState("list");
    const [orderNum, setOrderNum] = useState(0);
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
    const [currentOrder, setCurrentOrder] = useState<Order>();
    const [errorMessage, setErrorMessage] = useState<string>("");
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

    }, [navigate]);

    //pull orders from the database and store in "orders" state
    const fetchOrders = async () => {
        let orderList: Order[] = []
        setErrorMessage("");
        const potentialOrderList: Order[] | null = await getOrders();
        if (!potentialOrderList){
            console.log("Error fetching orders");
            setErrorMessage("There was an error fetching your orders.");
        }
        else if (potentialOrderList.length === 0){
            //handle the case where there are no orders with a default message

        }
        else{
            orderList = potentialOrderList;
            setOrders(orderList);
            setOrderNum(orderList[0].order_id);
        }
        
    }

    //updates the orders
    const refreshOrders = async () => {
        setErrorMessage("");
        let orderList: Order[] = [];
        const potentialOrderList: Order[] | null = await getOrders();
        if (!potentialOrderList){
            console.log("Error refreshing orders");
            setErrorMessage("Error refreshing orders, please refresh the page. If the problem persists, logout and try again.");
        }
        else if(potentialOrderList.length === 0){
            //handle this with a default, "you dont have any orders"

        }
        else{
            orderList = potentialOrderList;
            const updatedCurrent = orderList.find(i => i.order_id === orderNum);
            if (updatedCurrent) setCurrentOrder(updatedCurrent);
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
                        const currOrder: OrderDetail[] = data.map(detail => ({
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
    }, [orderNum, orders]);


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
            {errorMessage !== "" && <ErrorMessage message={errorMessage}/>}
        </div>
    )
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
        const updateData: Partial<Order> = { status_id: newStatus };
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


