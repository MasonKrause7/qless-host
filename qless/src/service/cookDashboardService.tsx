import { OrderDetail, Order } from "../App";
import { OrderStatus } from "./orderStatusService";

export const getListDetails = (orderDetails: OrderDetail[], hidePrice: boolean) => {
    return orderDetails.map(detail =>

        <li className="listItem" key={detail.order_product_id}>
            <div className="detailInfo">
                <div className="detailImg">
                    <img src={detail.product.image_path.includes("/image/path") ? "/src/defaultImgs/noimg.png" : detail.product.image_path} alt="Product Image" />
                </div>
                <div className="details">
                    <ol>
                        <li>{detail.product.product_name}</li>
                        <li>Quantity: {detail.qty}</li>
                    </ol>
                </div>
                {!hidePrice && (
                    <div className="price">
                        ${detail.product.price * detail.qty}
                    </div>
                )}
            </div>
        </li>

    );
}

export function lastUpdateTime(order: Order): string {
    let time = null;
    switch (order.status_id) {
        case OrderStatus.Received:
            time = new Date(order.time_received);
            break;
        case OrderStatus.BeingCooked:
            if (order.time_being_cooked)
                time = new Date(order.time_being_cooked);
            break;
        case OrderStatus.Ready:
            if (order.time_ready)
                time = new Date(order.time_ready);
            break;
        case OrderStatus.PickedUp:
            if (order.time_picked_up)
                time = new Date(order.time_picked_up);
            break;
    }
    return time ? time.toLocaleTimeString() : "Error: No Time";
}

export enum CookDashboardView {
    List = "list",
    Details = "details",
    Finish = "finish"
}