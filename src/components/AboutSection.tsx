import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="min-h-screen py-20 bg-white relative rounded-t-3xl overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-[clamp(40px,6vw,80px)] text-center mb-5 text-[#78BE20] uppercase tracking-wide font-bold">
          Outpost Custom
        </h2>
        <p className="text-center mb-16 text-lg text-gray-600 italic opacity-80">
          Warning: Original Content
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-16 items-center max-w-6xl mx-auto">
          <div>
            <h3 className="text-[28px] mb-5 text-black font-semibold">
              We are Customisation Specialists.
            </h3>
            <p className="mb-5 text-gray-600 leading-relaxed">
              Based out of our industrial unit in Kidderminster, Worcestershire, Outpost Custom has fast made a name for itself in the world of signage and workwear.
            </p>
            <p className="mb-5 text-gray-600 leading-relaxed">
              We offer a wide range of design, print, clothing and signage solutions to businesses and individuals across the Midlands.
            </p>

            <h3 className="text-[28px] mb-5 text-black font-semibold">
              We don't cut corners… unless they are on signs.
            </h3>
            <p className="mb-5 text-gray-600 leading-relaxed">
              Our extensive knowledge and experience means we're able to recommend the products and services that best suit your budget. We will advise and guide you on every aspect of the process whether you're a small business or a national company.
            </p>
            <p className="mb-5 text-gray-600 leading-relaxed">
              We believe that by going the extra mile, and genuinely caring about every business who walks though our doors, has been crucial to our success.
            </p>
          </div>
          <div>
            <img
              src="https://via.placeholder.com/500x500"
              alt="Outpost Shop External"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;