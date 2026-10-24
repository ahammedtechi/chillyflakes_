import React from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  RefreshCw,
  Lock,
} from 'lucide-react';
import { useAdminAuditLogs } from '../hooks/useAdminAuditLogs';
import { Pagination } from '../../../components/vendor/Pagination';
import { EmptyState } from '../../../components/vendor/EmptyState';
import { Skeleton } from '../../../components/vendor/Skeleton';

export const AdminAuditLogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const actionFilter = searchParams.get('action') || 'all';
  const moduleFilter = searchParams.get('module') || 'all';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('page_size') || '25', 10);

  const { data, isLoading, isError, refetch, isFetching } = useAdminAuditLogs({
    search: search || undefined,
    action: actionFilter !== 'all' ? actionFilter : undefined,
    module: moduleFilter !== 'all' ? moduleFilter : undefined,
    page,
    page_size: pageSize,
  });

  const updateParams = (updates: Record<string, string | number | undefined>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v === undefined || v === '' || v === 'all') {
        next.delete(k);
      } else {
        next.set(k, String(v));
      }
    });
    setSearchParams(next);
  };

  const logs = data?.results || [];

  return (
    <div className="space-y-6 pb-16 animate-fadeIn max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EAE5DB] pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#2E4D34] bg-[#EAF1EA] px-2.5 py-1 rounded-md">
            Compliance & Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#223B28] mt-2">
            Platform Audit Log
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6D61] mt-1">
            Immutable log of all administrative actions, data reveals, KYC decisions, and permission modifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#D1DDD0] bg-white text-xs font-semibold text-[#223B28] hover:bg-[#FAF7F2] transition-colors disabled:opacity-50 shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Notice Card */}
      <div className="bg-[#FAF7F2] border border-[#EAE5DB] rounded-2xl p-4 flex items-center justify-between text-xs text-[#5F6D61]">
        <div className="flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-[#2E4D34]" />
          <span>
            <strong>Append-Only Record:</strong> Audit log entries are generated server-side and cannot be edited, reordered, or deleted by any user or administrator.
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-white border border-[#D1DDD0] px-2.5 py-1 rounded-full text-[#223B28]">
          Super Admin Access Only
        </span>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white rounded-2xl border border-[#EAE5DB] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E9B90]" />
          <input
            type="text"
            value={search}
            onChange={(e) => updateParams({ search: e.target.value, page: 1 })}
            placeholder="Search by actor, target ID, action or reason..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#D1DDD0] focus:outline-none focus:ring-2 focus:ring-[#2E4D34] bg-[#FAF7F2]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Action Filter */}
          <select
            value={actionFilter}
            onChange={(e) => updateParams({ action: e.target.value, page: 1 })}
            className="text-xs px-3 py-2 rounded-xl border border-[#D1DDD0] bg-white text-[#223B28] focus:outline-none focus:ring-2 focus:ring-[#2E4D34]"
          >
            <option value="all">All Actions</option>
            <option value="reveal">Data Reveals</option>
            <option value="decision">Decisions / Approvals</option>
            <option value="create_user">User Invocations</option>
            <option value="role_change">Role & Permission Changes</option>
            <option value="soft_delete">Soft Deletions</option>
          </select>

          {/* Module Filter */}
          <select
            value={moduleFilter}
            onChange={(e) => updateParams({ module: e.target.value, page: 1 })}
            className="text-xs px-3 py-2 rounded-xl border border-[#D1DDD0] bg-white text-[#223B28] focus:outline-none focus:ring-2 focus:ring-[#2E4D34]"
          >
            <option value="all">All Modules</option>
            <option value="sellers">Sellers & KYC</option>
            <option value="products">Catalog Products</option>
            <option value="customers">Customers & Identity</option>
            <option value="staff_roles">Staff & Roles</option>
            <option value="categories">Categories</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-[#EAE5DB] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-xs text-red-600">
            Failed to load audit logs. Please retry.
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center">
            <EmptyState
              title="No Log Entries Recorded"
              description="No audit trail events match the current filter selection."
            />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF7F2] text-[#8E9B90] border-b border-[#EAE5DB] uppercase tracking-wider text-[10px] font-bold">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Action & Module</th>
                    <th className="py-3 px-4">Target Resource</th>
                    <th className="py-3 px-4">Reason / Details</th>
                    <th className="py-3 px-4 text-right">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EDE6] text-[#223B28]">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#FDFCF9] transition-colors">
                      <td className="py-3.5 px-4 text-[11px] text-[#5F6D61] whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-xs text-[#223B28]">{log.actor_name}</div>
                        <div className="text-[11px] text-[#5F6D61]">{log.actor_email}</div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                          {log.actor_role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-xs text-[#223B28] block">{log.action}</span>
                        <span className="text-[10px] uppercase font-bold text-[#8E9B90] tracking-wider">
                          {log.module}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-xs text-[#223B28] block">{log.target_name}</span>
                        <span className="font-mono text-[10px] text-[#8E9B90] block">{log.target_id}</span>
                      </td>

                      <td className="py-3.5 px-4 text-[11px] text-[#5F6D61] max-w-xs">
                        {log.reason || '—'}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-[11px] text-[#8E9B90]">
                        {log.ip_address}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-[#EAE5DB] bg-[#FAF7F2] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-[#5F6D61]">
                Showing {Math.min((page - 1) * pageSize + 1, data?.count || 0)} to{' '}
                {Math.min(page * pageSize, data?.count || 0)} of {data?.count || 0} audit logs
              </span>

              <Pagination
                currentPage={page}
                totalItems={data?.count || 0}
                pageSize={pageSize}
                onPageChange={(p) => updateParams({ page: p })}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAuditLogPage;
