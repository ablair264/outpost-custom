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
  isMobile?: boolean;
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
  isMobile = false,
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
        className={`flex items-center gap-1.5 ${isMobile ? 'mb-3' : 'mb-8'} text-white/60 hover:text-white transition-colors`}
      >
        <ArrowLeft className={isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        <span className={`neuzeit-font ${isMobile ? 'text-xs' : 'text-sm'}`}>
          {showCalendar ? 'Back to options' : 'Back to options'}
        </span>
      </motion.button>

      {!showCalendar ? (
        <>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center ${isMobile ? 'mb-5' : 'mb-10'}`}
          >
            <div
              className={`${isMobile ? 'w-10 h-10 mb-3' : 'w-16 h-16 mb-6'} rounded-full mx-auto flex items-center justify-center`}
              style={{ backgroundColor: `${clothingColors.accent}25` }}
            >
              <Calendar className={isMobile ? 'w-5 h-5' : 'w-8 h-8'} style={{ color: clothingColors.accent }} />
            </div>
            <h2 className={`hearns-font text-white ${isMobile ? 'text-xl mb-1.5' : 'text-3xl md:text-4xl mb-3'}`}>
              Book a Free Consultation
            </h2>
            <p className={`neuzeit-light-font text-white/60 max-w-md mx-auto ${isMobile ? 'text-xs' : ''}`}>
              Chat with our team about your {productName}. No obligation, just friendly expert advice.
            </p>
          </motion.div>

          {/* Consultation type options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${isMobile ? 'space-y-2.5 mb-5' : 'space-y-4 mb-10'}`}
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
                  w-full flex items-center ${isMobile ? 'gap-3 p-3' : 'gap-5 p-5'} rounded-[15px] border-2 text-left
                  transition-all duration-200
                  ${option.available
                    ? 'border-white/20 hover:border-[#64a70b] hover:shadow-lg hover:shadow-[#64a70b]/10 bg-white/5'
                    : 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed'
                  }
                `}
              >
                <div
                  className={`${isMobile ? 'w-10 h-10' : 'w-14 h-14'} rounded-[10px] flex items-center justify-center flex-shrink-0`}
                  style={{ backgroundColor: `${clothingColors.accent}25` }}
                >
                  <option.icon className={isMobile ? 'w-5 h-5' : 'w-7 h-7'} style={{ color: clothingColors.accent }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`neuzeit-font font-semibold text-white ${isMobile ? 'text-sm mb-0.5' : 'text-lg mb-1'}`}>
                    {option.title}
                  </h3>
                  <p className={`neuzeit-light-font text-white/60 ${isMobile ? 'text-xs line-clamp-1' : 'text-sm'}`}>
                    {option.description}
                  </p>
                </div>
                <div className={`flex items-center gap-1.5 text-white/40 flex-shrink-0 ${isMobile ? 'hidden' : ''}`}>
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
            className={`${isMobile ? 'p-3 mb-4' : 'p-5 mb-8'} rounded-[15px] bg-white/5 border border-white/10`}
          >
            <div className={`flex items-center gap-2 ${isMobile ? 'mb-2' : 'mb-3'}`}>
              <Shirt className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} style={{ color: clothingColors.accent }} />
              <h4 className={`neuzeit-font font-semibold text-white ${isMobile ? 'text-sm' : ''}`}>
                We can help with
              </h4>
            </div>
            <ul className={`grid ${isMobile ? 'grid-cols-1 gap-1.5' : 'md:grid-cols-2 gap-2'}`}>
              {[
                'Uniform programmes for teams',
                'Embroidery vs print recommendations',
                'Bulk pricing and discounts',
                'Fabric and sizing advice',
                'Turnaround times',
                'Branding placement options',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} flex-shrink-0`} style={{ color: clothingColors.accent }} />
                  <span className={`neuzeit-light-font text-white/70 ${isMobile ? 'text-xs' : 'text-sm'}`}>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Alternative contact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={`text-center ${isMobile ? 'pt-3' : 'pt-6'} border-t border-white/10`}
          >
            <p className={`neuzeit-light-font text-white/50 ${isMobile ? 'text-xs mb-2' : 'text-sm mb-3'}`}>
              Prefer to reach out directly?
            </p>
            <div className={`flex flex-wrap justify-center ${isMobile ? 'gap-3' : 'gap-4'}`}>
              <a
                href="tel:+441562123456"
                className={`flex items-center gap-1.5 neuzeit-font font-medium transition-colors hover:underline ${isMobile ? 'text-xs' : 'text-sm'}`}
                style={{ color: clothingColors.accent }}
              >
                <Phone className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
                01562 123456
              </a>
              <a
                href="mailto:info@outpostcustom.co.uk"
                className={`flex items-center gap-1.5 neuzeit-font font-medium transition-colors hover:underline ${isMobile ? 'text-xs' : 'text-sm'}`}
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
          <div className={`flex items-center ${isMobile ? 'gap-3 mb-4 p-3' : 'gap-4 mb-8 p-4'} rounded-[10px] bg-white/5 border border-white/10`}>
            {selectedType && (
              <>
                <div
                  className={`${isMobile ? 'w-9 h-9' : 'w-12 h-12'} rounded-[10px] flex items-center justify-center`}
                  style={{ backgroundColor: `${clothingColors.accent}25` }}
                >
                  {selectedType === 'call' && <Phone className={isMobile ? 'w-4 h-4' : 'w-6 h-6'} style={{ color: clothingColors.accent }} />}
                  {selectedType === 'video' && <Video className={isMobile ? 'w-4 h-4' : 'w-6 h-6'} style={{ color: clothingColors.accent }} />}
                  {selectedType === 'inperson' && <MapPin className={isMobile ? 'w-4 h-4' : 'w-6 h-6'} style={{ color: clothingColors.accent }} />}
                </div>
                <div>
                  <h3 className={`neuzeit-font font-semibold text-white ${isMobile ? 'text-sm' : ''}`}>
                    {consultationOptions.find(o => o.id === selectedType)?.title}
                  </h3>
                  <p className={`neuzeit-light-font text-white/60 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {consultationOptions.find(o => o.id === selectedType)?.duration}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Calendar embed placeholder */}
          <div className="rounded-[15px] border-2 border-white/20 overflow-hidden bg-white/5">
            {/* This would be replaced with actual Google Calendar embed */}
            <div className={`${isMobile ? 'aspect-square p-4' : 'aspect-[4/3] p-8'} flex flex-col items-center justify-center`}>
              <Calendar className={`${isMobile ? 'w-10 h-10 mb-3' : 'w-16 h-16 mb-6'} text-white/30`} />
              <h3 className={`neuzeit-font text-white ${isMobile ? 'text-base mb-1' : 'text-xl mb-2'}`}>
                Choose a Time
              </h3>
              <p className={`neuzeit-light-font text-white/60 text-center max-w-sm ${isMobile ? 'text-xs mb-3' : 'mb-6'}`}>
                Select an available slot that works for you. We'll send you a confirmation email.
              </p>

              {/* Placeholder buttons for demo */}
              <div className={`grid grid-cols-2 ${isMobile ? 'gap-2' : 'gap-3'} w-full max-w-xs`}>
                {['Tomorrow 10:00', 'Tomorrow 14:00', 'Wed 11:00', 'Thu 15:00'].map((slot) => (
                  <button
                    key={slot}
                    onClick={() => {
                      // In real implementation, this would book the slot
                      onComplete();
                    }}
                    className={`${isMobile ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm'} rounded-[10px] border border-white/20 text-white hover:border-[#64a70b] hover:bg-[#64a70b]/10 transition-all neuzeit-font`}
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
                className={`${isMobile ? 'mt-3 text-xs' : 'mt-6 text-sm'} flex items-center gap-1.5 neuzeit-font font-medium transition-colors hover:underline`}
                style={{ color: clothingColors.accent }}
              >
                View all available times
                <ExternalLink className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
              </a>
            </div>
          </div>

          {/* What to expect */}
          <div className={`${isMobile ? 'mt-4 p-3' : 'mt-8 p-5'} rounded-[15px] bg-white/5 border border-white/10`}>
            <h4 className={`neuzeit-font font-semibold text-white ${isMobile ? 'text-sm mb-2' : 'mb-3'}`}>
              What to expect
            </h4>
            <ul className={isMobile ? 'space-y-1.5' : 'space-y-2'}>
              {[
                'Discuss your workwear requirements and goals',
                'Get expert advice on fabrics, sizes, and branding',
                'Receive a detailed quote (no obligation)',
                'Ask any questions you have about the process',
              ].map((item, i) => (
                <li key={i} className={`flex items-center ${isMobile ? 'gap-2' : 'gap-3'}`}>
                  <CheckCircle className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} flex-shrink-0`} style={{ color: clothingColors.accent }} />
                  <span className={`neuzeit-light-font text-white/70 ${isMobile ? 'text-xs' : 'text-sm'}`}>{item}</span>
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
