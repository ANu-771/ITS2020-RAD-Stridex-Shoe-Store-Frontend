import type { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import {
  setCartOpen,
  updateQuantityAsync,
  removeFromCartAsync,
} from '../../store/slices/cartSlice';
import { formatLKR } from '../../utils/currency';

export const CartDrawer: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, isOpen } = useAppSelector((state) => state.cart);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const FREE_SHIPPING_THRESHOLD = 15000; // in LKR
  const STANDARD_DELIVERY_FEE = 650; // in LKR
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const deliveryFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_DELIVERY_FEE;
  const finalTotal = subtotal + deliveryFee;

  const handleCheckoutClick = () => {
    dispatch(setCartOpen(false));
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={() => dispatch(setCartOpen(false))}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#DCEBE0]">
          {/* Header */}
          <div className="p-5 border-b border-[#DCEBE0] flex items-center justify-between bg-[#F2FAF4]/40">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-[#DDF3E2] text-[#72C98A] rounded-xl">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-outfit text-lg font-bold text-[#26352D]">Your Shopping Bag</h3>
                <p className="text-xs text-[#718078]">
                  {items.length} {items.length === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>
            <button
              onClick={() => dispatch(setCartOpen(false))}
              className="p-2 text-[#718078] hover:text-[#26352D] rounded-xl hover:bg-[#DCEBE0]/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-[#F2FAF4] border-b border-[#DCEBE0] text-xs space-y-1.5">
            <div className="flex justify-between font-medium">
              <span className="text-[#26352D]">
                {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                  <span className="text-[#35A866] font-bold flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>You unlocked Free Island-wide Express Delivery!</span>
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-[#26352D]">{formatLKR(remainingForFree)}</strong> more for Free Shipping
                  </span>
                )}
              </span>
              <span className="text-[#718078]">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#DCEBE0] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#72C98A] h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                <div className="w-20 h-20 rounded-full bg-[#F2FAF4] flex items-center justify-center text-[#718078]">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="font-outfit font-bold text-lg text-[#26352D]">Your bag is empty</h4>
                  <p className="text-xs text-[#718078] mt-1 max-w-xs">
                    Explore our modern footwear collection and step into your style today.
                  </p>
                </div>
                <Link
                  to="/shop"
                  onClick={() => dispatch(setCartOpen(false))}
                  className="px-6 py-3 rounded-xl bg-[#72C98A] hover:bg-[#59B976] text-white text-xs font-bold shadow-md shadow-green-500/20 transition-all"
                >
                  Explore Footwear
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex space-x-3.5 p-3 rounded-2xl border border-[#DCEBE0] bg-white hover:border-[#72C98A]/50 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-[#F2FAF4] rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-[#DCEBE0]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-[#72C98A] uppercase tracking-wider">
                          {item.brandName}
                        </span>
                        <button
                          onClick={() =>
                            dispatch(removeFromCartAsync({ id: item.id, itemId: item.itemId }))
                          }
                          className="text-[#718078] hover:text-[#E45D5D] transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <Link
                        to={`/product/${item.slug}`}
                        onClick={() => dispatch(setCartOpen(false))}
                        className="font-outfit font-bold text-sm text-[#26352D] hover:text-[#72C98A] transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <div className="text-[11px] text-[#718078] flex items-center space-x-2 mt-0.5">
                        <span>Size: <strong className="text-[#26352D]">{item.size}</strong></span>
                        <span>•</span>
                        <span>Color: <strong className="text-[#26352D]">{item.color}</strong></span>
                      </div>
                    </div>

                    {/* Price & Quantity Controls */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="font-outfit font-extrabold text-[#26352D] text-sm">
                        {formatLKR(item.price)}
                      </div>

                      <div className="flex items-center space-x-1.5 bg-[#F2FAF4] border border-[#DCEBE0] rounded-lg p-0.5">
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantityAsync({
                                id: item.id,
                                itemId: item.itemId,
                                quantity: item.quantity - 1,
                              })
                            )
                          }
                          className="p-1 hover:bg-white rounded text-[#26352D] transition-colors"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-[#26352D]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantityAsync({
                                id: item.id,
                                itemId: item.itemId,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                          disabled={item.quantity >= item.maxStock}
                          className="p-1 hover:bg-white rounded text-[#26352D] disabled:opacity-30 transition-colors"
                          title="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#DCEBE0] bg-white space-y-3">
              <div className="space-y-1.5 text-xs text-[#718078]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-outfit font-bold text-[#26352D] text-sm">
                    {formatLKR(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Island-wide Delivery</span>
                  <span className="font-medium text-[#35A866]">
                    {deliveryFee === 0 ? 'FREE' : formatLKR(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#DCEBE0] pt-2 text-sm">
                  <strong className="text-[#26352D] font-outfit">Estimated Total (LKR)</strong>
                  <strong className="text-[#26352D] font-outfit text-base">
                    {formatLKR(finalTotal)}
                  </strong>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleCheckoutClick}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#72C98A] hover:bg-[#59B976] text-white font-bold text-xs shadow-lg shadow-green-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Proceed to Secure Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  to="/cart"
                  onClick={() => dispatch(setCartOpen(false))}
                  className="w-full py-2 px-4 rounded-xl border border-[#DCEBE0] hover:border-[#72C98A] text-[#26352D] text-xs font-semibold flex items-center justify-center transition-colors"
                >
                  View Full Bag & Delivery Details
                </Link>
              </div>

              <div className="text-center text-[10px] text-[#718078] flex items-center justify-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-[#72C98A]" />
                <span>100% Authentic Footwear Guarantee • Cash on Delivery / Card</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
