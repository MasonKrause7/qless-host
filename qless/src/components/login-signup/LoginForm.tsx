import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../commonUI/ErrorMessage';
import { signIn } from '../../service/supabaseService';


const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    
    const [errorMessage, setErrorMessage] = useState("");
    const [errorMessageVisible, setErrorMessageVisible] = useState(false);
    


    const handleLoginSubmission = async (event: React.FormEvent<HTMLFormElement>)=> {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);
        const email = formData.get("emailLogin") as string;
        const password = formData.get("passwordLogin") as string;

        const authenticatedUser = await signIn(email, password);
        if (!authenticatedUser){
            setErrorMessage("Authentication failed. Please try again, reset your password, or create an account instead.");
            setErrorMessageVisible(true);
            return;
        }
        else{
            if(authenticatedUser.is_manager){
                navigate('/manage');
            }
            else{
                navigate('/cook');
            }
        }


    }

    return (
        <div>
            <h1>Login Form</h1>
            <form onSubmit={handleLoginSubmission}>
                <input id='emailLogin' name="emailLogin" type="email" placeholder="Email" />
                <input id='passwordLogin' name="passwordLogin" type="password" placeholder="Password" />
                <button type="submit">Login</button>
                
                {errorMessageVisible && <ErrorMessage message={errorMessage} />}
            </form>
        </div>
    )
}


export default LoginForm;