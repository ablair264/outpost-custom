import React from 'react';

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="features-section">
      <div className="container">
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">
              <i className="fas fa-arrows-alt"></i>
            </div>
            <h3>MADE TO ORDER</h3>
            <p>Our business is founded on manufacturing products that are exactly to your specification. Mix and match products with bespoke customisation and creative design.</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <i className="fas fa-clock"></i>
            </div>
            <h3>FAST TURN AROUND</h3>
            <p>With a dedicated in-house production team specialising in each stage of customisation, we have the ability to meet your deadlines with express service when needed.</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <i className="fas fa-desktop"></i>
            </div>
            <h3>IN-HOUSE DESIGN SERVICE</h3>
            <p>With all orders we offer an initial design consultation and give you an idea of how your customisation will look. Our qualified graphic designers can also provide a full design service.</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <i className="fas fa-check-square"></i>
            </div>
            <h3>TRUSTED MATERIALS</h3>
            <p>We use trusted brands to make sure our customers only get the best that is available.</p>
            <h4><strong>Recycled & Sustainable options are available across all our products & services</strong></h4>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;