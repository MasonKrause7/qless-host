import ListOrders from '../../components/kitchen/ListOrders';
import '../../styles/kitchen/cookDashboard.css';
import { useState, useEffect } from 'react';
import supabase from '../../utils/supabase';
import { useNavigate } from 'react-router-dom';
import ViewOrderDetails from '../../components/kitchen/ViewOrderDetails';
import ViewOrderDetailsSidebar from '../../components/kitchen/ViewOrderDetailsSidebar';
import { Order } from '../../App';


export default function CookDashboard() {
    const [isShowing, setIsShowing] = useState("list");
    const [orderNum, setOrderNum] = useState(0);
    const [orders, setOrders] = useState<Order[]>([]);
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


    return (
        <div className="pageContainer">
            <div className='cookDashContainer'>
                <div className="cookDashLeft">
                    {isShowing === "list" && <ListOrders setIsShowing={setIsShowing}
                        setOrderNum={setOrderNum} orders={orders} orderStatus={3} />}
                    {isShowing === "details" && <ViewOrderDetails
                        order={getOrderFromList({ orders, orderNum })} setIsShowing={setIsShowing} />}
                </div>
                <div className="cookDashRight">
                    {isShowing === "list" && <p>Just For Testing</p>}
                    {isShowing === "details" && <ViewOrderDetailsSidebar orders={orders}
                        order={getOrderFromList({ orders, orderNum })} setIsShowing={setIsShowing}
                        setOrderNum={setOrderNum} />}
                </div>
                {isShowing === "finish" && <FinishButton setIsShowing={setIsShowing} orderNum={orderNum} />}
            </div>
        </div>
    )
}



function getOrderFromList({ orders, orderNum }: { orders: Order[]; orderNum: number }) {
    const item = orders.find(i => i.order_id === orderNum);
    return item;
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

