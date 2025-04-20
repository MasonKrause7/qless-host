import supabase from '../utils/supabase';
import type { TruckAssignment, Employee } from '../App';

// Create a truck assignment for an employee
export async function createEmployeeAssignment(
  employeeId: string,
  truckId: number
): Promise<TruckAssignment | null> {
  try {
    const now = new Date();
    const isoDate = now.toISOString();
    
    const newAssignment = {
      truck_id: truckId,
      employee_id: employeeId,
      date_assigned: isoDate
    };
    
    // Use RPC to bypass RLS for this specific operation
    // This will allow the manager to create the assignment for the employee
    const { data, error } = await supabase.rpc('create_truck_assignment', {
      p_truck_id: truckId,
      p_employee_id: employeeId,
      p_date_assigned: isoDate
    });
    
    if (error) {
      console.log(`Error creating truck assignment: ${error.message}`);
      return null;
    }
    
    if (data) {
      console.log(`Successfully assigned employee to truck ${truckId}`);
      return data as TruckAssignment;
    }
    
    return null;
  } catch (err) {
    console.log("Exception thrown in createEmployeeAssignment", err);
    return null;
  }
}

// Get all of a manager's employees
export async function getAllEmployees(managerId: string): Promise<Employee[] | null> {
  try {
    // First get all trucks belonging to the manager
    const { data: truckData, error: truckError } = await supabase
      .from('truck')
      .select('*')
      .eq("manager_id", managerId);
    
    if (truckError) {
      console.log(`Error fetching trucks: ${truckError.message}`);
      return null;
    }
    
    if (!truckData || truckData.length === 0) {
      console.log("No trucks found for this manager");
      return [];
    }
    
    // Get all truck IDs
    const truckIds = truckData.map(truck => truck.truck_id);
    
    // Get all assignments for these trucks, with joined user data
    const { data: assignments, error: assignmentError } = await supabase
      .from('truck_assignment')
      .select(`
        assignment_id,
        truck_id,
        employee_id,
        date_assigned,
        truck:truck_id(truck_id, truck_name),
        user:employee_id(user_id, first_name, last_name, email)
      `)
      .in('truck_id', truckIds);
    
    if (assignmentError) {
      console.log(`Error fetching assignments: ${assignmentError.message}`);
      return null;
    }
    
    if (!assignments) {
      return [];
    }
    
    
    
    // Map the joined data to our Employee type format
    const employees = assignments.map((assignment: any) => ({
      employee_id: assignment.employee_id,
      first_name: assignment.user ? assignment.user.first_name : '',
      last_name: assignment.user ? assignment.user.last_name : '',
      email: assignment.user ? assignment.user.email : '',
      truck_id: assignment.truck_id,
      truck_name: assignment.truck ? assignment.truck.truck_name : '',
      date_assigned: assignment.date_assigned
    }));
    
    return employees as Employee[];
  } catch (err) {
    console.log("Exception thrown in getAllEmployees", err);
    return null;
  }
}

// Remove an employee's truck assignment
export async function removeEmployeeAssignment(employeeId: string): Promise<boolean> {
  try {
    // Use RPC to bypass RLS for this specific operation
    const { error } = await supabase.rpc('remove_truck_assignment', {
      p_employee_id: employeeId
    });
    
    if (error) {
      console.log(`Error removing employee assignment: ${error.message}`);
      return false;
    }
    
    return true;
  } catch (err) {
    console.log("Exception thrown in removeEmployeeAssignment", err);
    return false;
  }
}

// Update an employee's truck assignment
export async function updateEmployeeAssignment(
  employeeId: string,
  newTruckId: number
): Promise<TruckAssignment | null> {
  try {
    const now = new Date();
    const isoDate = now.toISOString();
    
    // Use RPC to bypass RLS for this specific operation
    const { data, error } = await supabase.rpc('update_truck_assignment', {
      p_employee_id: employeeId,
      p_truck_id: newTruckId,
      p_date_assigned: isoDate
    });
    
    if (error) {
      console.log(`Error updating assignment: ${error.message}`);
      return null;
    }
    
    if (data) {
      console.log(`Successfully reassigned employee to truck ${newTruckId}`);
      return data as TruckAssignment;
    }
    
    return null;
  } catch (err) {
    console.log("Exception thrown in updateEmployeeAssignment", err);
    return null;
  }
}