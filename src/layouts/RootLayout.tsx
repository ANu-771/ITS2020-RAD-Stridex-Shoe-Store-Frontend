import { useEffect } from 'react';
import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
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
