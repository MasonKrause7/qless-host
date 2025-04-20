import { useState } from 'react';
import OrderMenu from '../../components/customer/OrderMenu';
import "../../styles/customer/customerInterface.css";
import { CustomerInterfaceView } from '../../service/customerInterfaceService';
import CustLanding from '../../components/customer/CustLanding';
import ViewCart from '../../components/customer/ViewCart';
import OrderConfirmation from '../../components/customer/OrderConfirmation';

export default function CustomerInterface() {

    const [isShowing, setIsShowing] = useState<CustomerInterfaceView>(CustomerInterfaceView.Landing);

    return (
        <div className='pageContainer'>
            {isShowing === CustomerInterfaceView.Landing &&
                <CustLanding
                    setIsShowing={setIsShowing}
                />}
            {isShowing === CustomerInterfaceView.Menu &&
                <OrderMenu setIsShowing={setIsShowing}/>}
            {isShowing === CustomerInterfaceView.Cart &&
                <ViewCart setIsShowing={setIsShowing} />}
            {isShowing === CustomerInterfaceView.Confirmation &&
                <OrderConfirmation />}
        </div>
    );
}
