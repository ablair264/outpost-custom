import React from 'react';

const PrintAndInstagram: React.FC = () => {
  const instagramItems = [
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300"
  ];

  return (
    <>
      {/* Print Department Section */}
      <section id="print" className="print-section">
        <div className="triangle-separator top"></div>
        <div className="container">
          <h2 className="section-title white-text">Our Print Department</h2>
          <div className="section-underline"></div>
          <p className="section-lead white-text">Bring your artwork to life with our in-house Digital Printing.</p>
          <p className="white-text">
            We've got in-house printers so we can deliver a speedy, reliable service. Our production team can manage the demanding deadlines and technical challenges to ensure you get printed products that reflect your business in the best possible way.
          </p>
          
          <a href="#" className="view-all-button">VIEW ALL PRINT PRODUCTS</a>
        </div>
      </section>

      {/* Instagram Section */}
      <section id="instagram" className="instagram-section">
        <div className="triangle-separator top black"></div>
        <div className="container">
          <h2 className="section-title">Our work speaks for itself.</h2>
          <div className="section-underline accent"></div>
          <p className="section-lead">Designed by artists. Precision-cut by machines. Applied by professionals.</p>
          <p>Enjoy our most recent projects from our Instagram feed…</p>
          
          <div className="instagram-grid">
            {instagramItems.map((src, index) => (
              <div key={index} className="instagram-item">
                <img src={src} alt={`Instagram post ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default PrintAndInstagram;