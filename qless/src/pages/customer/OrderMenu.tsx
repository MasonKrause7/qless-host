import "../../styles/customer/OrderMenu.css";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

function OrderMenu() {
    const location = useLocation();
    const navigate = useNavigate();
    const [custPhoneNumber, setCustPhoneNumber] = useState("");
    useEffect(() => {
        if (!location.state?.cleanedNumber) {
            console.log("Cannot access menu without phone number");
            navigate("/customer", { replace: true });
        } else {
            setCustPhoneNumber(location.state.cleanedNumber);
        }
    }, [location, navigate]);
    return (
        <div>
            <h1>Order Menu</h1>
            <p>Welcome! Choose your food items here.</p>
            <p>Your phone number: {custPhoneNumber}</p>
            <div className="order-menu-container">
                {/* Empty box for now */}
                <div className="menu-box">Item 1</div>
                <div className="menu-box">Item 2</div>
                <div className="menu-box">Item 3</div>
                <div className="menu-box">Item 4</div>
            </div>
        </div>
        
    );
}

export default OrderMenu;
