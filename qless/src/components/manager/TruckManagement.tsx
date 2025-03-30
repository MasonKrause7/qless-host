import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/manager/managerDashboard.css';
import { getTrucks, uploadTruckImage, postTruck } from '../../utils/supabaseService';
import type { ManagementSubDashProps, Truck, InsertTruck } from '../../App';
import ErrorMessage from '../commonUI/ErrorMessage';
import TruckCard from './TruckCard';
import QRCodeGenerator from '../../utils/QRCodeGenerator';




const TruckManagement: React.FC<ManagementSubDashProps> = ({ manager }) => {
    const navigate = useNavigate();

    const [trucks, setTrucks] = useState<Truck[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [creatingTruck, setCreatingTruck] = useState(false);
    const [newTruckImgFile, setNewTruckImgFile] = useState<File | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrucks = async () => {
            setErrorMessage("");
            const truckList: Truck[] | null = await getTrucks(manager.user_id);
            if (!truckList){
                setErrorMessage("Unable to fetch truck list... wait a few moments and then try refreshing.");
            }
            else{
                setTrucks(truckList);
            }
        }
        fetchTrucks();
    }, []);


    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {

        //5MB max for standard upload to storage
        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        const validTypes = ["image/png", "image/jpeg"];

        if (event.target.files && event.target.files.length > 0) {
            const inputImgFile = event.target.files[0];
            
            //validate file type
            if (!validTypes.includes(inputImgFile.type)) {
                setErrorMessage("Truck image must be a .png or .jpg file type.");
                return;
            }
            //validate file size
            if (inputImgFile.size > MAX_FILE_SIZE) {
                setErrorMessage("Truck image must be less than 5MB. Please upload a different image.");
                return;
            }

            setNewTruckImgFile(inputImgFile);
            const tempUrl = URL.createObjectURL(inputImgFile);
            setPreviewURL(tempUrl);
        }
    };
    

    const createTruck = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");
        const formData = new FormData(event.currentTarget);
        const truckName: string = formData.get('newTruckName') as string;
        //validate form data
        if (!truckName || truckName === ""){
            setErrorMessage("Please enter a truck name.");
            return;
        }
        const insertTruck: InsertTruck = {
            /*  truck_id: number,
                 truck_name: string,
                 image_path: string,
                 qr_code_path: string,
                 menu_id: number | null,
                 manager_id: string */
             truck_name: truckName,
             manager_id: manager.user_id
         }
         const newTruck: Truck | null = await postTruck(insertTruck);
         if (!newTruck) {
            setErrorMessage(`An error occurred while creating the truck: ${insertTruck.truck_name}`);
            return;
         }

        //truck image can be null, if it is then we shouldnt include it
        let imgUrl: string | null = "";
        if(newTruckImgFile){
            imgUrl = await uploadTruckImage(newTruckImgFile, manager.user_id);
            if (!imgUrl){
                setErrorMessage("There was an error uploading your image.");
            }
            else{
                newTruck.image_path = imgUrl;
            }
        }
        
        //then generate qr code
        

        //then submit image updates

        //then show menu's dropdown
        


        

    }

    

    

    return (
        <>
        <h2 className='pageTitle'>Manage Trucks</h2>   
        {!creatingTruck && <div className="managementContainer">
            <div className='managementItemList'>
                <ul className='truckCards'>
                    {trucks.map((truck) => (
                        <li key={truck.truck_id}>
                            <TruckCard truck={truck} />
                        </li>
                    ))}
                    <li className='lastTruckCard'>
                        <button className='addTruckButton'
                                onClick={() => setCreatingTruck(true)}
                        >
                            Add New Truck
                        </button>
                    </li>
                </ul>
            </div>
        </div>}

        {creatingTruck && <div>
            <form 
                onSubmit={(event) => createTruck(event)}
                className='createForm'
            >
                <div className='createFormInputGroup'>
                    <label htmlFor="newTruckName">Truck Name</label>
                    <input className='createFormInput' name='newTruckName' type="text" />
                </div>
                <div className='createFormInputGroup'>
                    <label htmlFor="newTruckImg">Truck Image</label>
                    <input name='newTruckImg' type="file" accept="image/*" onChange={handleImageUpload} />
                </div>
                {previewURL && <img className='imagePreview' src={previewURL} alt='Truck Preview'></img>}
                <div>
                    <button type='submit'>Create Truck</button>
                    <button onClick={()=>setCreatingTruck(false)}>Cancel</button>
                </div>
            </form>
            
        </div>}
        {errorMessage !== "" && <ErrorMessage message={errorMessage} />}
        </>
    )
}


export default TruckManagement;