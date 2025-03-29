import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TruckManagement from "../../components/manager/TruckManagement";
import MenuManagement from '../../components/manager/MenuManagement';
import EmployeeManagement from '../../components/manager/EmployeeManagement';
import ManagerDashboardNav from '../../components/manager/ManagerDashboardNav';
import { getManager } from '../../utils/supabaseService';
import type { User } from '../../App';



function ManagerDashboard() {
    const navigate = useNavigate();

    const [visibleDashboard, setVisibleDashboard] = useState('trucks');
    const [manager, setManager] = useState<User | null>(null);

    useEffect(() => {
        const fetchManager = async () => {
            const user: User | null = await getManager();
            if(!user){
                navigate('/');
            }
            else{
                setManager(user);
            }
        }
        fetchManager();
    }, [navigate]); //on mount, check the user is logged in

    return (
        <div>
            
            <ManagerDashboardNav setVisibleDashboard={setVisibleDashboard} />
            {manager && <h1 className='welcomeMessage'>Welcome to your dashboard, <strong className='strong'>{manager.first_name}</strong></h1>}
            {manager!== null && visibleDashboard === 'trucks' && <TruckManagement manager={manager} />}
            {manager !== null && visibleDashboard === 'menus' && <MenuManagement manager={manager} />}
            {manager !== null && visibleDashboard === 'employees' && <EmployeeManagement manager={manager} />}

        </div>
    )
}

export default ManagerDashboard;

