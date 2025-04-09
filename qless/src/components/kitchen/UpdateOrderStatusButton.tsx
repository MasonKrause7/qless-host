import { useEffect, useState } from "react";
import { OrderStatus } from "../../service/orderStatusService";
import { Order } from "../../App";
import { updateOrderStatus } from "../../service/supabaseService";
import { CookDashboardView } from "../../service/cookDashboardService";

type UpdateOrderStatusButtonProps = {
    className: string;
    currentOrder: Order;
    refreshOrders: () => Promise<void>;
    setIsShowing: React.Dispatch<React.SetStateAction<CookDashboardView>>;
    setOrderNum: React.Dispatch<React.SetStateAction<number>>;
}

export function UpdateOrderStatusButton({
    className,
    currentOrder,
    refreshOrders,
    setIsShowing,
    setOrderNum
}: UpdateOrderStatusButtonProps) {

    const [currentStatus, setCurrentStatus] = useState<OrderStatus>(OrderStatus.Received);
    const isButtonDisabled: boolean = currentStatus >= OrderStatus.PickedUp;

    //when the current order updates, change the current status to reflect new order
    useEffect(() => {
        setCurrentStatus(currentOrder.status_id);
    }, [currentOrder]);

    //handle click
    const click = async () => {
        const newStatus = getNextStatus(currentStatus);
        if (!newStatus) return;

        //if status is Ready, switch view to FinishOrder
        if (currentStatus === OrderStatus.Ready) {
            setOrderNum(currentOrder.order_id);
            setIsShowing(CookDashboardView.Finish);
            return;
        }

        //otherwise, update
        const updateData: Partial<Order> = { status_id: newStatus };
        if (newStatus === OrderStatus.BeingCooked)
            updateData.time_being_cooked = new Date();
        else if (newStatus === OrderStatus.Ready)
            updateData.time_ready = new Date();
        
        const didOrderUpdate = await updateOrderStatus(currentOrder.order_id, updateData);

        if(didOrderUpdate) await refreshOrders();
    }

    return <button
        onClick={click}
        className={className}
        disabled={isButtonDisabled}
    >
        {getStatusText(currentStatus)}
    </button>
}

const getStatusText = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.Received: return "Start Cooking";
        case OrderStatus.BeingCooked: return "Mark as Ready";
        case OrderStatus.Ready: return "Finish Order";
        case OrderStatus.PickedUp: return "Order Completed";
        default: return "Invalid Status";
    }
};

const getNextStatus = (status: OrderStatus): OrderStatus | null => {
    switch (status) {
        case OrderStatus.Received: return OrderStatus.BeingCooked;
        case OrderStatus.BeingCooked: return OrderStatus.Ready;
        case OrderStatus.Ready: return OrderStatus.PickedUp;
        case OrderStatus.PickedUp: return null; // no further status
        default: return null;
    }
};