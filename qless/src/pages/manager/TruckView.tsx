import {useNavigate, useLocation} from 'react-router-dom';
import { useEffect, useState } from 'react';
import {Truck, Menu, User} from '../../App';
import { getUser, getMenus, getMenuById, updateTruckMenu } from '../../service/supabaseService';
import '../../styles/manager/truckView.css'
import ErrorMessage from '../../components/commonUI/ErrorMessage';


const TruckView: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [truck, setTruck] = useState<Truck | null>(null);
    const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);
    const [menus, setMenus] = useState<Menu[] | null>(null);
    const [currentMenu, setCurrentMenu] = useState<Menu | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [manager, setManager] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    useEffect(() => {
        const checkUserAuthentication = async () => {
            const user: User | null = await getUser();
            if (!user){
                console.log("Unauthenticated user attempted to access Truck View");
                navigate("/");
            }
            setManager(user);
            
        }
        checkUserAuthentication();
    }, [navigate]);

    useEffect(() => {
        const fetchMenus = async () => {
            setErrorMessage("");
            if(!manager){
                return;
            }
            const menuList: Menu[] | null = await getMenus(manager.user_id);
            if (!menuList){
                setErrorMessage("Unable to fetch truck list... wait a few moments and then try refreshing.");
            }
            else{
                setMenus(menuList);
            }
        }
        fetchMenus();
    }, [manager]);

    useEffect(() => {
        const getTruckWithMenu = async () => {
            if (!location.state || !location.state.truck){
                navigate("/manage");
            }
            else{
                const currTruck: Truck = location.state.truck;
                setTruck(currTruck);
                if (!currTruck.menu_id){
                    return;
                }
                const currMenu: Menu | null = await getMenuById(currTruck.menu_id);
                setCurrentMenu(currMenu);
            }
        }
        getTruckWithMenu();
    }, [location, navigate]);

    const handleMenuChange = async () => {
        if (!truck) return;

        setIsLoading(true);
        setErrorMessage("");

        try {
            // Update truck with new menu ID in database
            const updatedTruck = await updateTruckMenu(truck.truck_id, selectedMenuId);
            
            if (!updatedTruck) {
                setErrorMessage("Failed to update menu. Please try again.");
                return;
            }

            // Update local truck data
            setTruck(updatedTruck);
            
            // Update current menu display
            if (selectedMenuId === null) {
                setCurrentMenu(null);
            } else {
                const newMenu = await getMenuById(selectedMenuId);
                setCurrentMenu(newMenu);
            }
            
        } catch (error) {
            console.error("Error updating menu:", error);
            setErrorMessage("An error occurred while updating the menu. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className='truckViewContainer'>
                {truck && (<>
                    <img className='truckViewImage' src={truck.image_path} alt="" />
                    <h3>{truck.truck_name}</h3>
                    <p>Current Menu: {currentMenu ? currentMenu.menu_name : "No menu assigned"}</p>
                    <div className='selectorInputGroup'>

                        <label htmlFor="updatedMenuSelect">Update Menu</label>
                        <select 
                            id="updatedMenuSelect" 
                            className='selectorUpdatedMenu' 
                            value={selectedMenuId ?? ""} 
                            onChange={(e) => setSelectedMenuId(e.target.value ? Number(e.target.value) : null)}
                        >
                            <option value="">No Menu</option> {/* Option for null */}
                            {menus?.map((menu) => (
                                <option key={menu.menu_id} value={menu.menu_id}>
                                    {menu.menu_name}
                                </option>
                            ))}
                        </select>
                        <button 
                            onClick={handleMenuChange} 
                            disabled={isLoading}
                        >
                            {isLoading ? "Updating..." : "Change Menu"}
                        </button>
                    </div>
                    
                 </>)}
                 { errorMessage !== "" && <ErrorMessage message={errorMessage}/> }
            </div>
        </>
    )
};
export default TruckView;