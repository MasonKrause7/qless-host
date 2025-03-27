import { Order } from "../../pages/kitchen/CookDashboard";
import "../../styles/kitchen/cookDashboard.css";
import supabase from "../../utils/supabase";
import { useEffect, useState } from "react";

type OrderDetail = {
    order_product_id: number,
    qty: number,
    product: Product
}

type Product = {
    product_name: string,
    price: number,
    image_path: string
}

export default function ViewOrderDetails({ order, setIsShowing: setIsShowing }:
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
                    )`).eq('order_id', order.order_id);
                if (data) {
                    let orderDetailList: OrderDetail[] = data.map(detail => ({
                        order_product_id: detail.order_product_id,
                        qty: detail.qty,
                        product: Array.isArray(detail.product) ? detail.product[0] : detail.product
                    }));
                    setOrderDetails(orderDetailList);
                    console.log("successfully pulled details");//debug
                    console.log("data",data);//debug
                }
                else console.log("Failed to fetch details");
            }
            catch (err) {
                console.log("Unable to complete fetch orders process...", err);
            }
        }
        fetchDetails();
    }, []);

    const listDetails = orderDetails.map(detail =>
    
        <li className="listItem" key={detail.order_product_id}>
            <div className="detailInfo">
                <div className="detailImg">
                    <img src={detail.product.image_path.includes("/image/path") ?"/src/tempimg/img.jpg":detail.product.image_path} alt="Product Image" />
                </div>
                <div className="details">
                    <ol>
                        <li>{detail.product.product_name}</li>
                        <li>Quantity: {detail.qty}</li>
                    </ol>
                </div>
                <div className="price">${(detail.product.price * detail.qty)}</div>
            </div>
            <button>Delete</button>
        </li>
        
    );

    console.log("orderDetails",orderDetails);//debug

    return <ol>{listDetails}</ol>;
}

