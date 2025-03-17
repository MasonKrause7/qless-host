import supabase from '../../utils/supabase';
import { useNavigate } from 'react-router-dom';


export type User = {
    first_name: string,
    last_name: string,
    email: string,
    user_id: string,
    is_manager: boolean
}
type LoginFormProps = {
    handleLoginAttempt: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ handleLoginAttempt }) => {

    const navigate = useNavigate();

    const handleLoginSubmission = async (event: React.FormEvent<HTMLFormElement>)=> {
        event.preventDefault();
        handleLoginAttempt();
        const loginErrorNotification = document.getElementById('loginErrorNotification');
        if (loginErrorNotification === null){
            return;
        }
        const formData = new FormData(event.currentTarget);
        const email = formData.get("emailLogin") as string;
        const password = formData.get("passwordLogin") as string;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            if (data.user !== null && data.session !== null){
                console.log(`successfully logged in ${data.user.user_metadata.first_name}`);
                const { data: userData, error: userError } = await supabase.from("user").select('*').eq("user_id", data.user.id);
                if (userData !== null){
                    const loggedUser: User = userData[0] 

                    if (loggedUser.is_manager){
                        navigate('/manage', { state: {loggedUser} });
                    }
                    else{
                        navigate('/cook');
                    }
                }
                else if (userError !== null){
                    loginErrorNotification.innerText = "There was an error creating User object...";
                }
                
            }
            else if (error !== null){
                console.log(`Error logging in that user: ${error.code}`);
                //add specific error handling depending on error.code
                if (error.code === 'invalid_credentials'){
                    loginErrorNotification.innerText = "Invalid credentials. Check your email and password and try again."
                }
                else{
                    loginErrorNotification.innerText = "Error logging in, please try again."
                }
            }
            else{
                console.log(`An unexpected error occured during the login process.`);
                loginErrorNotification.innerText = "An unexpected error occured while logging in. Please try again or contact support."
            }
        }
        catch (err){
           console.log("Unable to complete login request... ", err);
        }

    }

    return (
        <div>
            <h1>Login Form</h1>
            <form onSubmit={handleLoginSubmission}>
                <input id='emailLogin' name="emailLogin" type="email" placeholder="Email" />
                <input id='passwordLogin' name="passwordLogin" type="password" placeholder="Password" />
                <button type="submit">Login</button>
                
                <p id='loginErrorNotification' className='errorNotificationText'></p>
            </form>
        </div>
    )
}


export default LoginForm;