import React, { useState, useEffect } from 'react';

const ServicesIntro: React.FC = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = "Make the right first impression";

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < fullText.length) {
        setDisplayText(fullText.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentIndex, fullText]);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setCurrentIndex(0);
    }, 500);

    return () => clearTimeout(startTimer);
  }, []);

  return (
    <section id="services-intro" className="bg-black py-24 px-6 text-center">
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-white text-[50px] md:text-[30px] leading-none tracking-tight min-h-[60px] md:min-h-[40px] inline-block"
          style={{ fontFamily: "'Aldivaro', sans-serif", fontWeight: 'normal' }}
        >
          <span>{displayText}</span>
          <span className="inline-block text-white animate-[blink_1s_infinite]">|</span>
        </h2>
      </div>
    </section>
  );
};

export default ServicesIntro;