import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Upload,
  X,
  FileImage,
  Send,
  CheckCircle,
  Loader2,
  Info,
} from 'lucide-react';
import { printingColors } from '../../../lib/printing-theme';

interface HelpRequestFormProps {
  onBack: () => void;
  onComplete: () => void;
  productTitle?: string;
  serviceName?: string;
}

interface UploadedFile {
  file: File;
  preview: string | null;
}

const HelpRequestForm: React.FC<HelpRequestFormProps> = ({
  onBack,
  onComplete,
  productTitle,
  serviceName = 'printing',
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    }));
    setFiles(prev => [...prev, ...newFiles].slice(0, 5)); // Max 5 files
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.svg', '.webp'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 25 * 1024 * 1024,
    multiple: true,
  });

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsComplete(true);

    setTimeout(() => {
      onComplete();
    }, 3000);
  };

  const isValid = name.trim() && email.trim() && description.trim();

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl mx-auto text-center py-16"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center"
          style={{ backgroundColor: `${printingColors.accent}25` }}
        >
          <CheckCircle className="w-12 h-12" style={{ color: printingColors.accent }} />
        </motion.div>

        <h2 className="hearns-font text-3xl text-white mb-3">
          Request Sent!
        </h2>
        <p className="smilecake-font text-xl mb-4" style={{ color: printingColors.accent }}>
          We're on it
        </p>
        <p className="neuzeit-light-font text-white/70 max-w-md mx-auto">
          Our design team will review your request and get back to you within 24 hours with options and pricing.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="flex items-center gap-2 mb-8 text-white/60 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="neuzeit-font text-sm">Back to options</span>
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="hearns-font text-3xl md:text-4xl text-white mb-3">
          Tell us about your project
        </h2>
        <p className="neuzeit-light-font text-white/60">
          Share what you have and we'll create something brilliant
        </p>
      </motion.div>

      <form onSubmit={handleSubmit}>
        {/* File upload area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <label className="neuzeit-font text-sm font-medium text-white block mb-2">
            Upload your logo, images or inspiration
            <span className="text-white/40 font-normal ml-1">(optional)</span>
          </label>

          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-[15px] p-6 text-center cursor-pointer
              transition-all duration-200
              ${isDragActive
                ? 'border-[#64a70b] bg-[#64a70b]/10'
                : 'border-white/20 hover:border-white/40 bg-white/5'
              }
            `}
          >
            <input {...getInputProps()} />
            <Upload className="w-8 h-8 mx-auto mb-3 text-white/40" />
            <p className="neuzeit-font text-sm text-white/70">
              Drag files here or <span style={{ color: printingColors.accent }}>browse</span>
            </p>
            <p className="neuzeit-light-font text-xs text-white/40 mt-1">
              PNG, JPG, PDF, SVG up to 25MB each
            </p>
          </div>

          {/* Uploaded files */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 flex flex-wrap gap-3"
              >
                {files.map((f, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative group"
                  >
                    <div className="w-20 h-20 rounded-[10px] overflow-hidden bg-white/10 border border-white/20">
                      {f.preview ? (
                        <img src={f.preview} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileImage className="w-8 h-8 text-white/40" />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <label className="neuzeit-font text-sm font-medium text-white block mb-2">
            What do you need? <span className="text-red-400">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={`e.g., "I need 500 business cards with my logo and contact details" or "I'd like a flyer design for my new cafe opening"`}
            rows={4}
            className="w-full px-4 py-3 rounded-[10px] bg-white/10 border border-white/20 focus:border-[#64a70b] focus:ring-2 focus:ring-[#64a70b]/30 outline-none transition-all resize-none neuzeit-light-font text-white placeholder-white/40"
          />
        </motion.div>

        {/* Contact details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-4 mb-6"
        >
          <div>
            <label className="neuzeit-font text-sm font-medium text-white block mb-2">
              Your name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Smith"
              className="w-full px-4 py-3 rounded-[10px] bg-white/10 border border-white/20 focus:border-[#64a70b] focus:ring-2 focus:ring-[#64a70b]/30 outline-none transition-all neuzeit-light-font text-white placeholder-white/40"
            />
          </div>
          <div>
            <label className="neuzeit-font text-sm font-medium text-white block mb-2">
              Email address <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full px-4 py-3 rounded-[10px] bg-white/10 border border-white/20 focus:border-[#64a70b] focus:ring-2 focus:ring-[#64a70b]/30 outline-none transition-all neuzeit-light-font text-white placeholder-white/40"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-8"
        >
          <label className="neuzeit-font text-sm font-medium text-white block mb-2">
            Phone number <span className="text-white/40 font-normal">(optional)</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="07123 456789"
            className="w-full md:w-1/2 px-4 py-3 rounded-[10px] bg-white/10 border border-white/20 focus:border-[#64a70b] focus:ring-2 focus:ring-[#64a70b]/30 outline-none transition-all neuzeit-light-font text-white placeholder-white/40"
          />
        </motion.div>

        {/* Pricing info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 p-4 rounded-[10px] bg-white/5 border border-white/10"
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-white/40 flex-shrink-0 mt-0.5" />
            <div>
              <p className="neuzeit-font text-sm text-white/80 mb-1">
                <strong>Design pricing:</strong> Template designs from £25+VAT, bespoke designs quoted individually.
              </p>
              <p className="neuzeit-light-font text-sm text-white/50">
                We'll send you a quote before starting any work.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Submit button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`
              w-full flex items-center justify-center gap-3 px-6 py-4 rounded-[15px]
              neuzeit-font text-base font-semibold transition-all duration-300
              ${isValid && !isSubmitting
                ? 'text-white hover:opacity-90'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
              }
            `}
            style={isValid && !isSubmitting ? { backgroundColor: printingColors.accent } : {}}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Request
              </>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  );
};

export default HelpRequestForm;
