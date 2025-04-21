import { useEffect, useState } from 'react';
import '../../styles/manager/managerDashboard.css';
import { getTrucks, getMenus, uploadTruckImage, postTruck, updateTruck, getTruckById } from '../../service/supabaseService';
import type { ManagementSubDashProps, Truck, InsertTruckDto, Menu } from '../../App';
import ErrorMessage from '../commonUI/ErrorMessage';
import TruckCard from './TruckCard';
import { generateAndUploadQRCode } from '../../utils/QRCodeGenerator';





const TruckManagement: React.FC<ManagementSubDashProps> = ({ manager }) => {

    const [trucks, setTrucks] = useState<Truck[] | null>(null);
    const [menus, setMenus] = useState<Menu[] | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [creatingTruck, setCreatingTruck] = useState(false);
    const [newTruckImgFile, setNewTruckImgFile] = useState<File | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);
    const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);



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
    }, [manager.user_id]);
    useEffect(() => {
        const fetchMenus = async () => {
            setErrorMessage("");
            const menuList: Menu[] | null = await getMenus(manager.user_id);
            if (!menuList){
                setErrorMessage("Unable to fetch truck list... wait a few moments and then try refreshing.");
            }
            else{
                setMenus(menuList);
            }
        }
        fetchMenus();
    }, [manager.user_id]);


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
        const insertTruck: InsertTruckDto = {
            /*  truck_id: number,
                 truck_name: string,
                 image_path: string,
                 qr_code_path: string,
                 menu_id: number | null,
                 manager_id: string */
             truck_name: truckName,
             manager_id: manager.user_id,
             menu_id: selectedMenuId
         }
         const newTruck: Truck | null = await postTruck(insertTruck);
         if (!newTruck) {
            setErrorMessage(`An error occurred while creating the truck: ${insertTruck.truck_name}`);
            return;
         }

        //truck image can be null, if it is then we shouldnt include it
        let potentialImgUrl: string | null = "";
        if(newTruckImgFile){
            potentialImgUrl = await uploadTruckImage(newTruckImgFile, manager.user_id);
            if (!potentialImgUrl){
                setErrorMessage("There was an error uploading your image. Truck creation will continue, you can add an image to your truck once its created.");
            }
            else{
                newTruck.image_path = potentialImgUrl;
            }
        }
        
        //then generate qr code
        const potentialPublicUrl: string | null = await generateAndUploadQRCode(newTruck.truck_id);
        if (!potentialPublicUrl){
            setErrorMessage("There was an error generating and storing the QR code for your truck. Please refresh and try again.");
        }
        else{
            newTruck.qr_code_path = potentialPublicUrl;
        }
        
        //submit image updates
        updateTruck(newTruck);
        const updatedTruck: Truck | null = await getTruckById(newTruck.truck_id);
        if (!updatedTruck){
            setErrorMessage("There was an error while updating the truck img urls");
        }
        else{
            let updateIndex: number = -1;
            if (trucks){
                for (let i = 0; i < trucks.length; i++){
                    if (trucks[i].truck_id === updatedTruck.truck_id){
                        updateIndex = i;
                    }
                }
                trucks.splice(updateIndex, 1);
                trucks.push(updatedTruck);
            }
        }

        setCreatingTruck(false);       

    }


    return (
        <>
        <h2 className='pageTitle'>Manage Trucks</h2>   
        {!creatingTruck && <div className="managementContainer">
            <div className='managementItemList'>
                <ul className='truckCards'>
                    {trucks && trucks.map((truck) => (
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

        {creatingTruck && 
        <div className="createTruckContainer">
            <h3>Create New Food Truck</h3>
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
                <div className='createFormInputGroup'>
                    <label htmlFor="menuSelect">Select Menu (Optional)</label>
                    <select 
                        id="menuSelect" 
                        className='createFormInput' 
                        value={selectedMenuId ?? ""} 
                        onChange={(e) => setSelectedMenuId(e.target.value ? Number(e.target.value) : null)}
                    >
                        <option value="">No Menu</option> {/* Option for null */}
                        {menus?.map((menu) => (
                            <option key={menu.menu_id} value={menu.menu_id}>
                                {menu.menu_name}
                            </option>
                        ))}
                    </select>
                </div>
                
                {previewURL && 
                    <div className="imagePreviewContainer">
                        <img 
                            className='imagePreview' 
                            src={previewURL} 
                            alt='Truck Preview'
                        />
                    </div>
                }
                
                <div className='formButtonGroup'>
                    <button 
                        type='button' 
                        className='cancelButton'
                        onClick={() => setCreatingTruck(false)}
                    >
                        Cancel
                    </button>
                    <button 
                        type='submit'
                        className='submitButton'
                    >
                        Create Truck
                    </button>
                </div>
            </form>
        </div>
        }
        {errorMessage !== "" && <ErrorMessage message={errorMessage} />}
        </>
    )
}


export default TruckManagement;