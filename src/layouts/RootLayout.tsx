import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { ToastProvider } from '../context/ToastContext';

export const RootLayout: FC = () => {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-[#F2FAF4] font-sans antialiased text-[#26352D] selection:bg-[#BDECCB] selection:text-[#26352D]">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </ToastProvider>
  );
};
