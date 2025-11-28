import React from 'react';

const ServicesGrid: React.FC = () => {
  const services = [
    {
      icon: "https://via.placeholder.com/100",
      title: "Sign boards",
      description: "Communicate your message with custom signage.",
      details: "Find the signage style that works best for you – available in a range of materials for internal & exterior use."
    },
    {
      icon: "https://via.placeholder.com/100",
      title: "Custom Clothing",
      description: "Premium garments and customisation, all in one place.",
      details: "Put as much pride into your appearance as you put into your work, use your back as a walking billboard and make your staff look like a team."
    },
    {
      icon: "https://via.placeholder.com/100",
      title: "Vehicle Signwriting",
      description: "Turn up to your next job looking professional, on brand and most importantly get noticed.",
      details: "Turn your vehicle into a promotional tool for your business to get spotted on the road or parked on any job with vinyl decals that are made with premium materials."
    },
    {
      icon: "https://via.placeholder.com/100",
      title: "Etched Window Privacy Film",
      description: "Add privacy without sacrificing style or losing natural light in your home or workplace.",
      details: "The etched finish gives a sandblasted / frosted look to your glass windows and doors where only basic shapes can be seen, hiding valuables, clutter or activity."
    },
    {
      icon: "https://via.placeholder.com/100",
      title: "Projecting Signs",
      description: "Mix & Match from our range of wall-mounted brackets and customisable panels.",
      details: "An excellent way to create signage that can be seen from all angles and improve your high-street visibility."
    },
    {
      icon: "https://via.placeholder.com/100",
      title: "Pavement Signs",
      description: "Catch attention of passes by and increase footfall with free-standing pavement signs.",
      details: "Available in a range of styles, colours and sizes suitable for different weather conditions."
    },
    {
      icon: "https://via.placeholder.com/100",
      title: "Branded Gazebos",
      description: "A huge customisable blank canvas to promote your brand!",
      details: "Our tried and tested Gazebos are available in a range of colours and sizes, or supply your own for customisation."
    },
    {
      icon: "https://via.placeholder.com/100",
      title: "Branded Parasols",
      description: "Give your logo plenty of room to make a big impact in your outdoor space.",
      details: "Our tried and tested Parasols are available in a range of colours and sizes, or supply your own for customisation."
    },
    {
      icon: "https://via.placeholder.com/100",
      title: "Branded Tablecloths",
      description: "Turn a simple folding table into a professional trade stand.",
      details: "Our machine washable table covers are available in a range of colours and sizes, or supply your own for customisation."
    }
  ];

  return (
    <>
      {/* CTA Banner Section */}
      <section id="cta-banner" className="cta-banner parallax-section">
        <div className="overlay"></div>
        <div className="container">
          <h2 className="cta-title">We're here to help you<br />promote your business</h2>
        </div>
      </section>

      {/* Services Grid Section */}
      <section id="services" className="services-grid-section">
        <div className="container">
          <h2 className="section-title accent-color">What we do</h2>
          <p className="section-lead">We're here to help you promote your business, build your brand or simply just to show your individuality.</p>
          
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon">
                  <img src={service.icon} alt={service.title} />
                </div>
                <h3>{service.title}</h3>
                <p><strong>{service.description}</strong></p>
                <p>{service.details}</p>
                <a href="#" className="service-button">
                  Find out more... <i className="fas fa-angle-double-right"></i>
                </a>
              </div>
            ))}
          </div>
          
          <div className="cta-contact">
            <h3 className="accent-color">
              Let's chat about your next project.<br />
              Call or WhatsApp 01562 227 117
            </h3>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesGrid;