import { useState, useEffect, useRef } from 'react';
import type { FC, FormEvent, ClipboardEvent, KeyboardEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { authService } from '../../services/authService';
import { APP_NAME } from '../../utils/constants';

type Step = 1 | 2 | 3;

export const ForgotPasswordPage: FC = () => {
  const navigate = useNavigate();

  // Wizard state
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & feedback state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const [isResetComplete, setIsResetComplete] = useState(false);

  // Cooldown timer state (in seconds)
  const [cooldown, setCooldown] = useState(0);

  // Input refs for 6 OTP boxes
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown countdown effect
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Focus the first OTP input when reaching step 2
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  // -------------------------------------------------------------
  // Step 1: Send OTP to Email
  // -------------------------------------------------------------
  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessInfo(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.forgotPassword(cleanEmail);
      setSuccessInfo(res.message);
      setCooldown(60); // 60 seconds cooldown
      setStep(2);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        'Unable to send verification code. Please check your email and try again.';
      setErrorMessage(msg);
      if (err.response?.data?.retryAfter) {
        setCooldown(err.response.data.retryAfter);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // Step 2: Handle OTP Digits (Auto-focus, Backspace, Paste)
  // -------------------------------------------------------------
  const handleOtpChange = (index: number, val: string) => {
    // Keep only the last typed character and only digits
    const cleanDigit = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanDigit;
    setOtpDigits(newDigits);
    setErrorMessage(null);

    // Auto-advance to next input if digit entered
    if (cleanDigit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        // Move to previous box if current is empty
        otpInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setOtpDigits(newDigits);

    // Focus either the next empty box or the last box
    const focusIndex = Math.min(pasted.length, 5);
    otpInputRefs.current[focusIndex]?.focus();
  };

  const handleResendOtp = async () => {
    if (cooldown > 0 || isLoading) return;
    setErrorMessage(null);
    setSuccessInfo(null);
    setIsLoading(true);

    try {
      const res = await authService.forgotPassword(email.trim());
      setSuccessInfo(res.message);
      setCooldown(60);
      setOtpDigits(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        'Unable to resend verification code. Please try again later.';
      setErrorMessage(msg);
      if (err.response?.data?.retryAfter) {
        setCooldown(err.response.data.retryAfter);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToPassword = (e: FormEvent) => {
    e.preventDefault();
    const otp = otpDigits.join('');
    if (otp.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the verification code.');
      return;
    }
    setErrorMessage(null);
    setStep(3);
  };

  // -------------------------------------------------------------
  // Step 3: Submit New Password & Reset
  // -------------------------------------------------------------
  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const otp = otpDigits.join('');
    if (otp.length !== 6) {
      setErrorMessage('Invalid verification code. Please enter all 6 digits.');
      setStep(2);
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-check.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.resetPassword({
        email: email.trim(),
        otp,
        newPassword,
      });

      setSuccessInfo(res.message);
      setIsResetComplete(true);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        'Failed to reset password. The code may be invalid or expired.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // Render: Success Confirmation Screen
  // -------------------------------------------------------------
  if (isResetComplete) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F2FAF4]">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-[#DCEBE0] shadow-sm text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#72C98A]/10 border border-[#72C98A]/20 flex items-center justify-center text-[#72C98A]">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <h2 className="font-outfit text-2xl font-bold text-[#26352D]">
              Password Reset Complete!
            </h2>
            <p className="mt-2 text-xs text-[#718078] leading-relaxed">
              Your STRIDEX account password has been updated successfully. You can now sign in with your new credentials.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full py-3.5 px-4 bg-[#72C98A] hover:bg-[#59B976] text-white text-sm font-semibold rounded-xl transition-all shadow-sm active:scale-[0.99]"
          >
            Sign In with New Password
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F2FAF4]">
      <div className="max-w-md w-full space-y-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#DCEBE0] shadow-sm">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <span className="font-outfit text-3xl font-extrabold text-[#26352D]">
              {APP_NAME}
              <span className="text-[#72C98A]">.</span>
            </span>
          </Link>
          <h2 className="mt-3 font-outfit text-2xl font-bold text-[#26352D]">
            {step === 1 && 'Reset Your Password'}
            {step === 2 && 'Verify Security Code'}
            {step === 3 && 'Create New Password'}
          </h2>
          <p className="mt-1 text-xs text-[#718078]">
            {step === 1 && 'Enter your registered email to receive a 6-digit OTP'}
            {step === 2 && `Enter the 6-digit code sent to ${email}`}
            {step === 3 && 'Choose a strong new password for your footwear profile'}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center space-x-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === s
                  ? 'w-8 bg-[#72C98A]'
                  : step > s
                  ? 'w-4 bg-[#72C98A]/40'
                  : 'w-4 bg-[#DCEBE0]'
              }`}
            />
          ))}
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="flex items-start space-x-2.5 p-3.5 rounded-xl bg-[#E45D5D]/10 border border-[#E45D5D]/20 text-[#E45D5D] text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {successInfo && step === 2 && (
          <div className="flex items-start space-x-2.5 p-3.5 rounded-xl bg-[#72C98A]/10 border border-[#72C98A]/20 text-[#26352D] text-xs font-medium">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#72C98A]" />
            <span className="leading-relaxed">{successInfo}</span>
          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* STEP 1: Enter Email                                       */}
        {/* -------------------------------------------------------- */}
        {step === 1 && (
          <form className="space-y-5" onSubmit={handleSendOtp}>
            <div>
              <label className="block text-xs font-semibold text-[#26352D] mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718078]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4]/50 text-sm text-[#26352D] focus:outline-none focus:border-[#72C98A] focus:ring-2 focus:ring-[#72C98A]/20 transition-all placeholder:text-[#718078]/60"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-[#72C98A] hover:bg-[#59B976] disabled:bg-[#72C98A]/50 text-white text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2 active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sending Code...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Send Verification Code</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center space-x-1.5 text-xs text-[#718078] hover:text-[#26352D] font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}

        {/* -------------------------------------------------------- */}
        {/* STEP 2: Verify 6-digit OTP                                */}
        {/* -------------------------------------------------------- */}
        {step === 2 && (
          <form className="space-y-6" onSubmit={handleProceedToPassword}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold text-[#26352D]">
                  Enter 6-Digit Code
                </label>
                <span className="text-[11px] text-[#718078]">
                  Expires in 5 minutes
                </span>
              </div>

              {/* 6 OTP Boxes */}
              <div
                className="flex items-center justify-between gap-2 sm:gap-2.5"
                onPaste={handleOtpPaste}
              >
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpInputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center font-outfit text-xl sm:text-2xl font-bold rounded-xl border border-[#DCEBE0] bg-[#F2FAF4]/60 text-[#26352D] focus:outline-none focus:border-[#72C98A] focus:ring-2 focus:ring-[#72C98A]/30 transition-all"
                  />
                ))}
              </div>
            </div>

            {/* Resend Cooldown Section */}
            <div className="flex items-center justify-between pt-1">
              {cooldown > 0 ? (
                <div className="flex items-center space-x-1.5 text-xs text-[#718078]">
                  <Clock className="w-3.5 h-3.5 text-[#72C98A]" />
                  <span>Resend available in {cooldown}s</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-xs text-[#72C98A] hover:text-[#59B976] font-semibold flex items-center space-x-1 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resend Verification Code</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setErrorMessage(null);
                }}
                className="text-xs text-[#718078] hover:text-[#26352D] hover:underline"
              >
                Change Email
              </button>
            </div>

            <button
              type="submit"
              disabled={otpDigits.join('').length !== 6 || isLoading}
              className="w-full py-3.5 px-4 bg-[#72C98A] hover:bg-[#59B976] disabled:bg-[#72C98A]/50 text-white text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2 active:scale-[0.99]"
            >
              <span>Continue to Reset Password</span>
            </button>
          </form>
        )}

        {/* -------------------------------------------------------- */}
        {/* STEP 3: Enter New Password                                */}
        {/* -------------------------------------------------------- */}
        {step === 3 && (
          <form className="space-y-5" onSubmit={handleResetPassword}>
            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-[#26352D] mb-1.5">
                New Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718078]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4]/50 text-sm text-[#26352D] focus:outline-none focus:border-[#72C98A] focus:ring-2 focus:ring-[#72C98A]/20 transition-all placeholder:text-[#718078]/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#718078] hover:text-[#26352D]"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-[#26352D] mb-1.5">
                Confirm New Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718078]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4]/50 text-sm text-[#26352D] focus:outline-none focus:border-[#72C98A] focus:ring-2 focus:ring-[#72C98A]/20 transition-all placeholder:text-[#718078]/60"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#718078] hover:text-[#26352D]"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-[#72C98A] hover:bg-[#59B976] disabled:bg-[#72C98A]/50 text-white text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2 active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <span>Reset Password & Finish</span>
              )}
            </button>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setStep(2);
                  setErrorMessage(null);
                }}
                className="text-xs text-[#718078] hover:text-[#26352D] inline-flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Edit Verification Code</span>
              </button>

              <Link
                to="/login"
                className="text-xs text-[#718078] hover:text-[#26352D] hover:underline"
              >
                Cancel
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
