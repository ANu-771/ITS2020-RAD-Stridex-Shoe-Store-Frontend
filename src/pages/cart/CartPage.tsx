import type { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { 
  updateQuantityAsync, 
  removeFromCartAsync, 
  clearCartAsync 
} from '../../store/slices/cartSlice';
import { formatLKR } from '../../utils/currency';

export const CartPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, isLoading } = useAppSelector((state) => state.cart);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const FREE_SHIPPING_THRESHOLD = 15000; // in LKR
  const STANDARD_DELIVERY_FEE = 650; // in LKR
  const deliveryFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_DELIVERY_FEE;
  const finalTotal = subtotal + deliveryFee;
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <div className="min-h-screen bg-[#F2FAF4] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Breadcrumb / Back Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/shop"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#718078] hover:text-[#26352D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
        {items.length > 0 && (
          <button
            type="button"
            onClick={() => dispatch(clearCartAsync())}
            className="text-xs text-[#E45D5D] hover:underline font-semibold"
          >
            Clear All Items
          </button>
        )}
      </div>

      <div className="pb-4 border-b border-[#DCEBE0]">
        <h1 className="font-outfit text-3xl sm:text-4xl font-extrabold text-[#26352D]">
          Your Shopping Bag
        </h1>
        <p className="text-xs sm:text-sm text-[#718078] mt-1">
          Review your selected footwear models, sizes, and quantities before completing your order.
        </p>
      </div>

      {items.length === 0 ? (
        /* Empty Cart State */
        <div className="bg-white rounded-3xl border border-[#DCEBE0] p-12 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-20 h-20 rounded-full bg-[#F2FAF4] flex items-center justify-center mx-auto text-[#718078]">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="font-outfit font-bold text-2xl text-[#26352D]">Your bag is empty</h2>
          <p className="text-xs text-[#718078]">
            Looks like you haven't added any shoes to your shopping bag yet. Explore our curated catalog of authentic footwear.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#72C98A] hover:bg-[#59B976] text-white text-xs font-bold shadow-md transition-all"
          >
            <span>Explore Footwear Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        /* Active Cart Layout: Left Items Table + Right Summary */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ======================================================== */}
          {/* LEFT: CART ITEMS (8 COLS)                                */}
          {/* ======================================================== */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Delivery Meter */}
            <div className="p-4 rounded-2xl bg-white border border-[#DCEBE0] space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#26352D]">
                  {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                    <span className="text-[#35A866] font-bold flex items-center space-x-1">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Congratulations! You qualify for Free Island-wide Express Delivery.</span>
                    </span>
                  ) : (
                    <span>
                      Add <strong className="text-[#26352D]">{formatLKR(remainingForFree)}</strong> more to unlock Free Delivery
                    </span>
                  )}
                </span>
                <span className="text-[#718078]">{progressPercent}%</span>
              </div>
              <div className="w-full bg-[#F2FAF4] h-2 rounded-full overflow-hidden border border-[#DCEBE0]">
                <div
                  className="bg-[#72C98A] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="bg-white rounded-3xl border border-[#DCEBE0] divide-y divide-[#DCEBE0] overflow-hidden shadow-xs">
              {items.map((item) => (
                <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  {/* Shoe Media & Details */}
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#F2FAF4] rounded-2xl border border-[#DCEBE0] p-2 shrink-0 flex items-center justify-center">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#72C98A] uppercase tracking-wider">
                        {item.brandName}
                      </span>
                      <Link
                        to={`/product/${item.slug}`}
                        className="block font-outfit font-bold text-base text-[#26352D] hover:text-[#72C98A] transition-colors"
                      >
                        {item.name}
                      </Link>
                      <div className="text-xs text-[#718078] flex items-center space-x-3">
                        <span>Size: <strong className="text-[#26352D]">EU {item.size}</strong></span>
                        <span>•</span>
                        <span>Color: <strong className="text-[#26352D]">{item.color}</strong></span>
                      </div>
                      <div className="font-outfit font-extrabold text-sm text-[#26352D] sm:hidden pt-1">
                        {formatLKR(item.price)}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-8 pt-2 sm:pt-0">
                    <div className="flex items-center space-x-2 bg-[#F2FAF4] border border-[#DCEBE0] rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            updateQuantityAsync({
                              id: item.id,
                              itemId: item.itemId,
                              quantity: item.quantity - 1,
                            })
                          )
                        }
                        className="p-1.5 hover:bg-white rounded-lg text-[#26352D] transition-colors"
                        title="Reduce quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-[#26352D]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        disabled={item.quantity >= item.maxStock}
                        onClick={() =>
                          dispatch(
                            updateQuantityAsync({
                              id: item.id,
                              itemId: item.itemId,
                              quantity: item.quantity + 1,
                            })
                          )
                        }
                        className="p-1.5 hover:bg-white rounded-lg text-[#26352D] disabled:opacity-30 transition-colors"
                        title="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="hidden sm:block text-right">
                      <div className="font-outfit font-extrabold text-base text-[#26352D]">
                        {formatLKR(item.price * item.quantity)}
                      </div>
                      <div className="text-[10px] text-[#718078]">
                        {formatLKR(item.price)} each
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        dispatch(removeFromCartAsync({ id: item.id, itemId: item.itemId }))
                      }
                      className="p-2 text-[#718078] hover:text-[#E45D5D] hover:bg-[#E45D5D]/10 rounded-xl transition-colors"
                      title="Remove shoe"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT: ORDER SUMMARY (4 COLS)                            */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 space-y-6 sticky top-28">
            <div className="bg-white rounded-3xl border border-[#DCEBE0] p-6 sm:p-8 space-y-6 shadow-xs">
              <h3 className="font-outfit font-bold text-xl text-[#26352D]">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs text-[#718078]">
                <div className="flex justify-between">
                  <span>Footwear Subtotal</span>
                  <span className="font-outfit font-bold text-sm text-[#26352D]">
                    {formatLKR(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Island-wide Express Delivery</span>
                  <span className="font-semibold text-[#35A866]">
                    {deliveryFee === 0 ? 'FREE' : formatLKR(deliveryFee)}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#DCEBE0] flex justify-between items-baseline">
                  <div>
                    <strong className="font-outfit text-base text-[#26352D] block">Total Amount</strong>
                    <span className="text-[10px] text-[#718078]">Includes all Sri Lanka taxes</span>
                  </div>
                  <strong className="font-outfit text-2xl font-extrabold text-[#26352D]">
                    {formatLKR(finalTotal)}
                  </strong>
                </div>
              </div>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => navigate('/checkout')}
                className="w-full py-4 rounded-xl bg-[#72C98A] hover:bg-[#59B976] text-white font-bold text-xs shadow-lg shadow-green-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 border-t border-[#DCEBE0] space-y-2 text-[11px] text-[#718078]">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-[#72C98A]" />
                  <span>Delivered within 24–48 hours in Colombo</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#72C98A]" />
                  <span>100% Authentic Footwear Guarantee</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4 text-[#72C98A]" />
                  <span>30-Day Hassle-Free Size Swaps</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
