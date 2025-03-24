import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TruckManagement from "../../components/manager/TruckManagement";
import MenuManagement from '../../components/manager/MenuManagement';
import EmployeeManagement from '../../components/manager/EmployeeManagement';
import ManagerDashboardNav from '../../components/manager/ManagerDashboardNav';
import supabase from '../../utils/supabase';
import type { User } from '../../App';




function ManagerDashboard() {
    const navigate = useNavigate();

    const [visibleDashboard, setVisibleDashboard] = useState('trucks');
    const [manager, setManager] = useState<User | null>(null);

    useEffect(() => {
        const verifyManagerAuthorization = async () => {
            const { data: authUser, error: authUserError } = await supabase.auth.getUser();
            if (authUserError) {
                console.log(`Error fetching the authenticated user: ${authUserError}\nReturning to landing page`);
                navigate("/");
            }
            else if (authUser){
                console.log('User authentication confirmed.');
                const { data: userData, error: userError } = await supabase.from('user').select('*').eq("user_id", authUser.user.id);
                if (userError) {
                    console.log(`Error fetching the user: ${userData}`);
                    navigate("/");
                }
                else if (userData && userData.length > 0) {
                    console.log('User found successfully.');
                    const user: User = userData[0] as User;
                    if (user.is_manager){
                        console.log(`${user.email} authorization confirmed: manager.`);
                        console.log('Granting access to management dashboard');
                        setManager(user); 
                    }
                    else {
                        console.log(`${user.email} authorization denied: non-manager.\nRedirecting to login...`);
                        navigate('/');
                    }
                }
                else {
                    console.log(`An unexpected error occured trying to fetch the user.`);
                    navigate('/');
                }
            }
            else {
                console.log('An unexpected error occured while trying to fetch the authenticated user.');
                navigate('/');
            }
        };
        verifyManagerAuthorization();
    }, []); //on mount, check the user is logged in




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

