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
    <section id="services-intro" className="services-intro">
      <div className="container">
        <h2 className="animated-title">
          <span>{displayText}</span>
          <span className="cursor">|</span>
        </h2>
      </div>
    </section>
  );
};

export default ServicesIntro;