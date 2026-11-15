import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Lock, Phone, Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react';
import { authService } from '../../services/authService';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { setCredentials } from '../../store/slices/authSlice';
import { syncCartWithServer } from '../../store/slices/cartSlice';
import { syncWishlistWithServer } from '../../store/slices/wishlistSlice';
import {
  loadGuestCart,
  clearGuestCart,
  loadGuestWishlist,
  clearGuestWishlist,
} from '../../utils/cartStorage';
import { APP_NAME } from '../../utils/constants';

export const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName || !email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Capture genuine unauthenticated guest items before registration
      const guestCart = loadGuestCart();
      const guestWishlist = loadGuestWishlist();

      const response = await authService.register({
        fullName,
        email,
        password,
        phone,
      });

      const { user, accessToken } = response.data;
      dispatch(setCredentials({ user, token: accessToken }));

      // 2. Safely sync guest items if any existed before registration
      if (guestCart.length > 0) {
        dispatch(syncCartWithServer(guestCart));
        clearGuestCart();
      }
      if (guestWishlist.length > 0) {
        dispatch(syncWishlistWithServer(guestWishlist.map((w) => w.productId)));
        clearGuestWishlist();
      }

      // Customer account redirects to homepage
      navigate('/', { replace: true });
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        'Registration could not be completed. Please check your information.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F2FAF4]">
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
            Create an Account
          </h2>
          <p className="mt-1 text-xs text-[#718078]">
            Join STRIDEX to unlock personalized shoe recommendations and express checkout
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="flex items-center space-x-2.5 p-3.5 rounded-xl bg-[#E45D5D]/10 border border-[#E45D5D]/20 text-[#E45D5D] text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Registration Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-[#26352D] mb-1">
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718078]">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4]/50 text-sm text-[#26352D] focus:outline-none focus:border-[#72C98A] focus:ring-2 focus:ring-[#72C98A]/20 transition-all placeholder:text-[#718078]/60"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-[#26352D] mb-1">
              Email Address *
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4]/50 text-sm text-[#26352D] focus:outline-none focus:border-[#72C98A] focus:ring-2 focus:ring-[#72C98A]/20 transition-all placeholder:text-[#718078]/60"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-[#26352D] mb-1">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718078]">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555-0199"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4]/50 text-sm text-[#26352D] focus:outline-none focus:border-[#72C98A] focus:ring-2 focus:ring-[#72C98A]/20 transition-all placeholder:text-[#718078]/60"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-[#26352D] mb-1">
              Password * (Min 6 characters)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718078]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4]/50 text-sm text-[#26352D] focus:outline-none focus:border-[#72C98A] focus:ring-2 focus:ring-[#72C98A]/20 transition-all placeholder:text-[#718078]/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#718078] hover:text-[#26352D]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-[#26352D] mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718078]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4]/50 text-sm text-[#26352D] focus:outline-none focus:border-[#72C98A] focus:ring-2 focus:ring-[#72C98A]/20 transition-all placeholder:text-[#718078]/60"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-4 rounded-xl font-semibold text-sm text-white bg-[#72C98A] hover:bg-[#59B976] shadow-md shadow-green-500/20 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Customer Account</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-[#DCEBE0]">
          <p className="text-xs text-[#718078]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#72C98A] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
