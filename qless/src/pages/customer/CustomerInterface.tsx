import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/global.css";
function CustomerInterface() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigate = useNavigate();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(event.target.value);
    };

    const handleSubmit = () => {
        const cleanedNumber = phoneNumber.replace(/\D/g, '');
        if (cleanedNumber.length === 10) {
            navigate('/order-menu');
        } else {
            alert("Please enter a valid 10-digit phone number.");
        }
    };

    return (
        <div>
            <p>Welcome to restaurant placeholder! Enter phone number to order:</p>
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

export default CustomerInterface;
