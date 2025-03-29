import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SignUpForm from '../../components/login-signup/SignUpForm';
import LoginForm from '../../components/login-signup/LoginForm';
import '../../styles/landing.css';
import ErrorMessage from '../../components/commonUI/ErrorMessage';




function LandingPage() {
  
    const [loginShowing, setLoginShowing] = useState<boolean>(true);
    


    return (
        <div className='pageContainer'>
            <div className='tabContainer'>
                <button className='tab' onClick={() => setLoginShowing(true)}>Login</button>
                <button className='tab' onClick={() => setLoginShowing(false)}>Sign Up</button>
            </div>

            <div className='formContainer'> 
                {loginShowing && <LoginForm />}
                {!loginShowing && <SignUpForm setLoginShowing={setLoginShowing} />} 
            </div>
        </div>
    )
}


export default LandingPage;