import "../../styles/customer/OrderMenu.css";
import ErrorMessage from "../commonUI/ErrorMessage";
import ItemCard from "./ItemCard";
import { useCustomerOrder } from "../../hooks/CustomerOrderContext";


type OrderMenuProps = {

}

export default function OrderMenu({

}: OrderMenuProps) {

    const {
        menu,
        products,
        errorMessage
    } = useCustomerOrder();


    return (
        <div className="order-menu-container">
            <h1>Order Menu for </h1>
            <h2>{menu === null ? "Invalid Truck ID" : menu.menu_name}</h2>
            <p>Welcome! Choose your food items here.</p>
            {<ErrorMessage message={errorMessage} />}
            <div>
                <ul>
                    {products.map(product => (
                        <li
                            key={product.product_id}
                        >
                            <ItemCard product={product} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>

    );
}


