import type { Menu, ProductTempDto, ManagementSubDashProps } from '../../App';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuCard from './MenuCard';
import EditMenu from '../../components/manager/EditMenu';
import '../../styles/manager/menuManagement.css'
import '../../styles/manager/managerDashboard.css'
import { getMenus, createMenu as createMenuInDB, uploadProductImage, createProduct } from '../../service/supabaseService';
import ErrorMessage from '../commonUI/ErrorMessage';
import ProductCard from './ProductCard';

const MenuManagement: React.FC<ManagementSubDashProps> = ({ manager }) => {
    const navigate = useNavigate();
    const productFormRef = useRef<HTMLFormElement>(null);

    const [menus, setMenus] = useState<Menu[]>([]);
    const [creatingMenu, setCreatingMenu] = useState<boolean>(false);
    const [editingMenuId, setEditingMenuId] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [pendingProducts, setPendingProducts] = useState<ProductTempDto[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [menuName, setMenuName] = useState<string>("");

    useEffect(() => {
        fetchMenus();
    }, [manager, navigate]);

    const fetchMenus = async () => {
        const potentialMenus: Menu[] | null = await getMenus(manager.user_id);
        if (!potentialMenus) {
            console.log("Could not get menus in menuManagement dashboard");
            setErrorMessage("Unable to pull your menus...");
            return;
        }
        const actualMenus: Menu[] = potentialMenus;
        setMenus(actualMenus);
    };

    const createMenu = async (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault();
        }
        
        if (!menuName || menuName.trim() === "") {
            setErrorMessage("Please enter a valid menu name.");
            return;
        }

        if (pendingProducts.length === 0) {
            setErrorMessage("Please add at least one product to your menu.");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage("");

        try {
            // Create the new menu
            const newMenu = await createMenuInDB({
                menu_name: menuName,
                manager_id: manager.user_id
            });

            if (!newMenu) {
                throw new Error("Failed to create menu");
            }

            // Upload products and associate them with the menu
            for (const product of pendingProducts) {
                let imagePath = null;
                
                // Upload image if available
                if (product.image) {
                    imagePath = await uploadProductImage(
                        product.image, 
                        manager.user_id, 
                        newMenu.menu_id
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
                    menu_id: newMenu.menu_id,
                    is_available: true
                });

                if (!productResult) {
                    console.warn(`Failed to create product ${product.product_name}`);
                }
            }

            // Release any created object URLs
            pendingProducts.forEach(product => {
                if (product.temp_url) {
                    URL.revokeObjectURL(product.temp_url);
                }
            });

            // Reset state and fetch updated menus
            setPendingProducts([]);
            setMenuName("");
            setCreatingMenu(false);
            
            // Fetch updated menus
            await fetchMenus();
            
        } catch (error) {
            console.error("Error creating menu:", error);
            setErrorMessage("Failed to create menu. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

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

    // New function to handle edit menu button click
    const handleEditMenuClick = (menuId: number) => {
        setEditingMenuId(menuId);
    };

    // Function to cancel menu creation and reset state
    const cancelMenuCreation = () => {
        // Release any object URLs to prevent memory leaks
        pendingProducts.forEach(product => {
            if (product.temp_url) {
                URL.revokeObjectURL(product.temp_url);
            }
        });
        
        setPendingProducts([]);
        setMenuName("");
        setCreatingMenu(false);
        setErrorMessage("");
    };

    // Function to cancel menu editing
    const cancelMenuEditing = () => {
        setEditingMenuId(null);
    };

    // Function to handle when menu editing is saved
    const handleMenuEditSaved = async () => {
        await fetchMenus();
        setEditingMenuId(null);
    };

    // Function to remove a product from the pending list
    const removeProduct = (index: number) => {
        setPendingProducts(prev => prev.filter((_, i) => i !== index));
    };

    // Find the menu being edited
    const menuBeingEdited = editingMenuId ? menus.find(m => m.menu_id === editingMenuId) : null;

    return (
        <div>
            <h2 className='pageTitle'>Manage Menus</h2>
            
            {/* Main menu list view */}
            {!creatingMenu && editingMenuId === null && (
                <div className='managementContainer'>
                    <div className='managementItemList'>
                        <ul className='menuCards'>
                            {menus && menus.map(menu => (
                                <li key={menu.menu_id}>
                                    <MenuCard 
                                        menu={menu} 
                                        onEditClick={handleEditMenuClick}
                                    />
                                </li> 
                            ))}
                            <li className='lastMenuCard'>
                                <button className='addMenuButton'
                                        onClick={() => setCreatingMenu(true)}
                                >
                                    Add Menu
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            {/* Create menu view */}
            {creatingMenu && (
                <div className='createMenuContainer'>
                    <form onSubmit={createMenu}
                          className='createForm'
                    >
                        <div className='createFormInputGroup'>
                            <label htmlFor="newMenuName">Menu Name</label>
                            <input 
                                className='createFormInput' 
                                name='newMenuName' 
                                type="text" 
                                value={menuName}
                                onChange={(e) => setMenuName(e.target.value)}
                                required
                            />
                        </div>

                        <p className='menuCreationInstructions'>
                            Now that you've named your menu, add the products it will offer.
                        </p>
                    </form>
                    <div className='addProductToMenuContainer'>
                        <form className='createProductForm'
                              onSubmit={handleNewProduct}
                              ref={productFormRef}
                        >
                            <div className='createFormInputGroup'>
                                <label htmlFor="newProductName">Product Name</label>
                                <input className='createFormInput' type="text" id='newProductName' name='newProductName' required />
                            </div>
                            <div className='createFormInputGroup'>
                                <label htmlFor="newProductPrice">Product Price</label>
                                <input className='createFormInput' type="number" id='newProductPrice' name='newProductPrice' step="0.01" required />
                            </div>
                            <div className='createFormInputGroup'>
                                <label htmlFor="newProductDescription">Product Description</label>
                                <input className='createFormInput' type="text" id='newProductDescription' name='newProductDescription' required />                                
                            </div>
                            <div className='createFormInputGroup'>
                                <label htmlFor="newProductImage">Product Image</label>
                                <input type="file" id='newProductImage' name='newProductImage' accept=".png,.jpg,.jpeg" />
                            </div>
                            <button type='submit' className='addProductButton'>Add Product</button>
                        </form>
                    </div>
                    
                    {pendingProducts.length > 0 && (
                        <div className='pendingProductsContainer'>
                            <h3>Products to be added</h3>
                            <ul className='pendingProducts'>
                                {pendingProducts.map((product, index) => (
                                    <li key={`${product.product_name}-${index}`} className='pendingProductItem'>
                                        <ProductCard 
                                            product={product} 
                                            showRemoveButton={true}
                                            onRemove={() => removeProduct(index)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    <div className='menuSubmitButtonsContainer'>
                        <button 
                            onClick={cancelMenuCreation}
                            className='cancelButton'
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => createMenu()}
                            className='submitButton'
                            disabled={isSubmitting || pendingProducts.length === 0 || !menuName}
                        >
                            {isSubmitting ? 'Creating Menu...' : 'Submit New Menu'}
                        </button>
                    </div>
                </div>
            )}

            {/* Edit menu view */}
            {editingMenuId !== null && menuBeingEdited && (
                <EditMenu 
                    menu={menuBeingEdited}
                    onCancel={cancelMenuEditing}
                    onSave={handleMenuEditSaved}
                />
            )}
        
            {errorMessage && <ErrorMessage message={errorMessage} />}
        </div>
    );
};

export default MenuManagement;