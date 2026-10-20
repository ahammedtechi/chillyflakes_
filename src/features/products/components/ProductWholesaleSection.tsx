import React from 'react';
import { Package2, Plus, Trash2, AlertCircle, TrendingDown } from 'lucide-react';
import type { ProductWholesaleConfig, ProductWholesaleTier } from '../../../types/product';
import { FormField } from '../../../components/ui/FormField';

interface ProductWholesaleSectionProps {
  wholesale: ProductWholesaleConfig;
  sellerWholesaleEligible: boolean;
  basePricePaise: number;
  onChange: (wholesale: ProductWholesaleConfig) => void;
  fieldErrors: Record<string, string>;
  readOnly?: boolean;
}

export const ProductWholesaleSection: React.FC<ProductWholesaleSectionProps> = ({
  wholesale,
  sellerWholesaleEligible,
  basePricePaise,
  onChange,
  fieldErrors,
  readOnly = false,
}) => {
  const isEnabled = Boolean(wholesale.enabled);
  const tiers = wholesale.tiers || [];

  const handleToggle = (enabled: boolean) => {
    if (readOnly || !sellerWholesaleEligible) return;

    if (enabled && tiers.length === 0) {
      // Seed default initial tier
      const suggestedTierPrice = basePricePaise > 0 ? Math.round(basePricePaise * 0.8) : 80000;
      onChange({
        enabled: true,
        moq: wholesale.moq || 10,
        tiers: [{ min_qty: 10, price_paise: suggestedTierPrice }],
      });
    } else {
      onChange({
        ...wholesale,
        enabled,
      });
    }
  };

  const handleMoqChange = (moq: number) => {
    onChange({
      ...wholesale,
      moq,
    });
  };

  const handleAddTier = () => {
    if (readOnly) return;
    const lastTier = tiers[tiers.length - 1];
    const nextQty = lastTier ? lastTier.min_qty + 20 : 25;
    const nextPrice = lastTier
      ? Math.max(100, Math.round(lastTier.price_paise * 0.9))
      : Math.round(basePricePaise * 0.75);

    onChange({
      ...wholesale,
      tiers: [...tiers, { min_qty: nextQty, price_paise: nextPrice }],
    });
  };

  const handleRemoveTier = (index: number) => {
    if (readOnly) return;
    const updated = tiers.filter((_, idx) => idx !== index);
    onChange({
      ...wholesale,
      tiers: updated,
    });
  };

  const handleUpdateTier = (
    index: number,
    field: keyof ProductWholesaleTier,
    value: number
  ) => {
    if (readOnly) return;
    const updated = [...tiers];
    updated[index] = { ...updated[index], [field]: value };
    onChange({
      ...wholesale,
      tiers: updated,
    });
  };

  return (
    <div
      id="section-wholesale"
      className="bg-white rounded-2xl border border-[#EAE5DB] p-5 sm:p-6 space-y-6 shadow-xs"
    >
      {/* Section Header */}
      <div className="border-b border-[#EAE5DB] pb-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EAF1EA] text-[#2E4D34] flex items-center justify-center font-bold text-sm">
            8
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#1D251E] flex items-center gap-2">
              <Package2 className="w-4 h-4 text-[#2E4D34]" />
              Wholesale & Bulk Supply (Optional)
            </h3>
            <p className="text-xs text-[#5F6D61]">
              Sell directly to corporate gifting buyers, organic boutiques, and bulk retail partners.
            </p>
          </div>
        </div>
      </div>

      {/* Toggle */}
      <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE5DB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#223B28] block">
            Also sell in bulk (wholesale)
          </span>
          <p className="text-[11px] text-[#5F6D61]">
            {sellerWholesaleEligible
              ? 'Enable wholesale purchasing and define volume-based tiered discounts.'
              : 'Wholesale selling is disabled for your vendor account. Wholesale permissions were not selected during vendor registration.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={readOnly || !sellerWholesaleEligible}
            onClick={() => handleToggle(!isEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#2E4D34] focus:ring-offset-2 ${
              isEnabled && sellerWholesaleEligible ? 'bg-[#2E4D34]' : 'bg-stone-300'
            } ${readOnly || !sellerWholesaleEligible ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            role="switch"
            aria-checked={isEnabled}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isEnabled && sellerWholesaleEligible ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="text-xs font-semibold text-[#223B28]">
            {isEnabled && sellerWholesaleEligible ? 'Wholesale Active' : 'Off'}
          </span>
        </div>
      </div>

      {/* When Wholesale Enabled */}
      {isEnabled && sellerWholesaleEligible && (
        <div className="space-y-5 pt-2">
          {/* MOQ Field */}
          <div className="max-w-xs">
            <FormField
              id="wholesale-moq"
              label="Minimum Order Quantity (MOQ)"
              type="number"
              min={2}
              required
              disabled={readOnly}
              value={wholesale.moq || ''}
              onChange={(e) => handleMoqChange(Math.max(2, parseInt(e.target.value) || 2))}
              placeholder="e.g. 10"
              rightElement={<span className="text-xs text-[#5F6D61] font-semibold pr-1">units</span>}
              hint="Minimum pieces required for wholesale bulk pricing."
              error={fieldErrors['wholesale.moq']}
            />
          </div>

          {/* Bulk Price Tiers Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#223B28] flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-[#2E4D34]" />
                  Volume Bulk Pricing Tiers
                </span>
                <span className="text-[11px] text-[#5F6D61]">
                  Quantities must strictly increase, and price per unit must strictly decrease.
                </span>
              </div>
              <button
                type="button"
                disabled={readOnly}
                onClick={handleAddTier}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EAF1EA] text-[#2E4D34] text-xs font-semibold border border-[#EAE5DB] transition-all disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tier</span>
              </button>
            </div>

            {fieldErrors['wholesale.tiers'] && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{fieldErrors['wholesale.tiers']}</span>
              </div>
            )}

            <div className="overflow-x-auto rounded-xl border border-[#EAE5DB]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#5F6D61] border-b border-[#EAE5DB]">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Tier Level</th>
                    <th className="py-2.5 px-3 font-semibold">From Quantity (Units)</th>
                    <th className="py-2.5 px-3 font-semibold">Price per Unit (₹)</th>
                    {!readOnly && tiers.length > 1 && (
                      <th className="py-2.5 px-2 font-semibold text-center w-12">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE5DB] bg-white">
                  {tiers.map((tier, tIdx) => {
                    const qtyError = fieldErrors[`wholesale.tiers.${tIdx}.min_qty`];
                    const priceError = fieldErrors[`wholesale.tiers.${tIdx}.price_paise`];

                    return (
                      <tr key={tIdx} className="hover:bg-[#FAF7F2]/40">
                        <td className="py-2 px-3 font-semibold text-[#1D251E]">
                          Tier #{tIdx + 1}
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            min={2}
                            disabled={readOnly}
                            value={tier.min_qty}
                            onChange={(e) =>
                              handleUpdateTier(
                                tIdx,
                                'min_qty',
                                Math.max(2, parseInt(e.target.value) || 2)
                              )
                            }
                            className={`w-32 py-1.5 px-2 text-xs border rounded-lg focus:outline-none ${
                              qtyError
                                ? 'border-red-500 bg-red-50'
                                : 'border-[#EAE5DB] focus:border-[#2E4D34]'
                            }`}
                          />
                          {qtyError && (
                            <span className="text-[10px] text-red-600 block pt-0.5">
                              {qtyError}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          <div className="relative inline-flex items-center">
                            <span className="absolute left-2.5 text-stone-500 text-xs font-semibold">
                              ₹
                            </span>
                            <input
                              type="number"
                              min={1}
                              step="0.01"
                              disabled={readOnly}
                              value={tier.price_paise ? tier.price_paise / 100 : ''}
                              onChange={(e) =>
                                handleUpdateTier(
                                  tIdx,
                                  'price_paise',
                                  e.target.value
                                    ? Math.round(parseFloat(e.target.value) * 100)
                                    : 0
                                )
                              }
                              className={`w-36 py-1.5 pl-6 pr-2 text-xs border rounded-lg focus:outline-none ${
                                priceError
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-[#EAE5DB] focus:border-[#2E4D34]'
                              }`}
                            />
                          </div>
                          {priceError && (
                            <span className="text-[10px] text-red-600 block pt-0.5">
                              {priceError}
                            </span>
                          )}
                        </td>
                        {!readOnly && tiers.length > 1 && (
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveTier(tIdx)}
                              className="p-1 rounded text-stone-400 hover:text-red-600"
                              title="Remove tier"
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
          </div>
        </div>
      )}
    </div>
  );
};
