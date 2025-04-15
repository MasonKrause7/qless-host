import type { Menu, ManagementSubDashProps } from '../../App';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuCard from './MenuCard';
import '../../styles/manager/menuManagement.css'
import '../../styles/manager/managerDashboard.css'
import { getMenus } from '../../service/supabaseService';
import ErrorMessage from '../commonUI/ErrorMessage';

const MenuManagement: React.FC<ManagementSubDashProps> = ({ manager }) => {
    const navigate = useNavigate();

    const [menus, setMenus] = useState<Menu[]>([]);
    const [creatingMenu, setCreatingMenu] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const fetchMenus = async () => {
            const potentialMenus: Menu[] | null = await getMenus(manager.user_id);
            if (!potentialMenus){
                console.log("Could not get menus in menuManagement dashboard");
                setErrorMessage("Unable to pull your menus...");
                return;
            }
            const actualMenus: Menu[] = potentialMenus;
            setMenus(actualMenus);
        }
        fetchMenus();
    }, [manager, navigate]);

    const createMenu = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); 
        //implement CREATE MENU!!

      };


    return (
        <div>
            <h2 className='pageTitle'>Manage Menus</h2>
            {!creatingMenu && <div className='managementContainer'>
                <div className='managementItemList'>
                    <ul className='menuCards'>
                        {menus && menus.map(menu => (
                            <li key={menu.menu_id}>
                                <MenuCard menu={menu} />
                            </li> 
                        ))}
                        <li className='lastMenuCard'>
                            <button className='addMenuButton'
                                    onClick={() => setCreatingMenu(true)}
                            >
                                Add Menu
                            </button>
                        </li>
                    </ul>
                </div>
            </div>}

            {creatingMenu && <div>
                <form onSubmit={(event) => createMenu(event)}
                      className='createForm'
                >
                    <div className='createFormInputGroup'>
                        <label htmlFor="newMenuName">Menu Name</label>
                        <input className='createFormInput' name='newMenuName' type="text" />
                    </div>

                    
                    <div className='addProductToMenuContainer'>
                        <h5>Create Product</h5>
                        <form className='createProductForm'></form>

                        <h5>Add Existing Product</h5>
                        <ul>
                            {/* map existing products */}
                        </ul>

                    </div>
                    <button type='submit'>Submit</button>
                    <button onClick={() => setCreatingMenu(false)}>Cancel</button>
                </form>    
            </div>}
        
            {errorMessage && <ErrorMessage message={errorMessage} />}
        </div>
    )
}

export default MenuManagement;