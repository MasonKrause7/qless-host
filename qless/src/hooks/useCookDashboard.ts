import { useEffect, useState } from "react";
import {
     getTrucks, getEmployeeTruck, getTruckById,
     getOrderDetails,
    getOrdersByManagerId,
    getOrdersByEmployeeId
} from "../service/supabaseService";
import { Order, OrderDetail, Truck, User } from "../App";
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
        if (user){
            fetchOrders(user);
        }
    }, [user]);


    //pull orders from the database and store in "orders" state
    const fetchOrders = async (loggedUser: User) => {
        let orderList: Order[] = []
        setErrorMessage("");


        /* Right here we just need to run a more specific query, 
            preferably through a function like getOrdersByUserId,
            or even more specific if we want getOrdersByEmployeeId and getOrdersByManagerId, depending on the user type.
            
            The reason is, RLS checks every row for authorization, which is much slower than a targeted query which can be optimized.
            Also, if they are employee, we need to go through truck_assignments to get the truck_id for orders
                    if they are manager, we need to go through trucks to get the truck_ids for orders.
        */
        let potentialOrderList: Order[] | null;
        
        if (loggedUser.is_manager){
            potentialOrderList = await getOrdersByManagerId(loggedUser.user_id);
        }
        else{
            potentialOrderList = await getOrdersByEmployeeId(loggedUser.user_id);
        }
        
        if (!potentialOrderList) {
            console.log("Error fetching orders");
            setErrorMessage("There was an error fetching your orders.");
        }
        else if(potentialOrderList.length === 0){
            console.log("Order list is empty: ", potentialOrderList);
            setErrorMessage("You don't have any past orders...")
        }
        else {
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