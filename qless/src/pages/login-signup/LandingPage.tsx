import { useState } from 'react';
import SignUpForm from '../../components/login-signup/SignUpForm';
import LoginForm from '../../components/login-signup/LoginForm';
import '../../styles/landing.css';




function LandingPage() {
    const [loginShowing, setLoginShowing] = useState<boolean>(true);

    const handleSignUpSuccess = () => {
        setLoginShowing(true);
        const signUpSuccessNotification = document.getElementById("signUpSuccessNotification");
        if (signUpSuccessNotification !== null){
            signUpSuccessNotification.innerText = "Successfully signed up. Use your new credentials to login.";
        }
    }
    const handleLoginAttempt = () => {
        const signUpSuccessNotification = document.getElementById('signUpSuccessNotification');
        if (signUpSuccessNotification !== null){
            signUpSuccessNotification.innerText = "";
        }
    }


    return (
        <div className='pageContainer'>
            <div className='tabContainer'>
                <button className='tab' onClick={() => setLoginShowing(true)}>Login</button>
                <button className='tab' onClick={() => setLoginShowing(false)}>Sign Up</button>
            </div>
            <p id='signUpSuccessNotification' className='successNotificationText'></p>
            <div className='formContainer'> 
                {loginShowing && <LoginForm handleLoginAttempt={handleLoginAttempt} />}
                {!loginShowing && <SignUpForm setLoginShowing={handleSignUpSuccess} />} 
            </div>
        </div>
    )
}


export default LandingPage;