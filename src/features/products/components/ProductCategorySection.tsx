import React, { useState, useMemo } from 'react';
import { Layers, AlertTriangle, HelpCircle, ArrowRight } from 'lucide-react';
import type { VendorCategoryWithAttributes } from '../../../types/categoryAttributes';
import { ConfirmDialog } from '../../../components/vendor/ConfirmDialog';
import { findSimilarCategories } from '../utils/categoryMatching';

interface ProductCategorySectionProps {
  categories: VendorCategoryWithAttributes[];
  selectedCategoryId: string | null;
  selectedSubcategory?: string;
  requestedCategoryName?: string;
  requestedSubcategoryName?: string;
  isCustomSubcategory?: boolean;
  onCategoryChange: (categoryId: string | null) => void;
  onSubcategoryChange: (subcategory: string) => void;
  onRequestedCategoryNameChange: (name: string) => void;
  onRequestedSubcategoryNameChange: (sub: string) => void;
  onIsCustomSubcategoryChange: (isCustom: boolean) => void;
  hasFilledAttributes: boolean;
  error?: string;
  categoryNameError?: string;
  subcategoryNameError?: string;
  readOnly?: boolean;
}

export const ProductCategorySection: React.FC<ProductCategorySectionProps> = ({
  categories,
  selectedCategoryId,
  selectedSubcategory = '',
  requestedCategoryName = '',
  requestedSubcategoryName = '',
  isCustomSubcategory = false,
  onCategoryChange,
  onSubcategoryChange,
  onRequestedCategoryNameChange,
  onRequestedSubcategoryNameChange,
  onIsCustomSubcategoryChange,
  hasFilledAttributes,
  error,
  categoryNameError,
  subcategoryNameError,
  readOnly = false,
}) => {
  const [pendingCategoryId, setPendingCategoryId] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const isOtherSelected = selectedCategoryId === null || selectedCategoryId === 'other';
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  // Real-time duplicate category suggestions (up to 3)
  const similarCategories = useMemo(() => {
    if (!isOtherSelected || !requestedCategoryName) return [];
    return findSimilarCategories(requestedCategoryName, categories);
  }, [isOtherSelected, requestedCategoryName, categories]);

  const hasExactDuplicate = similarCategories.some((m) => m.isExact);

  const handleSelectCategory = (categoryId: string | null) => {
    if (readOnly || categoryId === selectedCategoryId) return;

    if (hasFilledAttributes) {
      setPendingCategoryId(categoryId);
      setShowConfirmDialog(true);
    } else {
      applyCategoryChange(categoryId);
    }
  };

  const applyCategoryChange = (catId: string | null) => {
    onCategoryChange(catId);
    if (catId !== 'other' && catId !== null) {
      onRequestedCategoryNameChange('');
      onIsCustomSubcategoryChange(false);
      onRequestedSubcategoryNameChange('');
    }
  };

  const handleConfirmChange = () => {
    applyCategoryChange(pendingCategoryId);
    setPendingCategoryId(null);
    setShowConfirmDialog(false);
  };

  const handleSelectSuggestedCategory = (catId: string) => {
    if (readOnly) return;
    if (hasFilledAttributes) {
      setPendingCategoryId(catId);
      setShowConfirmDialog(true);
    } else {
      applyCategoryChange(catId);
    }
  };

  return (
    <div id="section-category" className="bg-white rounded-xl border border-stone-200 p-6 space-y-5 shadow-sm">
      <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              Category & Classification <span className="text-red-500">*</span>
            </h3>
            <p className="text-xs text-stone-500">
              Select the sellable category for your product. Specific attribute fields will load automatically.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Primary Category Grid (7 predefined + 8th 'Other' card) */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-stone-700 block">
          Primary Product Category <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {categories.map((cat) => {
            const isSelected = cat.id === selectedCategoryId;
            return (
              <button
                key={cat.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelectCategory(cat.id)}
                className={`text-left p-3 rounded-xl border text-xs font-medium transition-all flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-700/20 font-semibold shadow-sm'
                    : 'border-stone-200 bg-white hover:border-stone-300 text-stone-800 hover:bg-stone-50'
                } ${readOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{cat.name}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  )}
                </div>
                <span className="text-[10px] text-stone-500 line-clamp-1 font-normal">
                  {cat.subcategories?.slice(0, 3).join(', ') || cat.description}...
                </span>
              </button>
            );
          })}

          {/* 8th Card: 'Other' */}
          <button
            type="button"
            disabled={readOnly}
            onClick={() => handleSelectCategory(null)}
            className={`text-left p-3 rounded-xl border text-xs font-medium transition-all flex flex-col justify-between gap-2 ${
              isOtherSelected
                ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-700/20 font-semibold shadow-sm'
                : 'border-stone-200 bg-white hover:border-stone-300 text-stone-800 hover:bg-stone-50'
            } ${readOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-bold">Other</span>
              {isOtherSelected && (
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              )}
            </div>
            <span className="text-[10px] text-stone-500 line-clamp-1 font-normal">
              My product does not fit these categories
            </span>
          </button>
        </div>
      </div>

      {/* WHEN 'OTHER' IS SELECTED */}
      {isOtherSelected && (
        <div className="pt-2 p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE5DB] space-y-4 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category Name (required, 3-50 chars, letters/numbers/spaces/&/- only) */}
            <div>
              <label
                htmlFor="requested-category-name"
                className="text-xs font-semibold text-stone-800 block mb-1"
              >
                Category name <span className="text-red-500">*</span>
              </label>
              <input
                id="requested-category-name"
                type="text"
                disabled={readOnly}
                maxLength={50}
                value={requestedCategoryName}
                onChange={(e) => onRequestedCategoryNameChange(e.target.value)}
                placeholder="e.g. Traditional Musical Instruments"
                className={`w-full text-xs px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white text-stone-800 ${
                  categoryNameError || hasExactDuplicate
                    ? 'border-amber-500 bg-amber-50/30'
                    : 'border-stone-300'
                }`}
              />
              {categoryNameError && !hasExactDuplicate && (
                <span className="text-[11px] text-red-600 block pt-1 font-medium">
                  {categoryNameError}
                </span>
              )}

              {/* Duplicate Prevention Suggestions */}
              {similarCategories.length > 0 && (
                <div className="mt-2 p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 space-y-2">
                  <div className="text-[11px] text-amber-900 font-medium flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>
                      {hasExactDuplicate
                        ? 'This category already exists on ChillyFlakes:'
                        : 'Did you mean an existing category?'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {similarCategories.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleSelectSuggestedCategory(m.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-md text-[11px] font-semibold transition-colors shadow-2xs"
                      >
                        <span>{m.name}</span>
                        <ArrowRight className="w-3 h-3 text-emerald-600" />
                        <span className="text-[10px] text-emerald-700 font-normal">Use this category</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Subcategory (optional, 3-50 chars) */}
            <div>
              <label
                htmlFor="requested-subcategory-name"
                className="text-xs font-semibold text-stone-800 block mb-1"
              >
                Subcategory <span className="text-stone-400 font-normal">(Optional)</span>
              </label>
              <input
                id="requested-subcategory-name"
                type="text"
                disabled={readOnly}
                maxLength={50}
                value={requestedSubcategoryName}
                onChange={(e) => onRequestedSubcategoryNameChange(e.target.value)}
                placeholder="e.g. String Instruments or Flutes"
                className={`w-full text-xs px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white text-stone-800 ${
                  subcategoryNameError ? 'border-red-500' : 'border-stone-300'
                }`}
              />
              {subcategoryNameError && (
                <span className="text-[11px] text-red-600 block pt-1 font-medium">
                  {subcategoryNameError}
                </span>
              )}
            </div>
          </div>

          {/* Helper Text */}
          <p className="text-[11px] text-stone-500 leading-relaxed">
            Our team will review your category before the product goes live. It may be placed in an existing category.
          </p>
        </div>
      )}

      {/* WHEN AN EXISTING CATEGORY IS SELECTED */}
      {!isOtherSelected && selectedCategory && (
        <div className="pt-2 space-y-3 max-w-md">
          <div>
            <label htmlFor="category-subcategory-select" className="text-xs font-semibold text-stone-700 block mb-1">
              Subcategory <span className="text-stone-400 font-normal">(Optional)</span>
            </label>
            <select
              id="category-subcategory-select"
              value={isCustomSubcategory ? '__other__' : selectedSubcategory}
              disabled={readOnly}
              onChange={(e) => {
                if (e.target.value === '__other__') {
                  onIsCustomSubcategoryChange(true);
                  onSubcategoryChange('');
                } else {
                  onIsCustomSubcategoryChange(false);
                  onSubcategoryChange(e.target.value);
                  onRequestedSubcategoryNameChange('');
                }
              }}
              className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white text-stone-800"
            >
              <option value="">Select a subcategory (recommended)...</option>
              {selectedCategory.subcategories?.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
              <option value="__other__">Other (type your own)...</option>
            </select>
          </div>

          {/* When 'Other (type your own)' subcategory is chosen */}
          {isCustomSubcategory && (
            <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#EAE5DB] space-y-1.5 animate-in fade-in">
              <label
                htmlFor="custom-subcategory-input"
                className="text-xs font-semibold text-stone-800 block"
              >
                New subcategory name <span className="text-red-500">*</span>
              </label>
              <input
                id="custom-subcategory-input"
                type="text"
                disabled={readOnly}
                maxLength={50}
                value={requestedSubcategoryName}
                onChange={(e) => onRequestedSubcategoryNameChange(e.target.value)}
                placeholder="e.g. Festival Special Tops"
                className={`w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white text-stone-800 ${
                  subcategoryNameError ? 'border-red-500 bg-red-50/40' : 'border-stone-300'
                }`}
              />
              {subcategoryNameError && (
                <span className="text-[11px] text-red-600 block font-medium">
                  {subcategoryNameError}
                </span>
              )}
              <span className="text-[10px] text-stone-500 block">
                Requested subcategory under {selectedCategory.name} (3–50 characters).
              </span>
            </div>
          )}
        </div>
      )}

      {/* Confirmation modal on changing category when attributes filled */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Change Product Category?"
        message="Changing the category will clear any category-specific details you have already entered for this product. Are you sure you want to proceed?"
        confirmText="Yes, Change Category"
        cancelText="Keep Current"
        onConfirm={handleConfirmChange}
        onClose={() => {
          setShowConfirmDialog(false);
          setPendingCategoryId(null);
        }}
      />
    </div>
  );
};
