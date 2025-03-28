import type {User} from '../App';
import supabase from './supabase';

export async function getUserWithManagerAuthorizationCheck(){
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
                console.log('Granting access to management dashboard');
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