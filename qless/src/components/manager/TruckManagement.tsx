import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/manager/managerDashboard.css';
import { getTrucks } from '../../utils/supabaseService';
import type { ManagementSubDashProps, Truck } from '../../App';
import ErrorMessage from '../commonUI/ErrorMessage';
import TruckCard from './TruckCard';




const TruckManagement: React.FC<ManagementSubDashProps> = ({ manager }) => {
    const navigate = useNavigate();

    const [trucks, setTrucks] = useState<Truck[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [creatingTruck, setCreatingTruck] = useState(false);
    const [newTruckImage, setNewTruckImage] = useState<File | null>(null);
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
        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        const validTypes = ["image/png", "image/jpeg"];

        if (event.target.files && event.target.files.length > 0) {
            const newTruckImgFile = event.target.files[0];
            
            //validate file type
            if (!validTypes.includes(newTruckImgFile.type)) {
                setErrorMessage("Truck image must be a .png or .jpg file type.");
                return;
            }
            //validate file size
            if (newTruckImgFile.size > MAX_FILE_SIZE) {
                setErrorMessage("Truck image must be less than 5MB. Please upload a different image.");
                return;
            }

            setNewTruckImage(newTruckImgFile);
            const tempUrl = URL.createObjectURL(newTruckImgFile);
            setPreviewURL(tempUrl);
        }
    };
    

    const createTruck = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");
        const formData = new FormData(event.currentTarget);
        const truckName = formData.get('newTruckName');
        //validate form data
        if (!truckName || truckName === ""){
            setErrorMessage("Please enter a truck name.");
            return;
        }
        //then handle image upload
        
        //then generate qr code

        


        //finish creating truck
        const managerId = manager.user_id;
        const newTruck = {
           /*  truck_id: number,
                truck_name: string,
                image_path: string,
                qr_code_path: string,
                menu_id: number | null,
                manager_id: number */
            truck_name: truckName,
            image_path: "",
            qr_code_path: "",
            menu_id: null,
            manager_id: managerId
        }

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