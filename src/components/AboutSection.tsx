import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="about-section">
      <div className="container">
        <h2 className="section-title accent-color">Outpost Custom</h2>
        <p className="section-subtitle">Warning: Original Content</p>
        
        <div className="content-grid">
          <div className="content-column">
            <h3>We are Customisation Specialists.</h3>
            <p>Based out of our industrial unit in Kidderminster, Worcestershire, Outpost Custom has fast made a name for itself in the world of signage and workwear.</p>
            <p>We offer a wide range of design, print, clothing and signage solutions to businesses and individuals across the Midlands.</p>
            
            <h3>We don't cut corners… unless they are on signs.</h3>
            <p>Our extensive knowledge and experience means we're able to recommend the products and services that best suit your budget. We will advise and guide you on every aspect of the process whether you're a small business or a national company.</p>
            <p>We believe that by going the extra mile, and genuinely caring about every business who walks though our doors, has been crucial to our success.</p>
          </div>
          <div className="image-column">
            <img src="https://via.placeholder.com/500x500" alt="Outpost Shop External" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;