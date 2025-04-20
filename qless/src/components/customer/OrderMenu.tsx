import ItemCard from "./ItemCard";
import { useCustomerOrder } from "../../hooks/CustomerOrderContext";
import { CustomerInterfaceView } from "../../service/customerInterfaceService";


type OrderMenuProps = {
    setIsShowing: React.Dispatch<React.SetStateAction<CustomerInterfaceView>>;
}

export default function OrderMenu({
    setIsShowing
}: OrderMenuProps) {

    const {
        truck,
        products,
        cart
    } = useCustomerOrder();


    return (
        <div className="orderMenuContainer">
            <div className="cartStickyWrapper">
                <button
                    className="viewCartButton"
                    onClick={() => setIsShowing(CustomerInterfaceView.Cart)}
                    disabled={cart.length === 0}
                >
                    Cart
                </button>
            </div>

            <div className="orderMenuHeader">
                <div className="orderMenuHeaderInner">
                    <h1>Menu for </h1>
                    <h2>{truck ? truck.truck_name : "Invalid Truck ID"}</h2>
                    <p>Welcome! Choose your food items below:</p>
                </div>
            </div>

            <ul className="itemCardContainer">
                {products.map((product) => (
                    <li key={product.product_id}>
                        <ItemCard
                            product={product}
                            itemQty={
                                cart.find((item) => item.product.product_id === product.product_id)?.qty
                            }
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}


