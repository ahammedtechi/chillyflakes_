import React, { useRef, useState } from 'react';
import {
  Upload,
  X,
  Star,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  FileImage,
  Loader2,
} from 'lucide-react';
import type { ProductImageItem } from '../../types/product';
import { uploadProductImage } from '../../api/vendorProducts';

interface ImageUploaderProps {
  images: ProductImageItem[];
  onChange: (images: ProductImageItem[]) => void;
  maxImages?: number;
  label?: string;
  helperText?: string;
  error?: string;
  readOnly?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  maxImages = 8,
  label = 'Product Images',
  helperText = 'Upload high-resolution JPG, PNG or WebP images (min 800×800px, max 5 MB each). The primary image is the main store thumbnail.',
  error,
  readOnly = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);
  const [editingAltIndex, setEditingAltIndex] = useState<number | null>(null);

  const validateDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        if (img.width < 800 || img.height < 800) {
          resolve(false);
        } else {
          resolve(true);
        }
      };
      img.onerror = () => resolve(true);
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0 || readOnly) return;
    setLocalError(null);

    const availableSlots = maxImages - images.length;
    if (availableSlots <= 0) {
      setLocalError(`Maximum ${maxImages} images allowed.`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, availableSlots);

    for (const file of filesToUpload) {
      // Validate file type
      const allowed = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowed.includes(file.type)) {
        setLocalError(`File '${file.name}' is not supported. Use JPG, PNG or WebP.`);
        return;
      }

      // Validate size
      if (file.size > 5 * 1024 * 1024) {
        setLocalError(`File '${file.name}' exceeds the 5 MB limit.`);
        return;
      }

      // Validate dimensions
      const isDimensionValid = await validateDimensions(file);
      if (!isDimensionValid) {
        setLocalError(`Image '${file.name}' is smaller than 800×800 pixels. Please upload high-res photos.`);
        return;
      }
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const newUploadedItems: ProductImageItem[] = [];

      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        setUploadProgress(Math.round(((i + 1) / filesToUpload.length) * 80));

        const res = await uploadProductImage(file);
        newUploadedItems.push({
          id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          upload_id: res.id,
          url: res.url,
          alt: file.name.replace(/\.[^/.]+$/, ''),
          is_primary: images.length === 0 && newUploadedItems.length === 0,
          order: images.length + newUploadedItems.length,
        });
      }

      setUploadProgress(100);
      const combined = [...images, ...newUploadedItems];

      // Ensure at least one image is primary
      if (!combined.some((img) => img.is_primary) && combined.length > 0) {
        combined[0].is_primary = true;
      }

      onChange(combined);
    } catch {
      setLocalError('Image upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index: number) => {
    if (readOnly) return;
    const updated = images.filter((_, i) => i !== index);
    if (images[index].is_primary && updated.length > 0) {
      updated[0].is_primary = true;
    }
    const reordered = updated.map((item, i) => ({ ...item, order: i }));
    onChange(reordered);
  };

  const handleSetPrimary = (index: number) => {
    if (readOnly) return;
    const updated = images.map((item, i) => ({
      ...item,
      is_primary: i === index,
    }));
    onChange(updated);
  };

  const handleMove = (index: number, direction: 'prev' | 'next') => {
    if (readOnly) return;
    const targetIndex = direction === 'prev' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const copy = [...images];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    const reordered = copy.map((item, i) => ({ ...item, order: i }));
    onChange(reordered);
  };

  const handleAltChange = (index: number, alt: string) => {
    const updated = [...images];
    updated[index].alt = alt;
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
            <FileImage className="w-4 h-4 text-emerald-700" />
            {label}
            <span className="text-xs font-normal text-stone-500">
              ({images.length}/{maxImages})
            </span>
          </label>
          <p className="text-xs text-stone-500 mt-0.5">{helperText}</p>
        </div>
      </div>

      {(error || localError) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{localError || error}</span>
        </div>
      )}

      {/* Grid of uploaded images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((item, idx) => (
          <div
            key={item.id || item.upload_id || idx}
            className={`relative group bg-stone-100 border rounded-xl overflow-hidden transition-all shadow-sm ${
              item.is_primary ? 'ring-2 ring-emerald-600 border-emerald-600' : 'border-stone-200'
            }`}
          >
            <div className="aspect-square w-full overflow-hidden bg-stone-50 flex items-center justify-center">
              <img
                src={item.url}
                alt={item.alt || `Product image ${idx + 1}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            </div>

            {/* Badges */}
            <div className="absolute top-2 left-2 flex gap-1 items-center">
              {item.is_primary && (
                <span className="bg-emerald-700 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-current" /> Primary
                </span>
              )}
            </div>

            {/* Controls overlay */}
            {!readOnly && (
              <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  {!item.is_primary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(idx)}
                      title="Set as primary thumbnail"
                      className="text-xs bg-white/90 hover:bg-white text-stone-900 px-2 py-1 rounded font-medium shadow flex items-center gap-1"
                    >
                      <Star className="w-3 h-3 text-amber-500" /> Set Primary
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    title="Remove image"
                    className="p-1 bg-red-600/90 hover:bg-red-600 text-white rounded-full ml-auto"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-1 text-white">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'prev')}
                      title="Move backward"
                      className="p-1 bg-white/20 hover:bg-white/40 disabled:opacity-30 rounded"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => handleMove(idx, 'next')}
                      title="Move forward"
                      className="p-1 bg-white/20 hover:bg-white/40 disabled:opacity-30 rounded"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditingAltIndex(editingAltIndex === idx ? null : idx)}
                    className="text-[11px] underline bg-white/20 hover:bg-white/30 px-2 py-1 rounded"
                  >
                    Alt text
                  </button>
                </div>
              </div>
            )}

            {/* Alt text editor overlay */}
            {editingAltIndex === idx && (
              <div className="absolute inset-x-0 bottom-0 bg-white p-2 border-t border-stone-200 z-10 shadow-lg">
                <label className="text-[10px] font-semibold text-stone-600 block mb-1">
                  Accessibility Alt Text:
                </label>
                <input
                  type="text"
                  value={item.alt || ''}
                  onChange={(e) => handleAltChange(idx, e.target.value)}
                  placeholder="Describe product image..."
                  className="w-full text-xs px-2 py-1 border border-stone-300 rounded focus:ring-1 focus:ring-emerald-500 focus:outline-none mb-1.5"
                />
                <button
                  type="button"
                  onClick={() => setEditingAltIndex(null)}
                  className="w-full text-center text-[10px] bg-stone-800 text-white py-0.5 rounded font-medium"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Upload Trigger Dropzone */}
        {!readOnly && images.length < maxImages && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-stone-300 hover:border-emerald-600 hover:bg-emerald-50/30 rounded-xl aspect-square flex flex-col items-center justify-center p-4 cursor-pointer transition-colors text-center group"
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-7 h-7 text-emerald-600 animate-spin" />
                <span className="text-xs font-medium text-stone-600">Uploading... {uploadProgress}%</span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-stone-100 group-hover:bg-emerald-100 flex items-center justify-center text-stone-500 group-hover:text-emerald-700 transition-colors mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-stone-700 group-hover:text-emerald-800">
                  Add Image
                </span>
                <span className="text-[10px] text-stone-400 mt-0.5">JPG, PNG, WebP</span>
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
