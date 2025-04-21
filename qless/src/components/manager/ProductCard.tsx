import '../../styles/manager/managerDashboard.css';
import type { ProductTempDto } from '../../App';

type ProductCardProps = {
    product: ProductTempDto;
    onRemove?: () => void;
    showRemoveButton?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
    product, 
    onRemove,
    showRemoveButton = false
}) => {
    return (
        <div className="cardContainer productCardContainer">
            {product.temp_url && (
                <div className='cardImgContainer'>
                    <img className='card' src={product.temp_url} alt={product.product_name} />
                </div>
            )}
            <div className="productCardContent">
                <h3 className="productName">{product.product_name}</h3>
                <p className="productPrice">${product.price.toFixed(2)}</p>
                <p className="productDescription">{product.description}</p>
            </div>
            
            {showRemoveButton && onRemove && (
                <button 
                    className="productRemoveButton" 
                    onClick={onRemove}
                    aria-label="Remove product"
                >
                    ×
                </button>
            )}
        </div>
    );
};

export default ProductCard;