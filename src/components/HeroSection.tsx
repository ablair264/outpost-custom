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
      className="min-h-screen flex items-center justify-center bg-[#1a1a1a] bg-cover bg-center text-center relative"
      style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/background.jpg')"
      }}
    >
      <div className="relative z-10">
        <div className="text-white text-sm tracking-[3px] uppercase mb-8 opacity-90">
          OUTPOST CUSTOM
        </div>
        <h1
          className="text-white text-[clamp(48px,8vw,85px)] leading-none mb-10 text-center flex items-center justify-center min-h-[200px] relative"
          style={{
            fontFamily: "'Hearns', sans-serif",
            fontWeight: 'normal'
          }}
        >
          <span
            className="opacity-0 animate-[fadeInOut_4s_ease-in-out] absolute w-full left-0 [&.active]:opacity-100 [&.active]:relative active"
            dangerouslySetInnerHTML={{ __html: rotatingTexts[currentTextIndex] }}
          />
        </h1>
        <div className="text-white text-lg mb-10 opacity-90 font-light">
          Located in Kidderminster, Worcestershire
        </div>
        <button
          className="inline-block px-10 py-4 text-white border-2 border-white text-sm tracking-[2px] uppercase transition-all duration-300 bg-transparent cursor-pointer hover:bg-[#78BE20] hover:border-[#78BE20] hover:-translate-y-0.5"
          onClick={() => scrollToSection('#services-intro')}
        >
          WHAT WE DO
        </button>
      </div>
    </section>
  );
};

export default HeroSection;