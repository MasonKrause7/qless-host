import ListOrders from '../../components/kitchen/ListOrders';
import '../../styles/kitchen/cookDashboard.css';
import { useState } from 'react';

export default function CookDashboard() {
    const [isShowing, setIsShowing] = useState("list");
    const [orderNum, setOrderNum] = useState(0);

    return (
        <div className="pageContainer">
            <div className='cookDashContainer'>
                <div className="cookDashLeft">
                    {isShowing === "list" && <ListOrders setIsShowing={setIsShowing} setOrderNum={setOrderNum} status="In Progress" />}
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

