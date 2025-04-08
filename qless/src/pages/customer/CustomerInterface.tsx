import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getTruckById, getMenuById, getProducts } from '../../service/supabaseService';
import ErrorMessage from '../../components/commonUI/ErrorMessage';
import OrderMenu from './OrderMenu';
import { Truck, Menu, Product } from '../../App';
import "../../styles/customer/CustomerInterface.css";
function CustomerInterface() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const [truck, setTruck] = useState<Truck | null>(null);
    const [menu, setMenu] = useState<Menu | null>(null);
    const [products, setProducts] = useState<Product[] | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    
    
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
        };
    
        fetchTruckById(truck_id_int);
    }, [searchParams]);

    useEffect(() => {
        const fetchMenu = async () => {
            if (truck){
                if (truck.menu_id){
                    const potentialMenu = await getMenuById(truck.menu_id);
                    if (!potentialMenu){
                        setErrorMessage(`Could not get the menu for ${truck.truck_name}`);
                        return;
                    }
                    setMenu(potentialMenu);
                }
            }
        };
        fetchMenu();
    }, [truck])

    useEffect(() => {
        const fetchProducts = async () => {
            if(menu){
                const potentialProducts: Product[] | null = await getProducts(menu.menu_id);  
                if(!potentialProducts){
                    setErrorMessage(`Could not get the products for menu ${menu.menu_id}`);
                    return;
                }
                setProducts(potentialProducts);
            }
        }
        fetchProducts();
    }, [menu])
    


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(event.target.value);
    };

    const handleSubmit = () => {
        const cleanedNumber = phoneNumber.replace(/\D/g, '');
        if (cleanedNumber.length === 10) {
            navigate('/order-menu',{ state:{cleanedNumber:cleanedNumber}});
        } else {
            alert("Please enter a valid 10-digit phone number.");
        }
    };

    return (
        <div>
            {truck && <p>Welcome to {truck.truck_name}! Enter phone number to order:</p>}
            <input 
                type="tel"
                value={phoneNumber}
                onChange={handleChange}
                placeholder="123-456-7890"
                maxLength={12}
            />
            <button onClick={handleSubmit}>Submit</button>
            {errorMessage !== "" && <ErrorMessage message={errorMessage}/>}
            {truck && <img className='truckImgCustInterface' src={truck.image_path}></img>}
            {menu && products && <OrderMenu menu={menu} products={products} />}

        </div>
    );
}

export default CustomerInterface;
