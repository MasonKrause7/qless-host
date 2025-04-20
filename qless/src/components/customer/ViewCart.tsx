import { useCustomerOrder } from "../../hooks/CustomerOrderContext";
import ItemCard from "./ItemCard";
import { formatPhoneNumber } from "../../service/formatter";
import ErrorMessage from "../commonUI/ErrorMessage";
import { CustomerInterfaceView, getOrderCostTotals } from "../../service/customerInterfaceService";
import { useEffect } from "react";

type ViewCartProps = {
    setIsShowing: React.Dispatch<React.SetStateAction<CustomerInterfaceView>>;
}

export default function ViewCart({ setIsShowing }: ViewCartProps) {

    const {
        truck,
        cart,
        order,
        errorMessage
    } = useCustomerOrder();

    const {
        subtotal,
        tax,
        total
    } = getOrderCostTotals();

    useEffect(() => { if (cart.length === 0) setIsShowing(CustomerInterfaceView.Menu) }, [cart]);

    return (
        <div className="orderMenuContainer">
            <div className="cartStickyWrapper">
                <button
                    className="viewCartButton"
                    onClick={() => setIsShowing(CustomerInterfaceView.Menu)}
                    disabled={cart.length === 0}
                >
                    Menu
                </button>
            </div>
            <div className="orderMenuHeader">
                <div className="viewCartInner">
                    <h1>Cart for </h1>
                    <h2>{truck ? truck.truck_name : "Invalid Truck ID"}</h2>
                    <p>Review order details below:</p>
                </div>
            </div>
            <ul className="itemCardContainer">
                {cart.map(item => (
                    <li
                        key={item.product.product_id}
                    >
                        <ItemCard
                            product={item.product}
                            itemQty={item.qty}
                        />
                    </li>
                ))}
            </ul>
            <div className="orderDetailsHeader">
                <div className="viewCartInner">
                    <h2>Order Details:</h2>
                    <p><strong>Phone Number: </strong>{formatPhoneNumber(order.customer_phone_number)}</p>
                    <div className="orderCost">
                        <div className="costRow">
                            <span>Subtotal:</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="costRow">
                            <span>Tax ({(order.tax_rate ?? 0) * 100}%):</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <hr />
                        <div className="costRow totalRow">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                    <SubmitButton setIsShowing={setIsShowing} />
                    {errorMessage !== "" && <ErrorMessage message={errorMessage} />}
                </div>
            </div>
        </div>
    );
}

type SubmitButtonProps = {
    setIsShowing: React.Dispatch<React.SetStateAction<CustomerInterfaceView>>;
}
function SubmitButton({ setIsShowing }: SubmitButtonProps) {

    const {
        submitOrder
    } = useCustomerOrder();

    const handleClick = async () => {
        const orderSubmitSuccesss = await submitOrder();
        if (orderSubmitSuccesss) {
            setIsShowing(CustomerInterfaceView.Confirmation);
        }
    }


    return <button className="submitOrderButton" onClick={handleClick}>Submit Order</button>
}