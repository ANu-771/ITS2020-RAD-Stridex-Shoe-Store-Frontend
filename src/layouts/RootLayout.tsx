import { useEffect } from 'react';
import type { FC } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { AiChatbot } from '../components/ai/AiChatbot';
import { ToastProvider } from '../context/ToastContext';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchServerCart } from '../store/slices/cartSlice';
import { fetchServerWishlist } from '../store/slices/wishlistSlice';

export const RootLayout: FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { pathname, search, hash } = useLocation();

  // Scroll window to top whenever route/pathname changes
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname, search, hash]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchServerCart());
      dispatch(fetchServerWishlist());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-[#F2FAF4] font-sans antialiased text-[#26352D] selection:bg-[#BDECCB] selection:text-[#26352D]">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <CartDrawer />
        <AiChatbot />
      </div>
    </ToastProvider>
  );
};
