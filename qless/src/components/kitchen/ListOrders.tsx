import '../../styles/kitchen/cookDashboard.css';
import { getOrderStatus } from '../../pages/kitchen/CookDashboard';
import { Order, OrderStatus } from '../../App';
import { UpdateOrderStatusButton } from '../../pages/kitchen/CookDashboard';
import supabase from '../../utils/supabase';
import { useState, useMemo, useEffect } from 'react';



export default function ListOrders({
    setIsShowing: setIsShowing,
    setOrderNum: setOrderNum,
    orders: orders,
    orderStatus,
    refreshOrders
}: {
    setIsShowing: React.Dispatch<React.SetStateAction<string>>;
    setOrderNum: React.Dispatch<React.SetStateAction<number>>;
    orders: Order[];
    orderStatus: OrderStatus;
    refreshOrders: () => Promise<void>;
}) {

    const [selectedTruckId, setSelectedTruckId] = useState<number | 'all' | null>(null);



    //create truck list
    const availableTrucks = useMemo(() => {
        const trucks = Array.from(new Set(orders.map(o => o.truck_id)));
        return trucks.sort((a, b) => a - b);//sort by truck id
    }, [orders])

    //set the first truck to default
    useEffect(() => {
        if (availableTrucks.length > 0 && selectedTruckId === null)
            setSelectedTruckId(availableTrucks[0]);
    }, [availableTrucks, selectedTruckId]);

    //filter the order list to relevant orders
    const orderList = orders.filter(order =>
        order.status_id <= orderStatus &&
        (selectedTruckId === 'all' || selectedTruckId === null || order.truck_id === selectedTruckId)
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
                <UpdateOrderStatusButton
                    className='listButton'
                    currentOrder={currentOrder}
                    refreshOrders={refreshOrders}
                    setIsShowing={setIsShowing}
                    setOrderNum={setOrderNum}
                />
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
                <label htmlFor="truckFilter">Select Truck:</label>
                {selectedTruckId !== null && (
                    <select
                        name="truckFilter"
                        id="truckFilter"
                        value={selectedTruckId ?? ''}
                        onChange={(e) =>
                            setSelectedTruckId(e.target.value === 'all' ? 'all' : parseInt(e.target.value))
                        }
                    >
                        <option value='all'>All Trucks</option>
                        {availableTrucks.map(id => (
                            <option key={id} value={id}>Truck {id}</option>
                        ))}

                    </select>
                )}
                <p>Just For Testing</p>
                <TempResetButton refreshOrders={refreshOrders} />
            </div>
        </>
    );
}

//for testing
function TempResetButton({ refreshOrders }: { refreshOrders: () => Promise<void> }) {

    const click = () => {

        const update = async () => {
            const { error: errorOne } = await supabase
                .from('orders')
                .update({
                    status_id: OrderStatus.Received,
                    time_being_cooked: null,
                    time_ready: null,
                    time_picked_up: null
                })
                .eq('order_id', 1);

            const { error: errorTwo } = await supabase
                .from('orders')
                .update({
                    status_id: OrderStatus.BeingCooked,
                    time_ready: null,
                    time_picked_up: null
                })
                .eq('order_id', 2);

            const { error: errorThree } = await supabase
                .from('orders')
                .update({
                    status_id: OrderStatus.Ready,
                    time_picked_up: null
                })
                .eq('order_id', 3);
            if (errorOne || errorTwo || errorThree) {
                console.log(`Error One: ${errorOne}
                Error Two: ${errorTwo}
                Error Three: ${errorThree}`);
            } else {
                await refreshOrders();
            }
        }
        update();

    }

    return <button onClick={click}>Reset</button>
}