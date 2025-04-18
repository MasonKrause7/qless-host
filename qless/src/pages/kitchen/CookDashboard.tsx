import ListOrders from '../../components/kitchen/ListOrders';
import '../../styles/kitchen/cookDashboard.css';
import { useState, useEffect, useMemo } from 'react';
import ViewOrderDetails from '../../components/kitchen/ViewOrderDetails';
import FinishOrder from '../../components/kitchen/FinishOrder';
import ErrorMessage from '../../components/commonUI/ErrorMessage';
import { CookDashboardView } from '../../service/cookDashboardService';
import { useCookDashboard } from '../../hooks/useCookDashboard';
import { useUser } from '../../hooks/UserContext';


export default function CookDashboard() {
    const [isShowing, setIsShowing] = useState<CookDashboardView>(CookDashboardView.List);
    
    const {
        orders,
        filteredOrders,
        setOrderNum,
        currentOrder,
        orderDetails,
        orderStatusFilter,
        setOrderStatusFilter,
        trucks,
        selectedTruckId,
        setSelectedTruckId,
        errorMessage,
        refreshOrders
      } = useCookDashboard(isShowing);

      const {user} = useUser();


    //create truck list
    const availableTrucks = useMemo(() => {
        const trucks = Array.from(new Set(orders.map(o => o.truck_id)));
        return trucks.sort((a, b) => a - b);//sort by truck id
    }, [orders])

    //set the first truck to default
    useEffect(() => {
        if (availableTrucks.length > 0 && selectedTruckId === null)
            setSelectedTruckId(availableTrucks[0]);
    }, [availableTrucks, selectedTruckId]);



    return (
        <div className="pageContainer">
            <div className='cookDashContainer'>
                {isShowing === CookDashboardView.List && <ListOrders
                    setIsShowing={setIsShowing}
                    setOrderNum={setOrderNum}
                    orderStatusFilter={orderStatusFilter}
                    refreshOrders={refreshOrders}
                    setOrderStatusFilter={setOrderStatusFilter}
                    trucks={trucks}
                    selectedTruckId={selectedTruckId}
                    setSelectedTruckId={setSelectedTruckId}
                    user={user}
                    filteredOrders={filteredOrders}
                />}

                {isShowing === CookDashboardView.Details && <ViewOrderDetails
                    filteredOrders={filteredOrders}
                    currentOrder={currentOrder}
                    orderDetails={orderDetails}
                    setIsShowing={setIsShowing}
                    setOrderNum={setOrderNum}
                    refreshOrders={refreshOrders}
                    setOrderStatusFilter={setOrderStatusFilter}
                />}

                {isShowing === CookDashboardView.Finish && <FinishOrder
                    setIsShowing={setIsShowing}
                    orderDetails={orderDetails}
                    currentOrder={currentOrder}
                    refreshOrders={refreshOrders}
                    setOrderStatusFilter={setOrderStatusFilter}
                />}
            </div>
            {errorMessage !== "" && <ErrorMessage message={errorMessage} />}
        </div>
    )
}
