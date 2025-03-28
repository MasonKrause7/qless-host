import '../../styles/kitchen/cookDashboard.css';
import { getOrderStatus } from '../../pages/kitchen/CookDashboard';
import { Order } from '../../App';
import { UpdateOrderStatusButton } from '../../pages/kitchen/CookDashboard';
import supabase from '../../utils/supabase';

/*Order Status:
    1: Recieved
    2: Being Cooked
    3: Ready
    4: Picked Up
*/



export default function ListOrders({ setIsShowing: setIsShowing, setOrderNum: setOrderNum, orders: orders, orderStatus }:
    {
        setIsShowing: React.Dispatch<React.SetStateAction<string>>;
        setOrderNum: React.Dispatch<React.SetStateAction<number>>;
        orders: Order[];
        orderStatus: number;
    }) {

    const orderList = orders.filter(order =>
        order.status_id <= orderStatus
    );

    //map each order
    const listItems = orderList.map(currentOrder =>

        <li className='listItem' key={currentOrder.order_id}>
            <div className="listLeft">
                <ul className='orderList'>
                    <li>Order Number: {currentOrder.order_id}</li>
                    <li>Time Submitted: {new Date(currentOrder.time_received).toLocaleTimeString()}</li>
                    <li>Status: {getOrderStatus(currentOrder.status_id)}</li>
                </ul>
            </div>
            <div className="listRight">
                <button className='listButton' onClick={handleDetailsClick(currentOrder.order_id)}>View Details</button>
                <UpdateOrderStatusButton className='listButton' currentOrder={currentOrder} setOrderNum={setOrderNum}/>
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



    //return list
    return (
        <>
            <div className="cookDashLeft">
                <ol>{listItems}</ol>
            </div>
            <div className="cookDashRight">
                <p>Just For Testing</p>
                <TempResetButton />
            </div>
        </>
    );
}

//for testing
function TempResetButton() {

    const click = () => {
        
            const update = async () => {
                const { error: errorOne } = await supabase.from('orders').update({ status_id: 1 }).eq('order_id', 1);
                const { error: errorTwo } = await supabase.from('orders').update({ status_id: 2 }).eq('order_id', 2);
                const { error: errorThree } = await supabase.from('orders').update({ status_id: 3 }).eq('order_id', 3);
                if (errorOne || errorTwo || errorThree)
                    console.log(`Error One: ${errorOne}
                Error Two: ${errorTwo}
                Error Three: ${errorThree}`);
            }
            update();
        
    }

    return <button onClick={click}>Reset</button>
}