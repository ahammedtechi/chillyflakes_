import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  X,
  Filter,
  CheckSquare,
  Clock,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react';
import { useAdminProducts } from '../hooks/useAdminProducts';
import { PageHeader } from '../../../components/vendor/PageHeader';
import { StatusBadge } from '../../../components/vendor/StatusBadge';
import { Pagination } from '../../../components/vendor/Pagination';
import { EmptyState } from '../../../components/vendor/EmptyState';
import { ErrorState } from '../../../components/vendor/ErrorState';
import { formatINR } from '../../../utils/currency';
import { categories } from '../../../data/categories';

const SELLABLE_CATEGORIES = categories.filter((c) => c.id !== 'services');

export const AdminProductReviewsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state synchronization (defaults to pending_review, submitted_asc)
  const currentStatus = searchParams.get('status') || 'pending_review';
  const currentCategory = searchParams.get('category') || '';
  const currentSeller = searchParams.get('seller') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentOrdering = searchParams.get('ordering') || 'submitted_asc';
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const pageSize = 10;

  const [searchInput, setSearchInput] = useState(currentSearch);

  const queryParams = useMemo(
    () => ({
      status: currentStatus,
      category: currentCategory || undefined,
      seller: currentSeller || undefined,
      search: currentSearch || undefined,
      ordering: currentOrdering,
      page: currentPage,
      page_size: pageSize,
    }),
    [currentStatus, currentCategory, currentSeller, currentSearch, currentOrdering, currentPage]
  );

  const { data, isLoading, isError, refetch } = useAdminProducts(queryParams);

  const updateParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '') {
        next.delete(key);
      } else {
        next.set(key, val);
      }
    });
    setSearchParams(next);
  };

  const handleStatusTab = (status: string) => {
    updateParams({ status, page: '1' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchInput.trim() || null, page: '1' });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams({ status: 'pending_review', ordering: 'submitted_asc' }));
  };

  const hasActiveFilters = Boolean(
    currentCategory || currentSeller || currentSearch || currentStatus !== 'pending_review'
  );

  const statusTabs = [
    { id: 'pending_review', label: 'Pending Review', count: data?.status_counts?.pending_review ?? 0 },
    { id: 'approved', label: 'Approved', count: data?.status_counts?.approved ?? 0 },
    { id: 'rejected', label: 'Rejected', count: data?.status_counts?.rejected ?? 0 },
    { id: 'all', label: 'All Submissions', count: data?.status_counts?.all ?? 0 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeader
        title="Product Review Queue"
        description="Verify artisan listings against quality, category, and authenticity guidelines before approving them to the store."
      />

      {/* Status Filter Tabs */}
      <div className="border-b border-[#EAE5DB] -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar">
        <nav className="flex space-x-1 sm:space-x-2 min-w-max pb-2" aria-label="Review Queue Tabs">
          {statusTabs.map((tab) => {
            const isActive = currentStatus === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleStatusTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#2E4D34] text-white shadow-xs'
                    : 'text-[#5F6D61] hover:text-[#223B28] hover:bg-[#FAF7F2]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#EAE5DB] text-[#5F6D61]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#EAE5DB] p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-[#8E9B90] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title, SKU or seller..."
              className="w-full pl-9 pr-9 py-2 rounded-xl border border-[#EAE5DB] bg-[#FAF7F2]/60 text-xs sm:text-sm text-[#223B28] placeholder-[#8E9B90] focus:outline-none focus:ring-2 focus:ring-[#2E4D34] focus:bg-white transition-all"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  updateParams({ search: null, page: '1' });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E9B90] hover:text-[#223B28]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Category Dropdown */}
          <div className="lg:col-span-3">
            <select
              value={currentCategory}
              onChange={(e) => updateParams({ category: e.target.value || null, page: '1' })}
              className="w-full px-3 py-2 rounded-xl border border-[#EAE5DB] bg-white text-xs sm:text-sm text-[#223B28] focus:outline-none focus:ring-2 focus:ring-[#2E4D34] cursor-pointer"
            >
              <option value="">All Categories</option>
              {SELLABLE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Ordering Dropdown */}
          <div className="lg:col-span-4">
            <div className="relative">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#8E9B90] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={currentOrdering}
                onChange={(e) => updateParams({ ordering: e.target.value, page: '1' })}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#EAE5DB] bg-white text-xs sm:text-sm text-[#223B28] focus:outline-none focus:ring-2 focus:ring-[#2E4D34] cursor-pointer"
              >
                <option value="submitted_asc">Oldest Submitted (Queue Order)</option>
                <option value="submitted_desc">Newest Submitted First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-[#EAE5DB]/60 text-xs">
            <span className="text-[#5F6D61]">Filtering results</span>
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1.5 font-semibold text-[#DC2626] hover:text-[#991B1B] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Review Queue Table & Mobile Cards */}
      {isError ? (
        <ErrorState
          title="Failed to load review queue"
          message="Could not connect to moderation database. Please check your connection and retry."
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <div className="bg-white rounded-2xl border border-[#EAE5DB] p-6 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="w-12 h-12 rounded-xl bg-[#EAE5DB]/60 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="w-1/3 h-4 bg-[#EAE5DB]/70 rounded" />
                <div className="w-1/4 h-3 bg-[#EAE5DB]/40 rounded" />
              </div>
              <div className="w-24 h-4 bg-[#EAE5DB]/50 rounded" />
              <div className="w-20 h-6 bg-[#EAE5DB]/40 rounded-full" />
            </div>
          ))}
        </div>
      ) : data?.results.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="w-8 h-8 text-[#8E9B90]" />}
          title={
            currentStatus === 'pending_review'
              ? 'No products waiting for review'
              : 'No matching products found'
          }
          description={
            currentStatus === 'pending_review'
              ? 'All submitted artisan products have been reviewed! Check back when sellers submit new listings.'
              : 'Try clearing your search query or filters to view other products.'
          }
          action={
            hasActiveFilters
              ? {
                  label: 'Clear Filters',
                  onClick: handleClearFilters,
                  icon: <Filter className="w-3.5 h-3.5" />,
                }
              : undefined
          }
        />
      ) : (
        <div className="space-y-4">
          {/* Desktop Review Queue Table */}
          <div className="hidden lg:block overflow-hidden rounded-2xl border border-[#EAE5DB] bg-white shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#EAE5DB] text-xs font-semibold text-[#5F6D61] uppercase tracking-wider">
                  <th scope="col" className="py-3.5 px-4 w-[34%]">
                    Product Listing
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    Seller / Studio
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    Category
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-right">
                    Price
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    Submitted Date
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    Status
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE5DB] text-xs sm:text-sm">
                {data?.results.map((product) => {
                  const submittedFormatted = new Date(product.submitted_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <tr
                      key={product.id}
                      onClick={() => navigate(`/admin/product-reviews/${product.id}`)}
                      className="hover:bg-[#FAF7F2]/70 cursor-pointer transition-colors group"
                    >
                      {/* Thumbnail, Title, SKU */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.main_image_url}
                            alt={product.title}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/botanical-care-banner.jpg';
                            }}
                            className="w-12 h-12 rounded-xl object-cover border border-[#EAE5DB] bg-[#FAF7F2] flex-shrink-0 group-hover:shadow-xs transition-shadow"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-[#223B28] truncate group-hover:text-[#2E4D34] transition-colors">
                              {product.title}
                            </p>
                            <span className="font-mono text-[11px] text-[#8E9B90]">
                              {product.sku}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Seller Info */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-[#223B28]">
                          {product.seller.store_name}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-[#5F6D61] whitespace-nowrap">
                        {product.category.name}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 text-right font-medium text-[#223B28] whitespace-nowrap">
                        {formatINR(product.price_paise)}
                      </td>

                      {/* Submitted Date */}
                      <td className="py-3.5 px-4 text-[#5F6D61] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#8E9B90]" />
                          <span>{submittedFormatted}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={product.status} size="sm" />
                      </td>

                      {/* Action Button */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EAE5DB] bg-white group-hover:bg-[#2E4D34] group-hover:text-white text-xs font-semibold text-[#2E4D34] transition-all">
                          <span>Inspect</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3.5">
            {data?.results.map((product) => {
              const submittedFormatted = new Date(product.submitted_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <div
                  key={product.id}
                  onClick={() => navigate(`/admin/product-reviews/${product.id}`)}
                  className="bg-white rounded-2xl border border-[#EAE5DB] p-4 shadow-xs space-y-3 cursor-pointer hover:border-[#2E4D34] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={product.main_image_url}
                      alt={product.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/botanical-care-banner.jpg';
                      }}
                      className="w-16 h-16 rounded-xl object-cover border border-[#EAE5DB] bg-[#FAF7F2] flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <StatusBadge status={product.status} size="sm" />
                        <span className="font-bold text-xs text-[#223B28]">
                          {formatINR(product.price_paise)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-sm text-[#223B28] mt-1 line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="text-xs text-[#5F6D61] mt-1 font-medium">
                        By {product.seller.store_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#EAE5DB]/60 text-[#8E9B90]">
                    <span>Category: {product.category.name}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {submittedFormatted}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="w-full py-2 px-3 rounded-xl bg-[#2E4D34] text-white font-semibold text-xs shadow-xs transition-colors"
                  >
                    Open Review
                  </button>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {data && (
            <Pagination
              currentPage={currentPage}
              totalItems={data.count}
              pageSize={pageSize}
              onPageChange={(page) => updateParams({ page: String(page) })}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AdminProductReviewsPage;
