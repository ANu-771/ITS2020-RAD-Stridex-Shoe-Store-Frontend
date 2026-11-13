import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const NotFoundPage: FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-[#F2FAF4]">
      <span className="font-outfit text-7xl font-extrabold text-[#72C98A]">404</span>
      <h2 className="mt-4 text-2xl font-bold font-outfit text-[#26352D]">Page Not Found</h2>
      <p className="mt-2 text-sm text-[#718078] max-w-md">
        The shoe or page you are looking for does not exist or has been moved to a new collection.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#72C98A] hover:bg-[#59B976] shadow-md shadow-green-500/25 transition-all duration-200"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Return to Home
      </Link>
    </div>
  );
};
