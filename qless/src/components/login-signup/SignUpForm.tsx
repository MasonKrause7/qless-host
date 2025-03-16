import { useState } from 'react';
import supabase from '../../utils/supabase';


type SignUpFormProps = {
    setLoginShowing: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ setLoginShowing }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    


    const handleSignUpSubmission = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const notificationText = document.getElementById('signUpErrorNotification');
        if (notificationText === null) return;

        const formData = new FormData(event.currentTarget);
        const email = formData.get("emailSignUp") as string;
        const password = formData.get("passwordSignUp") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        

        if (password !== confirmPassword){
            notificationText.innerText = 'The password and password confirmation do not match. Please double check your entries and try again.';
            return;
        }
        //HANDLE THE REMAINING INPUT FIELDS VALIDATION (ie no name entered, weird characters in name)
        
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
                setLoginShowing(); 
                
            }
            else if (error) {
                console.log("Error occured while attempting sign up.");
                console.log("Error: ", error.code, error.message);
                //ADD IN SPECIFIC ERROR HANDLING, DISPLAY A NOTIFICATION BASED ON THE SPECIFIC ERROR (invalid fields, already registered, etc...)
                if (error.code === "user_already_exists"){
                    notificationText.innerText = "An account is already registered with that email. Try logging in instead.";
                }
                else{
                    notificationText.innerText = "Invalid signup, check all fields and try again.";
                }
                
            }
            else{
                console.log("An unexpected error occured during the sign up process.");
            }
        }
        catch (err){
            console.log("Unable to complete sign up request... ", err);
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
            <p id='signUpErrorNotification' className='errorNotificationText'></p>
        </div>
    </>
}


export default SignUpForm;