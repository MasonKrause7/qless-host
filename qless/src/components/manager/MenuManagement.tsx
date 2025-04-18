import type { Menu, ProductTempDto, ManagementSubDashProps } from '../../App';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuCard from './MenuCard';
import '../../styles/manager/menuManagement.css'
import '../../styles/manager/managerDashboard.css'
import { getMenus } from '../../service/supabaseService';
import ErrorMessage from '../commonUI/ErrorMessage';
import ProductCard from './ProductCard';

const MenuManagement: React.FC<ManagementSubDashProps> = ({ manager }) => {
    const navigate = useNavigate();
    const productFormRef = useRef<HTMLFormElement>(null);

    const [menus, setMenus] = useState<Menu[]>([]);
    const [creatingMenu, setCreatingMenu] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [pendingProducts, setPendingProducts] = useState<ProductTempDto[]>([]);

    useEffect(() => {
        const fetchMenus = async () => {
            const potentialMenus: Menu[] | null = await getMenus(manager.user_id);
            if (!potentialMenus){
                console.log("Could not get menus in menuManagement dashboard");
                setErrorMessage("Unable to pull your menus...");
                return;
            }
            const actualMenus: Menu[] = potentialMenus;
            setMenus(actualMenus);
        }
        fetchMenus();
    }, [manager, navigate]);

    const createMenu = () => {
        //IMPLEMENT MENU CREATION
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
    }

    return (
        <div>
            <h2 className='pageTitle'>Manage Menus</h2>
            {!creatingMenu && <div className='managementContainer'>
                <div className='managementItemList'>
                    <ul className='menuCards'>
                        {menus && menus.map(menu => (
                            <li key={menu.menu_id}>
                                <MenuCard menu={menu} />
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
            </div>}

            {creatingMenu && <div>
                <form onSubmit={createMenu}
                      className='createForm'
                >
                    <div className='createFormInputGroup'>
                        <label htmlFor="newMenuName">Menu Name</label>
                        <input className='createFormInput' name='newMenuName' type="text" />
                    </div>

                    <p>
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
                        <button type='submit'>Add Product</button>
                    </form>
                </div>
                <ul className='pendingProducts'>
                    {pendingProducts.map((product, index) => (
                        <li key={`${product.product_name}-${index}`}>
                            <ProductCard product={product} />
                        </li>
                    ))}
                </ul> 
                <button onClick={() => createMenu()}>Submit New Menu</button>
            </div>}
        
            {errorMessage && <ErrorMessage message={errorMessage} />}
        </div>
    )
}

export default MenuManagement;