import { useEffect, useState } from "react";
import { Product } from "../../App";
import { useCustomerOrder } from "../../hooks/CustomerOrderContext";

type ItemCardProps = {
    product: Product
}

export default function ItemCard({
    product
}: ItemCardProps) {

    const {

    } = useCustomerOrder();

    return (
        <>
            <img
                className="productImg"
                src={product.image_path.includes("/image/path") ?
                    "/src/defaultImgs/noimg.png" :
                    product.image_path}
                alt="Product Image"
            />
            <p>{product.product_name}</p>
            <p>{product.description}</p>
            <ItemSelector product={product}/>
        </>
    );
}

type ItemSelectorProps = {
    product: Product;
}

function ItemSelector({
    product
}: ItemSelectorProps) {
    const [subtractDisabled, setSubtractDisabled] = useState<boolean>(true);
    const [qty, setQty] = useState<number>(0);
    const{
        addItemToCart,
        removeItemFromCart
    }=useCustomerOrder();

    const subtract = () => {
        setQty(qty - 1);
        removeItemFromCart(product.product_id, 1, product.price);
    }

    const add = () => {
        setQty(qty + 1);
        addItemToCart(product.product_id, 1, product.price);
    }

    useEffect(() => {
        if (qty <= 0)
            setSubtractDisabled(true);
        else setSubtractDisabled(false);
    }, [qty]);

    return (
        <div className="itemSelector">
            <button onClick={subtract} disabled={subtractDisabled}>-</button>
            <p>{qty}</p>
            <button onClick={add}>+</button>
        </div>
    );
}

