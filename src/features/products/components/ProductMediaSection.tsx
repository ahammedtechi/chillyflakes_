import React from 'react';
import { Image, Video, Info } from 'lucide-react';
import type { ProductImageItem, ProductVideoUpload } from '../../../types/product';
import { ImageUploader } from '../../../components/vendor/ImageUploader';
import { ProductVideoUploader } from '../../../components/vendor/ProductVideoUploader';

interface ProductMediaSectionProps {
  hasColors: boolean;
  images: ProductImageItem[];
  video: ProductVideoUpload | null | undefined;
  onImagesChange: (images: ProductImageItem[]) => void;
  onVideoChange: (video: ProductVideoUpload | null) => void;
  fieldErrors: Record<string, string>;
  readOnly?: boolean;
}

export const ProductMediaSection: React.FC<ProductMediaSectionProps> = ({
  hasColors,
  images,
  video,
  onImagesChange,
  onVideoChange,
  fieldErrors,
  readOnly = false,
}) => {
  return (
    <div
      id="section-media"
      className="bg-white rounded-2xl border border-[#EAE5DB] p-5 sm:p-6 space-y-6 shadow-xs"
    >
      {/* Section Header */}
      <div className="border-b border-[#EAE5DB] pb-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EAF1EA] text-[#2E4D34] flex items-center justify-center font-bold text-sm">
            5
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#1D251E] flex items-center gap-2">
              <Image className="w-4 h-4 text-[#2E4D34]" />
              Product Photos & Craftsmanship Video
            </h3>
            <p className="text-xs text-[#5F6D61]">
              High-resolution imagery attracts conscious buyers. Upload clean photos with good lighting.
            </p>
          </div>
        </div>
      </div>

      {/* Standalone Product Images (only when not multi-color) */}
      {!hasColors ? (
        <div className="space-y-2">
          <ImageUploader
            images={images}
            onChange={onImagesChange}
            maxImages={8}
            label="Product Images (1–8 photos)"
            helperText="Upload JPG, PNG or WebP photos (min 800×800px, max 5 MB each). Drag or use arrows to reorder. Star the primary hero image. Add alt text for accessibility."
            error={fieldErrors['images']}
            readOnly={readOnly}
          />
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE5DB] flex items-start gap-3">
          <Info className="w-4 h-4 text-[#2E4D34] shrink-0 mt-0.5" />
          <div className="text-xs text-[#5F6D61] space-y-1">
            <span className="font-semibold text-[#223B28] block">
              Color-Specific Photos Enabled
            </span>
            <p>
              Because this listing comes in multiple colors, each color variant has its own dedicated photo gallery in Section 4 (Colors & Variants) above.
            </p>
          </div>
        </div>
      )}

      {/* Product Video Section (Available for both single and multi-color products) */}
      <div className="pt-2 border-t border-[#EAE5DB] space-y-3">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-[#2E4D34]" />
          <div>
            <span className="text-xs font-bold text-[#223B28] block">
              Artisan Craftsmanship Video (Optional)
            </span>
            <span className="text-[11px] text-[#5F6D61]">
              Each product listing allows strictly ONE showcase video (MP4 or WebM, max 50 MB, up to 60 seconds).
            </span>
          </div>
        </div>

        <ProductVideoUploader
          video={video}
          onChange={onVideoChange}
          error={fieldErrors['video_upload']}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};
