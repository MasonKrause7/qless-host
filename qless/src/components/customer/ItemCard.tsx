import { useEffect, useState } from "react";
import { Product } from "../../App";
import { useCustomerOrder } from "../../hooks/CustomerOrderContext";
import "../../styles/customer/itemCard.css"

type ItemCardProps = {
    product: Product
    itemQty?: number
}

export default function ItemCard({
    product,
    itemQty
}: ItemCardProps) {
    const [qty, setQty] = useState<number>(0);

    //if the item is already in the cart, set the qty on mount
    useEffect(() => { if (itemQty) setQty(itemQty); }, []);

    return (
        <div className="itemCard">
            <div className="itemCardInner">
                <img
                    className="productImg"
                    src={product.image_path===null ?
                        "/src/defaultImgs/noimg.png" :
                        product.image_path}
                    alt="Product Image"
                />
                <div className="itemInfoBlock">
                    <div className="itemHeaderRow">
                        <p className="itemName">{product.product_name}</p>
                        {<p className="itemPrice">${product.price.toFixed(2)}</p>}
                    </div>
                    <p className="itemDesc">{product.description}</p>
                    <div className="itemSelectorWrapper">
                        <ItemSelector product={product} qty={qty} setQty={setQty} />
                    </div>
                </div>

            </div>
        </div>
    );
}

type ItemSelectorProps = {
    product: Product;
    qty: number;
    setQty: React.Dispatch<React.SetStateAction<number>>;
}

function ItemSelector({
    product,
    qty,
    setQty
}: ItemSelectorProps) {

    const {
        addItemToCart,
        removeItemFromCart
    } = useCustomerOrder();

    const subtract = () => {
        setQty(qty - 1);
        removeItemFromCart(product, 1);
    }

    const add = () => {
        setQty(qty + 1);
        addItemToCart(product, 1);
    }


    return (<>
        {product.is_available === true ?
            <div className="itemSelector">
                <button
                    onClick={subtract}
                    disabled={qty <= 0}
                    aria-label="Decrease quantity"
                >
                    -
                </button>
                <p>{qty}</p>
                <button
                    onClick={add}
                    aria-label="Increase quantity"
                >
                    +
                </button>
            </div>
            :
            <div className="itemUnavailable">Item Unavailable</div>}
    </>);
}

