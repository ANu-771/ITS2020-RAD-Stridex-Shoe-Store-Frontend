import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { 
  Star, 
  Trash2, 
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import type { Review } from '../../services/reviewService';
import { useToast } from '../../context/ToastContext';

export const AdminReviewsPage: FC = () => {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchReviews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await reviewService.getReviews({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });
      if (res.success) {
        setReviews(res.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch reviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, status: 'APPROVED' | 'PENDING' | 'FLAGGED') => {
    try {
      const res = await reviewService.updateStatus(id, status);
      if (res.success) {
        showToast(`Review marked as ${status}`, 'success');
        setReviews((prev) => prev.map((r) => (r.id === id || r._id === id ? res.data : r)));
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update review status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      await reviewService.deleteReview(id);
      showToast('Review deleted', 'info');
      setReviews((prev) => prev.filter((r) => r.id !== id && r._id !== id));
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete review', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#DCEBE0] shadow-xs flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div>
          <h2 className="font-outfit text-xl font-bold text-[#26352D]">
            Customer Reviews & Ratings ({reviews.length})
          </h2>
          <p className="text-xs text-[#718078]">
            Moderate customer feedback, star ratings, and community reviews for shoe models.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="font-semibold text-[#26352D]">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] text-[#26352D] focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="FLAGGED">Flagged</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-2xl border border-[#DCEBE0]" />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-[#E45D5D]/10 text-[#E45D5D] text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#DCEBE0] p-12 text-center space-y-3">
          <MessageSquare className="w-8 h-8 text-[#718078] mx-auto" />
          <h3 className="font-outfit font-bold text-lg text-[#26352D]">No reviews found</h3>
          <p className="text-xs text-[#718078]">No reviews currently match this status filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <div
              key={r.id || r._id}
              className="bg-white p-5 rounded-3xl border border-[#DCEBE0] shadow-xs space-y-3 hover:border-[#72C98A]/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#F2FAF4] rounded-xl border border-[#DCEBE0] p-1 shrink-0 flex items-center justify-center">
                    <img
                      src={r.productId?.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80'}
                      alt={r.productId?.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-outfit font-bold text-sm text-[#26352D]">
                      {r.productId?.name || 'Shoe Model'}
                    </h4>
                    <span className="text-[11px] text-[#718078] block">
                      By <strong>{r.userId?.fullName || 'Customer'}</strong> ({r.userId?.email})
                    </span>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center space-x-0.5 text-amber-400 shrink-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < r.rating ? 'fill-amber-400' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Review Content */}
              <div className="space-y-1 text-xs">
                <strong className="text-[#26352D] font-bold block">{r.title}</strong>
                <p className="text-[#718078] leading-relaxed">"{r.comment}"</p>
                <span className="text-[10px] text-[#718078] block pt-1">
                  Submitted on {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Status and Action Buttons */}
              <div className="pt-2 border-t border-[#DCEBE0] flex items-center justify-between text-xs">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    r.status === 'APPROVED'
                      ? 'bg-[#DDF3E2] text-[#35A866]'
                      : r.status === 'FLAGGED'
                      ? 'bg-[#E45D5D]/10 text-[#E45D5D]'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {r.status}
                </span>

                <div className="flex items-center space-x-2">
                  {r.status !== 'APPROVED' && (
                    <button
                      onClick={() => handleUpdateStatus(r.id || r._id, 'APPROVED')}
                      className="px-2.5 py-1 bg-[#DDF3E2] hover:bg-[#bdeccb] text-[#35A866] font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
                    >
                      Approve
                    </button>
                  )}
                  {r.status !== 'FLAGGED' && (
                    <button
                      onClick={() => handleUpdateStatus(r.id || r._id, 'FLAGGED')}
                      className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
                    >
                      Flag
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(r.id || r._id)}
                    className="p-1 hover:bg-[#E45D5D]/10 text-[#E45D5D] rounded-lg transition-colors cursor-pointer"
                    title="Delete Review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
