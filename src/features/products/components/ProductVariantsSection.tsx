import React, { useState } from 'react';
import {
  Palette,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  Sparkles,
  Layers,
} from 'lucide-react';
import type {
  ProductColorItem,
  ProductSizeItem,
  ProductImageItem,
} from '../../../types/product';
import type { VendorCategoryWithAttributes } from '../../../types/categoryAttributes';
import { FormField } from '../../../components/ui/FormField';
import { ImageUploader } from '../../../components/vendor/ImageUploader';
import { ConfirmDialog } from '../../../components/vendor/ConfirmDialog';

interface ProductVariantsSectionProps {
  hasColors: boolean;
  colors: ProductColorItem[];
  standaloneSizes: ProductSizeItem[];
  category?: VendorCategoryWithAttributes;
  productTitle: string;
  baseSku: string;
  onHasColorsChange: (val: boolean) => void;
  onColorsChange: (colors: ProductColorItem[]) => void;
  onStandaloneSizesChange: (sizes: ProductSizeItem[]) => void;
  fieldErrors: Record<string, string>;
  readOnly?: boolean;
}

const PRESET_COLOR_SWATCHES = [
  { name: 'Crimson Red', hex: '#DC2626' },
  { name: 'Terracotta Rust', hex: '#C85A32' },
  { name: 'Ochre Gold', hex: '#D97706' },
  { name: 'Sage Green', hex: '#4B7252' },
  { name: 'Forest Green', hex: '#2E4D34' },
  { name: 'Indigo Blue', hex: '#2563EB' },
  { name: 'Royal Navy', hex: '#1E3A8A' },
  { name: 'Charcoal Black', hex: '#1F2937' },
  { name: 'Warm Ivory', hex: '#FDFBF7' },
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Dusty Rose', hex: '#DB2777' },
  { name: 'Mustard Yellow', hex: '#CA8A04' },
];

export const ProductVariantsSection: React.FC<ProductVariantsSectionProps> = ({
  hasColors,
  colors,
  standaloneSizes,
  category,
  productTitle,
  baseSku,
  onHasColorsChange,
  onColorsChange,
  onStandaloneSizesChange,
  fieldErrors,
  readOnly = false,
}) => {
  const [colorToRemove, setColorToRemove] = useState<{ index: number; name: string } | null>(null);
  const [customSizeInput, setCustomSizeInput] = useState<{ [colorId: string]: string }>({});

  const sizesEnabledForCategory = category?.sizes_enabled ?? false;
  const defaultCategorySizes = category?.default_sizes || ['Standard'];

  // Helper to generate SKU
  const generateSku = (colorName: string, sizeLabel: string): string => {
    const cleanBase = (baseSku || productTitle || 'PROD')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .slice(0, 6) || 'PROD';
    const cleanColor = colorName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 3) || 'COL';
    const cleanSize = sizeLabel.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4) || 'STD';
    return `${cleanBase}-${cleanColor}-${cleanSize}`;
  };

  // Add new color block
  const handleAddColor = () => {
    if (readOnly || colors.length >= 12) return;
    const nextIdx = colors.length + 1;
    const defaultSwatch = PRESET_COLOR_SWATCHES[(nextIdx - 1) % PRESET_COLOR_SWATCHES.length];
    const newColorId = `col_${Date.now()}`;

    const initialSizes: ProductSizeItem[] = sizesEnabledForCategory
      ? defaultCategorySizes.map((sz) => ({
          label: sz,
          stock: 10,
          sku: generateSku(defaultSwatch.name, sz),
        }))
      : [
          {
            label: 'Standard',
            stock: 10,
            sku: generateSku(defaultSwatch.name, 'Standard'),
          },
        ];

    const newColorItem: ProductColorItem = {
      id: newColorId,
      name: `Color ${nextIdx}`,
      hex: defaultSwatch.hex,
      images: [],
      sizes: initialSizes,
    };

    onColorsChange([...colors, newColorItem]);
  };

  // Move color up/down (keyboard accessible alternative to drag)
  const handleMoveColor = (index: number, direction: 'up' | 'down') => {
    if (readOnly) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= colors.length) return;

    const newColors = [...colors];
    const [moved] = newColors.splice(index, 1);
    newColors.splice(targetIndex, 0, moved);
    onColorsChange(newColors);
  };

  // Remove color
  const handleConfirmRemoveColor = () => {
    if (colorToRemove !== null) {
      const updated = colors.filter((_, idx) => idx !== colorToRemove.index);
      onColorsChange(updated);
      setColorToRemove(null);
    }
  };

  // Update specific color block
  const updateColorField = (index: number, updates: Partial<ProductColorItem>) => {
    if (readOnly) return;
    const updated = [...colors];
    updated[index] = { ...updated[index], ...updates };
    onColorsChange(updated);
  };

  // Add custom size to a color
  const handleAddCustomSizeToColor = (colorIndex: number) => {
    const color = colors[colorIndex];
    const inputVal = (customSizeInput[color.id] || '').trim();
    if (!inputVal) return;
    if (color.sizes.some((s) => s.label.toLowerCase() === inputVal.toLowerCase())) return;

    const newSizeItem: ProductSizeItem = {
      label: inputVal,
      stock: 5,
      sku: generateSku(color.name, inputVal),
    };

    updateColorField(colorIndex, {
      sizes: [...color.sizes, newSizeItem],
    });

    setCustomSizeInput((prev) => ({ ...prev, [color.id]: '' }));
  };

  // Remove size from color
  const handleRemoveSizeFromColor = (colorIndex: number, sizeIndex: number) => {
    if (readOnly) return;
    const color = colors[colorIndex];
    if (color.sizes.length <= 1) return;
    const updatedSizes = color.sizes.filter((_, idx) => idx !== sizeIndex);
    updateColorField(colorIndex, { sizes: updatedSizes });
  };

  // Update a size in a color
  const updateSizeInColor = (
    colorIndex: number,
    sizeIndex: number,
    field: keyof ProductSizeItem,
    value: any
  ) => {
    if (readOnly) return;
    const color = colors[colorIndex];
    const updatedSizes = [...color.sizes];
    updatedSizes[sizeIndex] = { ...updatedSizes[sizeIndex], [field]: value };
    updateColorField(colorIndex, { sizes: updatedSizes });
  };

  // Calculate summary counts
  const totalColorsCount = hasColors ? colors.length : 0;
  const totalVariantsCount = hasColors
    ? colors.reduce((acc, c) => acc + (c.sizes?.length || 0), 0)
    : standaloneSizes.length;
  const totalStockCount = hasColors
    ? colors.reduce(
        (acc, c) =>
          acc +
          (c.sizes || []).reduce((sAcc, s) => sAcc + Number(s.stock || 0), 0),
        0
      )
    : standaloneSizes.reduce((acc, s) => acc + Number(s.stock || 0), 0);

  return (
    <div
      id="section-variants"
      className="bg-white rounded-2xl border border-[#EAE5DB] p-5 sm:p-6 space-y-6 shadow-xs"
    >
      {/* Section Header */}
      <div className="border-b border-[#EAE5DB] pb-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EAF1EA] text-[#2E4D34] flex items-center justify-center font-bold text-sm">
            4
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#1D251E] flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#2E4D34]" />
              Colors, Sizes & Variants
            </h3>
            <p className="text-xs text-[#5F6D61]">
              Manage multi-color listings with dedicated photos, size matrices, and per-variant stock.
            </p>
          </div>
        </div>

        {/* Real-time Summary Line */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#EAE5DB] text-xs font-semibold text-[#223B28]">
          <Sparkles className="w-3.5 h-3.5 text-[#2E4D34]" />
          <span>
            {hasColors ? `${totalColorsCount} colors, ` : ''}
            {totalVariantsCount} variants, {totalStockCount} total items in stock
          </span>
        </div>
      </div>

      {/* Question: Does this product come in different colors? */}
      <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE5DB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-[#223B28] block">
            Does this product come in different colors?
          </span>
          <span className="text-[11px] text-[#5F6D61]">
            If Yes, each color gets its own high-resolution gallery (1–6 photos) and specific size stock.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={readOnly}
            onClick={() => {
              onHasColorsChange(true);
              if (colors.length === 0) {
                handleAddColor();
              }
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              hasColors
                ? 'bg-[#2E4D34] text-white shadow-xs'
                : 'bg-white text-[#5F6D61] border border-[#EAE5DB] hover:bg-[#EAF1EA]'
            }`}
          >
            Yes, multi-color
          </button>
          <button
            type="button"
            disabled={readOnly}
            onClick={() => onHasColorsChange(false)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              !hasColors
                ? 'bg-[#2E4D34] text-white shadow-xs'
                : 'bg-white text-[#5F6D61] border border-[#EAE5DB] hover:bg-[#EAF1EA]'
            }`}
          >
            No, single color / style
          </button>
        </div>
      </div>

      {/* Global Variant Validation Errors */}
      {fieldErrors['colors'] && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{fieldErrors['colors']}</span>
        </div>
      )}

      {/* CASE 1: MULTI-COLOR FLOW */}
      {hasColors ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#223B28]">
              Color Variants ({colors.length}/12 maximum)
            </span>
            <button
              type="button"
              disabled={readOnly || colors.length >= 12}
              onClick={handleAddColor}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2E4D34] text-white hover:bg-[#233B27] text-xs font-semibold shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Color</span>
            </button>
          </div>

          {colors.map((color, cIdx) => {
            const isFirst = cIdx === 0;
            const isLast = cIdx === colors.length - 1;
            const colorNameError = fieldErrors[`colors.${cIdx}.name`];
            const colorImagesError = fieldErrors[`colors.${cIdx}.images`];

            return (
              <div
                key={color.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isFirst
                    ? 'border-[#2E4D34]/40 bg-[#FAF7F2]/50 ring-1 ring-[#2E4D34]/10'
                    : 'border-[#EAE5DB] bg-white'
                } space-y-5`}
              >
                {/* Color block header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EAE5DB] pb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-full border border-black/20 shadow-2xs shrink-0"
                      style={{ backgroundColor: color.hex }}
                      title={`Hex: ${color.hex}`}
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#1D251E]">
                        Color #{cIdx + 1}: {color.name || 'Unnamed'}
                      </span>
                      {isFirst && (
                        <span className="px-2 py-0.5 rounded-full bg-[#EAF1EA] text-[#2E4D34] text-[10px] font-bold border border-[#D1DDD0]">
                          Default Store Showcase
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions: Reorder Buttons + Delete */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={readOnly || isFirst}
                      onClick={() => handleMoveColor(cIdx, 'up')}
                      className="p-1 rounded-lg border border-[#EAE5DB] text-[#5F6D61] hover:text-[#2E4D34] hover:bg-[#FAF7F2] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up (earlier display order)"
                      aria-label="Move color up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={readOnly || isLast}
                      onClick={() => handleMoveColor(cIdx, 'down')}
                      className="p-1 rounded-lg border border-[#EAE5DB] text-[#5F6D61] hover:text-[#2E4D34] hover:bg-[#FAF7F2] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down (later display order)"
                      aria-label="Move color down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {colors.length > 1 && !readOnly && (
                      <button
                        type="button"
                        onClick={() =>
                          setColorToRemove({ index: cIdx, name: color.name || `Color #${cIdx + 1}` })
                        }
                        className="p-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 ml-1"
                        title="Remove color"
                        aria-label="Remove color"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Color Name & Swatch Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    id={`color-name-${cIdx}`}
                    label="Color Display Name"
                    required
                    disabled={readOnly}
                    value={color.name}
                    onChange={(e) => updateColorField(cIdx, { name: e.target.value })}
                    placeholder="e.g. Indigo Blue or Sunset Terracotta"
                    error={colorNameError}
                  />

                  {/* Hex Picker & Text Swatches */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#223B28]">
                        Color Swatch & Hex Code <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] font-mono text-[#5F6D61]">{color.hex}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        disabled={readOnly}
                        value={color.hex}
                        onChange={(e) => updateColorField(cIdx, { hex: e.target.value })}
                        className="w-10 h-10 p-0.5 rounded-xl border border-[#EAE5DB] cursor-pointer bg-white"
                        aria-label="Custom color picker"
                      />
                      <input
                        type="text"
                        disabled={readOnly}
                        value={color.hex}
                        maxLength={7}
                        onChange={(e) => updateColorField(cIdx, { hex: e.target.value })}
                        className="w-24 py-2 px-2.5 text-xs font-mono uppercase bg-white border border-[#EAE5DB] rounded-xl focus:outline-none focus:border-[#2E4D34]"
                      />
                      <span className="text-[11px] text-[#5F6D61] truncate">
                        or pick curated swatch:
                      </span>
                    </div>

                    {/* Preset Swatches with Text Labels for Accessibility */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {PRESET_COLOR_SWATCHES.map((sw) => (
                        <button
                          key={sw.name}
                          type="button"
                          disabled={readOnly}
                          onClick={() => updateColorField(cIdx, { hex: sw.hex, name: color.name.startsWith('Color') ? sw.name : color.name })}
                          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-medium transition-all ${
                            color.hex.toLowerCase() === sw.hex.toLowerCase()
                              ? 'border-[#2E4D34] bg-[#EAF1EA] text-[#2E4D34] font-bold shadow-2xs'
                              : 'border-[#EAE5DB] bg-white text-[#5F6D61] hover:bg-[#FAF7F2]'
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/20"
                            style={{ backgroundColor: sw.hex }}
                          />
                          <span>{sw.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Color-Specific Image Uploader (min 1, max 6) */}
                <div className="pt-2">
                  <ImageUploader
                    images={color.images}
                    onChange={(imgs: ProductImageItem[]) => updateColorField(cIdx, { images: imgs })}
                    maxImages={6}
                    label={`Photos for ${color.name || 'this color'} (1–6 images)`}
                    helperText="Upload 1 to 6 photos representing this specific color. First or starred image is the primary swatch thumbnail."
                    error={colorImagesError}
                    readOnly={readOnly}
                  />
                </div>

                {/* Sizes Table for this Color */}
                <div className="pt-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#223B28] flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#2E4D34]" />
                      Size & Inventory for {color.name || 'this color'}
                    </span>
                    <span className="text-[11px] text-[#5F6D61]">
                      Stock 0 indicates out of stock on store.
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-[#EAE5DB]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF7F2] text-[#5F6D61] border-b border-[#EAE5DB]">
                        <tr>
                          <th className="py-2.5 px-3 font-semibold">Size Label</th>
                          <th className="py-2.5 px-3 font-semibold w-28">Stock Qty</th>
                          <th className="py-2.5 px-3 font-semibold">SKU Code</th>
                          <th className="py-2.5 px-3 font-semibold w-32">Price Override (₹)</th>
                          {!readOnly && color.sizes.length > 1 && (
                            <th className="py-2.5 px-2 font-semibold text-center w-12">Action</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EAE5DB] bg-white">
                        {color.sizes.map((sz, sIdx) => {
                          const stockError =
                            fieldErrors[`colors.${cIdx}.sizes.${sIdx}.stock`];
                          const skuError =
                            fieldErrors[`colors.${cIdx}.sizes.${sIdx}.sku`];

                          return (
                            <tr key={sIdx} className="hover:bg-[#FAF7F2]/40">
                              <td className="py-2 px-3 font-medium text-[#1D251E]">
                                {sz.label}
                              </td>
                              <td className="py-2 px-3">
                                <input
                                  type="number"
                                  min={0}
                                  disabled={readOnly}
                                  value={sz.stock}
                                  onChange={(e) =>
                                    updateSizeInColor(
                                      cIdx,
                                      sIdx,
                                      'stock',
                                      Math.max(0, parseInt(e.target.value) || 0)
                                    )
                                  }
                                  className={`w-24 py-1.5 px-2 text-xs border rounded-lg focus:outline-none ${
                                    stockError
                                      ? 'border-red-500 bg-red-50'
                                      : 'border-[#EAE5DB] focus:border-[#2E4D34]'
                                  }`}
                                />
                                {stockError && (
                                  <span className="text-[10px] text-red-600 block pt-0.5">
                                    {stockError}
                                  </span>
                                )}
                              </td>
                              <td className="py-2 px-3">
                                <input
                                  type="text"
                                  disabled={readOnly}
                                  value={sz.sku}
                                  onChange={(e) =>
                                    updateSizeInColor(cIdx, sIdx, 'sku', e.target.value)
                                  }
                                  className={`w-full py-1.5 px-2 text-xs font-mono uppercase border rounded-lg focus:outline-none ${
                                    skuError
                                      ? 'border-red-500 bg-red-50'
                                      : 'border-[#EAE5DB] focus:border-[#2E4D34]'
                                  }`}
                                />
                                {skuError && (
                                  <span className="text-[10px] text-red-600 block pt-0.5">
                                    {skuError}
                                  </span>
                                )}
                              </td>
                              <td className="py-2 px-3">
                                <input
                                  type="number"
                                  min={0}
                                  disabled={readOnly}
                                  value={
                                    sz.price_override_paise
                                      ? sz.price_override_paise / 100
                                      : ''
                                  }
                                  onChange={(e) =>
                                    updateSizeInColor(
                                      cIdx,
                                      sIdx,
                                      'price_override_paise',
                                      e.target.value
                                        ? Math.round(parseFloat(e.target.value) * 100)
                                        : undefined
                                    )
                                  }
                                  placeholder="Default"
                                  className="w-28 py-1.5 px-2 text-xs border border-[#EAE5DB] rounded-lg focus:outline-none focus:border-[#2E4D34]"
                                />
                              </td>
                              {!readOnly && color.sizes.length > 1 && (
                                <td className="py-2 px-2 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSizeFromColor(cIdx, sIdx)}
                                    className="p-1 rounded text-stone-400 hover:text-red-600"
                                    title="Remove this size"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Custom Size row for this color */}
                  {!readOnly && (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Add custom size (e.g. XXL, 500ml, UK 9)..."
                        value={customSizeInput[color.id] || ''}
                        onChange={(e) =>
                          setCustomSizeInput((prev) => ({
                            ...prev,
                            [color.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomSizeToColor(cIdx);
                          }
                        }}
                        className="py-1.5 px-3 text-xs border border-[#EAE5DB] rounded-xl focus:outline-none focus:border-[#2E4D34] w-64"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddCustomSizeToColor(cIdx)}
                        disabled={!(customSizeInput[color.id] || '').trim()}
                        className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EAF1EA] text-[#2E4D34] border border-[#EAE5DB] text-xs font-semibold disabled:opacity-50 transition-all flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Size</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* CASE 2: SINGLE COLOR / NO COLORS FLOW */
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE5DB] space-y-2">
            <span className="text-xs font-bold text-[#223B28] block">
              Single Color / Style Selected
            </span>
            <p className="text-xs text-[#5F6D61]">
              Product media will be configured below in Section 5.
              {sizesEnabledForCategory
                ? ' You can configure size rows and individual inventory below:'
                : ' Inventory can be set as a single total stock in Section 6 (Pricing & Stock).'}
            </p>
          </div>

          {/* If Category uses sizes or seller wants custom sizes */}
          {sizesEnabledForCategory && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#223B28] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#2E4D34]" />
                  Size & Inventory Matrix
                </span>
                <span className="text-[11px] text-[#5F6D61]">
                  Stock 0 means out of stock.
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#EAE5DB]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] text-[#5F6D61] border-b border-[#EAE5DB]">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Size Label</th>
                      <th className="py-2.5 px-3 font-semibold w-28">Stock Qty</th>
                      <th className="py-2.5 px-3 font-semibold">SKU Code</th>
                      <th className="py-2.5 px-3 font-semibold w-32">Price Override (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5DB] bg-white">
                    {standaloneSizes.map((sz, sIdx) => (
                      <tr key={sIdx} className="hover:bg-[#FAF7F2]/40">
                        <td className="py-2 px-3 font-medium text-[#1D251E]">{sz.label}</td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            min={0}
                            disabled={readOnly}
                            value={sz.stock}
                            onChange={(e) => {
                              const updated = [...standaloneSizes];
                              updated[sIdx] = {
                                ...updated[sIdx],
                                stock: Math.max(0, parseInt(e.target.value) || 0),
                              };
                              onStandaloneSizesChange(updated);
                            }}
                            className="w-24 py-1.5 px-2 text-xs border border-[#EAE5DB] rounded-lg focus:outline-none focus:border-[#2E4D34]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            disabled={readOnly}
                            value={sz.sku}
                            onChange={(e) => {
                              const updated = [...standaloneSizes];
                              updated[sIdx] = { ...updated[sIdx], sku: e.target.value };
                              onStandaloneSizesChange(updated);
                            }}
                            className="w-full py-1.5 px-2 text-xs font-mono uppercase border border-[#EAE5DB] rounded-lg focus:outline-none focus:border-[#2E4D34]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            min={0}
                            disabled={readOnly}
                            value={
                              sz.price_override_paise
                                ? sz.price_override_paise / 100
                                : ''
                            }
                            onChange={(e) => {
                              const updated = [...standaloneSizes];
                              updated[sIdx] = {
                                ...updated[sIdx],
                                price_override_paise: e.target.value
                                  ? Math.round(parseFloat(e.target.value) * 100)
                                  : undefined,
                              };
                              onStandaloneSizesChange(updated);
                            }}
                            placeholder="Default"
                            className="w-28 py-1.5 px-2 text-xs border border-[#EAE5DB] rounded-lg focus:outline-none focus:border-[#2E4D34]"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Dialog for Color Removal */}
      <ConfirmDialog
        isOpen={colorToRemove !== null}
        onClose={() => setColorToRemove(null)}
        onConfirm={handleConfirmRemoveColor}
        title="Remove Color Variant?"
        message={`Are you sure you want to remove '${colorToRemove?.name}'? Its photos, size inventory, and SKU configurations will be permanently cleared.`}
        confirmText="Remove Color"
        isDanger
      />
    </div>
  );
};
