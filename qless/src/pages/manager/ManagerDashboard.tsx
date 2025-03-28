import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TruckManagement from "../../components/manager/TruckManagement";
import MenuManagement from '../../components/manager/MenuManagement';
import EmployeeManagement from '../../components/manager/EmployeeManagement';
import ManagerDashboardNav from '../../components/manager/ManagerDashboardNav';
import {getUserWithManagerAuthorizationCheck} from '../../utils/supabaseService';
import type { User } from '../../App';




function ManagerDashboard() {
    const navigate = useNavigate();

    const [visibleDashboard, setVisibleDashboard] = useState('trucks');
    const [manager, setManager] = useState<User | null>(null);

    useEffect(() => {
        const getManager = async () => {
            const user = await getUserWithManagerAuthorizationCheck();
        }
        getManager();
    }, [navigate]); //on mount, check the user is logged in




    return (
        <div>
            <h1>MANAGER DASHBOARD</h1>
            <ManagerDashboardNav setVisibleDashboard={setVisibleDashboard} />
            {manager!== null && visibleDashboard === 'trucks' && <TruckManagement manager={manager} />}
            {manager !== null && visibleDashboard === 'menus' && <MenuManagement manager={manager} />}
            {manager !== null && visibleDashboard === 'employees' && <EmployeeManagement manager={manager} />}
        </div>
    )
}


export default ManagerDashboard;

