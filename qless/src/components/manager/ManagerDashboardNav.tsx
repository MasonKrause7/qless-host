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
            <nav className='managerDashboardNav'>
                <ul>
                    <li>
                        <button style={selectedOption === 'trucks' ? {backgroundColor: 'yellow'} : {backgroundColor: 'white'}}
                                onClick={() => handleOptionChange('trucks')}>
                            Trucks
                        </button>
                    </li>
                    <li>
                        <button style={selectedOption === 'menus' ? {backgroundColor: 'yellow'} : {backgroundColor: 'white'}}
                                onClick={() => handleOptionChange('menus')}>
                            Menus
                        </button>
                    </li>
                    <li>
                        <button style={selectedOption === 'employees' ? {backgroundColor: 'yellow'} : {backgroundColor: 'white'}}
                                onClick={() => handleOptionChange('employees')}>
                            Employees
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
        
    )
}


export default ManagerDashboardNav;