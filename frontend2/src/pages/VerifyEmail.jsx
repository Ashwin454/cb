import { useState, useEffect } from "react";
import { Loader2, CheckCircle, Mail, RefreshCw } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { VerifyOtp } from "../services/operations/Auth";

// Simple Input OTP Component
const InputOTP = ({ maxLength, value, onChange, disabled, children }) => {
  return (
    <div className="flex justify-center gap-2">
      {children}
    </div>
  );
};

const InputOTPSlot = ({ index, className, value }) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        maxLength="1"
        value={value || ""}
        className="w-full h-full text-center bg-transparent border-0 outline-none"
        readOnly
      />
      {value && <CheckCircle className="w-4 h-4 text-green-500 absolute -top-2 -right-2" />}
    </div>
  );
};

// Simple Button Component
const Button = ({ children, className, onClick, disabled, variant = "default", ...props }) => {
  const baseClasses = "px-4 py-2 rounded font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const variantClasses = {
    default: "bg-blue-500 hover:bg-blue-600 text-white",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700"
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const {email}=useParams();
  // Cooldown timer
  useEffect(() => {
    
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Handle OTP input change
  const handleOtpChange = (value) => {
    // Only allow numbers and limit to maxLength
    const numericValue = value.replace(/\D/g, "").slice(0, 4);
    setOtp(numericValue);
  };

  // Handle individual digit input
  const handleDigitChange = (index, value) => {
    const newOtp = otp.split("");
    newOtp[index] = value.replace(/\D/g, "");
    const updatedOtp = newOtp.join("").slice(0, 4);
    setOtp(updatedOtp);
    
    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.querySelector(`input[data-index="${index + 1}"]`);
      nextInput?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[data-index="${index - 1}"]`);
      prevInput?.focus();
    }
  };

  const showToast = (type, title, description) => {
    // Simple toast simulation - in a real app, you'd use a proper toast library
    console.log(`${type.toUpperCase()}: ${title} - ${description}`);
    alert(`${title}: ${description}`);
  };

  const handleVerify = async () => {
    if (!otp || otp.length !== 4 || !email) return;
    const data={
      email:email,
      otp:otp
    }
    setIsVerifying(true);
    dispatch(VerifyOtp(data,setIsVerifying,navigate));
   
    
  };

  

  // Auto-verify when OTP is complete
  useEffect(() => {
    if (otp.length === 4 && !isVerifying && !success) {
      handleVerify();
    }
  }, [otp]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 px-4">
      <div className="w-full max-w-md bg-white/95 rounded-2xl shadow-2xl p-8 flex flex-col items-center relative overflow-hidden">
        {/* Brand Logo */}
        <div className="mb-2">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">CB</span>
          </div>
        </div>
        
        {/* Step Indicator */}
        <div className="w-full flex items-center justify-center mb-4">
          <span className="text-xs text-gray-500 tracking-wide">Step 2 of 2: Email Verification</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-200 rounded-full mb-6">
          <div 
            className="h-1 bg-blue-500 rounded-full transition-all duration-500" 
            style={{ width: '100%' }} 
          />
        </div>
        
        <Mail className="w-12 h-12 text-blue-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-900">Verify Your Email</h1>
        <p className="text-gray-600 text-center mb-6">
          We've sent a verification code to{" "}
          <span className="font-semibold text-blue-600">{email}</span>.<br />
          Please enter it below to activate your account.
        </p>
        
        {/* OTP Input */}
        <div className="w-full flex flex-col items-center">
          <div className="flex justify-center gap-3 mb-6">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="relative">
                <input
                  type="text"
                  maxLength="1"
                  value={otp[index] || ""}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  data-index={index}
                  disabled={isVerifying || success}
                  className={`w-12 h-12 text-xl text-center border-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 ${
                    otp[index] 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 bg-white'
                  } ${(isVerifying || success) ? 'opacity-50' : ''}`}
                />
                {otp[index] && (
                  <CheckCircle className="w-4 h-4 text-green-500 absolute -top-2 -right-2" />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <Button
          className="w-full mt-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center"
          onClick={handleVerify}
          disabled={otp.length !== 4 || isVerifying || success}
        >
          {isVerifying ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <CheckCircle className="w-5 h-5 mr-2" />
          )}
          {isVerifying ? "Verifying..." : "Verify"}
        </Button>
        
       
        
        {/* Need Help Link */}
        <div className="w-full flex justify-end mt-2">
          <a 
            href="mailto:support@campusbites.in" 
            className="text-xs text-blue-500 hover:underline"
          >
            Need help?
          </a>
        </div>
        
        {/* Success Overlay */}
        {success && showConfetti && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/90 rounded-2xl">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
            <h2 className="text-xl font-bold text-green-700 mb-2">Email verified!</h2>
            <p className="text-gray-700 mb-4">Redirecting to login...</p>
            
            {/* Simple Confetti Animation */}
            <div className="flex flex-wrap gap-2 justify-center animate-pulse">
              {[...Array(20)].map((_, i) => (
                <span 
                  key={i} 
                  className="inline-block w-2 h-2 rounded-full animate-bounce" 
                  style={{ 
                    background: `hsl(${i * 18}, 80%, 60%)`,
                    animationDelay: `${i * 0.1}s`
                  }} 
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Demo Instructions */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700 text-center">
            <strong>Demo Mode:</strong> Enter "1234" to verify successfully
          </p>
        </div>
      </div>
    </div>
  );
}