import { Navigate, useLocation, Link } from 'react-router-dom';
import type { FC, ReactNode } from 'react';
import { useAppSelector } from '../../hooks/reduxHooks';
import type { UserRole } from '../../types';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // 1. If not authenticated, redirect to login with return path
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If role restrictions apply, verify user's role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-[#F2FAF4]">
        <div className="p-4 rounded-full bg-[#E45D5D]/10 text-[#E45D5D] mb-4">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h2 className="font-outfit text-3xl font-extrabold text-[#26352D]">Access Restricted</h2>
        <p className="mt-2 text-sm text-[#718078] max-w-md">
          You do not have administrative clearance to access this module. Your current role is{' '}
          <span className="font-semibold text-[#26352D] uppercase">{user.role}</span>.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#72C98A] hover:bg-[#59B976] text-white text-sm font-semibold shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
};
