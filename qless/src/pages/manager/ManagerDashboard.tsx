import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TruckManagement from "../../components/manager/TruckManagement";
import MenuManagement from '../../components/manager/MenuManagement';
import EmployeeManagement from '../../components/manager/EmployeeManagement';
import ManagerDashboardNav from '../../components/manager/ManagerDashboardNav';
import { getUser } from '../../service/supabaseService';
import type { User } from '../../App';
import '../../styles/manager/managerDashboard.css'



function ManagerDashboard() {
    const navigate = useNavigate();

    const [visibleDashboard, setVisibleDashboard] = useState('trucks');
    const [manager, setManager] = useState<User | null>(null);

    useEffect(() => {
        const fetchManager = async () => {
            const user: User | null = await getUser();
            if(!user || !user.is_manager){
                console.log(user ? `${user.email} authorization denied: non-manager.\nRedirecting to login...`: "No user found. Redirecting to login...");
                navigate('/');
            }
            else{
                    console.log(`${user.email} authorization confirmed: manager.`);
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

