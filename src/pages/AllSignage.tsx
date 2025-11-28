import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import SlimGridMotion from '../components/SlimGridMotion';

const AllSignage: React.FC = () => {
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Combine all signage images
  const signageImages = [
    '/pavement-signs/pavement1.jpg',
    '/projecting-signs/projecting1.jpg',
    '/vehicle-signwriting/vehicle1.jpg',
    '/pavement-signs/pavement2.jpg',
    '/projecting-signs/projecting2.jpg',
    '/vehicle-signwriting/vehicle2.jpg',
    '/pavement-signs/pavement3.jpg',
    '/projecting-signs/projecting3.jpg',
    '/vehicle-signwriting/vehicle3.jpg',
    '/pavement-signs/pavement4.jpg',
    '/projecting-signs/projecting4.jpg',
    '/vehicle-signwriting/vehicle4.jpg',
    '/pavement-signs/pavement1.jpg',
    '/projecting-signs/projecting1.jpg',
    '/vehicle-signwriting/vehicle1.jpg',
    '/pavement-signs/pavement2.jpg',
    '/projecting-signs/projecting2.jpg',
    '/vehicle-signwriting/vehicle2.jpg',
    '/pavement-signs/pavement3.jpg',
    '/projecting-signs/projecting3.jpg',
    '/vehicle-signwriting/vehicle3.jpg',
  ];

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

  const services = [
    {
      title: 'Pavement Signs',
      description: 'Catch attention of passers by and increase footfall with free-standing pavement signs available in a range of styles.',
      link: '/services/pavement-signs',
      icon: '📋',
      features: ['Eco Swing A-boards', 'Custom vinyl graphics', 'Weather resistant', 'From £52 + VAT']
    },
    {
      title: 'Projecting Signs',
      description: 'Mix and match from our range of wall-mounted brackets and customisable panels for signage that can be seen from all angles.',
      link: '/services/projecting-signs',
      icon: '🏷️',
      features: ['5 bracket styles', '3 panel types', 'Professional installation', 'From £52 + VAT']
    },
    {
      title: 'Vehicle Signwriting',
      description: 'Turn any vehicle into a promotional tool with custom vinyl decals. Get spotted on the road or parked on any job.',
      link: '/services/vehicle-signwriting',
      icon: '🚐',
      features: ['Full colour printing', 'Magnetic options', 'Professional fitting', 'From £200']
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Black */}
      <section className="relative h-[70vh] w-full overflow-hidden bg-black">
        <div className="absolute inset-0">
          <SlimGridMotion items={signageImages} gradientColor="black" />
        </div>

        <div className="absolute inset-0 bg-black/65 z-[5]" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/50 via-black/25 to-transparent backdrop-blur-sm z-[5]" />

        <div className="relative z-10 h-full flex items-center px-6 md:px-12 lg:px-24">
          <div className="max-w-5xl mx-auto w-full">
            <div ref={headingRef} className="mb-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-4 leading-[0.95]">
                All Signage<br />Services
              </h1>
              <div className="h-1 w-20 bg-[#6da71d] rounded-full" />
            </div>

            <div ref={contentRef} className="max-w-2xl mb-10">
              <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed">
                We are here to help you promote your business, build your brand or simply just to show your individuality.
              </p>
            </div>

            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
              <a
                href="#services"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#6da71d] text-white font-semibold text-base hover:bg-[#7dbf23] transition-all duration-300 shadow-lg shadow-[#6da71d]/30"
              >
                Explore Services
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-white bg-transparent text-white font-semibold text-base hover:bg-white/10 transition-all duration-300"
              >
                Get a Quote
              </a>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black z-[6]" />
      </section>

      {/* Services Grid - White */}
      <section id="services" className="py-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 mb-6">
              Our Signage Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From pavement signs to vehicle graphics, we have everything you need to promote your business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <a
                key={index}
                href={service.link}
                className="group relative overflow-hidden rounded-3xl bg-gray-50 border-2 border-gray-200 p-8 transition-all duration-300 hover:border-[#6da71d] hover:shadow-xl hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#6da71d]/0 to-[#6da71d]/0 group-hover:from-[#6da71d]/5 group-hover:to-[#6da71d]/10 transition-all duration-300" />

                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className="text-5xl">{service.icon}</div>
                    <div className="text-6xl font-black text-gray-100">0{index + 1}</div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#6da71d] transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-[#6da71d] mt-0.5">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center text-[#6da71d] font-semibold">
                    Learn More
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Gray */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Why choose Outpost Signs?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Expert signage solutions with professional installation and design services
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Free Design Service</h3>
              <p className="text-gray-600">
                Our in-house design team will create mockups and visuals at no extra cost
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Professional Installation</h3>
              <p className="text-gray-600">
                Fully insured team with years of experience installing all types of signage
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Turnaround</h3>
              <p className="text-gray-600">
                Most projects completed within 5-10 working days from approval
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA - Black */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Let us chat about your next project
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Get a free quote and design mockup for any of our signage services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-[#6da71d] text-white font-semibold text-lg hover:bg-[#7dbf23] transition-all duration-300 shadow-lg shadow-[#6da71d]/30"
            >
              Book FREE Consultation
            </a>
            <a
              href="tel:01562227117"
              className="inline-flex items-center justify-center px-10 py-4 rounded-full border-2 border-white/30 bg-transparent text-white font-semibold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300"
            >
              Call 01562 227 117
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AllSignage;
