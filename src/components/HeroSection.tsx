import React, { useState, useEffect } from 'react';

const HeroSection: React.FC = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  const rotatingTexts = [
    'We are<br><span class="text-[#64a70b]">Customisation Specialists</span>',
    'Every project is<br><span class="text-[#64a70b]">custom</span> for you',
    'Your next <span class="text-[#908d9a]">project</span><br>could be...',
    'Designed by<br><span class="text-[#64a70b]">artists</span>',
    'Precision-cut by<br><span class="text-[#908d9a]">machines</span>',
    'Installed + applied by<br><span class="text-[#64a70b]">professionals</span>'
  ];

  useEffect(() => {
    const initialDelay = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % rotatingTexts.length);
      }, 4000);
      
      return () => clearInterval(interval);
    }, 3000);

    return () => clearTimeout(initialDelay);
  }, [rotatingTexts.length]);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section
      id="hero"
      className="min-h-[100svh] flex items-center justify-center bg-cover bg-center text-center relative px-5 sm:px-6 py-20"
      style={{
        backgroundColor: "#183028",
        backgroundImage: "url(https://cdn.builder.io/api/v1/image/assets%2F5c078341d36c4b46a232917aaf98fa04%2F20b2762502fd460cbca5ad2f4fd8f2b4?format=webp)"
      }}
    >
      {/* Dark overlay - gradient fades out at bottom */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)'
        }}
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        <div className="text-white text-[10px] sm:text-xs md:text-sm tracking-[2px] sm:tracking-[3px] uppercase mb-4 sm:mb-6 md:mb-8 opacity-90">
          OUTPOST CUSTOM
        </div>
        <h1
          className="text-white text-[clamp(34px,7.5vw,85px)] leading-[1.15] mb-5 sm:mb-8 md:mb-10 text-center flex items-center justify-center min-h-[110px] sm:min-h-[140px] md:min-h-[200px] relative w-full"
          style={{
            fontFamily: "'Hearns', sans-serif",
            fontWeight: 'normal'
          }}
        >
          <span
            className="opacity-0 animate-[fadeInOut_4s_ease-in-out] absolute w-full left-0 [&.active]:opacity-100 [&.active]:relative active px-1"
            dangerouslySetInnerHTML={{ __html: rotatingTexts[currentTextIndex] }}
          />
        </h1>
        <div className="text-white/80 text-xs sm:text-sm md:text-base tracking-[3px] sm:tracking-[4px] uppercase mb-4 sm:mb-6 md:mb-8 font-light">
          Print <span className="mx-2 sm:mx-3 text-white/50">—</span> Signage <span className="mx-2 sm:mx-3 text-white/50">—</span> Clothing
        </div>
        <div className="text-white text-[11px] sm:text-xs md:text-sm mb-5 sm:mb-6 md:mb-8 opacity-70 font-light">
          Located in Kidderminster, Worcestershire
        </div>
        <button
          className="inline-block px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 text-white border-2 border-white text-[11px] sm:text-xs md:text-sm tracking-[1.5px] sm:tracking-[2px] uppercase transition-all duration-300 bg-transparent cursor-pointer hover:bg-[#78BE20] hover:border-[#78BE20] hover:-translate-y-0.5"
          onClick={() => scrollToSection('#services-intro')}
        >
          WHAT WE DO
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
