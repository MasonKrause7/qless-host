import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/manager/managerDashboard.css';
import supabase from '../../utils/supabase';
import type { ManagementSubDashProps, Truck } from '../../App';




const TruckManagement: React.FC<ManagementSubDashProps> = ({ manager }) => {
    const navigate = useNavigate();

    const [trucks, setTrucks] = useState<Truck[]>([]);

    useEffect(() => {
        const fetchTrucks = async () => {
            if (manager === null){
                console.log(`Cannot access the Truck Management dashboard without an authenticated manager account.\nReturning to login`);
                navigate('/');
            }
            else{
                const { data, error } = await supabase.from('truck').select().eq("manager_id", manager.user_id);
                if (error) {
                    console.log(`Error fetching trucks: ${error.code}.`);
                }
                else if (data){
                    const truckList: Truck[] = data.map(truck => ({
                        truck_id: truck.truck_id,
                        truck_name: truck.truck_name,
                        image_path: truck.image_path,
                        qr_code_path: truck.qr_code_path,
                        menu_id: truck.menu_id,
                        manager_id: truck.manager_id
                    }));
                    setTrucks(truckList);
                }
                else {
                    console.log("Unexpected error while fetching trucks...");
                }
            }
        }
        fetchTrucks();
    }, []);



    

    return (
        <>
        <h2>Manage Trucks</h2>   
        <div className="managementContainer">
             
            <div className='managementItemList'>
                <ul>
                    {trucks.map((truck) => (
                        <li key={truck.truck_id}>
                            <h3>{truck.truck_name}</h3>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        </>
    )
}


export default TruckManagement;