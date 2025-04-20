import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../commonUI/ErrorMessage';
import { useUser } from '../../hooks/UserContext';
import '../../styles/landing.css';

const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    
    const [errorMessage, setErrorMessage] = useState("");
    const [errorMessageVisible, setErrorMessageVisible] = useState(false);
    const { login } = useUser();

    const handleLoginSubmission = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);
        const email = formData.get("emailLogin") as string;
        const password = formData.get("passwordLogin") as string;

        const authenticatedUser = await login(email, password);
        if (!authenticatedUser) {
            setErrorMessage("Authentication failed. Please try again, reset your password, or create an account instead.");
            setErrorMessageVisible(true);
            return;
        } else {
            if (authenticatedUser.is_manager) {
                navigate('/manage');
            } else {
                navigate('/cook');
            }
        }
    }

    return (
        <div className="auth-form">
            <form onSubmit={handleLoginSubmission}>
                <div className="form-group">
                    <label htmlFor="emailLogin">Email</label>
                    <input id='emailLogin' name="emailLogin" type="email" placeholder="Enter your email" required />
                </div>
                <div className="form-group">
                    <label htmlFor="passwordLogin">Password</label>
                    <input id='passwordLogin' name="passwordLogin" type="password" placeholder="Enter your password" required />
                </div>
                <button type="submit" className="auth-button">Login</button>
                
                {errorMessageVisible && <ErrorMessage message={errorMessage} />}
            </form>
        </div>
    )
}

export default LoginForm;