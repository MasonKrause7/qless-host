import { useState } from 'react';
import supabase from '../../utils/supabase';
import '../../styles/landing.css';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `https://qless-host.vercel.app/reset-password-confirm`,
      });
      
      if (error) {
        throw error;
      }
      
      setMessage('Password reset instructions have been sent to your email.');
    } catch (error: any) {
      setError(error.message || 'An error occurred while sending the password reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="passwordResetContainer">
      <div className="passwordResetCard">
        <h2>Reset Your Password</h2>
        <p className="resetInstructions">
          Enter your email address below, and we'll send you instructions to reset your password.
        </p>
        
        {message && <div className="successMessage">{message}</div>}
        {error && <div className="errorMessage">{error}</div>}
        
        <form onSubmit={handleResetPassword}>
          <div className="formGroup">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="resetButton"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Instructions'}
          </button>
        </form>
        
        <div className="backToLoginLink">
          <a href="/">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;