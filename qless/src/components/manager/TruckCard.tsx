import React from 'react';
import type { Truck } from '../../App';
import { useNavigate } from 'react-router-dom';
import '../../styles/manager/managerDashboard.css';

type TruckCardProps = {
    truck: Truck;
}

const TruckCard: React.FC<TruckCardProps> = ({ truck }) => {
    const navigate = useNavigate();
    const viewTruck = () => {
        navigate('/manage/truck', { state: { truck:truck } });
    }
    const downloadQr = () => {
        //download QR logic
    }
    console.log('img path=',truck.truck_name, truck.image_path);

    return (
        <>
            <div  className='cardContainer'>
                <div className='cardImgContainer'>
                <img src={truck.image_path}/>

                </div>
                <h5>{truck.truck_name}</h5>
                <button onClick={() => viewTruck()}>Manage</button>
                <button onClick={() => downloadQr()}>Download QR</button>
                <img className='qrPreview' src={truck.qr_code_path} alt="" />
            </div>
        </>
    )
}

export default TruckCard;