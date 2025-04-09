import ListOrders from '../../components/kitchen/ListOrders';
import '../../styles/kitchen/cookDashboard.css';
import { useState, useEffect, useMemo } from 'react';
import supabase from '../../utils/supabase';
import { useNavigate } from 'react-router-dom';
import ViewOrderDetails from '../../components/kitchen/ViewOrderDetails';
import { Order, OrderDetail, Truck, User } from '../../App';
import { OrderStatus } from '../../service/orderStatusService';
import FinishOrder from '../../components/kitchen/FinishOrder';
import { getUser, getOrders, getTrucks } from '../../service/supabaseService';
import ErrorMessage from '../../components/commonUI/ErrorMessage';
import { CookDashboardView } from '../../service/cookDashboardService';


export default function CookDashboard() {
    const [isShowing, setIsShowing] = useState<CookDashboardView>(CookDashboardView.List);
    const [orderNum, setOrderNum] = useState(0);
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
    const [currentOrder, setCurrentOrder] = useState<Order>();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [orderStatusFilter, setOrderStatusFilter] = useState(OrderStatus.Ready);
    const [trucks, setTrucks] = useState<Truck[]>([]);
    const [selectedTruckId, setSelectedTruckId] = useState<number | 'all' | null>(null);
    const navigate = useNavigate();


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
    //on mount
    useEffect(() => {
        
        //TODO: grab the truck user is assigned to from truck_assginment and use it to set selectedTruckId if they are not a manager


        //verify that user is authenticated, if not reroute to login page
        const checkAuth = async () => {
            const user: User | null = await getUser();
            if (!user) {
                console.log("No user found. Redirecting to login...");
                navigate("/");
            }
        }
        checkAuth();

        fetchOrders();//use on mount

        const fetchTrucks = async () => {
            const user = await getUser();
            if (user) {
                const truckList = await getTrucks(user.user_id);
                if (truckList) {
                    truckList.sort((a, b) => a.truck_name.localeCompare(b.truck_name));
                    setTrucks(truckList);
                }
            }
        }
        fetchTrucks();

    }, [navigate]);



    //pull orders from the database and store in "orders" state
    const fetchOrders = async () => {
        let orderList: Order[] = []
        setErrorMessage("");
        const potentialOrderList: Order[] | null = await getOrders();
        if (!potentialOrderList) {
            console.log("Error fetching orders");
            setErrorMessage("There was an error fetching your orders.");
        }
        else if (potentialOrderList.length === 0) {
            //handle the case where there are no orders with a default message

        }
        else {
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
        if (!potentialOrderList) {
            console.log("Error refreshing orders");
            setErrorMessage("Error refreshing orders, please refresh the page. If the problem persists, logout and try again.");
        }
        else if (potentialOrderList.length === 0) {
            setOrders([]);
            setCurrentOrder(undefined);
        }
        else {
            orderList = potentialOrderList;
            setOrders(orderList);
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
                {isShowing === CookDashboardView.List && <ListOrders
                    setIsShowing={setIsShowing}
                    setOrderNum={setOrderNum}
                    orders={orders}
                    orderStatusFilter={orderStatusFilter}
                    refreshOrders={refreshOrders}
                    setOrderStatusFilter={setOrderStatusFilter}
                    trucks={trucks}
                    selectedTruckId={selectedTruckId}
                    setSelectedTruckId={setSelectedTruckId}
                />}

                {isShowing === CookDashboardView.Details && <ViewOrderDetails
                    orders={orders}
                    orderStatusFilter={orderStatusFilter}
                    currentOrder={currentOrder}
                    orderDetails={orderDetails}
                    setIsShowing={setIsShowing}
                    setOrderNum={setOrderNum}
                    refreshOrders={refreshOrders}
                    setOrderStatusFilter={setOrderStatusFilter}
                />}

                {isShowing === CookDashboardView.Finish && <FinishOrder
                    setIsShowing={setIsShowing}
                    orderDetails={orderDetails}
                    currentOrder={currentOrder}
                    refreshOrders={refreshOrders}
                    setOrderStatusFilter={setOrderStatusFilter}
                />}
            </div>
            {errorMessage !== "" && <ErrorMessage message={errorMessage} />}
        </div>
    )
}
