import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Package, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  RefreshCw, 
  Eye, 
  UserCog, 
  Phone, 
  X,
  Filter
} from 'lucide-react';
import Swal from 'sweetalert2';
import { adminUserService } from '../../services/adminUserService';
import type { AdminUserItem, AdminUserStats } from '../../services/adminUserService';
import { UserRole } from '../../types';
import { useToast } from '../../context/ToastContext';
import { useAppSelector } from '../../hooks/reduxHooks';
import { formatLKR } from '../../utils/currency';

export const AdminUsersPage: FC = () => {
  const { showToast } = useToast();
  const currentAdmin = useAppSelector((state) => state.auth.user);

  // Users state
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [stats, setStats] = useState<AdminUserStats>({
    totalUsers: 0,
    totalCustomers: 0,
    totalInventoryManagers: 0,
    totalAdmins: 0,
    activeUsers: 0,
    inactiveUsers: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Filtering
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modals state
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<any | null>(null);
  const [selectedUserForRole, setSelectedUserForRole] = useState<AdminUserItem | null>(null);
  const [newRole, setNewRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [isUpdatingRole, setIsUpdatingRole] = useState<boolean>(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminUserService.getUsers({
        page,
        limit,
        search: search.trim() || undefined,
        role: selectedRole !== 'ALL' ? selectedRole : undefined,
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
      });

      if (res.success) {
        setUsers(res.data);
        setTotalPages(res.pagination.totalPages);
        setTotalItems(res.pagination.totalItems);
        setStats(res.stats);
      }
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      setError(err.response?.data?.message || 'Failed to retrieve user directory');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, selectedRole, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedRole('ALL');
    setSelectedStatus('ALL');
    setPage(1);
  };

  // Open User Details
  const handleViewDetails = async (userId: string) => {
    setSelectedUserForDetails(null);
    try {
      const res = await adminUserService.getUserById(userId);
      if (res.success) {
        setSelectedUserForDetails(res.data);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to load user details', 'error');
    }
  };

  // Change Role flow with SweetAlert2 confirmation
  const handleOpenRoleModal = (user: AdminUserItem) => {
    setSelectedUserForRole(user);
    setNewRole(user.role);
  };

  const handleConfirmRoleChange = async () => {
    if (!selectedUserForRole) return;
    if (selectedUserForRole.role === newRole) {
      setSelectedUserForRole(null);
      return;
    }

    // Confirmation dialog
    const result = await Swal.fire({
      title: 'Change User Role?',
      html: `Are you sure you want to change <strong>${selectedUserForRole.fullName}</strong> (${selectedUserForRole.email}) from <strong>${selectedUserForRole.role}</strong> to <strong>${newRole}</strong>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#72C98A',
      cancelButtonColor: '#718078',
      confirmButtonText: 'Yes, Update Role',
      cancelButtonText: 'Cancel',
      background: '#FFFFFF',
      color: '#26352D',
    });

    if (!result.isConfirmed) return;

    setIsUpdatingRole(true);
    try {
      const res = await adminUserService.updateUserRole(selectedUserForRole.id, newRole);
      if (res.success) {
        showToast(res.message, 'success');
        setSelectedUserForRole(null);
        fetchUsers();
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to update user role';
      Swal.fire({
        title: 'Action Prevented',
        text: errMsg,
        icon: 'error',
        confirmButtonColor: '#72C98A',
      });
    } finally {
      setIsUpdatingRole(false);
    }
  };

  // Toggle User Status (Activate / Deactivate) with SweetAlert2 confirmation
  const handleToggleStatus = async (user: AdminUserItem) => {
    const isDeactivating = user.isActive;

    const result = await Swal.fire({
      title: isDeactivating ? 'Deactivate User Account?' : 'Activate User Account?',
      html: isDeactivating
        ? `Are you sure you want to deactivate <strong>${user.fullName}</strong> (${user.email})?<br/><br/><span style="font-size: 13px; color: #E45D5D;">The user will be immediately blocked from logging in or using authenticated services.</span>`
        : `Activate <strong>${user.fullName}</strong>'s account? They will be granted full login access again.`,
      icon: isDeactivating ? 'warning' : 'info',
      showCancelButton: true,
      confirmButtonColor: isDeactivating ? '#E45D5D' : '#72C98A',
      cancelButtonColor: '#718078',
      confirmButtonText: isDeactivating ? 'Yes, Deactivate Account' : 'Yes, Activate Account',
      cancelButtonText: 'Cancel',
      background: '#FFFFFF',
      color: '#26352D',
    });

    if (!result.isConfirmed) return;

    try {
      const res = await adminUserService.updateUserStatus(user.id, !user.isActive);
      if (res.success) {
        showToast(res.message, 'success');
        fetchUsers();
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to update user status';
      Swal.fire({
        title: 'Action Prevented',
        text: errMsg,
        icon: 'error',
        confirmButtonColor: '#72C98A',
      });
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EFEAFE] text-[#6941C6] border border-[#D6BBFB]">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin
          </span>
        );
      case UserRole.INVENTORY_MANAGER:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]">
            <Package className="w-3.5 h-3.5" />
            Inventory Manager
          </span>
        );
      case UserRole.CUSTOMER:
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#DDF3E2] text-[#26352D] border border-[#BDECCB]">
            <UserCheck className="w-3.5 h-3.5 text-[#72C98A]" />
            Customer
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* ---------------------------------------------------- */}
      {/* 1. KPI STATISTICS CARDS                              */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white p-5 rounded-2xl border border-[#DCEBE0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#718078]">Total Registered</p>
            <h3 className="font-outfit text-2xl font-extrabold text-[#26352D] mt-1">{stats.totalUsers}</h3>
            <p className="text-[11px] text-[#718078] mt-1">
              <span className="text-[#72C98A] font-semibold">{stats.activeUsers} active</span> • {stats.inactiveUsers} inactive
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#F2FAF4] text-[#72C98A] border border-[#DCEBE0] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-5 rounded-2xl border border-[#DCEBE0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#718078]">Customers</p>
            <h3 className="font-outfit text-2xl font-extrabold text-[#26352D] mt-1">{stats.totalCustomers}</h3>
            <p className="text-[11px] text-[#718078] mt-1">Shoppers & buyers</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#DDF3E2] text-[#26352D] border border-[#BDECCB] flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-[#59B976]" />
          </div>
        </div>

        {/* Total Inventory Managers */}
        <div className="bg-white p-5 rounded-2xl border border-[#DCEBE0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#718078]">Inventory Managers</p>
            <h3 className="font-outfit text-2xl font-extrabold text-[#26352D] mt-1">{stats.totalInventoryManagers}</h3>
            <p className="text-[11px] text-[#718078] mt-1">Stock & warehouse control</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD] flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Total Administrators */}
        <div className="bg-white p-5 rounded-2xl border border-[#DCEBE0] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#718078]">Administrators</p>
            <h3 className="font-outfit text-2xl font-extrabold text-[#26352D] mt-1">{stats.totalAdmins}</h3>
            <p className="text-[11px] text-[#718078] mt-1">Full system authorization</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#EFEAFE] text-[#6941C6] border border-[#D6BBFB] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. SEARCH & FILTER TOOLBAR                           */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white p-5 rounded-2xl border border-[#DCEBE0] shadow-xs flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        <div>
          <h2 className="font-outfit text-xl font-bold text-[#26352D] flex items-center gap-2">
            <span>User & Role Directory</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F2FAF4] text-[#718078] border border-[#DCEBE0]">
              {totalItems} accounts
            </span>
          </h2>
          <p className="text-xs text-[#718078]">
            Manage user roles, activate or deactivate login permissions, and inspect profile history.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2 min-w-[260px] flex-1 sm:flex-initial">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-[#718078] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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
              className="px-3.5 py-2 bg-[#72C98A] hover:bg-[#59B976] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Role Filter */}
          <div className="flex items-center gap-1.5 bg-[#F2FAF4] border border-[#DCEBE0] px-3 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-[#718078]" />
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-[#26352D] font-medium focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value={UserRole.CUSTOMER}>Customer</option>
              <option value={UserRole.INVENTORY_MANAGER}>Inventory Manager</option>
              <option value={UserRole.ADMIN}>Administrator</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-[#F2FAF4] border border-[#DCEBE0] px-3 py-1.5 rounded-xl text-xs">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-[#26352D] font-medium focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>

          {/* Reset Filters */}
          {(search || selectedRole !== 'ALL' || selectedStatus !== 'ALL') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="p-2 text-[#718078] hover:text-[#26352D] hover:bg-[#F2FAF4] rounded-xl transition-colors cursor-pointer"
              title="Reset Filters"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. USER TABLE DISPLAY                                */}
      {/* ---------------------------------------------------- */}
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-2xl border border-[#DCEBE0]" />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-[#E45D5D]/10 text-[#E45D5D] border border-[#E45D5D]/20 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchUsers}
            className="px-3 py-1.5 bg-[#E45D5D] text-white rounded-lg font-semibold hover:bg-[#E45D5D]/90"
          >
            Retry
          </button>
        </div>
      ) : users.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#DCEBE0] shadow-xs space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#F2FAF4] text-[#718078] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-outfit font-bold text-base text-[#26352D]">No users found</h3>
          <p className="text-xs text-[#718078] max-w-sm mx-auto">
            No registered accounts match your search filters. Try clearing your search or role criteria.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-[#72C98A] text-white text-xs font-bold rounded-xl hover:bg-[#59B976] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#DCEBE0] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F2FAF4] text-[#718078] text-[11px] font-bold uppercase tracking-wider border-b border-[#DCEBE0]">
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCEBE0] text-xs">
                {users.map((u) => {
                  const isSelf = currentAdmin?.email === u.email;
                  return (
                    <tr key={u.id} className="hover:bg-[#F2FAF4]/60 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#DDF3E2] text-[#26352D] font-bold text-xs flex items-center justify-center border border-[#BDECCB] shrink-0">
                            {u.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-[#26352D] flex items-center gap-1.5">
                              <span>{u.fullName}</span>
                              {isSelf && (
                                <span className="text-[10px] bg-[#72C98A]/20 text-[#26352D] font-bold px-1.5 py-0.2 rounded border border-[#72C98A]/40">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#718078]">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Phone & Contact */}
                      <td className="py-4 px-4 text-[#718078]">
                        {u.phone ? (
                          <div className="flex items-center gap-1.5 text-[#26352D]">
                            <Phone className="w-3.5 h-3.5 text-[#72C98A]" />
                            <span>{u.phone}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] italic text-[#718078]/70">No phone</span>
                        )}
                      </td>

                      {/* Role */}
                      <td className="py-4 px-4">
                        {getRoleBadge(u.role)}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {u.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#DDF3E2] text-[#26352D] border border-[#BDECCB]">
                            <span className="w-2 h-2 rounded-full bg-[#72C98A]"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E45D5D]/10 text-[#E45D5D] border border-[#E45D5D]/20">
                            <span className="w-2 h-2 rounded-full bg-[#E45D5D]"></span>
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-4 text-[#718078] whitespace-nowrap">
                        {new Date(u.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Change Role Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenRoleModal(u)}
                            className="px-2.5 py-1.5 rounded-lg border border-[#DCEBE0] bg-white hover:bg-[#F2FAF4] text-[#26352D] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Change Role"
                          >
                            <UserCog className="w-3.5 h-3.5 text-[#72C98A]" />
                            <span>Role</span>
                          </button>

                          {/* Toggle Active / Deactivate */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(u)}
                            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                              u.isActive
                                ? 'border-[#E45D5D]/30 bg-white hover:bg-[#E45D5D]/10 text-[#E45D5D]'
                                : 'border-[#72C98A]/30 bg-white hover:bg-[#72C98A]/10 text-[#26352D]'
                            }`}
                            title={u.isActive ? 'Deactivate Account' : 'Activate Account'}
                          >
                            {u.isActive ? (
                              <>
                                <UserX className="w-3.5 h-3.5" />
                                <span>Deactivate</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3.5 h-3.5 text-[#72C98A]" />
                                <span>Activate</span>
                              </>
                            )}
                          </button>

                          {/* View Details */}
                          <button
                            type="button"
                            onClick={() => handleViewDetails(u.id)}
                            className="p-1.5 rounded-lg border border-[#DCEBE0] bg-white hover:bg-[#F2FAF4] text-[#718078] hover:text-[#26352D] transition-colors cursor-pointer"
                            title="View Profile Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ---------------------------------------------------- */}
          {/* PAGINATION BAR                                       */}
          {/* ---------------------------------------------------- */}
          <div className="p-4 border-t border-[#DCEBE0] bg-white flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#718078]">
            <p>
              Showing page <strong className="text-[#26352D]">{page}</strong> of <strong className="text-[#26352D]">{totalPages}</strong> ({totalItems} total users)
            </p>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-[#DCEBE0] hover:bg-[#F2FAF4] text-[#26352D] disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-[#DCEBE0] hover:bg-[#F2FAF4] text-[#26352D] disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. CHANGE ROLE MODAL                                 */}
      {/* ---------------------------------------------------- */}
      {selectedUserForRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#DCEBE0] shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#DCEBE0] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#F2FAF4] text-[#72C98A] border border-[#DCEBE0] flex items-center justify-center">
                  <UserCog className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-outfit font-bold text-lg text-[#26352D]">Assign User Role</h3>
                  <p className="text-xs text-[#718078]">{selectedUserForRole.fullName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserForRole(null)}
                className="p-1 rounded-full text-[#718078] hover:text-[#26352D] hover:bg-[#F2FAF4]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-[#718078]">
                Select the administrative or customer role to grant to <strong className="text-[#26352D]">{selectedUserForRole.email}</strong>:
              </p>

              {/* Role Radio Options */}
              <div className="space-y-2.5 pt-1">
                {/* Customer */}
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  newRole === UserRole.CUSTOMER
                    ? 'border-[#72C98A] bg-[#F2FAF4]'
                    : 'border-[#DCEBE0] bg-white hover:bg-[#F2FAF4]/50'
                }`}>
                  <input
                    type="radio"
                    name="userRole"
                    value={UserRole.CUSTOMER}
                    checked={newRole === UserRole.CUSTOMER}
                    onChange={() => setNewRole(UserRole.CUSTOMER)}
                    className="mt-0.5 text-[#72C98A] focus:ring-[#72C98A]"
                  />
                  <div>
                    <span className="font-bold text-xs text-[#26352D] block">Customer</span>
                    <span className="text-[11px] text-[#718078] leading-tight block mt-0.5">
                      Standard store shopper. Can browse products, add to cart, checkout, view order history, and purchase gift vouchers.
                    </span>
                  </div>
                </label>

                {/* Inventory Manager */}
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  newRole === UserRole.INVENTORY_MANAGER
                    ? 'border-[#0284C7] bg-[#E0F2FE]/40'
                    : 'border-[#DCEBE0] bg-white hover:bg-[#F2FAF4]/50'
                }`}>
                  <input
                    type="radio"
                    name="userRole"
                    value={UserRole.INVENTORY_MANAGER}
                    checked={newRole === UserRole.INVENTORY_MANAGER}
                    onChange={() => setNewRole(UserRole.INVENTORY_MANAGER)}
                    className="mt-0.5 text-[#0284C7] focus:ring-[#0284C7]"
                  />
                  <div>
                    <span className="font-bold text-xs text-[#0284C7] block">Inventory Manager</span>
                    <span className="text-[11px] text-[#718078] leading-tight block mt-0.5">
                      Stock management console. Can track variant quantities, process stock-in/stock-out, update order fulfillment, and adjust thresholds.
                    </span>
                  </div>
                </label>

                {/* Admin */}
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  newRole === UserRole.ADMIN
                    ? 'border-[#6941C6] bg-[#EFEAFE]/40'
                    : 'border-[#DCEBE0] bg-white hover:bg-[#F2FAF4]/50'
                }`}>
                  <input
                    type="radio"
                    name="userRole"
                    value={UserRole.ADMIN}
                    checked={newRole === UserRole.ADMIN}
                    onChange={() => setNewRole(UserRole.ADMIN)}
                    className="mt-0.5 text-[#6941C6] focus:ring-[#6941C6]"
                  />
                  <div>
                    <span className="font-bold text-xs text-[#6941C6] block">Administrator</span>
                    <span className="text-[11px] text-[#718078] leading-tight block mt-0.5">
                      Superuser privileges. Full access to user management, product/brand/category CRUD, financial reports, voucher issuance, and review moderation.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DCEBE0]">
              <button
                type="button"
                onClick={() => setSelectedUserForRole(null)}
                className="px-4 py-2 rounded-xl border border-[#DCEBE0] text-xs font-semibold text-[#718078] hover:bg-[#F2FAF4] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUpdatingRole}
                onClick={handleConfirmRoleChange}
                className="px-4 py-2 rounded-xl bg-[#72C98A] hover:bg-[#59B976] text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                {isUpdatingRole ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Save Role</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 5. USER DETAILS MODAL                                */}
      {/* ---------------------------------------------------- */}
      {selectedUserForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#DCEBE0] shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#DCEBE0] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#DDF3E2] text-[#26352D] font-extrabold text-base flex items-center justify-center border border-[#BDECCB]">
                  {selectedUserForDetails.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-outfit font-bold text-lg text-[#26352D]">{selectedUserForDetails.fullName}</h3>
                  <p className="text-xs text-[#718078]">{selectedUserForDetails.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserForDetails(null)}
                className="p-1 rounded-full text-[#718078] hover:text-[#26352D] hover:bg-[#F2FAF4]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#F2FAF4] border border-[#DCEBE0]">
                  <span className="text-[11px] text-[#718078] block">Role Assignment</span>
                  <div className="mt-1">{getRoleBadge(selectedUserForDetails.role)}</div>
                </div>

                <div className="p-3 rounded-xl bg-[#F2FAF4] border border-[#DCEBE0]">
                  <span className="text-[11px] text-[#718078] block">Account Status</span>
                  <div className="mt-1">
                    {selectedUserForDetails.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#DDF3E2] text-[#26352D] border border-[#BDECCB]">
                        <span className="w-2 h-2 rounded-full bg-[#72C98A]"></span>
                        Active Account
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E45D5D]/10 text-[#E45D5D] border border-[#E45D5D]/20">
                        <span className="w-2 h-2 rounded-full bg-[#E45D5D]"></span>
                        Deactivated
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2 p-3.5 rounded-xl border border-[#DCEBE0] bg-white">
                <div className="flex items-center justify-between text-[#718078]">
                  <span>Phone Number:</span>
                  <strong className="text-[#26352D]">{selectedUserForDetails.phone || 'Not provided'}</strong>
                </div>
                <div className="flex items-center justify-between text-[#718078]">
                  <span>Registered Date:</span>
                  <strong className="text-[#26352D]">
                    {new Date(selectedUserForDetails.createdAt).toLocaleString()}
                  </strong>
                </div>
                <div className="flex items-center justify-between text-[#718078]">
                  <span>Account ID:</span>
                  <strong className="text-[#26352D] font-mono text-[11px]">{selectedUserForDetails.id}</strong>
                </div>
              </div>

              {/* Shopping stats if customer */}
              {selectedUserForDetails.orderStats && (
                <div className="p-3.5 rounded-xl border border-[#BDECCB] bg-[#F2FAF4] space-y-2">
                  <div className="flex items-center justify-between text-[#718078]">
                    <span>Lifetime Orders:</span>
                    <strong className="text-[#26352D] font-bold text-sm">
                      {selectedUserForDetails.orderStats.totalOrders}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-[#718078]">
                    <span>Total Verified Spend:</span>
                    <strong className="text-[#59B976] font-bold text-sm">
                      {formatLKR(selectedUserForDetails.orderStats.totalSpent)}
                    </strong>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-[#DCEBE0]">
              <button
                type="button"
                onClick={() => setSelectedUserForDetails(null)}
                className="px-4 py-2 rounded-xl bg-[#26352D] text-white text-xs font-semibold hover:bg-[#1B2820] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
