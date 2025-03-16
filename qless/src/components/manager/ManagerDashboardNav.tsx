import { useState } from 'react';
import '../../styles/manager/managerDashboard.css';


type ManagerDashboardNavProps = {
    setVisibleMenu: React.Dispatch<React.SetStateAction<string>>;
}

const ManagerDashboardNav: React.FC<ManagerDashboardNavProps> = ({ setVisibleMenu }) => {
    const [selectedOption, setSelectedOption] = useState('trucks');

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