import '../../styles/manager/managerDashboard.css';
import type { ProductTempDto } from '../../App';

type ProductCardProps = {
    product: ProductTempDto
}
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {


    return (
        <>
            <div className="cardContainer">
                {product.temp_url && <div className='cardImgContainer'><img className='card' src={product.temp_url} /></div>}
                <p>{product.product_name}</p>
                <p>{product.price}</p>
                <p>{product.description}</p>
            </div>
        </>
    )
}

export default ProductCard;