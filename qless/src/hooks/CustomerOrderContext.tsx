import { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CartItem, Menu, Order, Product, Truck } from "../App";
import { getMenuById, getProducts, getTruckById, uploadCart, uploadNewOrder } from "../service/supabaseService";
import { OrderStatus } from "../service/orderStatusService";

//!!!IMPORTANT!!! Tax rate is set staically in this file!!


type CustomerOrderContextType = {
    truck: Truck | null;
    errorMessage: string;
    menu: Menu | null;
    products: Product[];
    cart: CartItem[];
    order: Partial<Order>;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    addPhoneToOrder: (phone: string) => void;
    addItemToCart: (product: Product, qty: number) => void;
    removeItemFromCart: (product: Product, qty: number) => void;
    submitOrder: () => Promise<boolean>;
}

const CustomerOrderContext = createContext<CustomerOrderContextType | undefined>(undefined);

export function CustomerOrderProvider({ children }: { children: React.ReactNode }) {
    const [truck, setTruck] = useState<Truck | null>(null);
    const [menu, setMenu] = useState<Menu | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [order, setOrder] = useState<Partial<Order>>({
        tax_rate: 0.06,
        status_id: OrderStatus.Received,
        subtotal: 0
    });

    const [searchParams] = useSearchParams();

    //on mount
    useEffect(() => {
        setErrorMessage("");
        const truck_id_str = searchParams.get('truckId');

        if (!truck_id_str) {
            setErrorMessage("Invalid truck ID. Please scan a valid QR code.");
            return;
        }

        const truck_id_int = parseInt(truck_id_str, 10);

        if (isNaN(truck_id_int)) {
            setErrorMessage("Invalid truck ID format.");
            return;
        }

        const fetchTruckById = async (truck_id: number) => {
            const potentialTruck = await getTruckById(truck_id);
            if (!potentialTruck) {
                setErrorMessage("Could not find that truck! The QR code may be out of date.");
                return;
            }
            setTruck(potentialTruck);
            setOrder(prev => ({
                ...prev,
                truck_id: potentialTruck.truck_id
            }));
        };

        fetchTruckById(truck_id_int);
    }, [searchParams]);

    //once truck has been found, find menu:
    useEffect(() => {
        const fetchMenu = async () => {
            if (truck) {
                if (truck.menu_id) {
                    const potentialMenu = await getMenuById(truck.menu_id);
                    if (!potentialMenu) {
                        setErrorMessage(`Could not get the menu for ${truck.truck_name}`);
                        return;
                    }
                    setMenu(potentialMenu);
                }
            }
        };
        fetchMenu();
    }, [truck])

    //once menu has been found, find products:
    useEffect(() => {
        const fetchProducts = async () => {
            if (menu) {
                const potentialProducts: Product[] | null = await getProducts(menu.menu_id);
                if (!potentialProducts) {
                    setErrorMessage(`Could not get the products for menu ${menu.menu_id}`);
                    return;
                }
                setProducts(potentialProducts);
            }
        }
        fetchProducts();
    }, [menu])

    const addPhoneToOrder = (phone: string) => {
        setOrder(prev => ({
            ...prev,
            customer_phone_number: phone
        }));
    }

    const addItemToCart = (product: Product, qty: number) => {
        const newItem: CartItem = {
            product: product,
            qty: qty
        };

        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(item => item.product.product_id === product.product_id);

            if (existingItemIndex !== -1) {
                // if item already exists... update quantity
                const updatedCart = [...prevCart];
                updatedCart[existingItemIndex] = {
                    ...updatedCart[existingItemIndex],
                    qty: updatedCart[existingItemIndex].qty + qty
                };
                return updatedCart;
            } else {
                // new item... add to cart
                return [...prevCart, newItem];
            }
        });

        //always update subtotal
        setOrder(prev => ({
            ...prev,
            subtotal: Number(((prev.subtotal ?? 0) + (product.price * qty)).toFixed(2))
        }));
    }

    const removeItemFromCart = (product: Product, qty: number) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.product.product_id === product.product_id);
            if (!existingItem) return prevCart;

            if (existingItem.qty > qty) {
                return prevCart.map(item =>
                    item.product.product_id === product.product_id
                        ? { ...item, qty: item.qty - qty }
                        : item
                );
            } else {
                // remove item if qty reaches 0 or below
                return prevCart.filter(item => item.product.product_id !== product.product_id);
            }
        });

        //update subtotal
        setOrder(prev => ({
            ...prev,
            subtotal: Number(((prev.subtotal ?? 0) - (product.price * qty)).toFixed(2))
        }));
    }

    const submitOrder = async () => {
        setErrorMessage('');
        const submittedOrder = await uploadNewOrder(order);
        if (submittedOrder === undefined) {
            setErrorMessage("Missing order data, could not create new order");
            return false;
        }

        setOrder(prev => ({
            ...prev,
            order_id: submittedOrder.order_id
        }));

        const uploadedCartSuccess = await uploadCart(submittedOrder.order_id, cart);
        if (uploadedCartSuccess) {
            return true;
        }
        else {
            setErrorMessage(errorMessage + "Unable to upload cart");
            return false;
        }
    };

    return (
        <CustomerOrderContext.Provider value={{
            truck,
            errorMessage,
            menu,
            products,
            cart,
            order,
            setErrorMessage,
            addPhoneToOrder,
            addItemToCart,
            removeItemFromCart,
            submitOrder
        }
        }>
            {children}
        </CustomerOrderContext.Provider>
    );
}

export function useCustomerOrder() {
    const context = useContext(CustomerOrderContext)
    if (context === undefined) {
        throw new Error("useCustomerOrder must be used with a CustomerOrderProvider");
    }
    return context;

}