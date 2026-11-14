import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowLeft, ArrowRight, Eye } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { removeFromWishlist, moveToCartAsync } from '../../store/slices/wishlistSlice';
import { addToCartAsync } from '../../store/slices/cartSlice';
import { formatLKR } from '../../utils/currency';
import { useToast } from '../../context/ToastContext';

export const WishlistPage: FC = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { items, isLoading } = useAppSelector((state) => state.wishlist);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleMoveToBag = async (item: any) => {
    try {
      if (isAuthenticated) {
        await dispatch(moveToCartAsync(item.productId)).unwrap();
      } else {
        dispatch(
          addToCartAsync({
            id: `${item.productId}-42-Standard`,
            productId: item.productId,
            name: item.name,
            slug: item.slug,
            image: item.image,
            brandName: item.brandName,
            size: '42',
            color: 'Standard',
            price: item.discountPrice > 0 ? item.discountPrice : item.basePrice,
            originalPrice: item.discountPrice > 0 ? item.basePrice : undefined,
            quantity: 1,
            maxStock: 10,
          })
        );
        dispatch(removeFromWishlist(item.productId));
      }
      showToast(`Moved "${item.name}" to your shopping bag!`, 'success');
    } catch (err: any) {
      showToast(err || 'Failed to move to bag', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#F2FAF4] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#DCEBE0]">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#72C98A] uppercase tracking-widest mb-1">
            <Heart className="w-4 h-4 fill-current text-[#E45D5D]" />
            <span>Saved Footwear</span>
          </div>
          <h1 className="font-outfit text-3xl sm:text-4xl font-extrabold text-[#26352D]">
            Your Wishlist ({items.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#718078] mt-1">
            Keep track of the footwear models you love. Move them to your bag before sizes sell out.
          </p>
        </div>

        <Link
          to="/shop"
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white border border-[#DCEBE0] text-xs font-bold text-[#26352D] hover:border-[#72C98A] shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Continue Shopping</span>
        </Link>
      </div>

      {items.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-[#DCEBE0] p-12 text-center space-y-4 max-w-md mx-auto shadow-xs">
          <div className="w-20 h-20 rounded-full bg-[#F2FAF4] flex items-center justify-center mx-auto text-[#718078]">
            <Heart className="w-10 h-10 stroke-[1.5]" />
          </div>
          <h2 className="font-outfit font-bold text-2xl text-[#26352D]">Your wishlist is empty</h2>
          <p className="text-xs text-[#718078]">
            Explore our latest sneaker drops and save your favorite models for easy access later.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#72C98A] hover:bg-[#59B976] text-white text-xs font-bold shadow-md transition-all"
          >
            <span>Explore Footwear</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        /* Saved Shoes Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => {
            const hasDiscount = item.discountPrice > 0 && item.discountPrice < item.basePrice;
            const activePrice = hasDiscount ? item.discountPrice : item.basePrice;

            return (
              <div
                key={item.productId}
                className="group bg-white rounded-3xl border border-[#DCEBE0] hover:border-[#72C98A] transition-all duration-300 hover:shadow-lg flex flex-col justify-between overflow-hidden"
              >
                {/* Media Container */}
                <div className="relative aspect-square w-full bg-[#F2FAF4] p-6 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => dispatch(removeFromWishlist(item.productId))}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white text-[#718078] hover:text-[#E45D5D] shadow-xs hover:bg-[#E45D5D]/10 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <Link to={`/product/${item.slug}`} className="w-full h-full flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#72C98A] uppercase tracking-wider block">
                      {item.brandName}
                    </span>
                    <Link
                      to={`/product/${item.slug}`}
                      className="font-outfit font-bold text-base text-[#26352D] hover:text-[#72C98A] transition-colors line-clamp-1 mt-0.5"
                    >
                      {item.name}
                    </Link>

                    <div className="mt-2 flex items-baseline space-x-2">
                      <span className="font-outfit font-extrabold text-lg text-[#26352D]">
                        {formatLKR(activePrice)}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-[#718078] line-through">
                          {formatLKR(item.basePrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleMoveToBag(item)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#72C98A] hover:bg-[#59B976] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                    <Link
                      to={`/product/${item.slug}`}
                      className="p-2.5 rounded-xl border border-[#DCEBE0] text-[#718078] hover:text-[#26352D] hover:border-[#72C98A] transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
