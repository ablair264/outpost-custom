import React, { useState, useEffect } from 'react';

const HeroSection: React.FC = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  const rotatingTexts = [
    'We are<br><span class="accent">Customisation Specialists</span>',
    'Every project is<br><span class="accent">custom</span> for you',
    'Your next <span class="accent">project</span><br>could be...',
    'Designed by<br><span class="accent">artists</span>',
    'Precision-cut by<br><span class="accent">machines</span>',
    'Installed & applied by<br><span class="accent">professionals</span>'
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
    <section id="hero" className="hero-section">
      <div className="hero-content">
        <div className="hero-subtitle">OUTPOST CUSTOM</div>
        <h1 className="hero-title">
          <span 
            className="rotating-text active"
            dangerouslySetInnerHTML={{ __html: rotatingTexts[currentTextIndex] }}
          />
        </h1>
        <div className="hero-description">Located in Kidderminster, Worcestershire</div>
        <button 
          className="hero-button"
          onClick={() => scrollToSection('#services-intro')}
        >
          WHAT WE DO
        </button>
      </div>
    </section>
  );
};

export default HeroSection;