import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { printingColors } from '../../lib/printing-theme';
import { PrintingProduct, extractUseCases, cleanDescription } from '../../lib/printing-products';
import PathSelector, { SubmissionPath } from './artwork-submission/PathSelector';
import SimpleUploader from './artwork-submission/SimpleUploader';
import HelpRequestForm from './artwork-submission/HelpRequestForm';
import ConsultationBooker from './artwork-submission/ConsultationBooker';
import type { ArtworkAnalysis } from '../../lib/artwork-types';

interface ProductDetailModalProps {
  product: PrintingProduct;
  isOpen: boolean;
  onClose: () => void;
}

type ModalStep = 'info' | 'path-select' | 'upload' | 'help' | 'consult' | 'details' | 'success';

interface SubmissionData {
  path: SubmissionPath | null;
  file?: File;
  analysis?: ArtworkAnalysis;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<ModalStep>('info');
  const [submissionData, setSubmissionData] = useState<SubmissionData>({ path: null });

  const imageUrl = product.images[0] || '/printing/placeholder.jpg';
  const useCases = extractUseCases(product);

  // Parse specs
  const parseSpecs = () => {
    const desc = product.full_description;
    const specs: { label: string; items: string[] }[] = [];

    const sizes: string[] = [];
    if (desc.includes('85mm x 55mm') || desc.includes('85 x 55')) sizes.push('85 x 55mm');
    if (desc.includes('A4')) sizes.push('A4');
    if (desc.includes('A5')) sizes.push('A5');
    if (desc.includes('A6')) sizes.push('A6');
    if (desc.includes('DL')) sizes.push('DL');
    if (desc.includes('A3')) sizes.push('A3');
    if (sizes.length > 0) specs.push({ label: 'Sizes', items: sizes });

    const paper: string[] = [];
    if (desc.includes('350gsm')) paper.push('350gsm');
    if (desc.includes('400gsm')) paper.push('400gsm');
    if (desc.toLowerCase().includes('uncoated')) paper.push('Uncoated');
    if (paper.length > 0) specs.push({ label: 'Paper', items: paper });

    const finish: string[] = [];
    if (desc.toLowerCase().includes('matt')) finish.push('Matt');
    if (desc.toLowerCase().includes('gloss')) finish.push('Gloss');
    if (desc.toLowerCase().includes('silk')) finish.push('Silk');
    if (finish.length > 0) specs.push({ label: 'Finish', items: finish });

    return specs;
  };

  const specs = parseSpecs();

  const handleClose = useCallback(() => {
    setStep('info');
    setSubmissionData({ path: null });
    onClose();
  }, [onClose]);

  const handleGetStarted = () => {
    setStep('path-select');
  };

  const handleSelectPath = (path: SubmissionPath) => {
    setSubmissionData(prev => ({ ...prev, path }));
    if (path === 'ready') setStep('upload');
    else if (path === 'help') setStep('help');
    else if (path === 'consult') setStep('consult');
  };

  const handleUploadComplete = (file: File, analysis: ArtworkAnalysis) => {
    setSubmissionData(prev => ({ ...prev, file, analysis }));
    setStep('details');
  };

  const handleHelpComplete = () => {
    // HelpRequestForm already collected user details, go straight to success
    setStep('success');
  };

  const handleConsultComplete = () => {
    setStep('success');
  };

  const handleDetailsComplete = () => {
    setStep('success');
  };

  const handleBackToPath = () => {
    setStep('path-select');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-4 md:inset-8 lg:inset-12 z-50 flex items-center justify-center pointer-events-none"
          >
            <div
              className="relative w-full max-w-5xl max-h-full overflow-hidden rounded-[15px] shadow-2xl pointer-events-auto flex flex-col"
              style={{ backgroundColor: printingColors.dark }}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) rgba(255,255,255,0.05)' }}>
                <AnimatePresence mode="wait">
                  {/* Step: Product Info */}
                  {step === 'info' && (
                    <motion.div
                      key="info"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="flex flex-col md:flex-row"
                    >
                      {/* Image - 40% on desktop */}
                      <div className="md:w-[40%] flex-shrink-0">
                        <img
                          src={imageUrl}
                          alt={product.title}
                          className="w-full h-64 md:h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-8 md:p-10">
                        <h2 className="hearns-font text-3xl md:text-4xl text-white mb-2">
                          {product.title}
                        </h2>

                        <p className="neuzeit-light-font text-lg text-white/70 mb-6 leading-relaxed">
                          {cleanDescription(product.short_description)}
                        </p>

                        {/* Perfect for */}
                        <div className="mb-6">
                          <p className="smilecake-font text-lg mb-3" style={{ color: printingColors.accent }}>
                            Perfect for...
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {useCases.map((useCase, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <Check className="w-4 h-4" style={{ color: printingColors.accent }} />
                                <span className="neuzeit-font text-sm text-white/80">{useCase}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-white/10 mb-6" />

                        {/* Specs */}
                        {specs.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                            {specs.map((spec, i) => (
                              <div key={i}>
                                <p className="neuzeit-font text-xs uppercase tracking-wide text-white/50 mb-2">
                                  {spec.label}
                                </p>
                                <div className="space-y-1">
                                  {spec.items.map((item, j) => (
                                    <p key={j} className="neuzeit-font text-sm text-white">{item}</p>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={handleGetStarted}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-[10px] neuzeit-font font-semibold text-white transition-all hover:opacity-90"
                            style={{ backgroundColor: printingColors.accent }}
                          >
                            Request a Quote
                            <ArrowRight className="w-5 h-5" />
                          </button>
                          <a
                            href="mailto:info@outpostcustom.co.uk?subject=Enquiry about printing"
                            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-[10px] neuzeit-font font-semibold text-white border-2 border-white/30 transition-all hover:bg-white/10 hover:border-white/50"
                          >
                            Contact the Team
                          </a>
                        </div>

                        {/* Trust indicators */}
                        <div className="mt-8 pt-6 border-t border-white/10">
                          <div className="flex flex-wrap gap-6 text-sm text-white/50">
                            <div className="flex items-center gap-2">
                              <Check className="w-4 h-4" style={{ color: printingColors.accent }} />
                              <span className="neuzeit-font">Free artwork check</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="w-4 h-4" style={{ color: printingColors.accent }} />
                              <span className="neuzeit-font">4-7 day turnaround</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="w-4 h-4" style={{ color: printingColors.accent }} />
                              <span className="neuzeit-font">Quality guaranteed</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step: Path Selection */}
                  {step === 'path-select' && (
                    <motion.div
                      key="path-select"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="p-8 md:p-12"
                    >
                      <button
                        onClick={() => setStep('info')}
                        className="flex items-center gap-2 mb-6 text-white/60 hover:text-white transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="neuzeit-font text-sm">Back to {product.title}</span>
                      </button>

                      <PathSelector
                        onSelectPath={handleSelectPath}
                        serviceName="printing"
                        recommendedPath="ready"
                      />
                    </motion.div>
                  )}

                  {/* Step: Upload */}
                  {step === 'upload' && (
                    <motion.div
                      key="upload"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="p-8 md:p-12"
                    >
                      <SimpleUploader
                        onBack={handleBackToPath}
                        onComplete={handleUploadComplete}
                        productTitle={product.title}
                        printDimensions={{ width: 148, height: 210 }}
                      />
                    </motion.div>
                  )}

                  {/* Step: Help Request */}
                  {step === 'help' && (
                    <motion.div
                      key="help"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="p-8 md:p-12"
                    >
                      <HelpRequestForm
                        onBack={handleBackToPath}
                        onComplete={handleHelpComplete}
                        productTitle={product.title}
                        serviceName="printing"
                      />
                    </motion.div>
                  )}

                  {/* Step: Consultation */}
                  {step === 'consult' && (
                    <motion.div
                      key="consult"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="p-8 md:p-12"
                    >
                      <ConsultationBooker
                        onBack={handleBackToPath}
                        onComplete={handleConsultComplete}
                        serviceName="printing"
                      />
                    </motion.div>
                  )}

                  {/* Step: Customer Details */}
                  {step === 'details' && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="p-8 md:p-12"
                    >
                      <CustomerDetailsForm
                        productTitle={product.title}
                        onComplete={handleDetailsComplete}
                      />
                    </motion.div>
                  )}

                  {/* Step: Success */}
                  {step === 'success' && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-8 md:p-12"
                    >
                      <SubmissionSuccess
                        productTitle={product.title}
                        onBrowseMore={handleClose}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Customer Details Form Component
interface CustomerDetailsFormProps {
  productTitle: string;
  onComplete: () => void;
}

const CustomerDetailsForm: React.FC<CustomerDetailsFormProps> = ({
  productTitle,
  onComplete,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');
  const [marketing, setMarketing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = name.trim() && email.trim() && email.includes('@');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    onComplete();
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="hearns-font text-3xl text-white mb-2">
          Almost there!
        </h2>
        <p className="neuzeit-light-font text-white/70">
          Just a few details so we can send your quote for {productTitle}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Name & Email */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="neuzeit-font text-sm text-white/70 block mb-2">
              Your name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Smith"
              className="w-full px-4 py-3 rounded-[10px] bg-white/10 border border-white/20 text-white placeholder-white/40 neuzeit-font focus:outline-none focus:border-white/50 transition-all"
            />
          </div>
          <div>
            <label className="neuzeit-font text-sm text-white/70 block mb-2">
              Email address <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full px-4 py-3 rounded-[10px] bg-white/10 border border-white/20 text-white placeholder-white/40 neuzeit-font focus:outline-none focus:border-white/50 transition-all"
            />
          </div>
        </div>

        {/* Phone & Company */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="neuzeit-font text-sm text-white/70 block mb-2">
              Phone <span className="text-white/40">(optional)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="07123 456789"
              className="w-full px-4 py-3 rounded-[10px] bg-white/10 border border-white/20 text-white placeholder-white/40 neuzeit-font focus:outline-none focus:border-white/50 transition-all"
            />
          </div>
          <div>
            <label className="neuzeit-font text-sm text-white/70 block mb-2">
              Company <span className="text-white/40">(optional)</span>
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Ltd"
              className="w-full px-4 py-3 rounded-[10px] bg-white/10 border border-white/20 text-white placeholder-white/40 neuzeit-font focus:outline-none focus:border-white/50 transition-all"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="neuzeit-font text-sm text-white/70 block mb-2">
            Anything else we should know? <span className="text-white/40">(optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. specific quantities, deadline, special requirements..."
            rows={3}
            className="w-full px-4 py-3 rounded-[10px] bg-white/10 border border-white/20 text-white placeholder-white/40 neuzeit-font focus:outline-none focus:border-white/50 transition-all resize-none"
          />
        </div>

        {/* Marketing opt-in */}
        <div className="mb-8">
          <label className="flex items-start gap-3 cursor-pointer">
            <div
              onClick={() => setMarketing(!marketing)}
              className={`w-5 h-5 mt-0.5 rounded border flex items-center justify-center transition-all flex-shrink-0 ${
                marketing ? 'border-transparent' : 'border-white/30'
              }`}
              style={marketing ? { backgroundColor: printingColors.accent } : {}}
            >
              {marketing && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="neuzeit-light-font text-sm text-white/60">
              Keep me updated on offers and new products
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-[10px] neuzeit-font font-semibold text-lg transition-all ${
            isValid && !isSubmitting
              ? 'text-white hover:opacity-90'
              : 'bg-white/10 text-white/40 cursor-not-allowed'
          }`}
          style={isValid && !isSubmitting ? { backgroundColor: printingColors.accent } : {}}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit Request
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        {/* Privacy note */}
        <p className="mt-4 text-center neuzeit-light-font text-xs text-white/40">
          🔒 We'll never share your details with third parties
        </p>
      </form>
    </div>
  );
};

// Submission Success Component
interface SubmissionSuccessProps {
  productTitle: string;
  onBrowseMore: () => void;
}

const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({
  productTitle,
  onBrowseMore,
}) => {
  const steps = [
    'We review your artwork/requirements',
    'We\'ll be in touch with any questions',
    'You\'ll receive a detailed quote',
    'Once approved, we print and deliver',
  ];

  return (
    <div className="max-w-lg mx-auto text-center">
      {/* Checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center"
        style={{ backgroundColor: printingColors.accent }}
      >
        <Check className="w-12 h-12 text-white" />
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="hearns-font text-3xl text-white mb-2"
      >
        Request Sent!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="smilecake-font text-xl mb-4"
        style={{ color: printingColors.accent }}
      >
        We're on it
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="neuzeit-light-font text-white/70 mb-8"
      >
        We've received your request for {productTitle}. Our team will review and get back to you within 24 hours.
      </motion.p>

      {/* Divider */}
      <div className="h-px bg-white/10 mb-8" />

      {/* What happens next */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-left mb-8"
      >
        <h3 className="neuzeit-font font-semibold text-white mb-4 text-center">
          What happens next
        </h3>
        <div className="space-y-3">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold text-white"
                style={{ backgroundColor: printingColors.accent }}
              >
                {i + 1}
              </div>
              <span className="neuzeit-font text-sm text-white/80">{step}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Contact info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="p-4 rounded-[10px] bg-white/5 mb-8"
      >
        <p className="neuzeit-font text-sm text-white/60 mb-2">
          Questions? Get in touch:
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="tel:+441onal234567"
            className="neuzeit-font text-sm font-medium hover:underline"
            style={{ color: printingColors.accent }}
          >
            01234 567890
          </a>
          <a
            href="mailto:info@outpostcustom.co.uk"
            className="neuzeit-font text-sm font-medium hover:underline"
            style={{ color: printingColors.accent }}
          >
            info@outpostcustom.co.uk
          </a>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        <button
          onClick={onBrowseMore}
          className="px-6 py-3 rounded-[10px] neuzeit-font font-medium text-white transition-all hover:opacity-90"
          style={{ backgroundColor: printingColors.accent }}
        >
          Browse More Products
        </button>
        <a
          href="/"
          className="px-6 py-3 rounded-[10px] neuzeit-font font-medium text-white/70 bg-white/10 hover:bg-white/20 transition-all"
        >
          Back to Home
        </a>
      </motion.div>
    </div>
  );
};

export default ProductDetailModal;
