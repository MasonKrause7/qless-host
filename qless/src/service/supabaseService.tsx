import type { User, Truck, InsertTruckDto, Menu, Product, Order, OrderDetail } from '../App';
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

export async function signUp(email: string, password: string, firstName: string, lastName: string) {
    try {
        const { data, error } = await supabase.auth.signUp(
            {
                email: email,
                password: password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        is_manager: true
                    }
                }
            }
        );
        if (data.user !== null) {
            console.log('Successfully signed up');
            return data.user;
        }
        else if (error) {
            console.log("Error while signing up: ", error.code, error.message);
        }
        else {
            console.log("An unexpected error occured during the sign up process.");
        }
    }
    catch (err) {
        console.log("Unable to complete sign up request... ", err);
    }
    return null;
};

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
            console.log("Exception thrown in getORderDetails", err);
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