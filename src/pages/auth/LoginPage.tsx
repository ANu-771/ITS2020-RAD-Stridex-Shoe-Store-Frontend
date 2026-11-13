import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { authService } from '../../services/authService';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { setCredentials } from '../../store/slices/authSlice';
import { APP_NAME } from '../../utils/constants';

export const LoginPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redirect path from location state, or fallback according to role
  const from = (location.state as any)?.from?.pathname;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      const { user, accessToken } = response.data;

      // Update Redux state
      dispatch(setCredentials({ user, token: accessToken }));

      // Redirect by role
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'INVENTORY_MANAGER') {
        navigate('/inventory', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        'Unable to log in. Please check your credentials and try again.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F2FAF4]">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-[#DCEBE0] shadow-sm">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <span className="font-outfit text-3xl font-extrabold text-[#26352D]">
              {APP_NAME}
              <span className="text-[#72C98A]">.</span>
            </span>
          </Link>
          <h2 className="mt-3 font-outfit text-2xl font-bold text-[#26352D]">
            Welcome Back
          </h2>
          <p className="mt-1 text-xs text-[#718078]">
            Sign in to access your footwear profile and orders
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="flex items-center space-x-2.5 p-3.5 rounded-xl bg-[#E45D5D]/10 border border-[#E45D5D]/20 text-[#E45D5D] text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          {/* Email field */}
          <div>
            <label className="block text-xs font-semibold text-[#26352D] mb-1.5">
              Email Address
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

          {/* Password field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#26352D]">
                Password
              </label>
              <span className="text-[11px] text-[#72C98A] hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
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
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4]/50 text-sm text-[#26352D] focus:outline-none focus:border-[#72C98A] focus:ring-2 focus:ring-[#72C98A]/20 transition-all placeholder:text-[#718078]/60"
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm text-white bg-[#72C98A] hover:bg-[#59B976] shadow-md shadow-green-500/20 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Demo credentials hint box */}
        <div className="p-3.5 bg-[#DDF3E2]/60 rounded-xl border border-[#BDECCB] text-[11px] text-[#26352D] space-y-1">
          <div className="font-semibold text-[#26352D]">Demo Accounts for Review:</div>
          <div>Admin: <code className="bg-white px-1 py-0.5 rounded">admin@stridex.com</code> / <code className="bg-white px-1 py-0.5 rounded">Admin@Stridex2026!</code></div>
          <div>Manager: <code className="bg-white px-1 py-0.5 rounded">inventory@stridex.com</code> / <code className="bg-white px-1 py-0.5 rounded">Manager@Stridex2026!</code></div>
        </div>

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-[#DCEBE0]">
          <p className="text-xs text-[#718078]">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[#72C98A] hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
