import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Store,
  CheckSquare,
  AlertTriangle,
  Play,
  ArrowRight,
  X,
  History,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useAdminProductDetail } from '../hooks/useAdminProductDetail';
import { useAdminProducts } from '../hooks/useAdminProducts';
import { useAdminProductMutations } from '../hooks/useAdminProductMutations';
import { useAdminCategories } from '../hooks/useAdminCategories';
import { PageHeader } from '../../../components/vendor/PageHeader';
import { StatusBadge } from '../../../components/vendor/StatusBadge';
import { ConfirmDialog } from '../../../components/vendor/ConfirmDialog';
import { ErrorState } from '../../../components/vendor/ErrorState';
import { useToast } from '../../../components/vendor/Toast';
import { formatINR } from '../../../utils/currency';
import {
  isValidCategoryString,
  findSimilarCategories,
} from '../../products/utils/categoryMatching';
import type { RejectReasonCode, AdminApprovePayload } from '../../../types/adminProduct';

type LangKey = 'en' | 'ml' | 'ta' | 'hi' | 'kn';

export const AdminProductReviewDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const { data: product, isLoading, isError, refetch } = useAdminProductDetail(id || '');
  const { approveMutation, rejectMutation } = useAdminProductMutations();
  const { data: adminCategories = [] } = useAdminCategories();

  // Query pending products list to determine "Review Next" target
  const { data: queueData } = useAdminProducts({ status: 'pending_review', page_size: 10 });

  // Local state
  const [activeLang, setActiveLang] = useState<LangKey>('en');
  const [selectedLightboxImage, setSelectedLightboxImage] = useState<string | null>(null);

  // Custom Category Resolution State
  const isCustomCategoryRequested = Boolean(
    product?.is_custom_category ||
    !product?.category?.id ||
    product?.requested_category_name
  );

  const [resolutionMode, setResolutionMode] = useState<'existing' | 'new_category' | 'new_subcategory'>('existing');
  const [selectedExistingCategoryId, setSelectedExistingCategoryId] = useState<string>('');
  const [selectedExistingSubcategory, setSelectedExistingSubcategory] = useState<string>('');
  const [newCatName, setNewCatName] = useState<string>('');
  const [newCatSlug, setNewCatSlug] = useState<string>('');
  const [newCatSubcategory, setNewCatSubcategory] = useState<string>('');
  const [parentCategoryId, setParentCategoryId] = useState<string>('');
  const [newSubcategoryName, setNewSubcategoryName] = useState<string>('');
  const [resolutionError, setResolutionError] = useState<string | null>(null);

  // Sync initial requested category/subcategory names
  React.useEffect(() => {
    if (product) {
      if (product.requested_category_name) {
        setNewCatName(product.requested_category_name);
        setNewCatSlug(
          product.requested_category_name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        );
      }
      if (product.requested_subcategory_name) {
        setNewCatSubcategory(product.requested_subcategory_name);
        setNewSubcategoryName(product.requested_subcategory_name);
      }
    }
  }, [product]);

  React.useEffect(() => {
    if (adminCategories.length > 0 && !selectedExistingCategoryId) {
      setSelectedExistingCategoryId(adminCategories[0].id);
      setSelectedExistingSubcategory(adminCategories[0].subcategories?.[0] || '');
      setParentCategoryId(adminCategories[0].id);
    }
  }, [adminCategories, selectedExistingCategoryId]);

  // Similar categories suggestions for new category name
  const similarCategories = React.useMemo(() => {
    if (!newCatName || newCatName.trim().length < 2) return [];
    return findSimilarCategories(newCatName, adminCategories);
  }, [newCatName, adminCategories]);

  // Dialog states
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReasonCode, setRejectReasonCode] = useState<RejectReasonCode>('poor_image_quality');
  const [rejectReasonText, setRejectReasonText] = useState('');
  const [rejectError, setRejectError] = useState<string | null>(null);

  // Checklist state (guidance checklist for admins, not enforced)
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    images: false,
    description: false,
    price: false,
    category: false,
    prohibited: false,
    video: false,
  });

  const toggleChecklist = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Find next pending product in queue
  const nextPendingProduct = queueData?.results?.find((p) => p.id !== id);

  const handleApproveConfirm = async () => {
    if (!id || !product) return;

    let payload: AdminApprovePayload | undefined;

    if (isCustomCategoryRequested) {
      if (resolutionMode === 'existing') {
        if (!selectedExistingCategoryId) {
          setResolutionError('Please select an existing category.');
          return;
        }
        payload = {
          category_id: selectedExistingCategoryId,
          subcategory: selectedExistingSubcategory.trim() || undefined,
        };
      } else if (resolutionMode === 'new_category') {
        const trimmed = newCatName.trim();
        if (!trimmed || !isValidCategoryString(trimmed)) {
          setResolutionError('Category name must be 3–50 characters (letters, numbers, spaces, & and -).');
          return;
        }
        const slug = (newCatSlug.trim() || trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-')).toLowerCase();
        payload = {
          new_category: {
            name: trimmed,
            slug,
            subcategories: newCatSubcategory.trim() ? [newCatSubcategory.trim()] : [],
          },
        };
      } else if (resolutionMode === 'new_subcategory') {
        const trimmed = newSubcategoryName.trim();
        if (!trimmed || !isValidCategoryString(trimmed)) {
          setResolutionError('Subcategory name must be 3–50 characters.');
          return;
        }
        if (!parentCategoryId) {
          setResolutionError('Please select a parent category.');
          return;
        }
        payload = {
          category_id: parentCategoryId,
          new_subcategory: {
            name: trimmed,
          },
        };
      }
    }

    try {
      await approveMutation.mutateAsync({ id, payload });
      toast.success('Product approved successfully! Listing is now live on ChillyFlakes.');
      setApproveDialogOpen(false);
      setResolutionError(null);
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } } };
      toast.error(errObj?.response?.data?.message || 'Failed to approve product.');
    }
  };

  const handleRejectNotSuitable = () => {
    setRejectReasonCode('category_not_suitable');
    setRejectReasonText(
      'The requested category does not align with ChillyFlakes artisan and handcrafted marketplace standards.'
    );
    setRejectDialogOpen(true);
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const trimmed = rejectReasonText.trim();
    if (trimmed.length < 10) {
      setRejectError('Please enter at least 10 characters explaining what the seller should fix.');
      return;
    }
    if (trimmed.length > 500) {
      setRejectError('Rejection reason cannot exceed 500 characters.');
      return;
    }

    try {
      await rejectMutation.mutateAsync({
        id,
        payload: {
          reason_code: rejectReasonCode,
          reason: trimmed,
        },
      });
      toast.warning('Product submission rejected. Explanation sent to seller.');
      setRejectDialogOpen(false);
      setRejectReasonText('');
      setRejectError(null);
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } } };
      toast.error(errObj?.response?.data?.message || 'Failed to reject product.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-[#EAE5DB]/60 rounded-xl w-1/3" />
        <div className="h-64 bg-white rounded-3xl border border-[#EAE5DB]" />
        <div className="h-96 bg-white rounded-3xl border border-[#EAE5DB]" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <ErrorState
        title="Product Not Found"
        message="Could not load product inspection details. The product may have been deleted or the ID is invalid."
        onRetry={() => refetch()}
      />
    );
  }

  const isPending = product.status === 'pending_review';
  const submittedFormatted = new Date(product.submitted_at || product.created_at).toLocaleDateString(
    'en-IN',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  return (
    <div className="space-y-6 pb-28 animate-fadeIn">
      {/* Top Breadcrumb & Return */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/product-reviews"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5F6D61] hover:text-[#223B28] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Review Queue</span>
        </Link>

        {nextPendingProduct && (
          <button
            type="button"
            onClick={() => navigate(`/admin/product-reviews/${nextPendingProduct.id}`)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2E4D34] hover:underline"
          >
            <span>Review next pending item</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <PageHeader
        title={product.title}
        description={`Submitted by ${product.seller.store_name} on ${submittedFormatted}`}
        actions={<StatusBadge status={product.status} size="md" />}
      />

      {/* Warning banner if product is NOT pending review */}
      {!isPending && (
        <div className="p-4 rounded-2xl border border-[#EAE5DB] bg-white shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-[#5F6D61] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#223B28]">
                Inspection Status: Currently {product.status.replace('_', ' ').toUpperCase()}
              </p>
              <p className="text-xs text-[#5F6D61] mt-0.5">
                {product.status === 'approved'
                  ? 'This listing was previously approved and is live on the store.'
                  : product.status === 'rejected'
                  ? `This listing was rejected with feedback: "${product.rejection_reason}"`
                  : 'This listing was withdrawn or drafted by the seller.'}
              </p>
            </div>
          </div>
          {nextPendingProduct && (
            <button
              type="button"
              onClick={() => navigate(`/admin/product-reviews/${nextPendingProduct.id}`)}
              className="px-3.5 py-1.5 rounded-xl bg-[#2E4D34] text-white font-semibold text-xs shadow-xs hover:bg-[#233B28] transition-colors flex-shrink-0"
            >
              Go to next pending product
            </button>
          )}
        </div>
      )}

      {/* Grid: Main Inspection Content (Col 8) + Admin Checklist & Seller Card (Col 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================== */}
        {/* LEFT COLUMN: FULL SUBMISSION CONTENT */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 space-y-6">
          {/* CUSTOM CATEGORY RESOLUTION PANEL */}
          {isCustomCategoryRequested && (
            <div
              id="custom-category-resolution"
              className="bg-amber-50/70 rounded-3xl border-2 border-amber-300/80 p-6 shadow-sm space-y-5 animate-in fade-in"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200 pb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full">
                      Custom Category Requested
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-amber-950 mt-1">
                      Seller Requested: "{product.requested_category_name || product.category?.name || 'Custom Category'}"
                    </h2>
                    {product.requested_subcategory_name && (
                      <p className="text-xs text-amber-900 mt-0.5">
                        Requested Subcategory: <strong>{product.requested_subcategory_name}</strong>
                      </p>
                    )}
                  </div>
                </div>

                {isPending && (
                  <button
                    type="button"
                    onClick={handleRejectNotSuitable}
                    className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl border border-red-300 bg-white hover:bg-red-50 text-xs font-semibold text-red-700 transition-colors shrink-0 shadow-2xs"
                  >
                    Reject as Not Suitable
                  </button>
                )}
              </div>

              {/* Custom Attributes Provided by Seller */}
              {product.custom_attributes && product.custom_attributes.length > 0 && (
                <div className="bg-white/80 rounded-2xl border border-amber-200 p-4 space-y-2">
                  <h4 className="text-xs font-bold text-amber-950">
                    Seller Custom Specifications ({product.custom_attributes.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {product.custom_attributes.map((attr, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-200/60 flex items-center justify-between"
                      >
                        <span className="text-stone-600 font-medium">{attr.label}:</span>
                        <span className="font-semibold text-stone-900">{attr.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resolution options for pending products */}
              {isPending ? (
                <div className="bg-white rounded-2xl border border-amber-200 p-5 space-y-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                      Category Placement Decision <span className="text-red-500">*</span>
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Before approving, select how this product should be catalogued on ChillyFlakes:
                    </p>
                  </div>

                  {resolutionError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{resolutionError}</span>
                    </div>
                  )}

                  {/* Mode Selector Tabs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setResolutionMode('existing');
                        setResolutionError(null);
                      }}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        resolutionMode === 'existing'
                          ? 'border-[#2E4D34] bg-[#EAF1EA] text-[#2E4D34] font-bold shadow-2xs'
                          : 'border-[#EAE5DB] bg-white text-[#5F6D61] hover:border-stone-300'
                      }`}
                    >
                      <p className="text-xs font-bold">1. Existing Category</p>
                      <p className="text-[11px] font-normal opacity-80 mt-0.5">
                        Map to an existing category/subcategory
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setResolutionMode('new_category');
                        setResolutionError(null);
                      }}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        resolutionMode === 'new_category'
                          ? 'border-[#2E4D34] bg-[#EAF1EA] text-[#2E4D34] font-bold shadow-2xs'
                          : 'border-[#EAE5DB] bg-white text-[#5F6D61] hover:border-stone-300'
                      }`}
                    >
                      <p className="text-xs font-bold">2. New Category</p>
                      <p className="text-[11px] font-normal opacity-80 mt-0.5">
                        Create a brand new department
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setResolutionMode('new_subcategory');
                        setResolutionError(null);
                      }}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        resolutionMode === 'new_subcategory'
                          ? 'border-[#2E4D34] bg-[#EAF1EA] text-[#2E4D34] font-bold shadow-2xs'
                          : 'border-[#EAE5DB] bg-white text-[#5F6D61] hover:border-stone-300'
                      }`}
                    >
                      <p className="text-xs font-bold">3. New Subcategory</p>
                      <p className="text-[11px] font-normal opacity-80 mt-0.5">
                        Add subcategory under an existing one
                      </p>
                    </button>
                  </div>

                  {/* FORM PER RESOLUTION MODE */}
                  {resolutionMode === 'existing' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-xs font-semibold text-[#223B28] mb-1">
                          Assign to Category
                        </label>
                        <select
                          value={selectedExistingCategoryId}
                          onChange={(e) => {
                            setSelectedExistingCategoryId(e.target.value);
                            const cat = adminCategories.find((c) => c.id === e.target.value);
                            setSelectedExistingSubcategory(cat?.subcategories?.[0] || '');
                          }}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE5DB] bg-white text-[#223B28] focus:outline-none focus:border-[#2E4D34]"
                        >
                          {adminCategories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#223B28] mb-1">
                          Subcategory
                        </label>
                        <select
                          value={selectedExistingSubcategory}
                          onChange={(e) => setSelectedExistingSubcategory(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE5DB] bg-white text-[#223B28] focus:outline-none focus:border-[#2E4D34]"
                        >
                          <option value="">None / General</option>
                          {adminCategories
                            .find((c) => c.id === selectedExistingCategoryId)
                            ?.subcategories?.map((sub) => (
                              <option key={sub} value={sub}>
                                {sub}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {resolutionMode === 'new_category' && (
                    <div className="space-y-3 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#223B28] mb-1">
                            New Category Name
                          </label>
                          <input
                            type="text"
                            value={newCatName}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewCatName(val);
                              setNewCatSlug(
                                val
                                  .toLowerCase()
                                  .trim()
                                  .replace(/[^a-z0-9]+/g, '-')
                                  .replace(/^-+|-+$/g, '')
                              );
                            }}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE5DB] bg-white text-[#223B28] focus:outline-none focus:border-[#2E4D34]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#223B28] mb-1">
                            Auto Slug
                          </label>
                          <input
                            type="text"
                            value={newCatSlug}
                            onChange={(e) => setNewCatSlug(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE5DB] bg-[#FAF7F2] font-mono text-[#223B28] focus:outline-none focus:border-[#2E4D34]"
                          />
                        </div>
                      </div>

                      {similarCategories.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-amber-100 border border-amber-300 text-xs text-amber-900">
                          <p className="font-bold flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                            Warning: Similar existing categories found:
                          </p>
                          <p className="text-[11px] text-amber-800 mt-0.5">
                            {similarCategories.map((m) => m.name).join(', ')}
                          </p>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-[#223B28] mb-1">
                          Subcategory under this new category (optional)
                        </label>
                        <input
                          type="text"
                          value={newCatSubcategory}
                          onChange={(e) => setNewCatSubcategory(e.target.value)}
                          placeholder="e.g. Starter Kits"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE5DB] bg-white text-[#223B28] focus:outline-none focus:border-[#2E4D34]"
                        />
                      </div>
                    </div>
                  )}

                  {resolutionMode === 'new_subcategory' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-xs font-semibold text-[#223B28] mb-1">
                          Parent Category
                        </label>
                        <select
                          value={parentCategoryId}
                          onChange={(e) => setParentCategoryId(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE5DB] bg-white text-[#223B28] focus:outline-none focus:border-[#2E4D34]"
                        >
                          {adminCategories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#223B28] mb-1">
                          New Subcategory Name
                        </label>
                        <input
                          type="text"
                          value={newSubcategoryName}
                          onChange={(e) => setNewSubcategoryName(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE5DB] bg-white text-[#223B28] focus:outline-none focus:border-[#2E4D34]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white/80 rounded-2xl border border-amber-200 p-4 text-xs text-stone-700">
                  <p>
                    <strong>Resolution Status:</strong> Placed under{' '}
                    <strong>{product.category?.name}</strong>
                    {product.subcategory ? ` > ${product.subcategory}` : ''}.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 1. Media Galleries & Video */}
          <div className="bg-white rounded-3xl border border-[#EAE5DB] p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-[#223B28]">
                Visual Assets & Media Gallery
              </h2>
              <span className="text-xs text-[#8E9B90]">
                Click any photo to inspect full high-resolution image
              </span>
            </div>

            {/* Galleries per color */}
            {product.color_galleries && product.color_galleries.length > 0 ? (
              <div className="space-y-4">
                {product.color_galleries.map((gallery, gIdx) => (
                  <div key={gIdx} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-[#D1DDD0]"
                        style={{ backgroundColor: gallery.hex }}
                      />
                      <span className="text-xs font-semibold text-[#223B28]">
                        Color: {gallery.color_name} ({gallery.images.length} photos)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {gallery.images.map((imgUrl, imgIdx) => (
                        <div
                          key={imgIdx}
                          onClick={() => setSelectedLightboxImage(imgUrl)}
                          className="relative aspect-square rounded-2xl border border-[#EAE5DB] bg-[#FAF7F2] overflow-hidden group cursor-zoom-in"
                        >
                          <img
                            src={imgUrl}
                            alt={`${product.title} - ${gallery.color_name}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                            Zoom
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => setSelectedLightboxImage(product.main_image_url)}
                  className="aspect-square rounded-2xl border border-[#EAE5DB] overflow-hidden cursor-zoom-in group"
                >
                  <img
                    src={product.main_image_url}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              </div>
            )}

            {/* Embedded Video Preview */}
            {product.video_url && (
              <div className="pt-4 border-t border-[#EAE5DB] space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#223B28]">
                  <Play className="w-3.5 h-3.5 text-[#2E4D34]" />
                  <span>Artisan Demonstration Video</span>
                </div>
                <div className="rounded-2xl border border-[#EAE5DB] bg-[#FAF7F2] overflow-hidden p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2E4D34] text-white flex items-center justify-center">
                      <Play className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#223B28]">Video Demonstration</p>
                      <p className="text-[11px] text-[#8E9B90] truncate max-w-sm">
                        {product.video_url}
                      </p>
                    </div>
                  </div>
                  <a
                    href={product.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-xl border border-[#EAE5DB] bg-white hover:bg-[#FAF7F2] text-xs font-semibold text-[#223B28] transition-colors"
                  >
                    Watch Full Video
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* 2. Title & Description with Language Tabs */}
          <div className="bg-white rounded-3xl border border-[#EAE5DB] p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAE5DB] pb-3">
              <h2 className="font-serif text-lg font-bold text-[#223B28]">
                Multilingual Content & Descriptions
              </h2>

              {/* Language Switcher Tabs */}
              <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#EAE5DB] text-xs">
                {(['en', 'ml', 'ta', 'hi', 'kn'] as LangKey[]).map((lang) => {
                  const labels: Record<LangKey, string> = {
                    en: 'English',
                    ml: 'മലയാളം',
                    ta: 'தமிழ்',
                    hi: 'हिंदी',
                    kn: 'ಕನ್ನಡ',
                  };
                  const isAvailable = Boolean(product.description_i18n?.[lang]);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setActiveLang(lang)}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                        activeLang === lang
                          ? 'bg-white text-[#2E4D34] font-bold shadow-2xs'
                          : isAvailable
                          ? 'text-[#5F6D61] hover:text-[#223B28]'
                          : 'text-[#B0B8B1] opacity-60'
                      }`}
                    >
                      {labels[lang]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E9B90]">
                  Product Title ({activeLang.toUpperCase()})
                </span>
                <p className="font-serif text-xl font-bold text-[#223B28] mt-0.5">
                  {product.title_i18n?.[activeLang] || product.title}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E9B90]">
                  Full Description
                </span>
                <p className="text-xs sm:text-sm text-[#5F6D61] leading-relaxed whitespace-pre-line mt-1 bg-[#FAF7F2]/40 p-4 rounded-2xl border border-[#EAE5DB]">
                  {product.description_i18n?.[activeLang] ||
                    product.description_i18n?.en ||
                    'No description provided for this language.'}
                </p>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E9B90] block mb-1.5">
                    Search Tags
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#EAE5DB] text-xs text-[#5F6D61]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Category Attributes & Specifications */}
          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <div className="bg-white rounded-3xl border border-[#EAE5DB] p-6 shadow-xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-[#223B28]">
                Category Attributes ({product.category.name})
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {Object.entries(product.attributes).map(([attrKey, attrVal]) => (
                  <div
                    key={attrKey}
                    className="p-3 rounded-2xl bg-[#FAF7F2]/50 border border-[#EAE5DB] flex items-center justify-between"
                  >
                    <span className="text-[#8E9B90] font-medium capitalize">
                      {attrKey.replace('_', ' ')}
                    </span>
                    <span className="font-semibold text-[#223B28]">{attrVal}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Pricing, GST, Shipping & Logistics */}
          <div className="bg-white rounded-3xl border border-[#EAE5DB] p-6 shadow-xs space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#223B28]">
              Commercial Terms & Logistics
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl border border-[#EAE5DB] bg-[#FAF7F2]/40">
                <span className="text-[#8E9B90]">Selling Price</span>
                <p className="font-serif text-lg font-bold text-[#2E4D34] mt-0.5">
                  {formatINR(product.price_paise)}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-[#EAE5DB] bg-[#FAF7F2]/40">
                <span className="text-[#8E9B90]">MRP / List Price</span>
                <p className="font-serif text-lg font-bold text-[#223B28] mt-0.5">
                  {formatINR(product.mrp_paise || product.price_paise)}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-[#EAE5DB] bg-[#FAF7F2]/40">
                <span className="text-[#8E9B90]">GST Slab</span>
                <p className="font-serif text-lg font-bold text-[#223B28] mt-0.5">
                  {product.gst_rate_percent ?? 5}%
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-[#EAE5DB] bg-[#FAF7F2]/40">
                <span className="text-[#8E9B90]">Package Weight</span>
                <p className="font-serif text-lg font-bold text-[#223B28] mt-0.5">
                  {product.shipping_weight_grams ?? 500} g
                </p>
              </div>
            </div>

            {/* Shipping Dimensions */}
            {product.shipping_dimensions && (
              <div className="p-3.5 rounded-2xl border border-[#EAE5DB] bg-[#FAF7F2]/30 flex items-center justify-between text-xs">
                <span className="text-[#8E9B90]">Package Dimensions (L × W × H):</span>
                <span className="font-mono font-semibold text-[#223B28]">
                  {product.shipping_dimensions.length_cm} × {product.shipping_dimensions.width_cm} ×{' '}
                  {product.shipping_dimensions.height_cm} cm
                </span>
              </div>
            )}

            {/* Wholesale Tiers */}
            {product.wholesale_enabled && product.wholesale_tiers && (
              <div className="pt-2 border-t border-[#EAE5DB] space-y-2">
                <span className="text-xs font-bold text-[#8A5A00] uppercase tracking-wider">
                  B2B Bulk Wholesale Pricing Tiers
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {product.wholesale_tiers.map((tier, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-[#F3E2B8] bg-[#FAF3E0]/30 flex items-center justify-between"
                    >
                      <span className="text-[#8A5A00]">Min {tier.min_quantity} units:</span>
                      <span className="font-bold text-[#223B28]">
                        {formatINR(tier.unit_price_paise)} / unit
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 5. Inventory & Variants Matrix */}
          <div className="bg-white rounded-3xl border border-[#EAE5DB] p-6 shadow-xs space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#223B28]">
              Variants & Inventory Matrix
            </h2>

            {product.variants && product.variants.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#FAF7F2] border-b border-[#EAE5DB] font-semibold text-[#5F6D61]">
                      <th className="py-2.5 px-3">Variant SKU</th>
                      <th className="py-2.5 px-3">Color</th>
                      <th className="py-2.5 px-3">Size / Spec</th>
                      <th className="py-2.5 px-3 text-right">Price</th>
                      <th className="py-2.5 px-3 text-right">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5DB]">
                    {product.variants.map((v, vIdx) => (
                      <tr key={vIdx} className="hover:bg-[#FAF7F2]/50">
                        <td className="py-2.5 px-3 font-mono text-[#8E9B90]">{v.sku}</td>
                        <td className="py-2.5 px-3 font-medium text-[#223B28]">{v.color_name}</td>
                        <td className="py-2.5 px-3 text-[#5F6D61]">{v.size || 'Standard'}</td>
                        <td className="py-2.5 px-3 text-right font-medium text-[#223B28]">
                          {formatINR(v.price_paise || product.price_paise)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#223B28]">
                          {v.stock}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-[#5F6D61]">Single variant product with {product.total_stock} in stock.</p>
            )}
          </div>

          {/* 6. Immutable Review History Log */}
          {product.review_history && product.review_history.length > 0 && (
            <div className="bg-white rounded-3xl border border-[#EAE5DB] p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#5F6D61]" />
                <h2 className="font-serif text-lg font-bold text-[#223B28]">
                  Historical Moderation Trail
                </h2>
              </div>

              <div className="space-y-3">
                {product.review_history.map((log) => {
                  const logDate = new Date(log.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={log.id}
                      className="p-4 rounded-2xl border border-[#EAE5DB] bg-[#FAF7F2]/40 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#223B28]">
                          {log.reviewed_by} decided{' '}
                          <span
                            className={
                              log.decision === 'approved' ? 'text-[#2E4D34] font-bold' : 'text-[#C53030] font-bold'
                            }
                          >
                            {log.decision.toUpperCase()}
                          </span>
                        </span>
                        <span className="text-[#8E9B90] text-[11px]">{logDate}</span>
                      </div>
                      {log.reason && (
                        <p className="text-[#5F6D61] bg-white p-2.5 rounded-xl border border-[#EAE5DB] mt-1">
                          Reason: {log.reason}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: SELLER PROFILE & ADMIN CHECKLIST */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-6">
          {/* Seller Card */}
          <div className="bg-white rounded-3xl border border-[#EAE5DB] p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#2E4D34] text-white flex items-center justify-center font-bold text-sm">
                <Store className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-base font-bold text-[#223B28] truncate">
                  {product.seller.store_name}
                </h3>
                <p className="text-xs text-[#5F6D61]">{product.seller.seller_name}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#EAE5DB] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#8E9B90]">Seller Status:</span>
                <span className="font-semibold text-[#2E4D34] bg-[#EAF1EA] px-2 py-0.5 rounded-full capitalize">
                  {product.seller.seller_status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8E9B90]">Registered Email:</span>
                <span className="font-mono text-[#223B28]">{product.seller.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8E9B90]">Verified Mobile:</span>
                <span className="font-mono text-[#223B28]">{product.seller.mobile_masked}</span>
              </div>
            </div>
          </div>

          {/* Admin Evaluation Guidance Checklist */}
          <div className="bg-white rounded-3xl border border-[#EAE5DB] p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#2E4D34]" />
              <h3 className="font-serif text-sm font-bold text-[#223B28]">
                Inspection Checklist
              </h3>
            </div>
            <p className="text-[11px] text-[#8E9B90] leading-snug">
              Guidance checklist to ensure listing meets ChillyFlakes artisan quality standards.
            </p>

            <div className="space-y-2 text-xs">
              {[
                { key: 'images', label: 'Images are clear on plain neutral backdrop' },
                { key: 'description', label: 'Description accurately lists ingredients / materials' },
                { key: 'price', label: 'Price and MRP are reasonable and truthful' },
                { key: 'category', label: 'Belongs to verified sellable craft category' },
                { key: 'prohibited', label: 'Contains no prohibited chemical additives or claims' },
                { key: 'video', label: 'Video demonstration is safe and appropriate' },
              ].map((item) => (
                <label
                  key={item.key}
                  onClick={() => toggleChecklist(item.key)}
                  className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#FAF7F2] cursor-pointer select-none transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checklist[item.key] || false}
                    onChange={() => {}}
                    className="mt-0.5 w-4 h-4 rounded text-[#2E4D34] focus:ring-[#2E4D34] border-[#D1DDD0]"
                  />
                  <span
                    className={`text-xs ${
                      checklist[item.key] ? 'line-through text-[#8E9B90]' : 'text-[#223B28]'
                    }`}
                  >
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* STICKY BOTTOM MODERATION ACTION BAR */}
      {/* ======================================================== */}
      <aside
        aria-label="Moderation Actions Bar"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE5DB] py-3.5 px-4 sm:px-8 shadow-lg"
      >
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <StatusBadge status={product.status} size="md" />
            <span className="text-xs text-[#5F6D61] hidden sm:inline">
              Reviewing: <strong>{product.title}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              disabled={!isPending || rejectMutation.isPending}
              onClick={() => setRejectDialogOpen(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#FED7D7] bg-[#FFF0F0] hover:bg-[#FEE2E2] disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold text-[#C53030] transition-colors"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject Submission</span>
            </button>

            <button
              type="button"
              disabled={!isPending || approveMutation.isPending}
              onClick={() => {
                if (isCustomCategoryRequested) {
                  if (resolutionMode === 'new_category') {
                    if (!newCatName.trim() || !isValidCategoryString(newCatName)) {
                      setResolutionError('Please enter a valid category name (3–50 characters) before approving.');
                      document.getElementById('custom-category-resolution')?.scrollIntoView({ behavior: 'smooth' });
                      return;
                    }
                  } else if (resolutionMode === 'new_subcategory') {
                    if (!newSubcategoryName.trim() || !isValidCategoryString(newSubcategoryName)) {
                      setResolutionError('Please enter a valid subcategory name (3–50 characters) before approving.');
                      document.getElementById('custom-category-resolution')?.scrollIntoView({ behavior: 'smooth' });
                      return;
                    }
                  } else if (resolutionMode === 'existing') {
                    if (!selectedExistingCategoryId) {
                      setResolutionError('Please select a target category before approving.');
                      document.getElementById('custom-category-resolution')?.scrollIntoView({ behavior: 'smooth' });
                      return;
                    }
                  }
                }
                setApproveDialogOpen(true);
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#2E4D34] hover:bg-[#233B28] disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold text-white shadow-sm transition-all focus:ring-2 focus:ring-[#2E4D34]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve & Publish</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* IMAGE LIGHTBOX MODAL */}
      {/* ======================================================== */}
      {selectedLightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedLightboxImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-[#FAF7F2] p-1"
              aria-label="Close image lightbox"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedLightboxImage}
              alt="High resolution inspection"
              className="max-h-[85vh] w-auto max-w-full rounded-2xl shadow-2xl object-contain"
            />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* APPROVE CONFIRMATION DIALOG */}
      {/* ======================================================== */}
      <ConfirmDialog
        isOpen={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
        onConfirm={handleApproveConfirm}
        title="Approve & Publish Listing"
        message={
          isCustomCategoryRequested
            ? `Approve '${product.title}' and map to "${
                resolutionMode === 'new_category'
                  ? newCatName
                  : resolutionMode === 'new_subcategory'
                  ? `${adminCategories.find((c) => c.id === parentCategoryId)?.name} > ${newSubcategoryName}`
                  : adminCategories.find((c) => c.id === selectedExistingCategoryId)?.name
              }"? Product will immediately go live on ChillyFlakes.`
            : `Are you sure you want to approve '${product.title}'? This product will immediately go live on the public ChillyFlakes store for buyers to purchase.`
        }
        confirmText="Approve Product"
        isDanger={false}
        isLoading={approveMutation.isPending}
      />

      {/* ======================================================== */}
      {/* REJECT MODAL DIALOG WITH REASON CODE & TEXT (10-500 CHARS) */}
      {/* ======================================================== */}
      {rejectDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-[#EAE5DB] space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FFF0F0] text-[#C53030] flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#223B28]">
                  Reject Product Submission
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRejectDialogOpen(false)}
                className="text-[#8E9B90] hover:text-[#223B28] p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#5F6D61]">
              Select a primary rejection category and provide clear feedback so the seller knows how
              to fix their listing before resubmitting.
            </p>

            {rejectError && (
              <div className="p-3 rounded-xl bg-[#FFF0F0] border border-[#FED7D7] text-xs text-[#C53030] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{rejectError}</span>
              </div>
            )}

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#223B28] mb-1.5">
                  Rejection Reason Category
                </label>
                <select
                  value={rejectReasonCode}
                  onChange={(e) => setRejectReasonCode(e.target.value as RejectReasonCode)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE5DB] bg-white text-xs text-[#223B28] focus:outline-none focus:ring-2 focus:ring-[#C53030]"
                >
                  <option value="poor_image_quality">Poor image quality / Cluttered backdrop</option>
                  <option value="wrong_category">Wrong product category</option>
                  <option value="incomplete_description">Incomplete ingredient or material details</option>
                  <option value="prohibited_product">Prohibited product or unverified claim</option>
                  <option value="price_issue">Unreasonable pricing or pricing discrepancy</option>
                  <option value="category_not_suitable">Category not suitable for ChillyFlakes marketplace</option>
                  <option value="other">Other compliance reason</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#223B28]">
                    Feedback for Seller (Min 10, Max 500 characters)
                  </label>
                  <span className="text-[11px] text-[#8E9B90]">
                    {rejectReasonText.length} / 500
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={rejectReasonText}
                  onChange={(e) => {
                    setRejectReasonText(e.target.value);
                    if (rejectError) setRejectError(null);
                  }}
                  placeholder="Explain clearly what the seller needs to modify (e.g. Please upload photos with a clean neutral background under natural diffused light and add mandatory botanical ingredients list.)"
                  className="w-full p-3 rounded-xl border border-[#EAE5DB] text-xs text-[#223B28] placeholder-[#8E9B90] focus:outline-none focus:ring-2 focus:ring-[#C53030]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectDialogOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#EAE5DB] text-xs font-semibold text-[#5F6D61] hover:bg-[#FAF7F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rejectMutation.isPending}
                  className="px-5 py-2 rounded-xl bg-[#C53030] hover:bg-[#9B2C2C] text-xs font-semibold text-white shadow-xs transition-colors"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductReviewDetailPage;
