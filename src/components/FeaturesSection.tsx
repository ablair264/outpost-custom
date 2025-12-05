import React from 'react';

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="bg-black py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="text-center text-white">
            <div className="w-20 h-20 mx-auto mb-5 border-2 border-[#78BE20] rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[#78BE20] group">
              <i className="fas fa-arrows-alt text-[40px] text-[#78BE20] transition-all duration-300 group-hover:text-white"></i>
            </div>
            <h3 className="text-[#78BE20] mb-4 text-lg tracking-wide">MADE TO ORDER</h3>
            <p className="text-sm leading-relaxed">Our business is founded on manufacturing products that are exactly to your specification. Mix and match products with bespoke customisation and creative design.</p>
          </div>

          <div className="text-center text-white">
            <div className="w-20 h-20 mx-auto mb-5 border-2 border-[#78BE20] rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[#78BE20] group">
              <i className="fas fa-clock text-[40px] text-[#78BE20] transition-all duration-300 group-hover:text-white"></i>
            </div>
            <h3 className="text-[#78BE20] mb-4 text-lg tracking-wide">FAST TURN AROUND</h3>
            <p className="text-sm leading-relaxed">With a dedicated in-house production team specialising in each stage of customisation, we have the ability to meet your deadlines with express service when needed.</p>
          </div>

          <div className="text-center text-white">
            <div className="w-20 h-20 mx-auto mb-5 border-2 border-[#78BE20] rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[#78BE20] group">
              <i className="fas fa-desktop text-[40px] text-[#78BE20] transition-all duration-300 group-hover:text-white"></i>
            </div>
            <h3 className="text-[#78BE20] mb-4 text-lg tracking-wide">IN-HOUSE DESIGN SERVICE</h3>
            <p className="text-sm leading-relaxed">With all orders we offer an initial design consultation and give you an idea of how your customisation will look. Our qualified graphic designers can also provide a full design service.</p>
          </div>

          <div className="text-center text-white">
            <div className="w-20 h-20 mx-auto mb-5 border-2 border-[#78BE20] rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[#78BE20] group">
              <i className="fas fa-check-square text-[40px] text-[#78BE20] transition-all duration-300 group-hover:text-white"></i>
            </div>
            <h3 className="text-[#78BE20] mb-4 text-lg tracking-wide">TRUSTED MATERIALS</h3>
            <p className="text-sm leading-relaxed">We use trusted brands to make sure our customers only get the best that is available.</p>
            <h4 className="text-white mt-5 text-base"><strong>Recycled & Sustainable options are available across all our products & services</strong></h4>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;