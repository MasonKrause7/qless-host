import { useState } from 'react';
import { signUp } from '../../utils/supabaseService';
import ErrorMessage from '../commonUI/ErrorMessage';
import { useNavigate } from 'react-router-dom';



type SignUpFormProps = {
    setLoginShowing: React.Dispatch<boolean>;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ setLoginShowing }) => {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errorMessageVisible, setErrorMessageVisible] = useState(false);
    


    const handleSignUpSubmission = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessageVisible(false);

        const formData = new FormData(event.currentTarget);
        const email = formData.get("emailSignUp") as string;
        const password = formData.get("passwordSignUp") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        

        if (password !== confirmPassword){
            setErrorMessage("Passwords do not match.");
            setErrorMessageVisible(true);
            return;
        }
        else if (!firstName || firstName.trim() === ""){
            setErrorMessage("Invalid first name input");
            setErrorMessageVisible(true);
            return;
        }
        else if (!lastName || lastName.trim() === ""){
            setErrorMessage("Invalid last name input");
            setErrorMessageVisible(true);
            return;
        }
        else if(!email || email.trim() === "" || email.length < 7){
            setErrorMessage("Invalid last name input");
            setErrorMessageVisible(true);
            return;
        }
        //HANDLE THE REMAINING INPUT FIELDS VALIDATION (ie no name entered, weird characters in name)
        
        const userData = await signUp(email, password, firstName, lastName);
        if (userData){
            setLoginShowing(true);
        }
        
    }

    return <>
        <div className="form">
            <h1>Sign Up Form</h1>
            <form onSubmit={handleSignUpSubmission}>
                <input id='firstName' name="firstName" type="text" placeholder="First Name" onChange={(event) => setFirstName(event.target.value)} />
                <input id='lastName' name='lastName' type="text" placeholder="Last Name" onChange={(event) => setLastName(event.target.value)} />
                <input id='emailSignUp' name='emailSignUp' type="email" placeholder="Email" />
                <input id='passwordSignUp' name='passwordSignUp' type="password" placeholder="Password" />
                <input id='confirmPassword' name='confirmPassword' type="password" placeholder="Confirm Password" />
                <button type="submit">Sign Up</button>
            </form>
            <p>Already have an account? <a>Login</a> instead</p>
            {errorMessageVisible && <ErrorMessage message={errorMessage} />}
        </div>
    </>
}


export default SignUpForm;