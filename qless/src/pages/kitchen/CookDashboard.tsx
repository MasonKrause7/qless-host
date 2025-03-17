import ListOrders from '../../components/kitchen/ListOrders';
import '../../styles/kitchen/cookDashboard.css';
import { useState, useEffect } from 'react';
import supabase from '../../utils/supabase';


/*Order Status:
    1: Recieved
    2: Being Cooked
    3: Ready
    4: Picked Up
*/

export default function CookDashboard() {
    const [isShowing, setIsShowing] = useState("list");
    const [orderNum, setOrderNum] = useState(0);
    const [orders, setOrders] = useState<Orders[]>([]);
    const [truck, setTruck] = useState<String | undefined>("");

    //get current user
    useEffect(() => {
        const fetchTruck = async () =>{
            let userID: string | undefined="";
            try{
                //pull user id from supabase
                const {data} = await supabase.auth.getUser();
                userID =  data.user?.id;
                if(userID === undefined)
                    throw new Error("user ID undefined");
            }
            catch(err){
                console.log("Unable to complete fetch user process...",err);
            }
        }
    }, []);
    console.log(supabase.auth.getUser());

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await supabase.from('orders').select();
                if (data) {
                    let orderList: Orders[] = data.map(order => ({
                        order_id: order.order_id,
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
                    orderList=orderList.filter(order => {});
                    setOrders(orderList);
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


    return (
        <div className="pageContainer">
            <div className='cookDashContainer'>
                <div className="cookDashLeft">
                    {isShowing === "list" && <ListOrders setIsShowing={setIsShowing} setOrderNum={setOrderNum} orders={orders} orderType={3} />}
                    {isShowing === "details" && <DetailsButton setIsShowing={setIsShowing} orderNum={orderNum} />}
                </div>
                <div className="cookDashRight">
                    <p>Just For Testing</p>
                </div>
                {isShowing === "finish" && <FinishButton setIsShowing={setIsShowing} orderNum={orderNum} />}
            </div>
        </div>
    )
}

export type Orders = {
    order_id:number,
    subtotal: number,
    tax_rate: number,
    customer_phone_number: string,
    time_received: Date,
    time_being_cooked: Date | null,
    time_ready: Date | null,
    time_picked_up: Date | null,
    status_id: number,
    truck_id: number
}

type User = {
    id: string
}

//converts an order status number to its coresponding string
export function getOrderStatus(id: number) {
    let status = "";
    switch (id) {
        case 1:
            status = "Recieved"
            break;
        case 2:
            status = "Being Cooked"
            break;
        case 3:
            status = "Ready"
            break;
        case 4:
            status = "Picked Up"
            break;
    }
    return status;
}

function DetailsButton({ setIsShowing, orderNum }:
    { setIsShowing: React.Dispatch<React.SetStateAction<string>>; orderNum: number }) {
    return (
        <>
            <h1>Details for: {orderNum}</h1>
            <button onClick={() => setIsShowing("list")}>Back</button>
        </>
    );
}

function FinishButton({ setIsShowing, orderNum }:
    { setIsShowing: React.Dispatch<React.SetStateAction<string>>; orderNum: number }) {
    return (
        <>
            <h1>Finish for: {orderNum}</h1>
            <button onClick={() => setIsShowing("list")}>Back</button>
        </>
    );
}

