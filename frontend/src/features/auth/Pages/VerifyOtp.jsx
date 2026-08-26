import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import '../auth.form.scss'; // Reuses auth layout forms
import { useEffect } from 'react';

const VerifyOtp = () => {
  const { loading, handleVerifyEmail,handleResendOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve email passed from register page or default to empty
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timeLeft, settimeLeft] = useState(300)  // 5minutes in second
  const [resending, setresending] = useState(false)

  useEffect(()=>{
    if(timeLeft<=0) return;

    const timerId=setInterval(()=>{
        settimeLeft((prev)=>prev-1)
    },1000)
    
    return ()=>clearInterval(timerId)

  },[timeLeft])

  const formatTime=(seconds)=>{
    const minutes=Math.floor(seconds/60);
    const secs=seconds%60
    return `${minutes.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !otp) {
      setError("Please enter both email and OTP");
      return;
    }
    if(timeLeft<=0){
        setError("OTP has expired. Please request a new one")
        return;
    }

    try {
      await handleVerifyEmail({ email, otp });
      setSuccess("Email verified successfully! Redirecting to login...");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || "Invalid or expired OTP");
    }
  };

  const handleResend=async()=>{
    if(!email){
        setError("Registered email is required to resend OTP")
    }

    setError("")
    setSuccess("")
    setresending(true)

    try{
        await handleResendOtp({email})
        setSuccess("A new OTP has send successfully")
        settimeLeft(300)
    } catch(err){
        setError(err.message || "Failed to  resend OTP. Please try  again")
    }finally{
        setresending(false)
    }
  }

  if (loading && !success) {
    return (
      <main>
        <h1>Verifying OTP...</h1>
      </main>
    );
  }

  return (
    <main>
      <div className="auth-box single-card">
        <h1>Verify Email</h1>
        <p>An OTP has been sent to your email address.</p>

        {error && <div className="error-message" style={{ color: '#ff4d4d', textAlign: 'center' }}>{error}</div>}
        {success && <div className="success-message" style={{ color: '#3fb950', textAlign: 'center' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Registered Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="otp">Enter OTP</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter verification code"
              maxLength={6}
              required
              disabled={timeLeft<=0}
            />
          </div>
    <div className="timer-container">
            <span className={`timer-text ${timeLeft === 0 ? 'expired' : ''}`}>
              {timeLeft > 0 ? `Time remaining: ${formatTime(timeLeft)}` : "OTP expired!"}
            </span>
            {timeLeft === 0 && (
              <button 
                type="button" 
                onClick={handleResend} 
                disabled={resending}
                className="button resend-btn"
              >
                {resending ? "Resending..." : "Resend OTP"}
              </button>
            )}
          </div>


          {timeLeft>0 && (
            <button className="button primary-button" type="submit">Verify</button>
          )}
        </form>
        <p>Need help? <Link to="/register">Back to Register</Link></p>
      </div>
    </main>
  );
};

export default VerifyOtp;
