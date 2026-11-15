import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  ShoppingBag, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { adminDashboardService } from '../../services/adminDashboardService';
import type { AdminCustomerItem } from '../../services/adminDashboardService';
import { formatLKR } from '../../utils/currency';

export const AdminCustomersPage: FC = () => {
  const [customers, setCustomers] = useState<AdminCustomerItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(15);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [search, setSearch] = useState<string>('');

  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminDashboardService.getCustomers({
        page,
        limit,
        search: search.trim() || undefined,
      });
      if (res.success) {
        setCustomers(res.data);
        setTotalPages(res.pagination.totalPages);
        setTotalItems(res.pagination.totalItems);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch customer directory');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCustomers();
  };

  return (
    <div className="space-y-6">
      {/* Top Search & Stats Card */}
      <div className="bg-white p-5 rounded-2xl border border-[#DCEBE0] shadow-xs flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div>
          <h2 className="font-outfit text-xl font-bold text-[#26352D]">
            Registered Customers ({totalItems})
          </h2>
          <p className="text-xs text-[#718078]">
            Customer profiles, order frequency, and purchase totals in Sri Lankan Rupees.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-[#718078] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] text-xs text-[#26352D] focus:outline-none focus:ring-1 focus:ring-[#72C98A]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#72C98A] hover:bg-[#59B976] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-2xl border border-[#DCEBE0]" />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-[#E45D5D]/10 text-[#E45D5D] text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#DCEBE0] p-12 text-center space-y-3">
          <Users className="w-8 h-8 text-[#718078] mx-auto" />
          <h3 className="font-outfit font-bold text-lg text-[#26352D]">No customers found</h3>
          <p className="text-xs text-[#718078]">No customer records match your search filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#DCEBE0] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F2FAF4] text-[#718078] border-b border-[#DCEBE0] uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Orders Placed</th>
                  <th className="py-3 px-4">Total Spent (LKR)</th>
                  <th className="py-3 px-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCEBE0]">
                {customers.map((c) => (
                  <tr key={c.id || c._id} className="hover:bg-[#F2FAF4]/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#26352D] flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#DDF3E2] text-[#26352D] font-bold flex items-center justify-center shrink-0">
                        {c.fullName.charAt(0).toUpperCase()}
                      </div>
                      <span>{c.fullName}</span>
                    </td>

                    <td className="py-3.5 px-4 text-[#718078]">
                      <span className="flex items-center space-x-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#718078]" />
                        <span>{c.email}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[#718078]">
                      {c.phone ? (
                        <span className="flex items-center space-x-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#718078]" />
                          <span>{c.phone}</span>
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F2FAF4] text-[#26352D] border border-[#DCEBE0]">
                        <ShoppingBag className="w-3 h-3 text-[#72C98A]" />
                        <span>{c.ordersCount} orders</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-outfit font-extrabold text-[#26352D]">
                      {formatLKR(c.totalSpent)}
                    </td>

                    <td className="py-3.5 px-4 text-[#718078] whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 bg-[#F2FAF4] border-t border-[#DCEBE0] flex items-center justify-between text-xs text-[#718078]">
            <span>
              Showing {customers.length} of {totalItems} customers (Page {page} of {totalPages})
            </span>

            <div className="flex items-center space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-[#DCEBE0] bg-white hover:bg-[#F2FAF4] disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-[#DCEBE0] bg-white hover:bg-[#F2FAF4] disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
