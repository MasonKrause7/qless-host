import { useState } from "react";
import { CustomerInterfaceView } from "../../service/customerInterfaceService";
import ErrorMessage from "../commonUI/ErrorMessage";
import { useCustomerOrder } from "../../hooks/CustomerOrderContext";
import "../../styles/customer/CustomerInterface.css"
import "../../styles/global.css"


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
            <div className="custInner">
                {truck && <>
                    <h1>Welcome to</h1>
                    <h2>{truck.truck_name}</h2>
                    <img
                        className='truckImgCustInterface'
                        src={truck.image_path === null ? "/src/defaultImgs/noimg.png" : truck.image_path}>
                    </img>
                    <p>Enter phone number to start order:</p>
                </>}
                {errorMessage !== "" && <ErrorMessage message={errorMessage} />}
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handleChange}
                    placeholder="123-456-7890"
                    maxLength={12}
                    id="custPhone"
                />
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
}