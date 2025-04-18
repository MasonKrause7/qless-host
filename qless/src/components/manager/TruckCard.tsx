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
    
    const downloadQrCode = async () => {
        const url = `https://ybdwknecdehcslhcizns.supabase.co/storage/v1/object/public/qr-codes/truck-${truck.truck_id}.png`;
        const filename = `${truck.truck_name}-qr.png`;
        
        try {
            // Fetch the image first
            const response = await fetch(url);
            const blob = await response.blob();
            
            // Create a blob URL and trigger download
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            
            // Clean up
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Error downloading QR code:", error);
        }
    };

    return (
        <>
            <div className='cardContainer'>
                <div className='cardImgContainer'>
                    <img src={truck.image_path}/>
                </div>
                <h5>{truck.truck_name}</h5>
                <button className='truckCardButton' onClick={() => viewTruck()}>Manage Truck</button>
                <button onClick={downloadQrCode}>Download QR Code</button>
                <img className='qrPreview' src={truck.qr_code_path} alt="" />
            </div>
        </>
    )
}

export default TruckCard;