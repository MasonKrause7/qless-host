import { useState, useEffect } from 'react';
import type { User, Truck } from '../../App';
import { getTrucks, signUp } from '../../service/supabaseService';
import { createEmployeeAssignment } from '../../service/employeeCreationService';
import '../../styles/manager/employeeManagement.css';

type CreateEmployeeFormProps = {
  manager: User;
  onEmployeeCreated: () => void;
  onCancel: () => void;
};

function generateRandomPassword(length = 10) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

const CreateEmployeeForm: React.FC<CreateEmployeeFormProps> = ({ manager, onEmployeeCreated, onCancel }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [managerPassword, setManagerPassword] = useState('');
  const [selectedTruckId, setSelectedTruckId] = useState<number | null>(null);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrucks = async () => {
      const truckList = await getTrucks(manager.user_id);
      if (truckList && truckList.length > 0) {
        setTrucks(truckList);
        setSelectedTruckId(truckList[0].truck_id); // Default select first truck
      }
    };

    fetchTrucks();
  }, [manager.user_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (!selectedTruckId) {
        throw new Error("Please select a truck to assign the employee to");
      }

      if (!managerPassword) {
        throw new Error("Please enter your password to create an employee");
      }

      // Store the manager password temporarily in sessionStorage
      // It will be used to log the manager back in after creating the employee
      sessionStorage.setItem('managerPassword', managerPassword);
      
      // Generate a random password for the new employee
      const randomPassword = generateRandomPassword();
      
      // Sign up the new user with preserveSession = true
      const newUser = await signUp(email, randomPassword, firstName, lastName, false, true);
      
      if (!newUser) {
        throw new Error("Failed to create employee account");
      }

      // Create assignment using the new user's ID
      const assignment = await createEmployeeAssignment(newUser.id, selectedTruckId);
      
      if (!assignment) {
        throw new Error("Failed to assign employee to truck");
      }

      // Clear the stored password for security
      sessionStorage.removeItem('managerPassword');

      setSuccessMessage(`Employee ${firstName} ${lastName} created successfully with a temporary password. They will need to use the "Reset Password" option on first login.`);
      
      // Clear form fields
      setFirstName('');
      setLastName('');
      setEmail('');
      setManagerPassword('');
      
      // Notify parent component
      setTimeout(() => {
        onEmployeeCreated();
      }, 2000);
      
    } catch (err: any) {
      // Clear the stored password if there was an error
      sessionStorage.removeItem('managerPassword');
      setError(err.message || "An error occurred while creating the employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="createEmployeeContainer">
      <h2>Add New Employee</h2>
      {error && <div className="errorMessage">{error}</div>}
      {successMessage && <div className="successMessage">{successMessage}</div>}
      
      <form onSubmit={handleSubmit} className="createEmployeeForm">
        <div className="createFormInputGroup">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        
        <div className="createFormInputGroup">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        
        <div className="createFormInputGroup">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="createFormInputGroup">
          <label htmlFor="truckId">Assign to Truck</label>
          <select
            id="truckId"
            value={selectedTruckId || ''}
            onChange={(e) => setSelectedTruckId(parseInt(e.target.value))}
            required
          >
            <option value="" disabled>Select a truck</option>
            {trucks.map((truck) => (
              <option key={truck.truck_id} value={truck.truck_id}>
                {truck.truck_name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="createFormInputGroup">
          <label htmlFor="managerPassword">Your Password (required to create employee)</label>
          <input
            type="password"
            id="managerPassword"
            value={managerPassword}
            onChange={(e) => setManagerPassword(e.target.value)}
            required
            placeholder="Enter your password to confirm"
          />
          <small className="passwordHelp">Your password is needed to re-authenticate you after creating the employee.</small>
        </div>
        
        <div className="formButtonGroup">
          <button 
            type="button" 
            className="cancelButton" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submitButton" 
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Employee'}
          </button>
        </div>
      </form>
      
      <div className="employeeCreationInstructions">
        <p>Note: A random temporary password will be generated for the employee. They will need to use the "Reset Password" option on their first login.</p>
      </div>
    </div>
  );
};

export default CreateEmployeeForm;