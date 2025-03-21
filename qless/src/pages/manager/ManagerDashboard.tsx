import { useState } from 'react';
import TruckManagement from "../../components/manager/TruckManagement";
import MenuManagement from '../../components/manager/MenuManagement';
import EmployeeManagement from '../../components/manager/EmployeeManagement';
import ManagerDashboardNav from '../../components/manager/ManagerDashboardNav';




function ManagerDashboard() {
    const [visibleMenu, setVisibleMenu] = useState('trucks');

    return (
        <div>
            <h1>MANAGER DASHBOARD</h1>
            <ManagerDashboardNav setVisibleMenu={setVisibleMenu} />
            {visibleMenu === 'trucks' && <TruckManagement />}
            {visibleMenu === 'menus' && <MenuManagement />}
            {visibleMenu === 'employees' && <EmployeeManagement />}


        </div>
    )
}


export default ManagerDashboard;

