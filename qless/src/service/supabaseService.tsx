import type { User, Truck, InsertTruckDto, Menu, Product, Order, OrderDetail, CartItem } from '../App';
import supabase from '../utils/supabase';

export async function getUser() {
    const { data: authUser, error: authUserError } = await supabase.auth.getUser();
    if (authUserError) {
        console.log(`Error fetching the authenticated user: ${authUserError}`);
    }
    else if (authUser) {
        console.log('User authentication confirmed.');
        const { data: userData, error: userError } = await supabase.from('user').select('*').eq("user_id", authUser.user.id);
        if (userError) {
            console.log(`Error fetching the user: ${userData}`);
        }
        else if (userData && userData.length > 0) {
            console.log('User found successfully.');
            const user: User = userData[0] as User;
            return user;
        }
        else {
            console.log(`An unexpected error occured trying to fetch the user.`);
        }
    }
    else {
        console.log('An unexpected error occured while trying to fetch the authenticated user.');
    }
    return null;
};


export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });
    if (data.user !== null && data.session !== null) {
        console.log(`successfully logged in ${data.user.user_metadata.first_name}`);
        const { data: userData, error: userError } = await supabase.from("user").select('*').eq("user_id", data.user.id);
        if (userData !== null) {
            const loggedUser: User = userData[0];
            return loggedUser;
        }
        else if (userError) {
            console.log('Could not get loggedUser')
        }
    }
    else if (error !== null) {
        console.log(`Error logging in that user: ${error.code}`);
    }
    else {
        console.log(`An unexpected error occured during the login process.`);
    }
    return null;
};

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.log("Error signing out: ", error);
}

export async function signUp(email: string, password: string, firstName: string, lastName: string, isManager = false, preserveSession = false) {
    try {
        // Store the current session if we need to preserve it
        let currentUser = null;
        let currentPassword = null;
        
        if (preserveSession) {
            // Get the current user's email to log back in later
            const { data: userData } = await supabase.auth.getUser();
            if (userData && userData.user) {
                currentUser = userData.user.email;
                // We'll need to ask for the manager's password in the UI
                // For now, we'll use sessionStorage
                currentPassword = sessionStorage.getItem('managerPassword');
                
                if (!currentPassword) {
                    console.log("No manager password found in session storage");
                    // We'll handle this case in the UI
                }
            }
        }
        
        // Regular sign up (this will sign out the current user)
        const { data, error } = await supabase.auth.signUp(
            {
                email: email,
                password: password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        is_manager: isManager
                    }
                }
            }
        );
        
        if (error) {
            console.log("Error while signing up: ", error.code, error.message);
            return null;
        }
        
        if (data.user) {
            console.log('Successfully signed up new user');
            
            // If we need to preserve the session, sign the manager back in
            if (preserveSession && currentUser && currentPassword) {
                console.log('Signing manager back in...');
                
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email: currentUser,
                    password: currentPassword
                });
                
                if (signInError) {
                    console.log("Error signing manager back in: ", signInError.message);
                    // This is a problematic state - the manager is now logged out
                    // We should handle this in the UI
                }
            }
            
            return data.user;
        } else {
            console.log("An unexpected error occurred during the sign up process.");
        }
    }
    catch (err) {
        console.log("Unable to complete sign up request... ", err);
    }
    return null;
}

export async function getTrucks(manager_id: string) {
    const { data, error } = await supabase.from('truck').select().eq("manager_id", manager_id);
    if (error) {
        console.log(`Error fetching trucks: ${error.code}.`);
    }
    else if (data) {
        const truckList: Truck[] = data.map(truck => ({
            truck_id: truck.truck_id,
            truck_name: truck.truck_name,
            image_path: truck.image_path,
            qr_code_path: truck.qr_code_path,
            menu_id: truck.menu_id,
            manager_id: truck.manager_id
        }));
        return truckList;
    }
    else {
        console.log("Unexpected error while fetching trucks...");
    }
    return null;
};

export async function getMenus(manager_id: string) {
    const { data, error } = await supabase.from('menu').select().eq("manager_id", manager_id);
    if (error) {
        console.log(`Error fetching menus: ${error.code}.`);
    }
    else if (data) {
        const menuList: Menu[] = data as Menu[];
        return menuList;
    }
    else {
        console.log("Unexpected error while fetching menus...");
    }
    return null;
};

// New function to create a menu
export async function createMenu(newMenuData: {
    menu_name: string,
    manager_id: string
}): Promise<Menu | null> {
    try {
        const { data, error } = await supabase
            .from('menu')
            .insert(newMenuData)
            .select('*')
            .single();
        
        if (error) {
            console.log(`Error creating menu: ${error.message}`);
            return null;
        }
        
        if (data) {
            console.log(`Successfully created menu: ${data.menu_name}`);
            return data as Menu;
        }
        
        return null;
    } catch (err) {
        console.log("Exception thrown in createMenu", err);
        return null;
    }
}

// New function to upload product image
export async function uploadProductImage(file: Blob, manager_id: string, menu_id: number): Promise<string | null> {
    try {
        const now = new Date();
        const isoTimestamp = now.toISOString();
        const filePath = `/product-images/manager-${manager_id}/menu-${menu_id}/uploaded-${isoTimestamp}`;
        
        const { data: response, error } = await supabase.storage
            .from('products')
            .upload(filePath, file);
            
        if (error) {
            console.log("Error uploading product image: ", error.message);
            return null;
        }
        
        const { data: pubUrl } = supabase.storage
            .from('products')
            .getPublicUrl(response.path);
            
        console.log("Successfully stored product image:", pubUrl.publicUrl);
        return pubUrl.publicUrl;
    } catch (err) {
        console.log("Exception thrown in uploadProductImage", err);
        return null;
    }
}

// New function to create a product
export async function createProduct(productData: {
    product_name: string,
    price: number,
    description: string,
    image_path: string | null,
    menu_id: number,
    is_available: boolean
}): Promise<Product | null> {
    try {
        const { data, error } = await supabase
            .from('product')
            .insert(productData)
            .select('*')
            .single();
            
        if (error) {
            console.log(`Error creating product: ${error.message}`);
            return null;
        }
        
        if (data) {
            console.log(`Successfully created product: ${data.product_name}`);
            return data as Product;
        }
        
        return null;
    } catch (err) {
        console.log("Exception thrown in createProduct", err);
        return null;
    }
}

export async function uploadTruckImage(file: File, manager_id: string) {
    const now = new Date();
    const isoTimestamp = now.toISOString();
    const filePath = `/truck-images/manager-${manager_id}/uploaded-${isoTimestamp}`;
    const { data: response, error } = await supabase.storage.from('trucks').upload(filePath, file);
    if (error) {
        // Handle error
        console.log("There was an error uploading the image: ", error.message);
        return null;
    } else {
        // Handle success
        console.log("successfully stored image!");
        console.log(response);
        const { data: pubUrl } = supabase.storage.from('trucks').getPublicUrl(response.path);

        console.log(pubUrl);
        return pubUrl.publicUrl

    }
};

export async function postTruck(newTruck: InsertTruckDto) {
    const { data, error } = await supabase.from("truck").insert(newTruck).select("*");
    if (error) {
        console.log(`Error inserting truck ${newTruck.truck_name}`);
        return null
    }
    else if (data && data.length > 0) {
        const newTruck = data[0] as Truck;
        return newTruck;
    }
    else {
        console.log("An unexpected error occurred while inserting truck: ", newTruck.truck_name);
        return null
    }

}

export async function getTruckById(truck_id: number) {
    const { data, error } = await supabase.from('truck').select("*").eq("truck_id", truck_id);
    if (error) {
        console.log(`Error getting truck ${truck_id}: `, error);
        return null;
    }
    else if (data && data.length > 0) {
        return data[0] as Truck;
    }
    else {
        console.trace("getTruckById() trace for truck_id=", truck_id);
        console.log("An unexpected error occurred while fetching truck with id=", truck_id);
        return null;
    }
};

export async function getMenuById(menu_id: number) {
    const { data, error } = await supabase.from('menu').select("*").eq("menu_id", menu_id);
    if (error) {
        console.log("Error occurred while getting the menu with id ", menu_id, error);
        return null;
    }
    else if (data && data.length > 0) {
        return data[0] as Menu;
    }
    else {
        console.log("An unexpected error occurred while getting the menu with id ", menu_id);
        return null;
    }
}

export async function getProducts(menu_id: number) {
    const { data, error } = await supabase.from('product').select("*").eq("menu_id", menu_id);
    if (error) {
        console.log(`Error getting products for menu ${menu_id}: ${error.message}`);
        return null;
    }
    else if (data) {
        return data as Product[];
    }
    else {
        console.log(`Unexpected error while getting products for menu ${menu_id}.`);
        return null;
    }
}

export async function uploadQrCode(truck_id: number, blob: Blob) {
    const fileName = `truck-${truck_id}.png`;
    // Upload to Supabase Storage (upsert allows overwriting)
    const { data, error } = await supabase.storage
        .from("qr-codes")
        .upload(fileName, blob);

    if (error) throw error;
    else if (data) {
        console.log(`QR code generated and uploaded successfully`);
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
        .from("qr-codes")
        .getPublicUrl(fileName);

    return publicUrlData.publicUrl; // Return the QR Code's public URL
}

//in progress
export async function updateTruck(updatedTruck: Truck) {

    const { error } = await supabase
        .from('truck')
        .update({
            truck_name: updatedTruck.truck_name,
            qr_code_path: updatedTruck.qr_code_path,
            image_path: updatedTruck.image_path,
            menu_id: updatedTruck.menu_id,
        })
        .eq("truck_id", updatedTruck.truck_id);
    if (error) {
        console.log(`Error updating truck ${updatedTruck.truck_id}: ${error.message}`);
    }

}
export async function getOrdersByManagerId(managerId: string){  
    try {
        const { data: truckData, error: truckError } = await supabase
            .from("truck")
            .select("*")
            .eq("manager_id", managerId);
        if (truckError){
            console.log("Error getting orders by manager id, failed to get truck data: ", truckError);
            return null;
        }
        if (truckData){
            if (truckData.length === 0){
                console.log("gettingOrdersByManagerId is stopping because that manager has no trucks");
                return [];
            }
            //now use truck_ids to get orders
            const truck_ids: number[] = truckData.map(truck => (truck.truck_id));
            const { data: orderData, error: orderError } = await supabase
                .from("orders")
                .select("*")
                .in("truck_id", truck_ids);
            if (orderError){
                console.log("Error getting orders by manager id: ", orderError);
                return null;
            }
            if (orderData){
                if (orderData.length === 0){
                    console.log('This managers trucks have no orders');
                    return [];
                }
                const orderList: Order[] = orderData as Order[];
                orderList.sort((a,b) => a.order_id - b.order_id);
                return orderList; 
            }
        }
    }
    catch(err){
        console.log("Exception thrown in getOrdersByManagerId for manager id: ", managerId, ": ", err);
    }
    return null;
}

export async function getOrdersByEmployeeId(employeeId: string){
    try{
        const { data: truckAssignmentData, error: truckAssignmentError } = await supabase
            .from("truck_assignment")
            .select("*")
            .eq("employee_id", employeeId);
        if(truckAssignmentError){
            console.log("Error getting orders by employee id, failed to get truck assignment data: ", truckAssignmentError);
            return null;
        }
        if (truckAssignmentData){
            if (truckAssignmentData.length === 0){
                console.log("This employee does not have a truck assignment");
                return null;
            }
            const truckId: number = truckAssignmentData[0].truck_id;
            console.log("Successfully retrieved truck_assignment, querying orders for truck_id: ", truckId);
            //now fetch the order
            const { data: orderData, error: orderError } = await supabase
                .from("orders")
                .select("*")
                .eq("truck_id", truckId);
            
            if(orderError){
                console.log("Error getting orders by employee id, failed to get order data: ", orderError);
                return null;
            }
            if (orderData){
                if (orderData.length === 0){
                    console.log("There are no orders for truck id: ", truckId);
                    return [];
                }
                const orderList: Order[] = orderData as Order[];
                orderList.sort((a,b) => a.order_id - b.order_id);
                return orderList; 
            }

        }
    }
    catch(err){
        console.log("Exception thrown in getOrdersByEmployeeId for employeeId: ", employeeId, ": ", err);
    }
    return null;
}

export async function getOrders() {
    try {
        const { data, error } = await supabase.from('orders').select();
        if (data) {
            const orderList: Order[] = data as Order[];
            orderList.sort((a, b) => a.order_id - b.order_id);
            return orderList;
        }
        else if (error) {
            console.log("Error in getOrders: ", error);
        }
        else {
            console.log("Unexpected error in getOrders...");
        }
    } catch (err) {
        console.log("Exception thrown in getOrders", err);
    }
    return null;
}

export async function updateOrderStatus(orderId: number, updateData: Partial<Order>): Promise<boolean | undefined> {
    try {
        const { error } = await supabase
            .from('orders')
            .update(updateData)
            .eq('order_id', orderId);
        if (error) {
            console.log(`Error updating order status for order num ${orderId}`, error);

        } else {
            return true;
        }
    }
    catch (err) {
        console.log("Exception thrown in updateOrderStatus", err);
    }
}

export async function getEmployeeTruck(userId: string): Promise<number | null> {
    try {
        const { data, error } = await supabase.from('truck_assignment').select('truck_id').eq('employee_id', userId);
        if (data) {
            return parseInt(data[0].truck_id);
        } else if (error) {
            console.log("Error in getEmployeeTruck: ", error);
        } else {
            console.log("Unexpected error in getEmplyoeeTruck...");
        }
    } catch (err) {
        console.log('Exception thrown in getEmployeeTruck', err);
    }
    return null;
}

export async function getOrderDetails(orderNum: number) {
    if (orderNum !== 0) {
        try {

            const { data, error } = await supabase.from('order_product').select(`
                        order_product_id,
                        qty,
                        product(
                            product_name,
                            price,
                            description,
                            image_path
                        )`).eq('order_id', orderNum);
            if (data) {
                const currOrder: OrderDetail[] = data.map(detail => ({
                    order_product_id: detail.order_product_id,
                    qty: detail.qty,
                    product: Array.isArray(detail.product) ? detail.product[0] : detail.product
                }))
                return currOrder;

            } else if (error) {
                console.log("Error in getOrderDetails: ", error);
            } else {
                console.log("Unexpected error in getOrderDetails...");
            }
        }
        catch (err) {
            console.log("Exception thrown in getOrderDetails", err);
        }
    }
}

export const updateTruckMenu = async (truckId: number, menuId: number | null): Promise<Truck | null> => {
    try {
      const { data, error } = await supabase
        .from('truck')
        .update({ menu_id: menuId })
        .eq('truck_id', truckId)
        .select('*')
        .single();
  
      if (error) {
        console.error('Error updating truck menu:', error);
        return null;
      }
  
      return data as Truck;
    } catch (error) {
      console.error('Exception when updating truck menu:', error);
      return null;
    }
  };

  // Add these functions to the existing supabaseService.tsx file

// Function to update menu details
export async function updateMenu(updatedMenu: Menu): Promise<Menu | null> {
    try {
        const { data, error } = await supabase
            .from('menu')
            .update({ menu_name: updatedMenu.menu_name })
            .eq('menu_id', updatedMenu.menu_id)
            .select('*')
            .single();

        if (error) {
            console.log(`Error updating menu: ${error.message}`);
            return null;
        }

        if (data) {
            console.log(`Successfully updated menu: ${data.menu_name}`);
            return data as Menu;
        }

        return null;
    } catch (err) {
        console.log("Exception thrown in updateMenu", err);
        return null;
    }
}

// Function to update product details
export async function updateProduct(productId: number, productData: {
    product_name?: string,
    price?: number,
    description?: string,
    image_path?: string | null,
    is_available?: boolean
}): Promise<Product | null> {
    try {
        const { data, error } = await supabase
            .from('product')
            .update(productData)
            .eq('product_id', productId)
            .select('*')
            .single();

        if (error) {
            console.log(`Error updating product: ${error.message}`);
            return null;
        }

        if (data) {
            console.log(`Successfully updated product: ${data.product_name}`);
            return data as Product;
        }

        return null;
    } catch (err) {
        console.log("Exception thrown in updateProduct", err);
        return null;
    }
}

// Function to delete a product
export async function deleteProduct(productId: number): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('product')
            .delete()
            .eq('product_id', productId);

        if (error) {
            console.log(`Error deleting product: ${error.message}`);
            return false;
        }

        console.log(`Successfully deleted product with ID: ${productId}`);
        return true;
    } catch (err) {
        console.log("Exception thrown in deleteProduct", err);
        return false;
    }
}

// Function to delete a menu and all associated products
export async function deleteMenu(menuId: number): Promise<boolean> {
    try {
        // First delete all products associated with this menu
        const { error: productsError } = await supabase
            .from('product')
            .delete()
            .eq('menu_id', menuId);

        if (productsError) {
            console.log(`Error deleting menu products: ${productsError.message}`);
            return false;
        }

        // Then delete the menu itself
        const { error: menuError } = await supabase
            .from('menu')
            .delete()
            .eq('menu_id', menuId);

        if (menuError) {
            console.log(`Error deleting menu: ${menuError.message}`);
            return false;
        }

        console.log(`Successfully deleted menu with ID: ${menuId}`);
        return true;
    } catch (err) {
        console.log("Exception thrown in deleteMenu", err);
        return false;
    }
}



export async function uploadNewOrder(order: Partial<Order>) {
    order.time_received = new Date();
    if (
        order.subtotal === null ||
        order.tax_rate === null ||
        order.customer_phone_number === null ||
        order.status_id === null ||
        order.truck_id === null
    ) {
        console.log("Missing order data in uploadNewData");
        return;
    }
    const { data, error } = await supabase.from('orders').insert(order).select();
    if (error) {
        console.log("Error in uploadNewOrder: ", error);
    } else if (data.length > 0) {
        return data[0] as Order;
    } else {
        console.log("Unexpected error in uploadNewOrder");
    }
}

export async function uploadCart(orderId: number, cart: CartItem[]) {
    let noError = true;
    cart.forEach(async item => {
        const { error } = await supabase.from('order_product').insert({
            qty: item.qty,
            order_id: orderId,
            product_id: item.product.product_id
        });
        if (error){
            console.log(`Error uploading ${item.product.product_name}`);
            noError = false;
        }
    });
    return noError;
}