import React from 'react';
import type { Truck } from '../../App';
import { useNavigate } from 'react-router-dom';

type TruckCardProps = {
    truck: Truck;
}

const TruckCard: React.FC<TruckCardProps> = ({ truck }) => {
    const navigate = useNavigate();
    const viewTruck = () => {
        navigate('/manage/truck', { state: { truck:truck } });
    }

    return (
        <>
            <div  className='cardContainer'>
                <div className='cardImgContainer'>
                    <img src={truck.image_path} alt="" />
                </div>
                <h5>{truck.truck_name}</h5>
                <button onClick={() => viewTruck()}>Manage</button>
            </div>
        </>
    )
}

export default TruckCard;