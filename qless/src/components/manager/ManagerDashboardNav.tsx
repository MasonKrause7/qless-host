import { useState, useEffect } from 'react';
import '../../styles/manager/managerDashboard.css';
import type { User } from '../login-signup/LoginForm';
import { useNavigate, useLocation } from 'react-router-dom';



type ManagerDashboardNavProps = {
    setVisibleMenu: React.Dispatch<React.SetStateAction<string>>;
}

const ManagerDashboardNav: React.FC<ManagerDashboardNavProps> = ({ setVisibleMenu }) => {
    const [selectedOption, setSelectedOption] = useState('trucks');
    
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const checkUserRole = () => {
            const user: User = location.state?.loggedUser;

            console.log(`user = ${user}`)
            if(user === undefined || user === null){
                navigate('/');
                return;
            }
            if (!user.is_manager){
                navigate('/');
                return;
            }
        };
        checkUserRole();
    }, []);
    

    const handleChange = (newOption: string) => {
        setSelectedOption(newOption);
        setVisibleMenu(newOption);
    }

    return (
        
        <div className='managerDashboardNavContainer'>
            <nav className='managerDashboardNav'>
                <ul>
                    <li>
                        <button style={selectedOption === 'trucks' ? {backgroundColor: 'yellow'} : {backgroundColor: 'white'}}
                                onClick={() => handleChange('trucks')}>
                            Trucks
                        </button>
                    </li>
                    <li>
                        <button style={selectedOption === 'menus' ? {backgroundColor: 'yellow'} : {backgroundColor: 'white'}}
                                onClick={() => handleChange('menus')}>
                            Menus
                        </button>
                    </li>
                    <li>
                        <button style={selectedOption === 'employees' ? {backgroundColor: 'yellow'} : {backgroundColor: 'white'}}
                                onClick={() => handleChange('employees')}>
                            Employees
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
        
    )
}


export default ManagerDashboardNav;