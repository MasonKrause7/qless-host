import type {User, Truck} from '../App';
import supabase from './supabase';

export async function getManager(){
    const { data: authUser, error: authUserError } = await supabase.auth.getUser();
    if (authUserError) {
        console.log(`Error fetching the authenticated user: ${authUserError}`);
    }
    else if (authUser){
        console.log('User authentication confirmed.');
        const { data: userData, error: userError } = await supabase.from('user').select('*').eq("user_id", authUser.user.id);
        if (userError) {
            console.log(`Error fetching the user: ${userData}`);
        }
        else if (userData && userData.length > 0) {
            console.log('User found successfully.');
            const user: User = userData[0] as User;
            if (user.is_manager){
                console.log(`${user.email} authorization confirmed: manager.`);
                return user;
            }
            else {
                console.log(`${user.email} authorization denied: non-manager.\nRedirecting to login...`);
            }
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


export async function signIn(email:string, password:string){
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });
    if (data.user !== null && data.session !== null){
        console.log(`successfully logged in ${data.user.user_metadata.first_name}`);
        const { data: userData, error: userError } = await supabase.from("user").select('*').eq("user_id", data.user.id);
        if (userData !== null){
            const loggedUser: User = userData[0];
            return loggedUser;
        }
    }
    else if (error !== null){
        console.log(`Error logging in that user: ${error.code}`);
    }
    else{
        console.log(`An unexpected error occured during the login process.`);
    }
    return null;
};

export async function signUp(email: string, password: string, firstName: string, lastName: string){
    try{
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
        else{
            console.log("An unexpected error occured during the sign up process.");
        }
    }
    catch (err){
        console.log("Unable to complete sign up request... ", err);
    }
    return null;
};

export async function getTrucks(manager_id: string){
    const { data, error } = await supabase.from('truck').select().eq("manager_id", manager_id);
    if (error) {
        console.log(`Error fetching trucks: ${error.code}.`);
    }
    else if (data){
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
}