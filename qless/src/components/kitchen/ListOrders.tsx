import '../../styles/kitchen/cookDashboard.css';
import supabase from '../../utils/supabase';
import { getOrderStatus } from '../../pages/kitchen/CookDashboard';

/*Order Status:
    1: Recieved
    2: Being Cooked
    3: Ready
    4: Picked Up
*/


//gets active orders from db and stores in array
async function getOrders() {
    const { data, error } = await supabase.from('orders').select();
    let openOrders = [];
    try {
        if (data === null) {
            console.log("Orders is NULL");
            throw new TypeError();
        } else {
            openOrders = data.filter(order => order.status_id !== 4)
        }
    }
    catch (err) {
        if (err instanceof TypeError) {
            console.log("Orders is NULL");
        }
    }

    console.log(error);

    return openOrders;
}

const openOrders = await getOrders();

export default function ListOrders({ setIsShowing: setIsShowing, setOrderNum: setOrderNum }:
    { setIsShowing: React.Dispatch<React.SetStateAction<string>>; setOrderNum: React.Dispatch<React.SetStateAction<number>>; }) {


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
                <button className='listButton' onClick={handleDetailsClick(order.orderId)}>View Details</button>
                <button className='listButton' onClick={handleFinishClick(order.orderId)}>Finish</button>
            </div>
        </li>

    );

    //return list
    return <ol>{listItems}</ol>
}


