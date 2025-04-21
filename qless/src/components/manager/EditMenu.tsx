import React, { useState, useEffect, useRef } from 'react';
import type { Menu, Product, ProductTempDto } from '../../App';
import '../../styles/manager/menuManagement.css';
import '../../styles/manager/managerDashboard.css';
import { 
    getProducts, 
    updateMenu, 
    uploadProductImage, 
    createProduct, 
    updateProduct,
    deleteProduct 
} from '../../service/supabaseService';
import ErrorMessage from '../commonUI/ErrorMessage';
import ProductCard from './ProductCard';

type EditMenuProps = {
    menu: Menu;
    onCancel: () => void;
    onSave: () => void;
}

const EditMenu: React.FC<EditMenuProps> = ({ menu, onCancel, onSave }) => {
    const productFormRef = useRef<HTMLFormElement>(null);

    const [menuName, setMenuName] = useState<string>(menu.menu_name);
    const [existingProducts, setExistingProducts] = useState<Product[]>([]);
    const [pendingProducts, setPendingProducts] = useState<ProductTempDto[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [productsToDelete, setProductsToDelete] = useState<number[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const products = await getProducts(menu.menu_id);
            if (products) {
                setExistingProducts(products);
            } else {
                setErrorMessage("Failed to fetch menu products");
            }
        };

        fetchProducts();
    }, [menu.menu_id]);

    const handleNewProduct = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const productName: string = formData.get('newProductName') as string;
        const productPriceStr: string = formData.get('newProductPrice') as string;
        const productPriceNum: number = parseFloat(productPriceStr);
        const description: string = formData.get('newProductDescription') as string;
        const imageFile = formData.get('newProductImage') as File | null;

        if (isNaN(productPriceNum)) {
            setErrorMessage("Please enter a valid product price.");
            return;
        }

        let productImageBlob: Blob | null = null;
        let tempUrl: string | null = null; 
        if (imageFile && imageFile.size > 0) {
            const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            const maxSizeMB = 5;

            if (!validTypes.includes(imageFile.type)) {
                setErrorMessage("Invalid file type. Only PNG and JPG are allowed.");
                return;
            }

            if (imageFile.size > maxSizeMB * 1024 * 1024) {
                setErrorMessage("Image must be 5MB or less.");
                return;
            }

            productImageBlob = imageFile;
            tempUrl = URL.createObjectURL(imageFile);
        }

        const newProduct: ProductTempDto = {
            product_name: productName,
            price: productPriceNum,
            description: description,
            image: productImageBlob,
            temp_url: tempUrl
        };

        setPendingProducts(prev => [...prev, newProduct]);
        setErrorMessage(""); // clear any previous errors
        
        // Reset the form after successfully adding a product
        if (productFormRef.current) {
            productFormRef.current.reset();
        }
    };

    const removeExistingProduct = (productId: number) => {
        setProductsToDelete(prev => [...prev, productId]);
    };

    const removePendingProduct = (index: number) => {
        setPendingProducts(prev => {
            const newArray = [...prev];
            if (newArray[index].temp_url) {
                URL.revokeObjectURL(newArray[index].temp_url!);
            }
            newArray.splice(index, 1);
            return newArray;
        });
    };

    const handleSave = async () => {
        if (!menuName || menuName.trim() === "") {
            setErrorMessage("Please enter a valid menu name.");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage("");

        try {
            // Update menu name if changed
            if (menuName !== menu.menu_name) {
                const updated = await updateMenu({
                    ...menu,
                    menu_name: menuName
                });

                if (!updated) {
                    throw new Error("Failed to update menu");
                }
            }

            // Delete products marked for deletion
            for (const productId of productsToDelete) {
                await deleteProduct(productId);
            }

            // Add new products
            for (const product of pendingProducts) {
                let imagePath = null;
                
                // Upload image if available
                if (product.image) {
                    imagePath = await uploadProductImage(
                        product.image, 
                        menu.manager_id, 
                        menu.menu_id
                    );
                    
                    if (!imagePath && product.image) {
                        console.warn(`Failed to upload image for product ${product.product_name}`);
                    }
                }

                // Create the product
                const productResult = await createProduct({
                    product_name: product.product_name,
                    price: product.price,
                    description: product.description,
                    image_path: imagePath,
                    menu_id: menu.menu_id,
                    is_available: true
                });

                if (!productResult) {
                    console.warn(`Failed to create product ${product.product_name}`);
                }
            }

            // Clean up any created object URLs
            pendingProducts.forEach(product => {
                if (product.temp_url) {
                    URL.revokeObjectURL(product.temp_url);
                }
            });

            onSave();
        } catch (error) {
            console.error("Error updating menu:", error);
            setErrorMessage("Failed to update menu. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Function to convert a Product to a display-friendly format for ProductCard
    const productToDisplayFormat = (product: Product): ProductTempDto => {
        return {
            product_name: product.product_name,
            price: product.price,
            description: product.description,
            image: null,
            temp_url: product.image_path
        };
    };

    return (
        <div className="editMenuContainer">
            <h2>Edit Menu</h2>
            
            <div className="createForm">
                <div className="createFormInputGroup">
                    <label htmlFor="menuName">Menu Name</label>
                    <input 
                        className="createFormInput" 
                        id="menuName"
                        name="menuName" 
                        type="text" 
                        value={menuName}
                        onChange={(e) => setMenuName(e.target.value)}
                        required
                    />
                </div>
            </div>

            {/* Existing Products Section */}
            {existingProducts.length > 0 && (
                <div className="existingProductsContainer">
                    <h3>Existing Products</h3>
                    <ul className="pendingProducts">
                        {existingProducts
                            .filter(product => !productsToDelete.includes(product.product_id))
                            .map(product => (
                                <li key={product.product_id} className="pendingProductItem">
                                    <ProductCard 
                                        product={productToDisplayFormat(product)} 
                                        showRemoveButton={true}
                                        onRemove={() => removeExistingProduct(product.product_id)}
                                    />
                                </li>
                            ))
                        }
                    </ul>
                </div>
            )}

            {/* Add New Products Section */}
            <div className="addProductToMenuContainer">
                <h3>Add New Products</h3>
                <form className="createProductForm"
                      onSubmit={handleNewProduct}
                      ref={productFormRef}
                >
                    <div className="createFormInputGroup">
                        <label htmlFor="newProductName">Product Name</label>
                        <input className="createFormInput" type="text" id="newProductName" name="newProductName" required />
                    </div>
                    <div className="createFormInputGroup">
                        <label htmlFor="newProductPrice">Product Price</label>
                        <input className="createFormInput" type="number" id="newProductPrice" name="newProductPrice" step="0.01" required />
                    </div>
                    <div className="createFormInputGroup">
                        <label htmlFor="newProductDescription">Product Description</label>
                        <input className="createFormInput" type="text" id="newProductDescription" name="newProductDescription" required />                                
                    </div>
                    <div className="createFormInputGroup">
                        <label htmlFor="newProductImage">Product Image</label>
                        <input type="file" id="newProductImage" name="newProductImage" accept=".png,.jpg,.jpeg" />
                    </div>
                    <button type="submit" className="addProductButton">Add Product</button>
                </form>
            </div>
            
            {/* Pending New Products Section */}
            {pendingProducts.length > 0 && (
                <div className="pendingProductsContainer">
                    <h3>New Products to Add</h3>
                    <ul className="pendingProducts">
                        {pendingProducts.map((product, index) => (
                            <li key={`new-${index}`} className="pendingProductItem">
                                <ProductCard 
                                    product={product} 
                                    showRemoveButton={true}
                                    onRemove={() => removePendingProduct(index)}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            {/* Action Buttons */}
            <div className="menuSubmitButtonsContainer">
                <button 
                    onClick={onCancel}
                    className="cancelButton"
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSave}
                    className="submitButton"
                    disabled={isSubmitting || (!menuName && pendingProducts.length === 0 && productsToDelete.length === 0)}
                >
                    {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                </button>
            </div>
            
            {errorMessage && <ErrorMessage message={errorMessage} />}
        </div>
    );
};

export default EditMenu;