import { useState } from "react";
import LoginForm from "../../components/login-signup/LoginForm";
import SignUpForm from "../../components/login-signup/SignUpForm";
import { Link } from "react-router-dom";
import '../../styles//landing.css';

const LandingPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="landing-container">
            <div className="auth-container">
                <h1 className="auth-title">
                    {isLogin ? "Welcome Back" : "Get Started"}
                </h1>

                {isLogin ? (
                    <div className="auth-content">
                        <LoginForm />
                        <div className="auth-toggle">
                            <p>Don't have an account?</p>
                            <button 
                                className="auth-button"
                                onClick={() => setIsLogin(false)}
                            >
                                Sign Up
                            </button>
                        </div>
                        <div className="reset-password-link">
                            <Link to="/reset-password">Reset Password</Link>
                        </div>
                    </div>
                ) : (
                    <div className="auth-content">
                        <SignUpForm />
                        <div className="auth-toggle">
                            <p>Already have an account?</p>
                            <button 
                                className="auth-button"
                                onClick={() => setIsLogin(true)}
                            >
                                Login
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LandingPage;