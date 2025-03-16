import { useState } from 'react';
import SignUpForm from '../components/SignUpForm';
import LoginForm from '../components/LoginForm';
import '../styles/landing.css';




function LandingPage() {
    const [loginShowing, setLoginShowing] = useState(true);
    



    return (
        <div className='pageContainer'>
            <div className='tabContainer'>
                <button className='tab' onClick={() => setLoginShowing(true)}>Login</button>
                <button className='tab' onClick={() => setLoginShowing(false)}>Sign Up</button>
            </div>
            <div className='formContainer'> 
                {loginShowing && <LoginForm />}
                {!loginShowing && <SignUpForm />} 
            </div>
            <a href="/cook">Cook Page</a>
        </div>
    )
}


export default LandingPage;