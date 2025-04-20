import type { Employee, ManagementSubDashProps } from '../../App';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEmployees } from '../../service/employeeCreationService';
import CreateEmployeeForm from './CreateEmployeeForm';
import '../../styles/manager/employeeManagement.css';

const EmployeeManagement: React.FC<ManagementSubDashProps> = ({ manager }) => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchEmployees = async () => {
        setIsLoading(true);
        if (manager === null) {
            console.log('Cannot access the Employee Management dashboard without an authenticated manager account.\nReturning to login');
            navigate('/');
        }
        else {
            const employeeList = await getAllEmployees(manager.user_id);
            if (employeeList) {
                setEmployees(employeeList);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchEmployees();
    }, [manager, navigate]);

    const handleEmployeeCreated = () => {
        // Refresh the employee list
        fetchEmployees();
        // Hide the form
        setShowAddForm(false);
    };

    return (
        <div className="employeeManagementContainer">
            <div className="employeeManagementHeader">
                <h2 className="pageTitle">Employee Management</h2>
                {!showAddForm && (
                    <button 
                        className="addEmployeeButton" 
                        onClick={() => setShowAddForm(true)}
                    >
                        + Add New Employee
                    </button>
                )}
            </div>

            {showAddForm ? (
                <CreateEmployeeForm 
                    manager={manager} 
                    onEmployeeCreated={handleEmployeeCreated}
                    onCancel={() => setShowAddForm(false)}
                />
            ) : isLoading ? (
                <div className="loadingMessage">Loading employees...</div>
            ) : employees.length === 0 ? (
                <div className="noEmployeesMessage">
                    <p>You don't have any employees assigned to your trucks yet.</p>
                    <p>Click the "Add New Employee" button to get started.</p>
                </div>
            ) : (
                <div className="employeeCards">
                    {employees.map(employee => (
                        <div key={employee.employee_id} className="employeeCard">
                            <div className="employeeDetails">
                                <h3 className="employeeName">{employee.first_name} {employee.last_name}</h3>
                                <p className="employeeEmail">{employee.email}</p>
                                <div className="employeeTruckBadge">
                                    <span className="truckLabel">Assigned to:</span>
                                    <span className="truckName">{employee.truck_name}</span>
                                </div>
                                <p className="assignmentDate">
                                    <small>Since: {new Date(employee.date_assigned).toLocaleDateString()}</small>
                                </p>
                            </div>
                            <div className="employeeActions">
                                <button className="secondaryButton">
                                    Reassign
                                </button>
                                <button className="secondaryButton">
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmployeeManagement;