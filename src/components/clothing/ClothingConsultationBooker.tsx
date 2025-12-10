import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Calendar,
  Video,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  ExternalLink,
  Shirt,
} from 'lucide-react';

// Theme colors - matching clothing pages
const clothingColors = {
  accent: '#64a70b',
  dark: '#183028',
  secondary: '#1e3a2f',
};

interface ClothingConsultationBookerProps {
  onBack: () => void;
  onComplete: () => void;
  productName?: string;
  calendarUrl?: string;
}

type ConsultationType = 'call' | 'video' | 'inperson';

interface ConsultationOption {
  id: ConsultationType;
  title: string;
  description: string;
  icon: React.ElementType;
  duration: string;
  available: boolean;
}

const ClothingConsultationBooker: React.FC<ClothingConsultationBookerProps> = ({
  onBack,
  onComplete,
  productName = 'workwear project',
  calendarUrl = 'https://calendar.google.com/calendar/appointments/schedules/YOUR_SCHEDULE_ID',
}) => {
  const [selectedType, setSelectedType] = useState<ConsultationType | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const consultationOptions: ConsultationOption[] = [
    {
      id: 'call',
      title: 'Phone Call',
      description: 'Quick chat to discuss your workwear requirements',
      icon: Phone,
      duration: '15-30 mins',
      available: true,
    },
    {
      id: 'video',
      title: 'Video Call',
      description: 'Screen share ideas and see fabric samples virtually',
      icon: Video,
      duration: '30 mins',
      available: true,
    },
    {
      id: 'inperson',
      title: 'Visit Our Studio',
      description: 'See samples, try on sizes, and meet the team in Kidderminster',
      icon: MapPin,
      duration: '45 mins',
      available: true,
    },
  ];

  const handleSelectType = (type: ConsultationType) => {
    setSelectedType(type);
    setShowCalendar(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={showCalendar ? () => setShowCalendar(false) : onBack}
        className="flex items-center gap-2 mb-8 text-white/60 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="neuzeit-font text-sm">
          {showCalendar ? 'Back to options' : 'Back to options'}
        </span>
      </motion.button>

      {!showCalendar ? (
        <>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div
              className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ backgroundColor: `${clothingColors.accent}25` }}
            >
              <Calendar className="w-8 h-8" style={{ color: clothingColors.accent }} />
            </div>
            <h2 className="hearns-font text-3xl md:text-4xl text-white mb-3">
              Book a Free Consultation
            </h2>
            <p className="neuzeit-light-font text-white/60 max-w-md mx-auto">
              Chat with our team about your {productName}. No obligation, just friendly expert advice.
            </p>
          </motion.div>

          {/* Consultation type options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4 mb-10"
          >
            {consultationOptions.map((option, index) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.1 }}
                onClick={() => handleSelectType(option.id)}
                disabled={!option.available}
                className={`
                  w-full flex items-center gap-5 p-5 rounded-[15px] border-2 text-left
                  transition-all duration-200
                  ${option.available
                    ? 'border-white/20 hover:border-[#64a70b] hover:shadow-lg hover:shadow-[#64a70b]/10 bg-white/5'
                    : 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed'
                  }
                `}
              >
                <div
                  className="w-14 h-14 rounded-[10px] flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${clothingColors.accent}25` }}
                >
                  <option.icon className="w-7 h-7" style={{ color: clothingColors.accent }} />
                </div>
                <div className="flex-1">
                  <h3 className="neuzeit-font text-lg font-semibold text-white mb-1">
                    {option.title}
                  </h3>
                  <p className="neuzeit-light-font text-sm text-white/60">
                    {option.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-white/40">
                  <Clock className="w-4 h-4" />
                  <span className="neuzeit-font text-sm">{option.duration}</span>
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* What we can help with */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="p-5 rounded-[15px] bg-white/5 border border-white/10 mb-8"
          >
            <div className="flex items-center gap-2 mb-3">
              <Shirt className="w-5 h-5" style={{ color: clothingColors.accent }} />
              <h4 className="neuzeit-font font-semibold text-white">
                We can help with
              </h4>
            </div>
            <ul className="grid md:grid-cols-2 gap-2">
              {[
                'Uniform programmes for teams',
                'Embroidery vs print recommendations',
                'Bulk pricing and discounts',
                'Fabric and sizing advice',
                'Turnaround times',
                'Branding placement options',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: clothingColors.accent }} />
                  <span className="neuzeit-light-font text-sm text-white/70">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Alternative contact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center pt-6 border-t border-white/10"
          >
            <p className="neuzeit-light-font text-sm text-white/50 mb-3">
              Prefer to reach out directly?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:+441562123456"
                className="flex items-center gap-2 text-sm neuzeit-font font-medium transition-colors hover:underline"
                style={{ color: clothingColors.accent }}
              >
                <Phone className="w-4 h-4" />
                01562 123456
              </a>
              <a
                href="mailto:info@outpostcustom.co.uk"
                className="flex items-center gap-2 text-sm neuzeit-font font-medium transition-colors hover:underline"
                style={{ color: clothingColors.accent }}
              >
                info@outpostcustom.co.uk
              </a>
            </div>
          </motion.div>
        </>
      ) : (
        /* Calendar booking view */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Selected type header */}
          <div className="flex items-center gap-4 mb-8 p-4 rounded-[10px] bg-white/5 border border-white/10">
            {selectedType && (
              <>
                <div
                  className="w-12 h-12 rounded-[10px] flex items-center justify-center"
                  style={{ backgroundColor: `${clothingColors.accent}25` }}
                >
                  {selectedType === 'call' && <Phone className="w-6 h-6" style={{ color: clothingColors.accent }} />}
                  {selectedType === 'video' && <Video className="w-6 h-6" style={{ color: clothingColors.accent }} />}
                  {selectedType === 'inperson' && <MapPin className="w-6 h-6" style={{ color: clothingColors.accent }} />}
                </div>
                <div>
                  <h3 className="neuzeit-font font-semibold text-white">
                    {consultationOptions.find(o => o.id === selectedType)?.title}
                  </h3>
                  <p className="neuzeit-light-font text-sm text-white/60">
                    {consultationOptions.find(o => o.id === selectedType)?.duration}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Calendar embed placeholder */}
          <div className="rounded-[15px] border-2 border-white/20 overflow-hidden bg-white/5">
            {/* This would be replaced with actual Google Calendar embed */}
            <div className="aspect-[4/3] flex flex-col items-center justify-center p-8">
              <Calendar className="w-16 h-16 text-white/30 mb-6" />
              <h3 className="neuzeit-font text-xl text-white mb-2">
                Choose a Time
              </h3>
              <p className="neuzeit-light-font text-white/60 text-center mb-6 max-w-sm">
                Select an available slot that works for you. We'll send you a confirmation email.
              </p>

              {/* Placeholder buttons for demo */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                {['Tomorrow 10:00', 'Tomorrow 14:00', 'Wed 11:00', 'Thu 15:00'].map((slot) => (
                  <button
                    key={slot}
                    onClick={() => {
                      // In real implementation, this would book the slot
                      onComplete();
                    }}
                    className="px-4 py-3 rounded-[10px] border border-white/20 text-white hover:border-[#64a70b] hover:bg-[#64a70b]/10 transition-all neuzeit-font text-sm"
                  >
                    {slot}
                  </button>
                ))}
              </div>

              {/* External link to full calendar */}
              <a
                href={calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center gap-2 text-sm neuzeit-font font-medium transition-colors hover:underline"
                style={{ color: clothingColors.accent }}
              >
                View all available times
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* What to expect */}
          <div className="mt-8 p-5 rounded-[15px] bg-white/5 border border-white/10">
            <h4 className="neuzeit-font font-semibold text-white mb-3">
              What to expect
            </h4>
            <ul className="space-y-2">
              {[
                'Discuss your workwear requirements and goals',
                'Get expert advice on fabrics, sizes, and branding',
                'Receive a detailed quote (no obligation)',
                'Ask any questions you have about the process',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: clothingColors.accent }} />
                  <span className="neuzeit-light-font text-sm text-white/70">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ClothingConsultationBooker;
