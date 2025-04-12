import '../../styles/kitchen/cookDashboard.css';
import { Order, Truck, User } from '../../App';
import { OrderStatus, getOrderStatus } from '../../service/orderStatusService';
import { UpdateOrderStatusButton } from './UpdateOrderStatusButton';
import supabase from '../../utils/supabase';
import { CookDashboardView, lastUpdateTime } from '../../service/cookDashboardService';
import { useNavigate } from 'react-router-dom';

type ListOrdersProps = {
    setIsShowing: React.Dispatch<React.SetStateAction<CookDashboardView>>;
    setOrderNum: React.Dispatch<React.SetStateAction<number>>;
    orderStatusFilter: OrderStatus;
    refreshOrders: () => Promise<void>;
    setOrderStatusFilter: React.Dispatch<React.SetStateAction<OrderStatus>>;
    trucks: Truck[];
    selectedTruckId: number | 'all' | null;
    setSelectedTruckId: React.Dispatch<React.SetStateAction<number | "all" | null>>;
    user: User | null;
    filteredOrders: Order[];
}

export default function ListOrders({
    setIsShowing,
    setOrderNum,
    orderStatusFilter,
    refreshOrders,
    setOrderStatusFilter,
    trucks,
    selectedTruckId,
    setSelectedTruckId,
    user,
    filteredOrders
}: ListOrdersProps) {

    const navigate = useNavigate();


    //map each order
    const listItems = filteredOrders.map(currentOrder =>

        <li className='listItem' key={currentOrder.order_id}>
            <div className="listInnerBox">
                <div className="listLeft">
                    <ul className='orderList'>
                        <li><strong>Order Number:</strong> {currentOrder.order_id}</li>
                        <li><strong>Time Submitted:</strong> {new Date(currentOrder.time_received).toLocaleTimeString()}</li>
                        <li>
                            <strong>Status: </strong>
                            <span className={`statusLabel status-${currentOrder.status_id}`}>
                                {getOrderStatus(currentOrder.status_id)}
                            </span>
                        </li>
                        <li><strong>Last Update:</strong> {lastUpdateTime(currentOrder)}</li>
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
            </div>
        </li>
    );



    //for when you click the "veiw details" button
    function handleDetailsClick(orderId: number) {
        const click = () => {
            setIsShowing(CookDashboardView.Details);
            setOrderNum(orderId);
        }
        return click;
    }


    //return list
    return (
        <>
            <div className="cookDashLeft">
                {filteredOrders.length === 0 ?
                    <div className="listItem">
                        <div className="listInnerBox">No Orders in Queue
                        </div>
                    </div> : <ol>{listItems}</ol>}
            </div>
            <div className="cookDashRight">
                <div className="cookDashRightInner">
                    <h3>Welcome, {user?.first_name}!</h3>
                    {user?.is_manager ?
                        <>
                            <button onClick={() => navigate("/manage")}>Go To Manager Dashboard</button>
                            <br />
                        </> :
                        <></>}
                    {trucks.length > 0 && <label htmlFor="truckFilter">Select Truck:</label>}
                    {selectedTruckId !== null && trucks.length > 0 && (
                        <select
                            name="truckFilter"
                            id="truckFilter"
                            value={selectedTruckId ?? ''}
                            onChange={(e) =>
                                setSelectedTruckId(e.target.value === 'all' ? 'all' : parseInt(e.target.value))
                            }
                        >
                            <option value='all'>All Trucks</option>
                            {trucks.map(truck => (
                                <option key={truck.truck_id} value={truck.truck_id}>
                                    {truck.truck_name}
                                </option>
                            ))}

                        </select>
                    )}
                    <br />
                    <ViewPastOrders orderStatusFilter={orderStatusFilter} setOrderStatusFilter={setOrderStatusFilter} />
                    <p>Just For Testing</p>
                    <TempResetButton refreshOrders={refreshOrders} />
                </div>
            </div>
        </>
    );
}

type ViewPastOrdersProps = {
    orderStatusFilter: OrderStatus;
    setOrderStatusFilter: React.Dispatch<React.SetStateAction<OrderStatus>>;
}

function ViewPastOrders({
    orderStatusFilter,
    setOrderStatusFilter
}: ViewPastOrdersProps) {

    const click = () => {
        if (orderStatusFilter === OrderStatus.Ready)
            setOrderStatusFilter(OrderStatus.PickedUp);
        else
            setOrderStatusFilter(OrderStatus.Ready);

    }



    return <button onClick={click}>{orderStatusFilter === OrderStatus.PickedUp ? "View Current Orders" : "View Past Orders"}</button>
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