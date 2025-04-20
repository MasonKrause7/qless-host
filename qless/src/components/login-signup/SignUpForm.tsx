import { useState } from 'react';
import { signUp } from '../../service/supabaseService';
import ErrorMessage from '../commonUI/ErrorMessage';

const SignUpForm: React.FC = () => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errorMessageVisible, setErrorMessageVisible] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSignUpSubmission = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessageVisible(false);

        const formData = new FormData(event.currentTarget);
        const email = formData.get("emailSignUp") as string;
        const password = formData.get("passwordSignUp") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            setErrorMessageVisible(true);
            return;
        } else if (!firstName || firstName.trim() === "") {
            setErrorMessage("Invalid first name input");
            setErrorMessageVisible(true);
            return;
        } else if (!lastName || lastName.trim() === "") {
            setErrorMessage("Invalid last name input");
            setErrorMessageVisible(true);
            return;
        } else if (!email || email.trim() === "" || email.length < 7) {
            setErrorMessage("Invalid email input");
            setErrorMessageVisible(true);
            return;
        }
        
        // Sign up as a manager (true)
        const userData = await signUp(email, password, firstName, lastName, true);
        if (userData) {
            setShowSuccess(true);
            setTimeout(() => {
                // Redirect to login after signup
                window.location.href = "/";
            }, 3000);
        } else {
            setErrorMessage("Failed to create account. Please try again.");
            setErrorMessageVisible(true);
        }
    }

    return (
        <div className="auth-form">
            {showSuccess ? (
                <div className="success-message">
                    <h3>Account Created Successfully!</h3>
                    <p>Redirecting to login page...</p>
                </div>
            ) : (
                <form onSubmit={handleSignUpSubmission}>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input 
                            id='firstName' 
                            name="firstName" 
                            type="text" 
                            placeholder="Enter your first name" 
                            onChange={(event) => setFirstName(event.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input 
                            id='lastName' 
                            name='lastName' 
                            type="text" 
                            placeholder="Enter your last name" 
                            onChange={(event) => setLastName(event.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="emailSignUp">Email</label>
                        <input 
                            id='emailSignUp' 
                            name='emailSignUp' 
                            type="email" 
                            placeholder="Enter your email" 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="passwordSignUp">Password</label>
                        <input 
                            id='passwordSignUp' 
                            name='passwordSignUp' 
                            type="password" 
                            placeholder="Create a password" 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input 
                            id='confirmPassword' 
                            name='confirmPassword' 
                            type="password" 
                            placeholder="Confirm your password" 
                            required 
                        />
                    </div>
                    <button type="submit" className="auth-button">Sign Up</button>
                    
                    {errorMessageVisible && <ErrorMessage message={errorMessage} />}
                </form>
            )}
        </div>
    )
}

export default SignUpForm;