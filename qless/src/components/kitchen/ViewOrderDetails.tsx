import { Order } from "../../pages/kitchen/CookDashboard";
import "../../styles/kitchen/cookDashboard.css";
import supabase from "../../utils/supabase";
import { useEffect } from "react";

type OrderDetail={

}

export default function ViewOrderDetails({ order }: { order: Order | undefined }) {
    if (order === undefined) {
        console.log("Invalid order");
        return;
    }
    //pull order details from db
    useEffect(() => {
        const fetchDetails = async () =>{
            try{
                const {data} = await supabase.from('').select(`
                    *,
                    product(*)
                    `).eq('order_prodcut.order_id',order.order_id);
                if(data){
                    
                }
            }
            catch{

            }
        }
    },[]);
    return (<p></p>);
}