import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, MapPin, Phone, Search, ChevronDown } from 'lucide-react';

interface ClothingHowItWorksProps {
  isOpen: boolean;
  onClose: () => void;
  onStartOrder: () => void;
}

// Theme colors - matching clothing pages
const clothingColors = {
  accent: '#64a70b',
  dark: '#183028',
  secondary: '#1e3a2f',
};

const steps = [
  {
    number: 1,
    title: 'Choose your garments',
    description: 'Browse our catalogue online, pop into our shop to try on garments, or chat to our team who will advise on the best options for you.',
  },
  {
    number: 2,
    title: 'Get a FREE quote + mockup',
    description: 'Send us your logo and our design team will create a visual of how your clothing will look.',
    note: 'Need a logo designed first? Our in-house design team can help with that.',
  },
  {
    number: 3,
    title: 'Approve your order',
    description: 'Once you approve your order, we\'ll get it into production. This usually takes 5-10 working days.',
    note: 'Got an event and need your order sooner? Chat to our team – we\'ll do our best to help!',
  },
  {
    number: 4,
    title: 'Order up!',
    description: 'We\'ll let you know when your order is ready to collect from our Kidderminster shop, or we can post it to you (from £2.50).',
  },
];

const ClothingHowItWorks: React.FC<ClothingHowItWorksProps> = ({
  isOpen,
  onClose,
  onStartOrder,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl max-h-[90vh] mx-4 rounded-2xl overflow-hidden shadow-2xl"
            style={{ backgroundColor: clothingColors.dark }}
          >
            {/* Background texture */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'url(/BlackTextureBackground.webp)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Content */}
            <div className="relative z-10 p-6 md:p-10 overflow-y-auto max-h-[90vh] scrollbar-clothing">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <h2 className="hearns-font text-3xl md:text-4xl text-white mb-3">
                  How's it work?
                </h2>
                <p className="neuzeit-light-font text-base text-white/70 max-w-xl mx-auto">
                  Four simple steps to get your personalised clothing and branded workwear
                </p>
              </motion.div>

              {/* Steps - Vertical Timeline */}
              <div className="relative max-w-2xl mx-auto mb-10">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + index * 0.1 }}
                    className="relative flex gap-5"
                  >
                    {/* Timeline connector */}
                    <div className="flex flex-col items-center">
                      {/* Step circle */}
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border-2 relative z-10"
                        style={{
                          backgroundColor: clothingColors.dark,
                          borderColor: clothingColors.accent,
                        }}
                      >
                        <span
                          className="hearns-font text-xl"
                          style={{ color: clothingColors.accent }}
                        >
                          {step.number}
                        </span>
                      </div>

                      {/* Connecting line + arrow */}
                      {index < steps.length - 1 && (
                        <div className="flex flex-col items-center">
                          <div
                            className="w-0.5 h-8"
                            style={{ backgroundColor: clothingColors.accent }}
                          />
                          <ChevronDown
                            className="w-4 h-4 -mt-1"
                            style={{ color: clothingColors.accent }}
                          />
                          <div
                            className="w-0.5 h-8"
                            style={{ backgroundColor: clothingColors.accent }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Step content */}
                    <div className={`pt-1 ${index < steps.length - 1 ? 'pb-6' : ''}`}>
                      <div
                        className="embossing-font text-[10px] uppercase tracking-[0.2em] mb-1"
                        style={{ color: clothingColors.accent }}
                      >
                        Step {step.number}
                      </div>
                      <h3 className="hearns-font text-xl text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="neuzeit-light-font text-sm text-white/70 leading-relaxed">
                        {step.description}
                      </p>
                      {step.note && (
                        <p className="neuzeit-font text-xs mt-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 italic text-white/60">
                          💡 {step.note}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                {/* Primary CTA */}
                <button
                  onClick={() => {
                    onClose();
                    onStartOrder();
                  }}
                  className="w-full h-14 rounded-[12px] neuzeit-font font-semibold text-base text-white transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-xl hover:scale-[1.01]"
                  style={{
                    backgroundColor: clothingColors.accent,
                    boxShadow: `0 8px 25px ${clothingColors.accent}40`,
                  }}
                >
                  <Search className="w-5 h-5" />
                  Start Your Order
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Secondary CTAs */}
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="https://maps.google.com/?q=Outpost+Kidderminster"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-12 rounded-[10px] border border-white/20 neuzeit-font text-sm text-white/80 transition-all duration-200 hover:border-[#64a70b] hover:text-white flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    How To Find Us
                  </a>
                  <a
                    href="tel:01onal"
                    className="h-12 rounded-[10px] border border-white/20 neuzeit-font text-sm text-white/80 transition-all duration-200 hover:border-[#64a70b] hover:text-white flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Give Us a Call
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ClothingHowItWorks;
