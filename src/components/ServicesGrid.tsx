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
      <section
        id="cta-banner"
        className="py-48 bg-cover bg-center bg-fixed text-center relative"
        style={{ backgroundImage: "url('parallax-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h2 className="text-white text-[clamp(40px,6vw,80px)] leading-tight font-semibold">
            We're here to help you<br />promote your business
          </h2>
        </div>
      </section>

      {/* Services Grid Section */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-[clamp(40px,6vw,80px)] text-center mb-5 text-[#78BE20] uppercase tracking-wide font-bold">
            What we do
          </h2>
          <p className="text-center mb-10 text-lg text-gray-700 max-w-3xl mx-auto">
            We're here to help you promote your business, build your brand or simply just to show your individuality.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-16">
            {services.map((service, index) => (
              <div
                key={index}
                className="p-12 shadow-[0_0_20px_rgba(159,164,176,0.3)] text-center transition-all duration-300 hover:shadow-[0_0_30px_rgba(159,164,176,0.5)] bg-white"
              >
                <div className="mb-8">
                  <img src={service.icon} alt={service.title} className="w-20 h-20 mx-auto" />
                </div>
                <h3 className="text-[#78BE20] mb-5 text-[22px] font-semibold">{service.title}</h3>
                <p className="mb-4 text-gray-600 leading-relaxed"><strong>{service.description}</strong></p>
                <p className="mb-4 text-gray-600 leading-relaxed">{service.details}</p>
                <a
                  href="#"
                  className="inline-block px-8 py-3 bg-[#78BE20] text-white no-underline rounded transition-all duration-300 hover:bg-black hover:text-[#78BE20] text-sm font-semibold tracking-wide"
                >
                  Find out more... <i className="fas fa-angle-double-right ml-1"></i>
                </a>
              </div>
            ))}
          </div>

          <div className="text-center mt-20">
            <h3 className="text-[25px] leading-relaxed tracking-tight text-[#78BE20]">
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