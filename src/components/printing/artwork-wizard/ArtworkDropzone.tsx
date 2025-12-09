import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, FileImage, AlertCircle } from 'lucide-react';
import { printingColors } from '../../../lib/printing-theme';
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE_MB, MAX_FILE_SIZE_BYTES, ACCEPTED_EXTENSIONS } from '../../../lib/artwork-constants';
import { formatFileSize } from '../../../lib/artwork-analysis';

interface ArtworkDropzoneProps {
  onFileSelect: (file: File) => void;
  onCanvaImport?: () => void;
  onGoogleDriveImport?: () => void;
  onDropboxImport?: () => void;
  disabled?: boolean;
}

const ArtworkDropzone: React.FC<ArtworkDropzoneProps> = ({
  onFileSelect,
  onCanvaImport,
  onGoogleDriveImport,
  onDropboxImport,
  disabled = false,
}) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);

    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError(`File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('Invalid file type. Please upload JPG, PNG, PDF, SVG, AI, or EPS.');
      } else {
        setError('Could not upload file. Please try again.');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE_BYTES,
    multiple: false,
    disabled,
  });

  // Brand logo SVGs
  const CanvaLogo = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 17.567c-.292.291-.838.564-1.474.564-1.164 0-2.218-.8-3.345-2.4-.727.8-1.527 1.473-2.182 1.473-.546 0-.982-.364-1.091-.91-.146-.654.146-1.672.946-2.981.218-.364.473-.764.764-1.164-.182-.654-.328-1.382-.328-2.109 0-1.964.91-3.236 2.182-3.236.91 0 1.527.618 1.527 1.527 0 1.346-1.164 2.91-2.546 4.364.11.4.255.764.4 1.091 1.128-1.273 2.037-1.928 2.946-1.928.727 0 1.2.473 1.2 1.128 0 .436-.182.836-.473 1.127-.364.364-.946.582-1.636.582-.4 0-.8-.073-1.164-.218-.073.109-.146.218-.218.327.91 1.237 1.637 1.782 2.291 1.782.4 0 .727-.146.982-.4.218-.218.473-.291.691-.291.4 0 .727.327.727.727 0 .291-.109.546-.4.946z"/>
    </svg>
  );

  const GoogleDriveLogo = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path fill="#4285F4" d="M12 11L7.5 3h9L12 11z"/>
      <path fill="#FBBC05" d="M7.5 3L3 11l4.5 8h4.5l-4.5-8L12 3H7.5z"/>
      <path fill="#34A853" d="M16.5 3L12 11l4.5 8h4.5l-4.5-8L21 3h-4.5z"/>
      <path fill="#EA4335" d="M3 11l4.5 8h9l4.5-8H3z"/>
    </svg>
  );

  const DropboxLogo = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#0061FF">
      <path d="M6 2l6 3.75L6 9.5 0 5.75 6 2zm12 0l6 3.75-6 3.75-6-3.75L18 2zM0 13.25L6 9.5l6 3.75-6 3.75-6-3.75zm18-3.75l6 3.75-6 3.75-6-3.75 6-3.75zM6 18.25l6-3.75 6 3.75-6 3.75-6-3.75z"/>
    </svg>
  );

  const importSources = [
    { id: 'canva', label: 'Canva', logo: CanvaLogo, onClick: onCanvaImport },
    { id: 'gdrive', label: 'Google Drive', logo: GoogleDriveLogo, onClick: onGoogleDriveImport },
    { id: 'dropbox', label: 'Dropbox', logo: DropboxLogo, onClick: onDropboxImport },
  ].filter(source => source.onClick);

  return (
    <div className="w-full">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-[15px] p-8 md:p-12 text-center cursor-pointer
          transition-all duration-200 ease-out
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isDragActive && !isDragReject ? 'border-[#64a70b] bg-[#64a70b]/5' : ''}
          ${isDragReject ? 'border-red-500 bg-red-50' : ''}
          ${!isDragActive && !isDragReject ? 'border-[#c1c6c8] hover:border-[#64a70b] hover:bg-[#64a70b]/5' : ''}
        `}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {isDragActive && !isDragReject ? (
            <motion.div
              key="drag-active"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center gap-4"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${printingColors.accent}20` }}
              >
                <FileImage className="w-8 h-8" style={{ color: printingColors.accent }} />
              </div>
              <p className="neuzeit-font text-lg" style={{ color: printingColors.accent }}>
                Drop your file here
              </p>
            </motion.div>
          ) : isDragReject ? (
            <motion.div
              key="drag-reject"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-red-100">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="neuzeit-font text-lg text-red-500">
                File type not supported
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: printingColors.neutralLight }}
              >
                <Upload className="w-8 h-8" style={{ color: printingColors.dark }} />
              </div>
              <div>
                <p className="neuzeit-font text-lg text-gray-800">
                  Drag & drop or{' '}
                  <span style={{ color: printingColors.accent }} className="font-medium">
                    click to upload
                  </span>
                </p>
                <p className="neuzeit-light-font text-sm text-gray-500 mt-2">
                  JPG, PNG, PDF, SVG, AI, EPS up to {MAX_FILE_SIZE_MB}MB
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 mt-3 p-3 rounded-[10px] bg-red-50 text-red-600"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="neuzeit-font text-sm">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Import sources */}
      {importSources.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="neuzeit-light-font text-sm text-gray-400">or import from</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {importSources.map((source) => {
              const LogoComponent = source.logo;
              return (
                <button
                  key={source.id}
                  onClick={source.onClick}
                  disabled={disabled}
                  className={`
                    inline-flex items-center gap-2.5 px-5 py-3 rounded-[10px]
                    neuzeit-font text-sm font-medium border border-gray-200
                    transition-all duration-200
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 hover:border-gray-300'}
                  `}
                  style={{ backgroundColor: 'white', color: printingColors.textDark }}
                >
                  <LogoComponent />
                  {source.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtworkDropzone;
