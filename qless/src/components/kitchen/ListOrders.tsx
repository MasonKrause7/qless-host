import '../../styles/kitchen/cookDashboard.css';
import supabase from '../../utils/supabase';
import { getOrderStatus } from '../../pages/kitchen/CookDashboard';
import { useEffect, useState } from 'react';
import { Orders } from '../../pages/kitchen/CookDashboard';

/*Order Status:
    1: Recieved
    2: Being Cooked
    3: Ready
    4: Picked Up
*/

export default function ListOrders({ setIsShowing: setIsShowing, setOrderNum: setOrderNum }:
    {
        setIsShowing: React.Dispatch<React.SetStateAction<string>>;
        setOrderNum: React.Dispatch<React.SetStateAction<number>>;
    }) {
    const [openOrders, setOpenOrders] = useState<Orders[]>([]);

    //debug
    console.log(supabase.auth.getUser());

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await supabase.from('orders').select();
                if (data) {
                    const orderList: Orders[] = data.map(order => ({
                        order_id: order.truck_id,
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
                    setOpenOrders(orderList);
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


    //map each active order
    const listItems = openOrders.map(order =>

        <li className='listItem' key={order.order_id}>
            <div className="listLeft">
                <ul className='orderList'>
                    <li>Order Number: {order.order_id}</li>
                    <li>Time Submitted: {order.time_received.toLocaleTimeString()}</li>
                    <li>Status: {getOrderStatus(order.status_id)}</li>
                </ul>
            </div>
            <div className="listRight">
                <button className='listButton' onClick={handleDetailsClick(order.order_id)}>View Details</button>
                <button className='listButton' onClick={handleFinishClick(order.order_id)}>Finish</button>
            </div>
        </li>
        

    );

    //for when you click the "veiw details" button
    function handleDetailsClick(orderId: number) {
        const click = () => {
            setIsShowing("details");
            setOrderNum(orderId);
        }
        return click;
    }

    //for when you click the "finish" button
    function handleFinishClick(orderId: number) {
        const click = () => {
            setIsShowing("finish");
            setOrderNum(orderId);
        }
        return click;
    }

    //return list
    return <ol>{listItems}</ol>
}


