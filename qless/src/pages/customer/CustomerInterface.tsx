import { useState } from 'react';
import OrderMenu from '../../components/customer/OrderMenu';
import "../../styles/customer/CustomerInterface.css";
import { CustomerInterfaceView } from '../../service/customerInterfaceService';
import CustLanding from '../../components/customer/CustLanding';

 export default function CustomerInterface() {

    const [isShowing, setIsShowing] = useState<CustomerInterfaceView>(CustomerInterfaceView.Landing);

    return (
        <>
            {isShowing === CustomerInterfaceView.Landing &&
                <CustLanding
                    setIsShowing={setIsShowing}
                />}
            {isShowing === CustomerInterfaceView.Menu &&
                <OrderMenu />}
        </>
    );
}
