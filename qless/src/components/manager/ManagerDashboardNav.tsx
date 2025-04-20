import { useState, useEffect } from 'react';
import '../../styles/manager/managerDashboard.css';

type ManagerDashboardNavProps = {
    setVisibleDashboard: React.Dispatch<React.SetStateAction<string>>;
}

const ManagerDashboardNav: React.FC<ManagerDashboardNavProps> = ({ setVisibleDashboard }) => {
    const [selectedOption, setSelectedOption] = useState('trucks');

    useEffect(() => {
        setVisibleDashboard(selectedOption);
    }, [selectedOption])

    const handleOptionChange = (newOption: string) => {
        setSelectedOption(newOption);
    }

    return (
        <div className='managerDashboardNavContainer'>
            <h1 className='pageTitle'>Manager Dashboard</h1>
            <nav className='managerDashboardNav'>
                <ul>
                    <li>
                        <button 
                            className={selectedOption === 'trucks' ? 'managerDashboardNavButtonSelected' : 'managerDashboardNavButton'}
                            onClick={() => handleOptionChange('trucks')}
                        >
                            Trucks
                        </button>
                    </li>
                    <li>
                        <button 
                            className={selectedOption === 'menus' ? 'managerDashboardNavButtonSelected' : 'managerDashboardNavButton'}
                            onClick={() => handleOptionChange('menus')}
                        >
                            Menus
                        </button>
                    </li>
                    <li>
                        <button 
                            className={selectedOption === 'employees' ? 'managerDashboardNavButtonSelected' : 'managerDashboardNavButton'}
                            onClick={() => handleOptionChange('employees')}
                        >
                            Employees
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default ManagerDashboardNav;