import { useEffect, useState } from 'react';
import '../../styles/manager/managerDashboard.css';
import supabase from '../../utils/supabase';

type Truck = {
    truck_id: number,
    truck_name: string,
    image_path: string | null,
    qr_code_path: string,
    menu_id: number | null
}

function TruckManagement(){
    const [trucks, setTrucks] = useState<Truck[]>([]);

    useEffect(() => {
        const fetchTrucks = async () => {
            try{
                const { data } = await supabase.from('truck').select()
                if (data){
                    const truckList: Truck[] = data.map(truck => ({
                        truck_id: truck.truck_id,
                        truck_name: truck.truck_name,
                        image_path: truck.image_path,
                        qr_code_path: truck.qr_code_path,
                        menu_id: truck.menu_id
                    }));
                    setTrucks(truckList);
                }
                else {
                    console.log("Failed to fetch trucks.");
                }
            }
            catch (err) {
                console.log("Unable to complete the fetch trucks process... ", err);
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