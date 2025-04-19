import { useState } from "react";
import { CustomerInterfaceView } from "../../service/customerInterfaceService";
import ErrorMessage from "../commonUI/ErrorMessage";
import { useCustomerOrder } from "../../hooks/CustomerOrderContext";


type CustLandingProps = {
    setIsShowing: React.Dispatch<React.SetStateAction<CustomerInterfaceView>>;
}

export default function CustLanding({
    setIsShowing
}: CustLandingProps) {

    const {
        truck,
        errorMessage,
        setErrorMessage,
        addPhoneToOrder
    } = useCustomerOrder();

    const [phoneNumber, setPhoneNumber] = useState<string>('');


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(event.target.value);
        setErrorMessage('');
    };

    const handleSubmit = () => {
        const cleanedNumber = phoneNumber.replace(/\D/g, '');
        if (cleanedNumber.length === 10) {
            addPhoneToOrder(cleanedNumber);
            setIsShowing(CustomerInterfaceView.Menu);
        } else {
            setErrorMessage("Please enter a valid 10-digit phone number.");
        }
    };

    return (
        <div className='custLandingContainer'>
            {truck && <p>Welcome to {truck.truck_name}!</p>}
            {truck && <img className='truckImgCustInterface' src={truck.image_path}></img>}
            {truck && <p>Enter phone number to order:</p>}
            {errorMessage !== "" && <ErrorMessage message={errorMessage} />}
            <input
                type="tel"
                value={phoneNumber}
                onChange={handleChange}
                placeholder="123-456-7890"
                maxLength={12}
            />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}