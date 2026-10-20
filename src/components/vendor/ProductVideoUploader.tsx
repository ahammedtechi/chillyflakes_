import React, { useRef, useState } from 'react';
import { Video, Upload, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import type { ProductVideoUpload } from '../../types/product';
import { uploadProductVideo } from '../../api/vendorProducts';
import { ConfirmDialog } from './ConfirmDialog';

interface ProductVideoUploaderProps {
  video: ProductVideoUpload | null | undefined;
  onChange: (video: ProductVideoUpload | null) => void;
  error?: string;
  readOnly?: boolean;
}

export const ProductVideoUploader: React.FC<ProductVideoUploaderProps> = ({
  video,
  onChange,
  error,
  readOnly = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);
  const [pendingReplaceFile, setPendingReplaceFile] = useState<File | null>(null);
  const [showReplaceConfirm, setShowReplaceConfirm] = useState(false);

  const checkVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const vid = document.createElement('video');
      vid.preload = 'metadata';
      vid.onloadedmetadata = () => {
        window.URL.revokeObjectURL(vid.src);
        resolve(vid.duration);
      };
      vid.onerror = () => {
        reject(new Error('Failed to load video metadata.'));
      };
      vid.src = URL.createObjectURL(file);
    });
  };

  const processUpload = async (file: File) => {
    setLocalError(null);

    // Validate type
    const allowed = ['video/mp4', 'video/webm'];
    if (!allowed.includes(file.type)) {
      setLocalError('Invalid video format. Only MP4 and WebM videos are supported.');
      return;
    }

    // Validate size (50 MB)
    if (file.size > 50 * 1024 * 1024) {
      setLocalError('Video exceeds maximum 50 MB limit.');
      return;
    }

    // Validate duration (max 60 seconds)
    try {
      const duration = await checkVideoDuration(file);
      if (duration > 60.5) {
        setLocalError(
          `Video is ${Math.round(duration)} seconds long. Maximum allowed duration is 60 seconds.`
        );
        return;
      }

      setIsUploading(true);
      setUploadProgress(20);

      const res = await uploadProductVideo(file, (pct) => {
        setUploadProgress(pct);
      });

      onChange({
        upload_id: res.id,
        url: res.url,
        duration_seconds: Math.round(duration),
      });
    } catch {
      setLocalError('Could not process video. Please verify the file is not corrupted.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0 || readOnly) return;
    const file = files[0];

    if (video) {
      setPendingReplaceFile(file);
      setShowReplaceConfirm(true);
      return;
    }

    void processUpload(file);
  };

  const confirmReplace = () => {
    if (pendingReplaceFile) {
      void processUpload(pendingReplaceFile);
      setPendingReplaceFile(null);
    }
    setShowReplaceConfirm(false);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
          <Video className="w-4 h-4 text-emerald-700" />
          Product Video (Optional)
        </label>
        <p className="text-xs text-stone-500 mt-0.5">
          Exactly one short demonstration video (MP4 or WebM, max 50 MB, maximum 60 seconds). A video helps shoppers see craftsmanship, drape, and texture.
        </p>
      </div>

      {(error || localError) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{localError || error}</span>
        </div>
      )}

      {video ? (
        <div className="relative bg-stone-900 rounded-xl overflow-hidden max-w-md border border-stone-300 shadow-sm">
          <video
            src={video.url}
            controls
            className="w-full max-h-64 object-contain bg-black"
          />
          <div className="p-3 bg-stone-900/90 flex items-center justify-between text-white text-xs">
            <span className="flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-emerald-400" />
              Duration: {video.duration_seconds || 30}s
            </span>

            {!readOnly && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-xs transition"
                >
                  Replace Video
                </button>
                <button
                  type="button"
                  onClick={() => onChange(null)}
                  className="p-1 bg-red-600/80 hover:bg-red-600 text-white rounded transition"
                  title="Remove video"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        !readOnly && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-stone-300 hover:border-emerald-600 hover:bg-emerald-50/20 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition text-center max-w-md group"
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                <span className="text-xs font-semibold text-stone-700">
                  Uploading video ({uploadProgress}%)...
                </span>
                <span className="text-[11px] text-stone-500">Checking duration and encoding...</span>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-stone-100 group-hover:bg-emerald-100 flex items-center justify-center text-stone-500 group-hover:text-emerald-700 transition mb-2">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-stone-800 group-hover:text-emerald-800">
                  Upload Product Video
                </span>
                <span className="text-[11px] text-stone-400 mt-0.5">
                  MP4 or WebM &bull; Max 50 MB &bull; Up to 60 sec
                </span>
              </>
            )}
          </div>
        )
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      <ConfirmDialog
        isOpen={showReplaceConfirm}
        title="Replace Existing Video?"
        message="Only one video is supported per product listing. Uploading this new file will replace your current product video."
        confirmText="Replace Video"
        cancelText="Keep Current"
        onConfirm={confirmReplace}
        onClose={() => {
          setShowReplaceConfirm(false);
          setPendingReplaceFile(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }}
      />
    </div>
  );
};
