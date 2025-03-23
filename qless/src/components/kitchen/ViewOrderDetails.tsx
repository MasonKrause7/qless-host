import { Order } from "../../pages/kitchen/CookDashboard";
import "../../styles/kitchen/cookDashboard.css";
import supabase from "../../utils/supabase";
import { useEffect, useState } from "react";

type OrderDetail = {
    order_product_id : number,
    qty: number,
    product: Product[]
}    

type Product= {
    product_name:string,
    price: number,
    image_path: string

}

export default function ViewOrderDetails({ order, setIsShowing : setIsShowing}:
    {
        order: Order | undefined;
        setIsShowing: React.Dispatch<React.SetStateAction<string>>;
    }) {
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);

    if (order === undefined) {
        console.log("Invalid order");
        setIsShowing("list");
        return;
    }

    //pull order details from db
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const { data } = await supabase.from('order_product').select(`
                    order_product_id,
                    qty,
                    product(
                        product_name,
                        price,
                        image_path
                    )`).eq('order_id',order.order_id);
                if (data) {
                    let orderDetailList: OrderDetail[] = data.map(detail => ({
                        order_product_id: detail.order_product_id,
                        qty: detail.qty,
                        product: detail.product.map(productDetail => ({
                            product_name: productDetail.product_name,
                            price: productDetail.price,
                            image_path: productDetail.image_path
                        }))
                    }));
                    setOrderDetails(orderDetailList);
                }
                else console.log("Failed to fetch details");
            }
            catch (err){
                console.log("Unable to complete fetch orders process...", err);
            }
        }
        fetchDetails();
    }, []);
    return (<p></p>);
}