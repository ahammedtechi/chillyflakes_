import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  ArrowLeft,
  Loader2,
  ShieldAlert,
  Clock,
} from 'lucide-react';

import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '../../../components/vendor/Toast';
import { StatusBadge } from '../../../components/vendor/StatusBadge';
import { ProductCategorySection } from '../components/ProductCategorySection';
import { ProductBasicDetailsSection, type LanguageTranslation } from '../components/ProductBasicDetailsSection';
import { ProductAttributesSection } from '../components/ProductAttributesSection';
import { ProductVariantsSection } from '../components/ProductVariantsSection';
import { ProductMediaSection } from '../components/ProductMediaSection';
import { ProductPricingSection } from '../components/ProductPricingSection';
import { ProductShippingSection } from '../components/ProductShippingSection';
import { ProductWholesaleSection } from '../components/ProductWholesaleSection';
import { ProductStickyActionBar } from '../components/ProductStickyActionBar';
import { ProductSubmitSuccessModal } from '../components/ProductSubmitSuccessModal';
import { ProductReReviewConfirmModal } from '../components/ProductReReviewConfirmModal';
import { ProductErrorSummary } from '../components/ProductErrorSummary';

import {
  useVendorCategories,
  useVendorProductDetail,
  useProductFormMutations,
} from '../hooks/useProductForm';
import { useProductMutations } from '../hooks/useProductMutations';
import {
  validateProductSubmission,
  draftProductSchema,
  type FormValidationErrorItem,
} from '../validation/productSchema';

import type {
  ProductColorItem,
  ProductImageItem,
  ProductSizeItem,
  ProductVideoUpload,
  ProductShippingConfig,
  ProductWholesaleConfig,
  VendorProductPayload,
} from '../../../types/product';
import type { VendorCategoryWithAttributes } from '../../../types/categoryAttributes';

export const VendorProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const toast = useToast();

  const isEditMode = Boolean(id && id !== 'new');

  // Queries & Mutations
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
  } = useVendorCategories();

  const {
    data: initialProduct,
    isLoading: isProductLoading,
    error: productLoadError,
    refetch: refetchProduct,
  } = useVendorProductDetail(isEditMode ? id : undefined);

  const {
    createDraftMutation,
    updateDraftMutation,
    submitForReviewMutation,
  } = useProductFormMutations();

  const { withdrawMutation } = useProductMutations();

  // Active category definition
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [requestedCategoryName, setRequestedCategoryName] = useState<string>('');
  const [requestedSubcategoryName, setRequestedSubcategoryName] = useState<string>('');
  const [isCustomSubcategory, setIsCustomSubcategory] = useState<boolean>(false);

  // Basic details
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [translations, setTranslations] = useState<Record<string, LanguageTranslation>>({});

  // Dynamic category attributes & custom attributes
  const [attributes, setAttributes] = useState<Record<string, any>>({});
  const [customAttributes, setCustomAttributes] = useState<{ label: string; value: string }[]>([]);

  // Variants
  const [hasColors, setHasColors] = useState<boolean>(false);
  const [colors, setColors] = useState<ProductColorItem[]>([]);
  const [standaloneSizes, setStandaloneSizes] = useState<ProductSizeItem[]>([]);

  // Standalone media
  const [standaloneImages, setStandaloneImages] = useState<ProductImageItem[]>([]);
  const [videoUpload, setVideoUpload] = useState<ProductVideoUpload | null>(null);

  // Pricing & Stock
  const [mrpPaise, setMrpPaise] = useState<number>(0);
  const [pricePaise, setPricePaise] = useState<number>(0);
  const [gstRate, setGstRate] = useState<number>(12);
  const [hsn, setHsn] = useState<string>('');
  const [baseSku, setBaseSku] = useState<string>('');
  const [stock, setStock] = useState<number>(10);

  // Shipping
  const [shipping, setShipping] = useState<ProductShippingConfig>({
    weight_g: 500,
    length_cm: 20,
    width_cm: 15,
    height_cm: 10,
    processing_days: 2,
  });

  // Wholesale
  const [wholesale, setWholesale] = useState<ProductWholesaleConfig>({
    enabled: false,
    moq: 10,
    tiers: [],
  });

  // Validation & Error states
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [errorList, setErrorList] = useState<FormValidationErrorItem[]>([]);

  // UI Modals & Flags
  const [showSubmitSuccessModal, setShowSubmitSuccessModal] = useState<boolean>(false);
  const [showReReviewConfirmModal, setShowReReviewConfirmModal] = useState<boolean>(false);
  const [changedReviewFields, setChangedReviewFields] = useState<string[]>([]);
  const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lastAutosavedAt, setLastAutosavedAt] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Initialized flag to avoid marking pristine loaded data as dirty
  const isLoadedRef = useRef<boolean>(false);
  const activeProductIdRef = useRef<string | undefined>(isEditMode ? id : undefined);

  // Selected Category Object
  const currentCategory: VendorCategoryWithAttributes | undefined = useMemo(() => {
    if (selectedCategoryId === 'other' || !selectedCategoryId) return undefined;
    return categories.find((c) => c.id === selectedCategoryId);
  }, [categories, selectedCategoryId]);

  // Check if seller enabled wholesale at registration
  const sellerWholesaleEligible = user ? user.vendor_status !== 'rejected' : true;

  // Initialize Default Category when categories load for new products
  useEffect(() => {
    if (!isEditMode && categories.length > 0 && !selectedCategoryId) {
      const firstCat = categories[0];
      setSelectedCategoryId(firstCat.id);
      setSelectedSubcategory(firstCat.subcategories?.[0] || '');
      if (firstCat.sizes_enabled) {
        setStandaloneSizes(
          (firstCat.default_sizes || ['Standard']).map((sz) => ({
            label: sz,
            stock: 10,
            sku: `SKU-${Date.now().toString().slice(-4)}-${sz.toUpperCase()}`,
          }))
        );
      }
    }
  }, [categories, isEditMode, selectedCategoryId]);

  // Populate data when editing existing product
  useEffect(() => {
    if (!initialProduct || !isEditMode) return;

    activeProductIdRef.current = initialProduct.id;

    const isCustomCat = Boolean(
      initialProduct.is_custom_category ||
      !initialProduct.category?.id ||
      initialProduct.category?.id === 'other' ||
      initialProduct.requested_category_name ||
      initialProduct.custom_category_name
    );

    if (isCustomCat) {
      setSelectedCategoryId('other');
      setRequestedCategoryName(
        initialProduct.requested_category_name ||
        initialProduct.custom_category_name ||
        initialProduct.category?.name ||
        ''
      );
    } else {
      setSelectedCategoryId(initialProduct.category?.id || '');
      setRequestedCategoryName('');
    }

    if (initialProduct.requested_subcategory_name || initialProduct.custom_subcategory) {
      setSelectedSubcategory('__custom__');
      setIsCustomSubcategory(true);
      setRequestedSubcategoryName(
        initialProduct.requested_subcategory_name ||
        initialProduct.custom_subcategory ||
        ''
      );
    } else {
      setSelectedSubcategory(initialProduct.subcategory || '');
      setIsCustomSubcategory(false);
      setRequestedSubcategoryName('');
    }

    if (initialProduct.custom_attributes && Array.isArray(initialProduct.custom_attributes)) {
      setCustomAttributes(initialProduct.custom_attributes);
    }

    setTitle(initialProduct.title || '');
    setDescription(initialProduct.description || '');
    setBrand(initialProduct.brand || '');
    setTags(initialProduct.tags || []);
    setTranslations(initialProduct.translations || {});
    setAttributes(initialProduct.attributes || {});

    const hasCols = Boolean(
      initialProduct.has_colors ||
        (initialProduct.color_items && initialProduct.color_items.length > 0)
    );
    setHasColors(hasCols);
    if (initialProduct.color_items && initialProduct.color_items.length > 0) {
      setColors(initialProduct.color_items);
    } else if (initialProduct.colors && initialProduct.colors.length > 0) {
      setColors(
        initialProduct.colors.map((c, idx) => ({
          id: `col_${idx + 1}`,
          name: c.name,
          hex: c.hex,
          images: [],
          sizes: [{ label: 'Standard', stock: 10, sku: `${initialProduct.sku}-${idx + 1}` }],
        }))
      );
    }

    if (initialProduct.image_items && initialProduct.image_items.length > 0) {
      setStandaloneImages(initialProduct.image_items);
    } else if (initialProduct.main_image_url) {
      setStandaloneImages([
        {
          id: 'img_main',
          upload_id: 'upl_main',
          url: initialProduct.main_image_url,
          is_primary: true,
          order: 0,
          alt: initialProduct.title,
        },
      ]);
    }

    setVideoUpload(initialProduct.video_upload || null);
    setMrpPaise(initialProduct.mrp_paise || initialProduct.price_paise * 1.25);
    setPricePaise(initialProduct.price_paise || 0);
    setGstRate(initialProduct.gst_rate ?? 12);
    setHsn(initialProduct.hsn || '');
    setBaseSku(initialProduct.sku || '');
    setStock(initialProduct.total_stock || 10);

    if (initialProduct.shipping) {
      setShipping(initialProduct.shipping);
    }

    if (initialProduct.wholesale) {
      setWholesale(initialProduct.wholesale);
    }

    // Default standalone sizes if category uses them and colors not used
    const cat = categories.find((c) => c.id === initialProduct.category?.id);
    if (cat?.sizes_enabled && (!initialProduct.color_items || initialProduct.color_items.length === 0)) {
      setStandaloneSizes(
        (cat.default_sizes || ['Standard']).map((sz) => ({
          label: sz,
          stock: 10,
          sku: `${initialProduct.sku || 'SKU'}-${sz.toUpperCase()}`,
        }))
      );
    }

    setTimeout(() => {
      isLoadedRef.current = true;
      setHasUnsavedChanges(false);
    }, 100);
  }, [initialProduct, isEditMode, categories]);

  // Mark unsaved changes on state changes after initial load
  const markDirty = useCallback(() => {
    if (isLoadedRef.current) {
      setHasUnsavedChanges(true);
    }
  }, []);

  // Unsaved changes browser prompt
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Total Stock calculation
  const totalCalculatedStock = useMemo(() => {
    if (hasColors) {
      return colors.reduce(
        (sum, col) =>
          sum +
          (col.sizes || []).reduce((sSum, s) => sSum + Number(s.stock || 0), 0),
        0
      );
    }
    if (currentCategory?.sizes_enabled && standaloneSizes.length > 0) {
      return standaloneSizes.reduce((sum, s) => sum + Number(s.stock || 0), 0);
    }
    return stock;
  }, [hasColors, colors, currentCategory, standaloneSizes, stock]);

  // Construct current payload
  const buildCurrentPayload = useCallback((): Partial<VendorProductPayload> => {
    const isOther = selectedCategoryId === 'other' || !selectedCategoryId;
    return {
      category_id: isOther ? null : selectedCategoryId,
      requested_category_name: isOther ? (requestedCategoryName.trim() || undefined) : undefined,
      custom_category_name: isOther ? (requestedCategoryName.trim() || undefined) : undefined,
      is_custom_category: isOther,
      subcategory: !isCustomSubcategory && selectedSubcategory !== '__custom__' ? (selectedSubcategory || undefined) : undefined,
      subcategory_id: !isCustomSubcategory && selectedSubcategory !== '__custom__' ? (selectedSubcategory || undefined) : undefined,
      requested_subcategory_name: isCustomSubcategory || selectedSubcategory === '__custom__' ? (requestedSubcategoryName.trim() || undefined) : undefined,
      custom_subcategory: isCustomSubcategory || selectedSubcategory === '__custom__' ? (requestedSubcategoryName.trim() || undefined) : undefined,
      title: title.trim(),
      description: description.trim(),
      brand: brand.trim() || undefined,
      translations,
      tags,
      attributes,
      custom_attributes: isOther ? customAttributes.filter((a) => a.label.trim() && a.value.trim()) : undefined,
      has_colors: hasColors,
      colors: hasColors ? colors : [],
      images: !hasColors ? standaloneImages : [],
      video_upload: videoUpload,
      mrp_paise: mrpPaise,
      price_paise: pricePaise,
      gst_rate: gstRate,
      hsn: hsn.trim() || undefined,
      stock: !hasColors ? stock : undefined,
      shipping,
      wholesale,
    };
  }, [
    selectedCategoryId,
    requestedCategoryName,
    selectedSubcategory,
    isCustomSubcategory,
    requestedSubcategoryName,
    title,
    description,
    brand,
    translations,
    tags,
    attributes,
    customAttributes,
    hasColors,
    colors,
    standaloneImages,
    videoUpload,
    mrpPaise,
    pricePaise,
    gstRate,
    hsn,
    stock,
    shipping,
    wholesale,
  ]);

  // Autosave a draft every 60 seconds ONLY if the product already exists
  useEffect(() => {
    if (!isEditMode || !activeProductIdRef.current) return;
    if (initialProduct?.status === 'pending_review') return;

    const timer = setInterval(async () => {
      if (!hasUnsavedChanges || !title.trim()) return;

      try {
        const payload = buildCurrentPayload();
        await updateDraftMutation.mutateAsync({
          id: activeProductIdRef.current!,
          payload,
        });
        setLastAutosavedAt(new Date());
        setHasUnsavedChanges(false);
      } catch {
        // Silent fail for background autosave
      }
    }, 60 * 1000);

    return () => clearInterval(timer);
  }, [
    isEditMode,
    hasUnsavedChanges,
    title,
    initialProduct?.status,
    buildCurrentPayload,
    updateDraftMutation,
  ]);

  // Handle Save Draft (requires only title)
  const handleSaveDraft = async () => {
    const draftValidation = draftProductSchema.safeParse({ title, category_id: selectedCategoryId });
    if (!draftValidation.success) {
      const msg = draftValidation.error.issues[0]?.message || 'Please enter a product title to save draft.';
      setFieldErrors({ title: msg });
      setErrorList([{ path: 'title', message: msg, sectionId: 'section-basic-details' }]);
      toast.error(msg);
      return;
    }

    setIsSavingDraft(true);
    setFieldErrors({});
    setErrorList([]);

    try {
      const payload = buildCurrentPayload();
      if (activeProductIdRef.current) {
        const updated = await updateDraftMutation.mutateAsync({
          id: activeProductIdRef.current,
          payload,
        });
        activeProductIdRef.current = updated.id;
        toast.success(t('vendorProductForm.draftSaved', 'Draft updated successfully.'));
      } else {
        const created = await createDraftMutation.mutateAsync(payload);
        activeProductIdRef.current = created.id;
        toast.success(t('vendorProductForm.draftCreated', 'Draft created successfully.'));
        navigate(`/vendor/products/${created.id}/edit`, { replace: true });
      }

      setHasUnsavedChanges(false);
      setLastAutosavedAt(new Date());
    } catch (err: any) {
      const serverMsg = err.response?.data?.message || err.message || 'Failed to save draft.';
      toast.error(serverMsg);
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Detect which content fields changed when editing an approved product
  const getApprovedContentChanges = (): string[] => {
    if (!initialProduct || initialProduct.status !== 'approved') return [];

    const changes: string[] = [];
    if (title.trim() !== initialProduct.title.trim()) changes.push('Product Title');
    if (description.trim() !== (initialProduct.description || '').trim())
      changes.push('Product Description');
    if (selectedCategoryId !== initialProduct.category?.id)
      changes.push('Product Category');
    if (hasColors !== Boolean(initialProduct.has_colors))
      changes.push('Color variants structure');
    if (JSON.stringify(attributes) !== JSON.stringify(initialProduct.attributes || {}))
      changes.push('Craftsmanship attributes & specifications');
    if (JSON.stringify(standaloneImages) !== JSON.stringify(initialProduct.image_items || []))
      changes.push('Product photography');
    if (videoUpload?.upload_id !== initialProduct.video_upload?.upload_id)
      changes.push('Craftsmanship video');

    return changes;
  };

  // Perform Final Submission to Platform Super Admin
  const executeFinalSubmit = async () => {
    setIsSubmitting(true);
    setFieldErrors({});
    setErrorList([]);

    try {
      const payload = buildCurrentPayload();
      let prodId = activeProductIdRef.current;

      // 1. Ensure product exists by saving current state
      if (prodId) {
        await updateDraftMutation.mutateAsync({ id: prodId, payload });
      } else {
        const created = await createDraftMutation.mutateAsync(payload);
        prodId = created.id;
        activeProductIdRef.current = created.id;
      }

      // 2. Submit for Platform Admin Review
      await submitForReviewMutation.mutateAsync(prodId);

      setHasUnsavedChanges(false);
      setShowSubmitSuccessModal(true);
    } catch (err: any) {
      const respData = err.response?.data;
      if (respData?.fieldErrors) {
        const mappedErrors: Record<string, string> = {};
        const mappedList: FormValidationErrorItem[] = [];

        Object.entries(respData.fieldErrors).forEach(([k, v]) => {
          const msg = Array.isArray(v) ? v[0] : String(v);
          mappedErrors[k] = msg;
          mappedList.push({
            path: k,
            message: msg,
            sectionId: 'section-basic-details',
          });
        });

        setFieldErrors(mappedErrors);
        setErrorList(mappedList);
      }
      const msg = respData?.message || err.message || 'Submission failed. Please check errors.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
      setShowReReviewConfirmModal(false);
    }
  };

  // Submit for Review Trigger
  const handleSubmitForReview = () => {
    const payload = buildCurrentPayload();
    const validation = validateProductSubmission(payload, currentCategory);

    if (!validation.success) {
      setFieldErrors(validation.fieldErrors);
      setErrorList(validation.errorList);
      toast.error('Please resolve highlighted errors before submitting for review.');
      return;
    }

    // Check if approved product has critical content changes
    if (initialProduct && initialProduct.status === 'approved') {
      const changes = getApprovedContentChanges();
      if (changes.length > 0) {
        setChangedReviewFields(changes);
        setShowReReviewConfirmModal(true);
        return;
      }
    }

    executeFinalSubmit();
  };

  // Handle Withdraw for pending_review
  const handleWithdrawAndEdit = async () => {
    if (!activeProductIdRef.current) return;
    try {
      await withdrawMutation.mutateAsync(activeProductIdRef.current);
      toast.success('Product withdrawn and returned to draft mode.');
      refetchProduct();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to withdraw product.');
    }
  };

  // Read-only condition: if pending_review
  const isPendingReview = initialProduct?.status === 'pending_review';
  const isRejected = initialProduct?.status === 'rejected';

  if (isCategoriesLoading || (isEditMode && isProductLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E4D34]" />
        <span className="text-xs text-[#5F6D61] font-medium">
          Loading product configuration...
        </span>
      </div>
    );
  }

  if (isEditMode && productLoadError) {
    return (
      <div className="p-8 text-center max-w-md mx-auto space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-[#1D251E]">Product Not Found</h2>
        <p className="text-xs text-[#5F6D61]">
          The product you are trying to edit could not be found or has been removed.
        </p>
        <button
          type="button"
          onClick={() => navigate('/vendor/products')}
          className="px-4 py-2 bg-[#2E4D34] text-white rounded-xl text-xs font-semibold"
        >
          Back to Catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="pb-16 max-w-5xl mx-auto space-y-6">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={() => navigate('/vendor/products')}
            className="inline-flex items-center gap-1.5 text-xs text-[#5F6D61] hover:text-[#2E4D34] mb-1 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>My Products</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1D251E]">
              {isEditMode ? `Edit: ${initialProduct?.title || 'Product'}` : 'Add New Product'}
            </h1>
            {initialProduct && (
              <StatusBadge status={initialProduct.status} />
            )}
          </div>
        </div>
      </div>

      {/* REJECTION REASON BANNER (for rejected products) */}
      {isRejected && (
        <div className="p-4 sm:p-5 rounded-2xl bg-red-50 border border-red-200 shadow-xs flex items-start gap-3.5 animate-in fade-in">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-red-900">
              Admin Review: Changes Requested
            </h2>
            <p className="text-xs text-red-800 leading-relaxed">
              <strong>Reason from Super Admin:</strong>{' '}
              "{initialProduct?.rejection_reason || 'Please review your images, attributes, and descriptions to ensure they match marketplace quality standards.'}"
            </p>
            <p className="text-[11px] text-red-700 pt-1">
              Please make the required adjustments in the form below and click "Submit for review" to re-evaluate your listing.
            </p>
          </div>
        </div>
      )}

      {/* PENDING REVIEW LOCK BANNER */}
      {isPendingReview && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold text-amber-900">
                Product is Under Admin Review
              </h2>
              <p className="text-xs text-amber-800">
                Editing is temporarily locked while our catalog curation team reviews your submission. To make edits right now, withdraw the product back to drafts.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleWithdrawAndEdit}
            className="px-4 py-2 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-300 text-amber-900 text-xs font-semibold shrink-0 shadow-2xs transition-all"
          >
            Withdraw & Edit
          </button>
        </div>
      )}

      {/* TOP ERROR SUMMARY (Focuses and scrolls to first error) */}
      <ProductErrorSummary
        errors={errorList}
        onDismiss={() => setErrorList([])}
      />

      {/* MAIN FORM SECTIONS */}
      <div className="space-y-6">
        {/* SECTION 1: CATEGORY SELECTION */}
        <ProductCategorySection
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          selectedSubcategory={selectedSubcategory}
          requestedCategoryName={requestedCategoryName}
          requestedSubcategoryName={requestedSubcategoryName}
          isCustomSubcategory={isCustomSubcategory}
          onCategoryChange={(catId) => {
            setSelectedCategoryId(catId || 'other');
            if (catId && catId !== 'other') {
              const foundCat = categories.find((c) => c.id === catId);
              setSelectedSubcategory(foundCat?.subcategories?.[0] || '');
              setIsCustomSubcategory(false);
            }
            setAttributes({});
            markDirty();
          }}
          onSubcategoryChange={(sub) => {
            setSelectedSubcategory(sub);
            markDirty();
          }}
          onRequestedCategoryNameChange={(name) => {
            setRequestedCategoryName(name);
            markDirty();
          }}
          onRequestedSubcategoryNameChange={(sub) => {
            setRequestedSubcategoryName(sub);
            markDirty();
          }}
          onIsCustomSubcategoryChange={(isCustom) => {
            setIsCustomSubcategory(isCustom);
            markDirty();
          }}
          hasFilledAttributes={Object.keys(attributes).length > 0 || customAttributes.length > 0}
          error={fieldErrors['category_id']}
          categoryNameError={fieldErrors['custom_category_name']}
          subcategoryNameError={fieldErrors['custom_subcategory']}
          readOnly={isPendingReview}
        />

        {/* SECTION 2: BASIC DETAILS & MULTILINGUAL TABS */}
        <ProductBasicDetailsSection
          title={title}
          description={description}
          brand={brand}
          tags={tags}
          translations={translations}
          onTitleChange={(val) => {
            setTitle(val);
            markDirty();
          }}
          onDescriptionChange={(val) => {
            setDescription(val);
            markDirty();
          }}
          onBrandChange={(val) => {
            setBrand(val);
            markDirty();
          }}
          onTagsChange={(tList) => {
            setTags(tList);
            markDirty();
          }}
          onTranslationsChange={(tr) => {
            setTranslations(tr);
            markDirty();
          }}
          fieldErrors={fieldErrors}
          readOnly={isPendingReview}
        />

        {/* SECTION 3: CATEGORY-SPECIFIC DETAILS */}
        <ProductAttributesSection
          category={currentCategory}
          isOtherCategory={selectedCategoryId === 'other' || !selectedCategoryId}
          attributes={attributes}
          customAttributes={customAttributes}
          onAttributeChange={(key, val) => {
            setAttributes((prev) => ({ ...prev, [key]: val }));
            markDirty();
          }}
          onCustomAttributesChange={(items) => {
            setCustomAttributes(items);
            markDirty();
          }}
          fieldErrors={fieldErrors}
          readOnly={isPendingReview}
        />

        {/* SECTION 4: COLORS AND SIZES (VARIANTS) */}
        <ProductVariantsSection
          hasColors={hasColors}
          colors={colors}
          standaloneSizes={standaloneSizes}
          category={currentCategory}
          productTitle={title}
          baseSku={baseSku}
          onHasColorsChange={(val) => {
            setHasColors(val);
            markDirty();
          }}
          onColorsChange={(cList) => {
            setColors(cList);
            markDirty();
          }}
          onStandaloneSizesChange={(sList) => {
            setStandaloneSizes(sList);
            markDirty();
          }}
          fieldErrors={fieldErrors}
          readOnly={isPendingReview}
        />

        {/* SECTION 5: MEDIA (STANDALONE PHOTOS & VIDEO) */}
        <ProductMediaSection
          hasColors={hasColors}
          images={standaloneImages}
          video={videoUpload}
          onImagesChange={(imgs) => {
            setStandaloneImages(imgs);
            markDirty();
          }}
          onVideoChange={(vid) => {
            setVideoUpload(vid);
            markDirty();
          }}
          fieldErrors={fieldErrors}
          readOnly={isPendingReview}
        />

        {/* SECTION 6: PRICING & STOCK */}
        <ProductPricingSection
          mrpPaise={mrpPaise}
          pricePaise={pricePaise}
          gstRate={gstRate}
          hsn={hsn}
          sku={baseSku}
          stock={stock}
          hasVariants={Boolean(hasColors || (currentCategory?.sizes_enabled && standaloneSizes.length > 0))}
          totalCalculatedStock={totalCalculatedStock}
          onMrpChange={(val) => {
            setMrpPaise(val);
            markDirty();
          }}
          onPriceChange={(val) => {
            setPricePaise(val);
            markDirty();
          }}
          onGstRateChange={(val) => {
            setGstRate(val);
            markDirty();
          }}
          onHsnChange={(val) => {
            setHsn(val);
            markDirty();
          }}
          onSkuChange={(val) => {
            setBaseSku(val);
            markDirty();
          }}
          onStockChange={(val) => {
            setStock(val);
            markDirty();
          }}
          fieldErrors={fieldErrors}
          readOnly={isPendingReview}
        />

        {/* SECTION 7: SHIPPING & PACKAGING */}
        <ProductShippingSection
          shipping={shipping}
          onChange={(sh) => {
            setShipping(sh);
            markDirty();
          }}
          fieldErrors={fieldErrors}
          readOnly={isPendingReview}
        />

        {/* SECTION 8: WHOLESALE (BULK SUPPLY) */}
        <ProductWholesaleSection
          wholesale={wholesale}
          sellerWholesaleEligible={sellerWholesaleEligible}
          basePricePaise={pricePaise}
          onChange={(wh) => {
            setWholesale(wh);
            markDirty();
          }}
          fieldErrors={fieldErrors}
          readOnly={isPendingReview}
        />
      </div>

      {/* STICKY ACTION BAR */}
      <ProductStickyActionBar
        isSavingDraft={isSavingDraft}
        isSubmitting={isSubmitting}
        lastAutosavedAt={lastAutosavedAt}
        hasUnsavedChanges={hasUnsavedChanges}
        isPendingReview={isPendingReview}
        onSaveDraft={handleSaveDraft}
        onSubmitForReview={handleSubmitForReview}
        onWithdrawAndEdit={isPendingReview ? handleWithdrawAndEdit : undefined}
        onBack={() => navigate('/vendor/products')}
      />

      {/* SUBMISSION SUCCESS MODAL */}
      <ProductSubmitSuccessModal
        isOpen={showSubmitSuccessModal}
        productTitle={title}
        onViewProducts={() => navigate('/vendor/products')}
        onAddAnother={() => {
          setShowSubmitSuccessModal(false);
          navigate('/vendor/products/new');
          window.location.reload();
        }}
      />

      {/* RE-REVIEW CONFIRM MODAL FOR APPROVED PRODUCTS */}
      <ProductReReviewConfirmModal
        isOpen={showReReviewConfirmModal}
        changedReviewFields={changedReviewFields}
        onConfirm={executeFinalSubmit}
        onCancel={() => setShowReReviewConfirmModal(false)}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default VendorProductFormPage;
