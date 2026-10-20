import React, { useState } from 'react';
import { FileText, Globe, Plus, X, AlertCircle } from 'lucide-react';
import { FormField } from '../../../components/ui/FormField';

export interface LanguageTranslation {
  title?: string;
  description?: string;
}

interface ProductBasicDetailsSectionProps {
  title: string;
  description: string;
  brand?: string;
  tags: string[];
  translations: Record<string, LanguageTranslation>;
  onTitleChange: (val: string) => void;
  onDescriptionChange: (val: string) => void;
  onBrandChange: (val: string) => void;
  onTagsChange: (tags: string[]) => void;
  onTranslationsChange: (translations: Record<string, LanguageTranslation>) => void;
  fieldErrors: Record<string, string>;
  readOnly?: boolean;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', required: true },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം', required: false },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', required: false },
  { code: 'hi', label: 'Hindi', native: 'हिंदी', required: false },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', required: false },
] as const;

export const ProductBasicDetailsSection: React.FC<ProductBasicDetailsSectionProps> = ({
  title,
  description,
  brand = '',
  tags,
  translations,
  onTitleChange,
  onDescriptionChange,
  onBrandChange,
  onTagsChange,
  onTranslationsChange,
  fieldErrors,
  readOnly = false,
}) => {
  const [activeLang, setActiveLang] = useState<string>('en');
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (!trimmed) return;
    if (tags.length >= 10) return;
    if (tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setTagInput('');
      return;
    }
    onTagsChange([...tags, trimmed]);
    setTagInput('');
  };

  const handleRemoveTag = (indexToRemove: number) => {
    if (readOnly) return;
    onTagsChange(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const handleTranslationTitleChange = (lang: string, val: string) => {
    if (lang === 'en') {
      onTitleChange(val);
    } else {
      const current = translations[lang] || {};
      onTranslationsChange({
        ...translations,
        [lang]: { ...current, title: val },
      });
    }
  };

  const handleTranslationDescChange = (lang: string, val: string) => {
    if (lang === 'en') {
      onDescriptionChange(val);
    } else {
      const current = translations[lang] || {};
      onTranslationsChange({
        ...translations,
        [lang]: { ...current, description: val },
      });
    }
  };

  const currentTitle =
    activeLang === 'en' ? title : translations[activeLang]?.title || '';
  const currentDesc =
    activeLang === 'en' ? description : translations[activeLang]?.description || '';

  const titleError = activeLang === 'en' ? fieldErrors['title'] : undefined;
  const descError = activeLang === 'en' ? fieldErrors['description'] : undefined;
  const tagsError = fieldErrors['tags'];

  return (
    <div
      id="section-basic-details"
      className="bg-white rounded-2xl border border-[#EAE5DB] p-5 sm:p-6 space-y-6 shadow-xs"
    >
      {/* Section Header */}
      <div className="border-b border-[#EAE5DB] pb-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EAF1EA] text-[#2E4D34] flex items-center justify-center font-bold text-sm">
            2
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#1D251E] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2E4D34]" />
              Basic Details & Regional Descriptions
            </h3>
            <p className="text-xs text-[#5F6D61]">
              Provide an authentic, clear title and narrative. Customers love learning the origin story.
            </p>
          </div>
        </div>
      </div>

      {/* Language Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#223B28]">
            <Globe className="w-3.5 h-3.5 text-[#2E4D34]" />
            <span>Product Information Languages</span>
          </div>
          <span className="text-[11px] text-[#5F6D61] hidden sm:inline">
            English is required. Other languages fall back to English if left blank.
          </span>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-[#EAE5DB] pb-2">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isCurrent = activeLang === lang.code;
            const hasCustomContent =
              lang.code === 'en'
                ? Boolean(title || description)
                : Boolean(translations[lang.code]?.title || translations[lang.code]?.description);

            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setActiveLang(lang.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-[#2E4D34] text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-[#5F6D61] hover:bg-[#EAF1EA] hover:text-[#2E4D34]'
                }`}
              >
                <span>{lang.native}</span>
                <span className="text-[10px] opacity-75">({lang.label})</span>
                {lang.required && <span className="text-amber-300 font-bold">*</span>}
                {hasCustomContent && !isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E4D34]"></span>
                )}
              </button>
            );
          })}
        </div>

        {activeLang !== 'en' && (
          <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE5DB] text-[11px] text-[#5F6D61]">
            Translating for <strong className="text-[#223B28]">{SUPPORTED_LANGUAGES.find((l) => l.code === activeLang)?.label}</strong>. Optional: if left unfilled, regional shoppers will automatically see the English title and description.
          </div>
        )}
      </div>

      {/* Title Field */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label htmlFor={`product-title-${activeLang}`} className="text-xs font-semibold text-[#223B28]">
            Product Title {activeLang === 'en' && <span className="text-red-500">*</span>}
          </label>
          <span className="text-[11px] text-[#5F6D61] font-mono">
            {currentTitle.length}/120
          </span>
        </div>
        <FormField
          id={`product-title-${activeLang}`}
          label=""
          value={currentTitle}
          maxLength={120}
          disabled={readOnly}
          onChange={(e) => handleTranslationTitleChange(activeLang, e.target.value)}
          placeholder={
            activeLang === 'en'
              ? 'e.g. Handcrafted Terracotta Water Carafe with Lid'
              : `Enter title in ${SUPPORTED_LANGUAGES.find((l) => l.code === activeLang)?.label}`
          }
          error={titleError}
        />
      </div>

      {/* Description Field */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label htmlFor={`product-desc-${activeLang}`} className="text-xs font-semibold text-[#223B28]">
            Detailed Story & Description {activeLang === 'en' && <span className="text-red-500">*</span>}
          </label>
          <span
            className={`text-[11px] font-mono ${
              activeLang === 'en' && currentDesc.length < 50
                ? 'text-red-600 font-semibold'
                : 'text-[#5F6D61]'
            }`}
          >
            {currentDesc.length} / 50 min chars
          </span>
        </div>
        <textarea
          id={`product-desc-${activeLang}`}
          rows={5}
          disabled={readOnly}
          value={currentDesc}
          onChange={(e) => handleTranslationDescChange(activeLang, e.target.value)}
          placeholder={
            activeLang === 'en'
              ? 'Describe materials, artisanal heritage, craftsmanship technique, sensory notes, and care instructions (plain text with line breaks, minimum 50 characters)...'
              : `Describe product in ${SUPPORTED_LANGUAGES.find((l) => l.code === activeLang)?.label}...`
          }
          className={`w-full p-3 text-xs text-[#1D251E] placeholder:text-[#9EB89D]/70 bg-white transition-all duration-200 border rounded-xl disabled:bg-[#F5F6F2] disabled:cursor-not-allowed focus:outline-none ${
            descError
              ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20 bg-[#FFF8F7]'
              : 'border-[#EAE5DB] hover:border-[#C4D3C2] focus:border-[#2E4D34] focus:ring-2 focus:ring-[#2E4D34]/20'
          }`}
        />
        {descError && (
          <div className="flex items-center gap-1.5 text-[11px] text-[#DC2626] font-medium pt-1">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{descError}</span>
          </div>
        )}
        <p className="text-[11px] text-[#5F6D61]">
          Plain text only with natural line breaks. HTML tags and external links are strictly sanitized.
        </p>
      </div>

      {/* Brand & Maker Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <FormField
          id="product-brand"
          label="Brand or Maker / Artisan Studio"
          value={brand}
          maxLength={80}
          disabled={readOnly}
          onChange={(e) => onBrandChange(e.target.value)}
          placeholder="e.g. Malabar Earth Collective"
          hint="Optional brand identifier or maker workshop name."
          error={fieldErrors['brand']}
        />

        {/* Tags */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="product-tags" className="text-xs font-semibold text-[#223B28]">
              Product Tags <span className="text-[11px] font-normal text-[#5F6D61]">({tags.length}/10)</span>
            </label>
          </div>
          <div className="flex gap-2">
            <input
              id="product-tags"
              type="text"
              disabled={readOnly || tags.length >= 10}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder={tags.length >= 10 ? 'Tag limit reached' : 'Type a tag and press Enter'}
              className="w-full py-2.5 px-3.5 text-xs text-[#1D251E] placeholder:text-[#9EB89D]/70 bg-white border border-[#EAE5DB] rounded-xl focus:border-[#2E4D34] focus:ring-2 focus:ring-[#2E4D34]/20 focus:outline-none disabled:bg-[#F5F6F2]"
            />
            <button
              type="button"
              disabled={readOnly || !tagInput.trim() || tags.length >= 10}
              onClick={handleAddTag}
              className="px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EAF1EA] text-[#2E4D34] text-xs font-semibold border border-[#EAE5DB] transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
          {tagsError && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#DC2626] font-medium pt-0.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{tagsError}</span>
            </div>
          )}

          {/* Tags Chips */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EAF1EA] text-[#2E4D34] text-xs font-medium border border-[#D1DDD0]"
                >
                  #{tag}
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(idx)}
                      className="hover:text-red-600 focus:outline-none ml-0.5"
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
