import ListOrders from '../../components/kitchen/ListOrders';
import '../../styles/kitchen/cookDashboard.css';
import { useState } from 'react';


/*Order Status:
    1: Recieved
    2: Being Cooked
    3: Ready
    4: Picked Up
*/

export default function CookDashboard() {
    const [isShowing, setIsShowing] = useState("list");
    const [orderNum, setOrderNum] = useState(0);

    return (
        <div className="pageContainer">
            <div className='cookDashContainer'>
                <div className="cookDashLeft">
                    {isShowing === "list" && <ListOrders setIsShowing={setIsShowing} setOrderNum={setOrderNum} />}
                    {isShowing === "details" && <DetailsButton setIsShowing={setIsShowing} orderNum={orderNum} />}
                </div>
                <div className="cookDashRight">
                    <p>Just For Testing</p>
                </div>
                {isShowing === "finish" && <FinishButton setIsShowing={setIsShowing} orderNum={orderNum} />}
            </div>
        </div>
    )
}

//converts an order status number to its coresponding string
export function getOrderStatus(id: number) {
    let status = "";
    switch (id) {
        case 1:
            status = "Recieved"
            break;
        case 2:
            status = "Being Cooked"
            break;
        case 3:
            status = "Ready"
            break;
        case 4:
            status = "Picked Up"
            break;
    }
    return status;
}

function DetailsButton({ setIsShowing, orderNum }:
    { setIsShowing: React.Dispatch<React.SetStateAction<string>>; orderNum: number }) {
    return (
        <>
            <h1>Details for: {orderNum}</h1>
            <button onClick={() => setIsShowing("list")}>Back</button>
        </>
    );
}

function FinishButton({ setIsShowing, orderNum }:
    { setIsShowing: React.Dispatch<React.SetStateAction<string>>; orderNum: number }) {
    return (
        <>
            <h1>Finish for: {orderNum}</h1>
            <button onClick={() => setIsShowing("list")}>Back</button>
        </>
    );
}

