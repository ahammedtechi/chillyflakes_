import React from 'react';
import { IndianRupee } from 'lucide-react';
import { FormField } from '../../../components/ui/FormField';

interface ProductPricingSectionProps {
  mrpPaise: number;
  pricePaise: number;
  gstRate: number;
  hsn?: string;
  sku: string;
  stock?: number;
  hasVariants: boolean;
  totalCalculatedStock: number;
  onMrpChange: (valPaise: number) => void;
  onPriceChange: (valPaise: number) => void;
  onGstRateChange: (val: number) => void;
  onHsnChange: (val: string) => void;
  onSkuChange: (val: string) => void;
  onStockChange: (val: number) => void;
  fieldErrors: Record<string, string>;
  readOnly?: boolean;
}

const GST_RATES = [0, 5, 12, 18, 28] as const;

export const ProductPricingSection: React.FC<ProductPricingSectionProps> = ({
  mrpPaise,
  pricePaise,
  gstRate,
  hsn = '',
  sku,
  stock = 0,
  hasVariants,
  totalCalculatedStock,
  onMrpChange,
  onPriceChange,
  onGstRateChange,
  onHsnChange,
  onSkuChange,
  onStockChange,
  fieldErrors,
  readOnly = false,
}) => {
  const mrpRupees = mrpPaise > 0 ? (mrpPaise / 100).toString() : '';
  const priceRupees = pricePaise > 0 ? (pricePaise / 100).toString() : '';

  const discountPercent =
    mrpPaise > pricePaise && mrpPaise > 0
      ? Math.round(((mrpPaise - pricePaise) / mrpPaise) * 100)
      : 0;

  return (
    <div
      id="section-pricing"
      className="bg-white rounded-2xl border border-[#EAE5DB] p-5 sm:p-6 space-y-6 shadow-xs"
    >
      {/* Section Header */}
      <div className="border-b border-[#EAE5DB] pb-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EAF1EA] text-[#2E4D34] flex items-center justify-center font-bold text-sm">
            6
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#1D251E] flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-[#2E4D34]" />
              Pricing, GST Compliance & Stock
            </h3>
            <p className="text-xs text-[#5F6D61]">
              Set honest, transparent retail pricing. Selling price cannot exceed the Maximum Retail Price (MRP).
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Base Price (MRP) */}
        <div>
          <FormField
            id="product-mrp"
            label="Base Price (MRP in ₹)"
            type="number"
            min={1}
            step="0.01"
            required
            disabled={readOnly}
            prefixText="₹"
            value={mrpRupees}
            onChange={(e) => {
              const num = parseFloat(e.target.value);
              onMrpChange(isNaN(num) ? 0 : Math.round(num * 100));
            }}
            placeholder="1299.00"
            hint="Printed maximum retail price."
            error={fieldErrors['mrp_paise']}
          />
        </div>

        {/* Selling Price */}
        <div>
          <FormField
            id="product-price"
            label="Selling Price (₹)"
            type="number"
            min={1}
            step="0.01"
            required
            disabled={readOnly}
            prefixText="₹"
            value={priceRupees}
            onChange={(e) => {
              const num = parseFloat(e.target.value);
              onPriceChange(isNaN(num) ? 0 : Math.round(num * 100));
            }}
            placeholder="999.00"
            hint={
              discountPercent > 0
                ? `${discountPercent}% customer discount off MRP`
                : 'Customer store price.'
            }
            error={fieldErrors['price_paise']}
          />
        </div>

        {/* GST Rate */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="product-gst"
            className="text-xs font-semibold text-[#223B28] flex items-center justify-between"
          >
            <span>
              GST Tax Rate <span className="text-red-500">*</span>
            </span>
          </label>
          <div className="relative">
            <select
              id="product-gst"
              disabled={readOnly}
              value={gstRate}
              onChange={(e) => onGstRateChange(Number(e.target.value))}
              className="w-full py-2.5 px-3.5 text-xs text-[#1D251E] bg-white transition-all duration-200 border border-[#EAE5DB] hover:border-[#C4D3C2] focus:border-[#2E4D34] focus:ring-2 focus:ring-[#2E4D34]/20 rounded-xl focus:outline-none disabled:bg-[#F5F6F2]"
            >
              {GST_RATES.map((rate) => (
                <option key={rate} value={rate}>
                  {rate}% GST {rate === 0 ? '(Exempted / Zero Rated)' : ''}
                </option>
              ))}
            </select>
          </div>
          <p className="text-[11px] text-[#5F6D61]">
            Applicable Indian GST rate on this product category.
          </p>
        </div>

        {/* HSN Code */}
        <div>
          <FormField
            id="product-hsn"
            label="HSN / SAC Code"
            type="text"
            disabled={readOnly}
            value={hsn}
            onChange={(e) => onHsnChange(e.target.value)}
            placeholder="e.g. 691200 or 6204"
            hint="Harmonized System of Nomenclature code."
            error={fieldErrors['hsn']}
          />
        </div>

        {/* Primary SKU */}
        <div>
          <FormField
            id="product-sku"
            label="Product Base SKU"
            type="text"
            disabled={readOnly}
            value={sku}
            onChange={(e) => onSkuChange(e.target.value)}
            placeholder="e.g. CF-TERRA-CARAFE"
            hint="Unique stock keeping identifier."
            error={fieldErrors['sku']}
          />
        </div>

        {/* Total Stock */}
        <div>
          {hasVariants ? (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#223B28] flex items-center justify-between">
                <span>Total Available Stock</span>
                <span className="text-[10px] font-bold text-[#2E4D34] bg-[#EAF1EA] px-2 py-0.5 rounded-full">
                  Auto-calculated
                </span>
              </label>
              <div className="py-2.5 px-3.5 text-xs font-mono font-bold text-[#1D251E] bg-[#FAF7F2] border border-[#EAE5DB] rounded-xl flex items-center justify-between">
                <span>{totalCalculatedStock} units</span>
                <span className="text-[11px] font-normal text-[#5F6D61]">
                  Sum of all variants
                </span>
              </div>
              <p className="text-[11px] text-[#5F6D61]">
                Stock is aggregated automatically from the size & variant tables above.
              </p>
            </div>
          ) : (
            <FormField
              id="product-stock"
              label="Available Stock Quantity"
              type="number"
              min={0}
              required
              disabled={readOnly}
              value={stock}
              onChange={(e) => onStockChange(Math.max(0, parseInt(e.target.value) || 0))}
              placeholder="e.g. 25"
              hint="Units physically ready for shipment."
              error={fieldErrors['stock']}
            />
          )}
        </div>
      </div>
    </div>
  );
};
