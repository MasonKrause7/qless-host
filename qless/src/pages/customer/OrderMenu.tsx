import "../../styles/customer/OrderMenu.css";
import type { Menu, Product } from '../../App';


type OrderMenuProps = {
    menu: Menu,
    products: Product[]
}

const OrderMenu: React.FC<OrderMenuProps> = ({ menu, products }) => {
    
    
    return (
        <div>
            <h1>Order Menu for </h1>
            <h2>{menu.menu_name}</h2>
            <p>Welcome! Choose your food items here.</p>
            <div className="order-menu-container">
                <ul>
                    {products.map(product => (
                        <li 
                            key={product.product_id}
                        >
                            <p>{product.product_name}</p>
                            <p>{product.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        
    );
}

export default OrderMenu;
