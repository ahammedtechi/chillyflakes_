import React from 'react';
import { Sliders, AlertCircle, Check } from 'lucide-react';
import type {
  VendorCategoryWithAttributes,
  CategoryAttributeDefinition,
} from '../../../types/categoryAttributes';
import { FormField } from '../../../components/ui/FormField';

interface CustomAttributeRow {
  label: string;
  value: string;
}

interface ProductAttributesSectionProps {
  category?: VendorCategoryWithAttributes;
  isOtherCategory?: boolean;
  attributes: Record<string, any>;
  customAttributes?: CustomAttributeRow[];
  onAttributeChange: (key: string, value: any) => void;
  onCustomAttributesChange?: (items: CustomAttributeRow[]) => void;
  fieldErrors: Record<string, string>;
  readOnly?: boolean;
}

export const ProductAttributesSection: React.FC<ProductAttributesSectionProps> = ({
  category,
  isOtherCategory = false,
  attributes,
  customAttributes = [],
  onAttributeChange,
  onCustomAttributesChange,
  fieldErrors,
  readOnly = false,
}) => {
  const isOther = isOtherCategory || category?.id === 'other' || !category;

  const handleAddCustomAttribute = () => {
    if (readOnly || !onCustomAttributesChange || customAttributes.length >= 8) return;
    onCustomAttributesChange([...customAttributes, { label: '', value: '' }]);
  };

  const handleUpdateCustomAttribute = (index: number, field: 'label' | 'value', value: string) => {
    if (readOnly || !onCustomAttributesChange) return;
    const updated = [...customAttributes];
    const maxLen = field === 'label' ? 60 : 200;
    updated[index] = {
      ...updated[index],
      [field]: value.slice(0, maxLen),
    };
    onCustomAttributesChange(updated);
  };

  const handleRemoveCustomAttribute = (index: number) => {
    if (readOnly || !onCustomAttributesChange) return;
    const updated = customAttributes.filter((_, i) => i !== index);
    onCustomAttributesChange(updated);
  };

  if (isOther) {
    return (
      <div
        id="section-attributes"
        className="bg-white rounded-2xl border border-[#EAE5DB] p-5 sm:p-6 space-y-6 shadow-xs"
      >
        <div className="flex items-center gap-2.5 border-b border-[#EAE5DB] pb-3.5">
          <div className="w-8 h-8 rounded-xl bg-[#EAF1EA] text-[#2E4D34] flex items-center justify-center font-bold text-sm">
            3
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#1D251E] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#2E4D34]" />
              Specifications & Custom Attributes
            </h3>
            <p className="text-xs text-[#5F6D61]">
              Provide core product properties and add up to 8 custom attributes for your unique item.
            </p>
          </div>
        </div>

        {/* Standard generic product properties */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            id="attr-material"
            label="Material / Composition"
            type="text"
            disabled={readOnly}
            value={attributes['material'] || ''}
            onChange={(e) => onAttributeChange('material', e.target.value)}
            placeholder="e.g. 100% Cotton, Terracotta Clay, Brass"
            error={fieldErrors['attributes.material']}
          />

          <FormField
            id="attr-brand-maker"
            label="Brand / Artisan / Maker"
            type="text"
            disabled={readOnly}
            value={attributes['brand_maker'] || ''}
            onChange={(e) => onAttributeChange('brand_maker', e.target.value)}
            placeholder="e.g. Studio Potter, Heritage Crafts"
            error={fieldErrors['attributes.brand_maker']}
          />

          <FormField
            id="attr-dimensions"
            label="Dimensions"
            type="text"
            disabled={readOnly}
            value={attributes['dimensions'] || ''}
            onChange={(e) => onAttributeChange('dimensions', e.target.value)}
            placeholder="e.g. 15 cm x 10 cm x 5 cm"
            error={fieldErrors['attributes.dimensions']}
          />

          <FormField
            id="attr-weight"
            label="Weight"
            type="text"
            disabled={readOnly}
            value={attributes['weight'] || ''}
            onChange={(e) => onAttributeChange('weight', e.target.value)}
            placeholder="e.g. 450 grams"
            error={fieldErrors['attributes.weight']}
          />

          <div className="sm:col-span-2">
            <FormField
              id="attr-care-instructions"
              label="Care / Maintenance Instructions"
              type="text"
              disabled={readOnly}
              value={attributes['care_instructions'] || ''}
              onChange={(e) => onAttributeChange('care_instructions', e.target.value)}
              placeholder="e.g. Hand wash only with mild soap. Keep away from direct moisture."
              error={fieldErrors['attributes.care_instructions']}
            />
          </div>

          <FormField
            id="attr-country-origin"
            label="Country of Origin"
            type="text"
            disabled={readOnly}
            value={attributes['country_of_origin'] || 'India'}
            onChange={(e) => onAttributeChange('country_of_origin', e.target.value)}
            placeholder="India"
            error={fieldErrors['attributes.country_of_origin']}
          />
        </div>

        {/* Custom key-value specification rows */}
        <div className="pt-4 border-t border-[#EAE5DB]/60 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-[#223B28]">
                Additional Specifications ({customAttributes.length} / 8)
              </h4>
              <p className="text-[11px] text-[#5F6D61]">
                Add custom key-value details specific to your craft or product line.
              </p>
            </div>
            {!readOnly && (
              <button
                type="button"
                disabled={customAttributes.length >= 8}
                onClick={handleAddCustomAttribute}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#EAF1EA] text-[#2E4D34] hover:bg-[#2E4D34] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + Add Specification
              </button>
            )}
          </div>

          {customAttributes.length > 0 && (
            <div className="space-y-2.5 pt-2">
              {customAttributes.map((row, idx) => (
                <div
                  key={`custom-attr-${idx}`}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE5DB]"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      disabled={readOnly}
                      value={row.label}
                      maxLength={60}
                      onChange={(e) => handleUpdateCustomAttribute(idx, 'label', e.target.value)}
                      placeholder="Property name (e.g. Glaze Finish, Gemstone)"
                      className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-[#EAE5DB] focus:outline-none focus:border-[#2E4D34] text-[#1D251E]"
                    />
                  </div>
                  <div className="flex-[1.5]">
                    <input
                      type="text"
                      disabled={readOnly}
                      value={row.value}
                      maxLength={200}
                      onChange={(e) => handleUpdateCustomAttribute(idx, 'value', e.target.value)}
                      placeholder="Property value (e.g. Satin Matte, Rose Quartz)"
                      className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-[#EAE5DB] focus:outline-none focus:border-[#2E4D34] text-[#1D251E]"
                    />
                  </div>
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomAttribute(idx)}
                      title="Remove specification"
                      className="px-2.5 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200 self-end sm:self-auto"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const renderAttributeField = (attr: CategoryAttributeDefinition) => {
    const errorKey = `attributes.${attr.key}`;
    const error = fieldErrors[errorKey];
    const value = attributes[attr.key];

    if (attr.type === 'boolean') {
      const isChecked = Boolean(value);
      return (
        <div key={attr.key} className="flex flex-col gap-1 sm:col-span-2 py-1">
          <label className="text-xs font-semibold text-[#223B28] flex items-center gap-1.5">
            <span>{attr.label}</span>
            {attr.required && <span className="text-red-500">*</span>}
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={readOnly}
              onClick={() => onAttributeChange(attr.key, !isChecked)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#2E4D34] focus:ring-offset-2 ${
                isChecked ? 'bg-[#2E4D34]' : 'bg-stone-300'
              } ${readOnly ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
              role="switch"
              aria-checked={isChecked}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isChecked ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-xs font-medium text-[#223B28]">
              {isChecked ? 'Yes' : 'No'}
            </span>
            {attr.placeholder && (
              <span className="text-[11px] text-[#5F6D61] ml-2">
                — {attr.placeholder}
              </span>
            )}
          </div>
          {error && (
            <div className="flex items-center gap-1 text-[11px] text-red-600 pt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{error}</span>
            </div>
          )}
        </div>
      );
    }

    if (attr.type === 'select') {
      return (
        <div key={attr.key} className="flex flex-col gap-1.5">
          <label
            htmlFor={`attr-${attr.key}`}
            className="text-xs font-semibold text-[#223B28] flex items-center justify-between"
          >
            <span>
              {attr.label}
              {attr.required && <span className="text-red-500 ml-1">*</span>}
            </span>
          </label>
          <select
            id={`attr-${attr.key}`}
            disabled={readOnly}
            value={value || ''}
            onChange={(e) => onAttributeChange(attr.key, e.target.value)}
            className={`w-full py-2.5 px-3.5 text-xs text-[#1D251E] bg-white transition-all duration-200 border rounded-xl disabled:bg-[#F5F6F2] disabled:cursor-not-allowed focus:outline-none ${
              error
                ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20 bg-[#FFF8F7]'
                : 'border-[#EAE5DB] hover:border-[#C4D3C2] focus:border-[#2E4D34] focus:ring-2 focus:ring-[#2E4D34]/20'
            }`}
          >
            <option value="">Select {attr.label}...</option>
            {attr.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {error && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#DC2626] font-medium pt-0.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      );
    }

    if (attr.type === 'multiselect') {
      const selectedList: string[] = Array.isArray(value) ? value : [];
      const handleToggle = (optVal: string) => {
        if (readOnly) return;
        if (selectedList.includes(optVal)) {
          onAttributeChange(
            attr.key,
            selectedList.filter((item) => item !== optVal)
          );
        } else {
          onAttributeChange(attr.key, [...selectedList, optVal]);
        }
      };

      return (
        <div key={attr.key} className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-xs font-semibold text-[#223B28] flex items-center justify-between">
            <span>
              {attr.label}
              {attr.required && <span className="text-red-500 ml-1">*</span>}
            </span>
            <span className="text-[11px] text-[#5F6D61]">Select all that apply</span>
          </label>
          <div className="flex flex-wrap gap-2 pt-1">
            {attr.options?.map((opt) => {
              const isSelected = selectedList.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={readOnly}
                  onClick={() => handleToggle(opt.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#EAF1EA] border-[#2E4D34] text-[#2E4D34] shadow-2xs font-semibold'
                      : 'bg-white border-[#EAE5DB] text-[#5F6D61] hover:border-[#C4D3C2] hover:bg-[#FAF7F2]'
                  } ${readOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] border ${
                      isSelected
                        ? 'bg-[#2E4D34] border-[#2E4D34] text-white'
                        : 'border-stone-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5" />}
                  </span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
          {error && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#DC2626] font-medium pt-0.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      );
    }

    if (attr.type === 'number') {
      return (
        <div key={attr.key}>
          <FormField
            id={`attr-${attr.key}`}
            label={attr.label}
            type="number"
            disabled={readOnly}
            required={attr.required}
            value={value !== undefined ? value : ''}
            onChange={(e) =>
              onAttributeChange(
                attr.key,
                e.target.value === '' ? undefined : Number(e.target.value)
              )
            }
            placeholder={attr.placeholder || `Enter ${attr.label.toLowerCase()}`}
            rightElement={
              attr.unit ? (
                <span className="text-xs text-[#5F6D61] font-semibold pr-1">
                  {attr.unit}
                </span>
              ) : undefined
            }
            error={error}
          />
        </div>
      );
    }

    // Default: text
    return (
      <div key={attr.key} className={attr.key === 'ingredients' || attr.key === 'usage' || attr.key === 'care_instructions' ? 'sm:col-span-2' : ''}>
        <FormField
          id={`attr-${attr.key}`}
          label={attr.label}
          type="text"
          disabled={readOnly}
          required={attr.required}
          value={value || ''}
          onChange={(e) => onAttributeChange(attr.key, e.target.value)}
          placeholder={attr.placeholder || `Enter ${attr.label.toLowerCase()}`}
          error={error}
        />
      </div>
    );
  };

  return (
    <div
      id="section-attributes"
      className="bg-white rounded-2xl border border-[#EAE5DB] p-5 sm:p-6 space-y-6 shadow-xs"
    >
      {/* Section Header */}
      <div className="border-b border-[#EAE5DB] pb-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EAF1EA] text-[#2E4D34] flex items-center justify-center font-bold text-sm">
            3
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#1D251E] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#2E4D34]" />
              {category.name} Specifications
            </h3>
            <p className="text-xs text-[#5F6D61]">
              Detailed craftsmanship, material specifications, and attributes required for {category.name}.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Dynamic Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {category.attributes.map(renderAttributeField)}
      </div>
    </div>
  );
};
