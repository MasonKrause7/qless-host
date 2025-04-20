import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../utils/supabase';
import '../../styles/landing.css';

const PasswordResetConfirm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if we have a hash in the URL (this indicates the user has come from the reset email)
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || !hash.includes('type=recovery')) {
      setError('Invalid password reset link. Please request a new password reset.');
    }
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setMessage(null);
    
    // Validate passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Update password in Supabase
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        throw error;
      }
      
      setMessage('Your password has been successfully reset.');
      
      // After 2 seconds, redirect to login
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error: any) {
      setError(error.message || 'An error occurred while resetting your password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="passwordResetContainer">
      <div className="passwordResetCard">
        <h2>Create New Password</h2>
        <p className="resetInstructions">
          Please enter your new password below.
        </p>
        
        {message && <div className="successMessage">{message}</div>}
        {error && <div className="errorMessage">{error}</div>}
        
        <form onSubmit={handlePasswordChange}>
          <div className="formGroup">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              required
            />
          </div>
          
          <div className="formGroup">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="resetButton"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Reset Password'}
          </button>
        </form>
        
        <div className="backToLoginLink">
          <a href="/">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetConfirm;