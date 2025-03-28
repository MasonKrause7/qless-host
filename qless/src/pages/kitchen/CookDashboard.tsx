import ListOrders from '../../components/kitchen/ListOrders';
import '../../styles/kitchen/cookDashboard.css';
import { useState, useEffect } from 'react';
import supabase from '../../utils/supabase';
import { useNavigate } from 'react-router-dom';
import ViewOrderDetails from '../../components/kitchen/ViewOrderDetails';
import { Order, OrderDetail } from '../../App';


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
                        status_id: order.status_id
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
        fetchOrders();

    }, []);

    //pull order details from db whenever order num changes
    useEffect(() => {
        const fetchDetails = async () => {
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
        fetchDetails();
        setCurrentOrder(orders.find(i => i.order_id === orderNum));
    }, [orderNum]);


    return (
        <div className="pageContainer">
            <div className='cookDashContainer'>
                {isShowing === "list" && <ListOrders
                    setIsShowing={setIsShowing}
                    setOrderNum={setOrderNum}
                    orders={orders}
                    orderStatus={3}
                />}

                {isShowing === "details" && <ViewOrderDetails
                    orders={orders}
                    orderStatus={3}
                    currentOrder={currentOrder}
                    orderDetails={orderDetails}
                    setIsShowing={setIsShowing}
                    setOrderNum={setOrderNum}
                />}

                {isShowing === "finish" && <FinishButton
                    setIsShowing={setIsShowing}
                    orderNum={orderNum}
                />}
            </div>
        </div>
    )
}

/*Order Status:
    1: Recieved
    2: Being Cooked
    3: Ready
    4: Picked Up
*/

//converts an order status number to its coresponding string
export function getOrderStatus(id: number) {
    let status = "";
    switch (id) {
        case 1:
            status = "Recieved"
            break;
        case 2:
            status = "Being Cooked"
            break;
        case 3:
            status = "Ready"
            break;
        case 4:
            status = "Picked Up"
            break;
    }
    return status;
}

function FinishButton({ setIsShowing, orderNum }:
    { setIsShowing: React.Dispatch<React.SetStateAction<string>>; orderNum: number }) {
    return (
        <>
            <h1>Finish for: {orderNum}</h1>
            <button onClick={() => setIsShowing("list")}>Back</button>
        </>
    );
}


export function UpdateOrderStatusButton({
    className,
    currentOrder,
    setOrderNum
}: {
    className: string;
    currentOrder: Order;
    setOrderNum: React.Dispatch<React.SetStateAction<number>>
}) {
    const [currentStatus, setCurrentStatus] = useState(1);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    //when the current order updates, change the current status to reflect new order
    useEffect(() => {
        setCurrentStatus(currentOrder.status_id);
    }, [currentOrder]);

    let statusText = "Invalid Status";//default status

    switch (currentStatus) {//update text on the button
        case 1:
            statusText = "Begin Cooking"
            break;
        case 2:
            statusText = "Order Ready"
            break;
        case 3:
            statusText = "Finish Order"
            break;
        case 4:
            statusText = "Order Completed"
            setIsButtonDisabled(true);
            break;
    }
    const click = async () => {
        try {
            const { error } = await supabase.from('orders').update({ status_id: (currentStatus + 1) }).eq('order_id', currentOrder.order_id);
            if (error)
                console.log(`Error updating order status for order num ${currentOrder.order_id}`, error);
            setOrderNum
        }
        catch (err) {
            console.log("Error running update button click", err);
        }
    }

    return <button onClick={click} className={className} disabled={isButtonDisabled}>{statusText}</button>
}