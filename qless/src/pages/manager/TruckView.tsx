import {useNavigate, useLocation} from 'react-router-dom';
import { useEffect, useState } from 'react';
import {User, Truck} from '../../App';


const TruckView: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [truck, setTruck] = useState<Truck | null>(null);

    useEffect(() => {
        if (!location.state || !location.state.truck){
            navigate("/manage");
        }
        else{
            setTruck(location.state.truck);
        }
    }, [location, navigate]);

    return (
        <>
            <div>
                {truck && <img src={truck.image_path} alt="" />}
                {truck && <h3>{truck.truck_name}</h3>}
            </div>
        </>
    )
};
export default TruckView;