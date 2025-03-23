import '../../styles/kitchen/cookDashboard.css';
import { getOrderStatus } from '../../pages/kitchen/CookDashboard';
import { Order } from '../../pages/kitchen/CookDashboard';

/*Order Status:
    1: Recieved
    2: Being Cooked
    3: Ready
    4: Picked Up
*/



export default function ListOrders({ setIsShowing: setIsShowing, setOrderNum: setOrderNum, orders: orders, orderStatus: orderType }:
    {
        setIsShowing: React.Dispatch<React.SetStateAction<string>>;
        setOrderNum: React.Dispatch<React.SetStateAction<number>>;
        orders: Order[];
        orderStatus: number;
    }) {
    
    const orderList = orders.filter(order =>
        order.status_id <= orderType
    );

    //map each order
    const listItems = orderList.map(order =>
        
        <li className='listItem' key={order.order_id}>
            <div className="listLeft">
                <ul className='orderList'>
                    <li>Order Number: {order.order_id}</li>
                    <li>Time Submitted: {new Date(order.time_received).toTimeString()}</li>
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


