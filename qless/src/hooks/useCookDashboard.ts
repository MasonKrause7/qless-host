import { useEffect, useState } from "react";
import {
     getTrucks, getEmployeeTruck, getTruckById,
    getOrders, getOrderDetails
} from "../service/supabaseService";
import { Order, OrderDetail, Truck } from "../App";
import { OrderStatus } from "../service/orderStatusService";
import { CookDashboardView } from "../service/cookDashboardService";
import { useUser } from "./UserContext";

export function useCookDashboard(isShowing: CookDashboardView) {
    const [orderNum, setOrderNum] = useState<number>(0);
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
    const [currentOrder, setCurrentOrder] = useState<Order>();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [orderStatusFilter, setOrderStatusFilter] = useState(OrderStatus.Ready);
    const [trucks, setTrucks] = useState<Truck[]>([]);
    const [selectedTruckId, setSelectedTruckId] = useState<number | 'all' | null>(null);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

    const {user} = useUser();


    //on mount
    useEffect(() => {

        fetchOrders();

    }, []);


    //pull orders from the database and store in "orders" state
    const fetchOrders = async () => {
        let orderList: Order[] = []
        setErrorMessage("");
        const potentialOrderList: Order[] | null = await getOrders();
        if (!potentialOrderList) {
            console.log("Error fetching orders");
            setErrorMessage("There was an error fetching your orders.");
        } else {
            orderList = potentialOrderList;
            setOrders(orderList);
            if (!orderList.find(o => o.order_id === orderNum)) {
                setOrderNum(orderList[0].order_id);
            }
        }
    }

    //get the users trucks when the user changes
    useEffect(() => {
        const fetchTrucks = async () => {
            if (!user) {
                return;
            }

            if (user.is_manager) {
                const truckList = await getTrucks(user.user_id);
                if (truckList) {
                    truckList.sort((a, b) => a.truck_name.localeCompare(b.truck_name));
                    setTrucks(truckList);
                }
            } else {//if they are not a manager, find their truck
                const truckNum = await getEmployeeTruck(user.user_id);
                if (truckNum && user.is_manager) {
                    const userTruck = await getTruckById(truckNum);
                    if (userTruck) {
                        const truckArray: Truck[] = [userTruck];
                        setTrucks(truckArray);
                    }
                }
            }
        }
        fetchTrucks();
    }, [user]);

    //pull order details from db whenever order num changes
    useEffect(() => {
        const fetchOrderDetails = async () => {
            
            const currOrder = await getOrderDetails(orderNum);
            if (currOrder) {
                setOrderDetails(currOrder);
            }
        }
        fetchOrderDetails();
        setCurrentOrder(orders.find(i => i.order_id === orderNum) ?? undefined);
    }, [orderNum, orders, isShowing]);



    //filters the orders
    useEffect(() => {
        const filtered = orders.filter(order =>
            order.status_id <= orderStatusFilter &&
            (selectedTruckId === 'all' || selectedTruckId === null || order.truck_id === selectedTruckId)
        );

        setFilteredOrders(filtered);

        //pick valid order num based on filter
        if (filtered.length > 0) {
            const stillValid = filtered.find(order => order.order_id === orderNum);
            if (!stillValid) {
                setOrderNum(filtered[0].order_id);
            }
        } else {
            setOrderDetails([]);
        }

    }, [orders, orderStatusFilter, selectedTruckId, orderNum]);

    return {
        orders,
        filteredOrders,
        setOrderNum,
        currentOrder,
        orderDetails,
        orderStatusFilter,
        setOrderStatusFilter,
        trucks,
        selectedTruckId,
        setSelectedTruckId,
        errorMessage,
        refreshOrders: fetchOrders
    };
}