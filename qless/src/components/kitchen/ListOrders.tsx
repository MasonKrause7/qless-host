import '../../styles/kitchen/cookDashboard.css';

//temporary objects for testing 
const orders = [{
    orderId: 0,
    timePlaced: new Date(2025, 2, 8, 10, 0, 0, 0),
    orderStatus: "In Progress"
}, {
    orderId: 1,
    timePlaced: new Date(2025, 2, 8, 10, 5, 0, 0),
    orderStatus: "In Progress"
}]

//gets active orders from db and stores in array
function getOrders() {
    const openOrders= orders.filter(order => order.orderStatus!=="Finished")
    return openOrders;
}

export default function ListOrders({ setIsShowing: setIsShowing, setOrderNum: setOrderNum }:
    { setIsShowing: React.Dispatch<React.SetStateAction<string>>; setOrderNum: React.Dispatch<React.SetStateAction<number>> }) {
    const openOrders = getOrders();

    //for when you click the "veiw details" button
    function handleDetailsClick(orderId: number) {
        const click = () => {
            setIsShowing("details");
            setOrderNum(orderId);
        }
        return click;
    }
    
    //for when you click the "finish" button
    function handleFinishClick(orderId: number){
        const click = () => {
            setIsShowing("finish");
            setOrderNum(orderId);
        }
        return click;
    }

    //map each active order
    const listItems = openOrders.map(order =>
        <li key={order.orderId}>
            <ul className='orderList'>
                <li>Order Number: {order.orderId}</li>
                <li>Time Submitted: {order.timePlaced.toLocaleTimeString()}</li>
                <li>Status: {order.orderStatus}</li>
            </ul>
            <button className='listButton' onClick={handleDetailsClick(order.orderId)}>View Details</button>
            <button className='listButton' onClick={handleFinishClick(order.orderId)}>Finish</button>
        </li>
    );

    //return list
    return <ol>{listItems}</ol>
}
