import React from 'react';
import { Truck, Box } from 'lucide-react';
import type { ProductShippingConfig } from '../../../types/product';
import { FormField } from '../../../components/ui/FormField';

interface ProductShippingSectionProps {
  shipping: ProductShippingConfig;
  onChange: (shipping: ProductShippingConfig) => void;
  fieldErrors: Record<string, string>;
  readOnly?: boolean;
}

export const ProductShippingSection: React.FC<ProductShippingSectionProps> = ({
  shipping,
  onChange,
  fieldErrors,
  readOnly = false,
}) => {
  const updateField = (field: keyof ProductShippingConfig, value: number) => {
    onChange({
      ...shipping,
      [field]: value,
    });
  };

  return (
    <div
      id="section-shipping"
      className="bg-white rounded-2xl border border-[#EAE5DB] p-5 sm:p-6 space-y-6 shadow-xs"
    >
      {/* Section Header */}
      <div className="border-b border-[#EAE5DB] pb-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EAF1EA] text-[#2E4D34] flex items-center justify-center font-bold text-sm">
            7
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#1D251E] flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#2E4D34]" />
              Shipping, Packaging & Dimensions
            </h3>
            <p className="text-xs text-[#5F6D61]">
              Accurate weight and boxed dimensions are required to calculate pan-India courier tariffs and volumetric weight.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Dead Weight */}
        <div>
          <FormField
            id="shipping-weight"
            label="Product Weight"
            type="number"
            min={1}
            required
            disabled={readOnly}
            value={shipping.weight_g || ''}
            onChange={(e) => updateField('weight_g', Math.max(0, parseInt(e.target.value) || 0))}
            placeholder="e.g. 750"
            rightElement={<span className="text-xs text-[#5F6D61] font-semibold pr-1">grams</span>}
            hint="Net boxed weight."
            error={fieldErrors['shipping.weight_g']}
          />
        </div>

        {/* Package Length */}
        <div>
          <FormField
            id="shipping-length"
            label="Box Length"
            type="number"
            min={0.1}
            step="0.5"
            required
            disabled={readOnly}
            value={shipping.length_cm || ''}
            onChange={(e) => updateField('length_cm', Math.max(0, parseFloat(e.target.value) || 0))}
            placeholder="e.g. 25"
            rightElement={<span className="text-xs text-[#5F6D61] font-semibold pr-1">cm</span>}
            hint="Box length in cm."
            error={fieldErrors['shipping.length_cm']}
          />
        </div>

        {/* Package Width */}
        <div>
          <FormField
            id="shipping-width"
            label="Box Width"
            type="number"
            min={0.1}
            step="0.5"
            required
            disabled={readOnly}
            value={shipping.width_cm || ''}
            onChange={(e) => updateField('width_cm', Math.max(0, parseFloat(e.target.value) || 0))}
            placeholder="e.g. 20"
            rightElement={<span className="text-xs text-[#5F6D61] font-semibold pr-1">cm</span>}
            hint="Box width in cm."
            error={fieldErrors['shipping.width_cm']}
          />
        </div>

        {/* Package Height */}
        <div>
          <FormField
            id="shipping-height"
            label="Box Height"
            type="number"
            min={0.1}
            step="0.5"
            required
            disabled={readOnly}
            value={shipping.height_cm || ''}
            onChange={(e) => updateField('height_cm', Math.max(0, parseFloat(e.target.value) || 0))}
            placeholder="e.g. 15"
            rightElement={<span className="text-xs text-[#5F6D61] font-semibold pr-1">cm</span>}
            hint="Box height in cm."
            error={fieldErrors['shipping.height_cm']}
          />
        </div>
      </div>

      {/* Processing Time in Days (Optional) */}
      <div className="pt-2 border-t border-[#EAE5DB] grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FormField
            id="shipping-processing-days"
            label="Order Processing & Dispatch Time"
            type="number"
            min={1}
            max={30}
            disabled={readOnly}
            value={shipping.processing_days || ''}
            onChange={(e) =>
              updateField(
                'processing_days',
                e.target.value ? parseInt(e.target.value) : 2
              )
            }
            placeholder="e.g. 2"
            rightElement={<span className="text-xs text-[#5F6D61] font-semibold pr-1">days</span>}
            hint="Business days needed to hand package over to courier partner."
            error={fieldErrors['shipping.processing_days']}
          />
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE5DB] flex items-center gap-3 self-center">
          <Box className="w-5 h-5 text-[#2E4D34] shrink-0" />
          <div className="text-xs text-[#5F6D61]">
            <span className="font-semibold text-[#223B28] block">Volumetric Check</span>
            <span>
              Volumetric weight:{' '}
              {Math.round(
                ((shipping.length_cm || 1) *
                  (shipping.width_cm || 1) *
                  (shipping.height_cm || 1)) /
                  50
              ) / 100}{' '}
              kg. Express partners bill based on higher of dead or volumetric weight.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
