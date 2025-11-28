import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import SlimGridMotion from '../components/SlimGridMotion';

const ProjectingSigns: React.FC = () => {
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Projecting signs images for SlimGridMotion
  const projectingImages = Array.from({ length: 21 }, (_, index) => {
    const imageNum = (index % 4) + 1;
    return `/projecting-signs/projecting${imageNum}.jpg`;
  });

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      headingRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, delay: 0.3 }
    )
    .fromTo(
      contentRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.9 },
      '-=0.6'
    )
    .fromTo(
      ctaRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.4'
    );
  }, []);

  const steps = [
    {
      title: 'Get a FREE quote',
      description: 'Mix and match one of our bracket styles with one of our standard panel sizes, then add customisation.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Design Stage',
      description: 'Send your artwork for a proof, or our design team will create visuals of how your projecting sign could look on your premises.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Approve your order',
      description: 'After approval, we will get it into production (5-10 working days). You can also book our installation team to fit your projecting sign.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Order up!',
      description: 'Collect from Kidderminster or we can arrange posting (Delivery from £10). Booked installers? Our team will meet you on site.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    }
  ];

  const brackets = [
    {
      name: 'Victorian Bracket',
      description: 'Classic ornate design perfect for traditional shopfronts and heritage buildings',
      specs: ['Heavy-duty steel construction', 'Powder-coated finish', 'Supports panels up to 900mm', 'Available in black or white'],
      price: 'From £85 + VAT',
    },
    {
      name: 'Traditional Bracket',
      description: 'Timeless scrollwork design that complements period properties',
      specs: ['Robust steel frame', 'Weather-resistant coating', 'Supports panels up to 800mm', 'Multiple colour options'],
      price: 'From £75 + VAT',
    },
    {
      name: 'Scroll Bracket',
      description: 'Elegant curved design for a sophisticated appearance',
      specs: ['Durable construction', 'Rust-proof finish', 'Supports panels up to 700mm', 'Custom colours available'],
      price: 'From £70 + VAT',
    },
    {
      name: 'Contemporary Bracket',
      description: 'Modern minimalist design for contemporary businesses',
      specs: ['Sleek steel design', 'Powder-coated finish', 'Supports panels up to 1000mm', 'Available in multiple finishes'],
      price: 'From £65 + VAT',
    },
    {
      name: 'Flange / Blade Bracket',
      description: 'Simple and cost-effective mounting solution',
      specs: ['Basic steel construction', 'Standard finish', 'Supports panels up to 600mm', 'Most economical option'],
      price: 'From £52 + VAT',
    },
  ];

  const panels = [
    {
      name: 'Aluminium Composite',
      description: 'Lightweight yet durable panel with excellent weather resistance',
      features: ['Lightweight but rigid', 'Excellent flatness', 'Weather resistant', 'Easy to customise', 'Long-lasting finish'],
      bestFor: 'Modern designs and full-colour printing',
    },
    {
      name: 'High Density Foam (HDU)',
      description: 'Premium carved effect with traditional appearance',
      features: ['Can be routed for 3D effect', 'Paintable surface', 'Traditional look', 'Excellent durability', 'Lightweight material'],
      bestFor: 'Traditional signage with raised lettering',
    },
    {
      name: 'Acrylic Faced',
      description: 'Illuminated option for maximum visibility day and night',
      features: ['Internally illuminated', 'Even light distribution', 'Eye-catching at night', 'Professional appearance', 'Low energy LED lighting'],
      bestFor: 'Businesses wanting 24/7 visibility',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Black */}
      <section className="relative h-[70vh] w-full overflow-hidden bg-black">
        <div className="absolute inset-0">
          <SlimGridMotion items={projectingImages} gradientColor="black" />
        </div>

        <div className="absolute inset-0 bg-black/70 z-[5]" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/50 via-black/25 to-transparent backdrop-blur-sm z-[5]" />

        <div className="relative z-10 h-full flex items-center px-6 md:px-12 lg:px-24">
          <div className="max-w-5xl mx-auto w-full">
            <div ref={headingRef} className="mb-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-4 leading-[0.95]">
                Attract customers<br />from all angles
              </h1>
              <div className="h-1 w-20 bg-[#6da71d] rounded-full" />
            </div>

            <div ref={contentRef} className="max-w-2xl mb-10">
              <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed">
                Our projecting signs come in a range of styles, shapes and sizes. Mix and match your bracket and panel, then chat to our design team.
              </p>
            </div>

            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#6da71d] text-white font-semibold text-base hover:bg-[#7dbf23] transition-all duration-300 shadow-lg shadow-[#6da71d]/30"
              >
                How It Works
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-white bg-transparent text-white font-semibold text-base hover:bg-white/10 transition-all duration-300"
              >
                Get FREE Quote
              </a>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black z-[6]" />
      </section>

      {/* How It Works Section - White */}
      <section id="how-it-works" className="py-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 mb-3">
              How does it work?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
              Our projecting signs come in a range of styles and sizes to suit your premises
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {steps.map((step, idx) => (
              <div key={idx} className="text-center">
                {/* Circular Progress Icon */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="#6da71d"
                      strokeWidth="8"
                      strokeDasharray={`${((idx + 1) / 4) * 351.86} 351.86`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-[#6da71d] rounded-full flex items-center justify-center text-white">
                      {step.icon}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {idx + 1}. {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Made Section - Gray */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                Custom made for you
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                All of our projecting signs can be made to your exact specifications and are manufactured using the best materials and then finished to a very high standard.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Projecting signs are designed primarily for outdoor usage and are robustly built to withstand all weathers.
              </p>
              <div className="space-y-4">
                {[
                  'Mix and match brackets and panels',
                  'Manufactured to exact specifications',
                  'Weather-resistant construction',
                  'Professional installation available'
                ].map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#6da71d] flex items-center justify-center mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-base text-gray-700 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl bg-white border border-gray-200 p-12 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏷️</div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">Projecting Signs</div>
                  <div className="text-3xl font-black text-[#6da71d]">From £52 + VAT</div>
                  <div className="text-sm text-gray-600 mt-3">Our cheapest projecting sign solution!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Choose Bracket Section - Black */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Choose your bracket
            </h2>
            <div className="h-1 w-20 bg-[#6da71d] mx-auto rounded-full mb-8" />
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Select from our range of bracket styles to match your building aesthetic
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brackets.map((bracket, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-[#6da71d]/50 transition-all duration-300">
                <h3 className="text-2xl font-bold text-white mb-3">{bracket.name}</h3>
                <p className="text-white/70 leading-relaxed mb-6">{bracket.description}</p>

                <ul className="space-y-3 mb-6">
                  {bracket.specs.map((spec, specIdx) => (
                    <li key={specIdx} className="flex items-start gap-2">
                      <span className="text-[#6da71d] mt-1">•</span>
                      <span className="text-white/80 text-sm">{spec}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-white/10">
                  <div className="text-2xl font-bold text-[#6da71d]">{bracket.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Choose Panel Section - White */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Choose your panel
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Select the perfect panel material for your signage needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {panels.map((panel, idx) => (
              <div key={idx} className={`rounded-3xl p-8 ${idx === 2 ? 'bg-[#6da71d]/5 border-2 border-[#6da71d]' : 'bg-gray-50 border-2 border-gray-200'}`}>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{panel.name}</h3>
                <p className="text-gray-700 leading-relaxed mb-6">{panel.description}</p>

                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Features:</h4>
                  <ul className="space-y-2">
                    {panel.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="flex items-start gap-2">
                        <span className="text-[#6da71d] text-xl flex-shrink-0">✓</span>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm font-bold text-gray-900 mb-1">Best for:</div>
                  <div className="text-gray-700">{panel.bestFor}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Team Section - Gray */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Professional installation team
          </h2>
          <div className="h-1 w-20 bg-[#6da71d] mx-auto rounded-full mb-8" />
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed mb-12">
            Our installation team are professional, fully insured, and experienced in working at height. Whether you need wall mounting or overhead installation, we have got you covered.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Professional</h3>
              <p className="text-gray-700">
                Years of experience installing projecting signs safely
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fully Insured</h3>
              <p className="text-gray-700">
                Complete peace of mind with comprehensive insurance coverage
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <div className="text-4xl mb-4">🏗️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Height Certified</h3>
              <p className="text-gray-700">
                Qualified to work at height with proper safety equipment
              </p>
            </div>
          </div>

          <div className="mt-12 bg-white border-2 border-[#6da71d] rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Building regulations and planning permission
            </h3>
            <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
              We can advise on building regulations and planning permission requirements for your projecting sign. Requirements vary by location and building type, so get in touch to discuss your specific needs.
            </p>
          </div>
        </div>
      </section>

      {/* Types of Customisation Section - Black */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Types of customisation
            </h2>
            <div className="h-1 w-20 bg-[#6da71d] mx-auto rounded-full mb-8" />
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Choose between printed vinyl for full-colour designs or cut vinyl for clean, professional lettering
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Printed Vinyl */}
            <div className="bg-white/5 border-2 border-white/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Printed Vinyl</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-[#6da71d] text-2xl flex-shrink-0">✓</span>
                  <span className="text-white/80">Full colour printing for complex designs and photos</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#6da71d] text-2xl flex-shrink-0">✓</span>
                  <span className="text-white/80">Perfect for logos with gradients and multiple colours</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#6da71d] text-2xl flex-shrink-0">✓</span>
                  <span className="text-white/80">Can include photographs and intricate graphics</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#6da71d] text-2xl flex-shrink-0">✓</span>
                  <span className="text-white/80">Available in gloss or matt finish</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 text-2xl flex-shrink-0">✗</span>
                  <span className="text-white/50">Slightly shorter lifespan than cut vinyl</span>
                </li>
              </ul>
            </div>

            {/* Cut Vinyl */}
            <div className="bg-[#6da71d]/10 border-2 border-[#6da71d] rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Cut Vinyl</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-[#6da71d] text-2xl flex-shrink-0">✓</span>
                  <span className="text-white/80">Longest lasting option (5-7 years outdoor)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#6da71d] text-2xl flex-shrink-0">✓</span>
                  <span className="text-white/80">Sharp, clean edges for professional lettering</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#6da71d] text-2xl flex-shrink-0">✓</span>
                  <span className="text-white/80">Available in 100+ solid colours plus special finishes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#6da71d] text-2xl flex-shrink-0">✓</span>
                  <span className="text-white/80">Metallic, reflective, and fluorescent options available</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 text-2xl flex-shrink-0">✗</span>
                  <span className="text-white/50">Not suitable for complex multi-colour designs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - White */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Ready to stand out?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Get a free quote for your custom projecting sign
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-[#6da71d] text-white font-semibold text-lg hover:bg-[#7dbf23] transition-all duration-300 shadow-lg shadow-[#6da71d]/30"
            >
              Get FREE Quote
            </a>
            <a
              href="tel:01562227117"
              className="inline-flex items-center justify-center px-10 py-4 rounded-full border-2 border-gray-300 bg-transparent text-gray-900 font-semibold text-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
            >
              Call 01562 227 117
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectingSigns;
