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
      <section id="print" className="bg-black py-48 text-center relative">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-[clamp(40px,6vw,80px)] text-center mb-5 text-white uppercase tracking-wide font-bold">
            Our Print Department
          </h2>
          <div className="w-16 h-1 bg-[#78BE20] mx-auto my-8"></div>
          <p className="text-lg text-white mb-5 max-w-3xl mx-auto">
            Bring your artwork to life with our in-house Digital Printing.
          </p>
          <p className="text-white mb-8 max-w-3xl mx-auto">
            We've got in-house printers so we can deliver a speedy, reliable service. Our production team can manage the demanding deadlines and technical challenges to ensure you get printed products that reflect your business in the best possible way.
          </p>

          <a
            href="#"
            className="inline-block px-10 py-4 bg-transparent text-white border-2 border-white no-underline rounded transition-all duration-300 hover:bg-[#78BE20] hover:border-[#78BE20] hover:text-black uppercase tracking-[2px] text-sm font-semibold mt-4"
          >
            VIEW ALL PRINT PRODUCTS
          </a>
        </div>
      </section>

      {/* Instagram Section */}
      <section id="instagram" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-[clamp(40px,6vw,80px)] text-center mb-5 text-black uppercase tracking-wide font-bold">
            Our work speaks for itself.
          </h2>
          <div className="w-16 h-1 bg-[#78BE20] mx-auto my-8"></div>
          <p className="text-center text-lg mb-5">
            Designed by artists. Precision-cut by machines. Applied by professionals.
          </p>
          <p className="text-center text-lg mb-5">
            Enjoy our most recent projects from our Instagram feed…
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-16">
            {instagramItems.map((src, index) => (
              <div key={index} className="relative overflow-hidden aspect-square">
                <img
                  src={src}
                  alt={`Instagram post ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default PrintAndInstagram;