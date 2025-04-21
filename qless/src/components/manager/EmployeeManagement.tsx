import type { Employee, ManagementSubDashProps } from '../../App';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    getAllEmployees, 
    removeEmployee, 
    getAvailableTrucks, 
    reassignEmployee 
} from '../../service/employeeCreationService';
import CreateEmployeeForm from './CreateEmployeeForm';
import '../../styles/manager/employeeManagement.css';

const EmployeeManagement: React.FC<ManagementSubDashProps> = ({ manager }) => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showReassignModal, setShowReassignModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [availableTrucks, setAvailableTrucks] = useState<any[]>([]);
    const [selectedTruckId, setSelectedTruckId] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

    const fetchTrucks = async () => {
        if (manager) {
            const trucks = await getAvailableTrucks(manager.user_id);
            if (trucks) {
                setAvailableTrucks(trucks);
            }
        }
    };

    useEffect(() => {
        fetchEmployees();
        fetchTrucks();
    }, [manager, navigate]);

    const handleEmployeeCreated = () => {
        // Refresh the employee list
        fetchEmployees();
        // Hide the form
        setShowAddForm(false);
    };

    const handleRemoveClick = async (employee: Employee) => {
        if (window.confirm(`Are you sure you want to remove ${employee.first_name} ${employee.last_name} from your team?`)) {
            setIsProcessing(true);
            setErrorMessage(null);
            setSuccessMessage(null);
            
            const success = await removeEmployee(employee.employee_id);
            
            if (success) {
                setSuccessMessage(`Successfully removed ${employee.first_name} ${employee.last_name} from your team.`);
                fetchEmployees(); // Refresh the list
            } else {
                setErrorMessage(`Failed to remove ${employee.first_name} ${employee.last_name}. Please try again.`);
            }
            
            setIsProcessing(false);
        }
    };

    const handleReassignClick = (employee: Employee) => {
        setSelectedEmployee(employee);
        setSelectedTruckId(employee.truck_id); // Set default to current truck
        setShowReassignModal(true);
    };

    const handleReassignSubmit = async () => {
        if (!selectedEmployee || !selectedTruckId) return;
        
        setIsProcessing(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        
        const success = await reassignEmployee(selectedEmployee.employee_id, selectedTruckId);
        
        if (success) {
            setSuccessMessage(`Successfully reassigned ${selectedEmployee.first_name} ${selectedEmployee.last_name}.`);
            fetchEmployees(); // Refresh the list
            setShowReassignModal(false);
        } else {
            setErrorMessage(`Failed to reassign ${selectedEmployee.first_name} ${selectedEmployee.last_name}. Please try again.`);
        }
        
        setIsProcessing(false);
    };

    const ReassignModal = () => {
        if (!selectedEmployee) return null;
        
        return (
            <div className="modalOverlay">
                <div className="modalContent">
                    <h3>Reassign {selectedEmployee.first_name} {selectedEmployee.last_name}</h3>
                    <p>Current truck: {selectedEmployee.truck_name}</p>
                    
                    <div className="formGroup">
                        <label htmlFor="truckSelect">Select new truck:</label>
                        <select 
                            id="truckSelect"
                            value={selectedTruckId || ''}
                            onChange={(e) => setSelectedTruckId(Number(e.target.value))}
                            disabled={isProcessing}
                        >
                            {availableTrucks.map(truck => (
                                <option key={truck.truck_id} value={truck.truck_id}>
                                    {truck.truck_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {errorMessage && <p className="errorMessage">{errorMessage}</p>}
                    
                    <div className="modalActions">
                        <button 
                            className="cancelButton"
                            onClick={() => setShowReassignModal(false)}
                            disabled={isProcessing}
                        >
                            Cancel
                        </button>
                        <button 
                            className="confirmButton"
                            onClick={handleReassignSubmit}
                            disabled={isProcessing || selectedTruckId === selectedEmployee.truck_id}
                        >
                            {isProcessing ? 'Processing...' : 'Confirm Reassignment'}
                        </button>
                    </div>
                </div>
            </div>
        );
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

            {successMessage && (
                <div className="successMessage">
                    {successMessage}
                    <button 
                        className="closeMessage" 
                        onClick={() => setSuccessMessage(null)}
                    >
                        ✕
                    </button>
                </div>
            )}

            {errorMessage && !showReassignModal && (
                <div className="errorMessage">
                    {errorMessage}
                    <button 
                        className="closeMessage" 
                        onClick={() => setErrorMessage(null)}
                    >
                        ✕
                    </button>
                </div>
            )}

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
                                <button 
                                    className="secondaryButton"
                                    onClick={() => handleReassignClick(employee)}
                                    disabled={isProcessing}
                                >
                                    Reassign
                                </button>
                                <button 
                                    className="secondaryButton"
                                    onClick={() => handleRemoveClick(employee)}
                                    disabled={isProcessing}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showReassignModal && <ReassignModal />}
        </div>
    );
};

export default EmployeeManagement;