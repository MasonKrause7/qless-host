import type { Menu, ManagementSubDashProps } from '../../App';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../utils/supabase';

const MenuManagement: React.FC<ManagementSubDashProps> = ({ manager }) => {
    const navigate = useNavigate();
    const [menus, setMenus] = useState<Menu[]>([]);

    useEffect(() => {
        const fetchMenus = async () => {
            if (manager === null) {
                console.log(`Cannot access the Truck Management dashboard without an authenticated manager account.\nReturning to login`);
                navigate('/');
            }
            else{
                const { data: menuData, error: menuError } = await supabase.from('menu').select('*').eq('manager_id', manager.user_id);
                if (menuError) {
                    console.log(`Error fetching menus: ${menuError.code}.`);
                }
                else if (menuData) {
                    const menuList: Menu[] = menuData.map(menu => ({
                        menu_id: menu.menu_id,
                        menu_name: menu.menu_name,
                        manager_id: menu.manager_id
                    }));
                    setMenus(menuList);
                }
                else{
                    console.log('An unexpected error occured while fetching menus...');
                }
            }
        }
        fetchMenus();
    }, []);


    return (
        <div>
            <h1>Manage Menus</h1>
            <ul>
                {menus.map(menu => (
                    <li key={menu.menu_id}>
                        <h3>{menu.menu_name}</h3>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default MenuManagement;