import type { User, Truck, TruckAssignment, Employee, ManagementSubDashProps } from '../../App';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../utils/supabase';

const EmployeeManagement: React.FC<ManagementSubDashProps> = ({ manager }) => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            if (manager === null){
                console.log('Cannot access the Employee Management dashboard without an authenticated manager account.\nReturning to login');
                navigate('/');
            }
            else{
                //to get the employees for a manager
                //first you gotta get the trucks, 
                //then get truck assignments where the trucks match the assignment
                //then use the employee_id from the truck_assignment to pull those users

                const { data: truckData, error: truckError } = await supabase.from('truck').select('*').eq("manager_id", manager.user_id);
                if (truckError){
                    console.log(`Error fetching trucks while fetching employees: ${truckError.code}.`);
                }
                else if (truckData){
                    const truckList: Truck[] = truckData as Truck[];
                    let employeeList: Employee[] = []
                    //this loop goes through each truck of this managers and gets the employees for that truck,
                    //and adds those employees to the employeeList. At the end of the loop, the employees of every truck will be added.
                    for(let i = 0; i < truckList.length; i++){
                        let truck_id = truckList[i].truck_id;
                        console.log(`scanning truck ${truck_id} ${truckList[i].truck_name}`);
                        const { data: assignmentData, error: assignmentError } = await supabase.from('truck_assignment').select('*').eq("truck_id", truck_id);
                        if (assignmentError){
                            console.log(`Error fetching assignments for truck ${truck_id}: ${truckList[i].truck_name}`);
                        }
                        else if(assignmentData){
                            const assignmentList: TruckAssignment[] = assignmentData as TruckAssignment[];
                            //this for loop gets each employees data and adds them to the list
                            for(let j = 0; j < assignmentList.length; j++){
                                console.log(`scanning assignment_id ${assignmentList[j].assignment_id}`)
                                let employee: Employee = {
                                    first_name: "",
                                    last_name: "",
                                    email: "",
                                    employee_id: assignmentList[j].employee_id,
                                    truck_id: truck_id,
                                    truck_name: truckList[i].truck_name,
                                    date_assigned: assignmentList[j].date_assigned
                                }
                                const { data: userData, error: userError } = await supabase.from('user').select('*').eq("user_id", employee.employee_id);
                                if (userError){
                                    console.log(`Error fetching user data for user_id=${employee.employee_id}: ${userError.code}`);
                                }
                                else if (userData && userData.length > 0){
                                    const user: User = userData[0] as User
                                    employee.first_name = user.first_name;
                                    employee.last_name = user.last_name;
                                    employee.email = user.email;
                                    employeeList.push(employee);
                                    console.log(`adding ${employee.first_name} to employeeList`);
                                }
                                else{
                                    console.log(`An unexpected error occurred while fetching user user_id=${employee.employee_id}...`);
                                }
                            }
                        }
                        else{
                            console.log(`An unexpected error fetching assignments for truck ${truck_id} - ${truckList[i].truck_name}`);
                        }
                    }
                    setEmployees(employeeList);
                }
                else{
                    console.log('An unexpected error occurred fetching trucks while fetching employees...');
                }
            }
        }
        fetchEmployees();
    }, []);

    return (
        <div>
            <h2>Employee Management</h2>
            <div>
                <ul>
                    { employees.map(employee => (
                        <li key={employee.employee_id}>
                            <h3>{employee.last_name}, {employee.first_name}</h3>
                            <p>Email: {employee.email}</p>
                            <p>Truck: {employee.truck_id} {employee.truck_name}</p>
                        </li>
                    )) }
                </ul>
            </div>
        </div>
    )
}


export default EmployeeManagement;