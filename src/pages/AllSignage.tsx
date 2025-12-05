import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Frame, Shield, Map, ArrowUpRight, Palette, Hammer, Umbrella, Table } from 'lucide-react';
import SlimGridMotion from '../components/SlimGridMotion';

const AllSignage: React.FC = () => {
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

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
    tl.fromTo(headingRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, delay: 0.3 })
    .fromTo(contentRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.6')
    .fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.4');
  }, []);

  const indoorServices = [
    {
      title: 'Glass Manifestation',
      description: 'Frosted, etched-effect or decorative graphics for glass surfaces, meeting building regulations and enhancing branding.',
      link: '/services/glass-manifestation',
      Icon: Frame,
      category: 'Indoor'
    },
    {
      title: 'Window Privacy Film',
      description: 'Control visibility and light levels with decorative frosted film, perfect for offices and commercial spaces.',
      link: '/services/window-privacy-film',
      Icon: Shield,
      category: 'Indoor'
    }
  ];

  const outdoorServices = [
    {
      title: 'Signboards',
      description: 'Premium flat-panel signage for building facades, available in aluminium composite or built-up acrylic letters.',
      link: '/services/signboards',
      Icon: Map,
      category: 'Outdoor'
    },
    {
      title: 'Pavement Signs',
      description: 'Catch attention of passers by with free-standing A-boards, from budget eco-swing to premium chalkboard options.',
      link: '/services/pavement-signs',
      Icon: ArrowUpRight,
      category: 'Outdoor'
    },
    {
      title: 'Projecting Signs',
      description: 'Wall-mounted brackets with custom panels, visible from all angles. Mix and match from 5 bracket styles.',
      link: '/services/projecting-signs',
      Icon: Hammer,
      category: 'Outdoor'
    }
  ];

  const eventServices = [
    {
      title: 'Gazebos',
      description: 'Branded pop-up gazebos for events and outdoor promotions, available in multiple sizes with custom printing.',
      link: '/services/gazebos',
      Icon: Umbrella,
      category: 'Events'
    },
    {
      title: 'Parasols',
      description: 'Custom-printed outdoor parasols for cafés, bars, and events. Durable, weather-resistant branding.',
      link: '/services/parasols',
      Icon: Umbrella,
      category: 'Events'
    },
    {
      title: 'Tablecloths',
      description: 'Printed tablecloths for exhibitions, events, and trade shows. Professional presentation with full-color printing.',
      link: '/services/tablecloths',
      Icon: Table,
      category: 'Events'
    }
  ];

  const allServices = [...indoorServices, ...outdoorServices, ...eventServices];

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'Hearns';
          src: url('/fonts/Hearns/Hearns.woff') format('woff');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Smilecake';
          src: url('/fonts/smilecake/Smilecake.otf') format('opentype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Aldivaro Stamp';
          src: url('/fonts/aldivaro/Aldivaro Stamp Demo.otf') format('opentype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        .hearns-font {
          font-family: 'Hearns', Georgia, serif;
          font-weight: normal;
        }
        .smilecake-font {
          font-family: 'Smilecake', cursive;
          font-weight: normal;
        }
        .aldivaro-stamp {
          font-family: 'Aldivaro Stamp', serif;
          font-weight: normal;
        }
      `}</style>

      <div className="min-h-screen bg-white">
        {/* Hero Section - Palette A */}
        <section className="relative h-[70vh] w-full overflow-hidden bg-[#333333]">
          <div className="absolute inset-0">
            <SlimGridMotion items={signageImages} gradientColor="#333333" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#333333]/80 via-[#333333]/50 to-transparent z-[5]" />

          <div className="relative z-10 h-full flex items-center px-6 md:px-12 lg:px-24">
            <div className="max-w-6xl mx-auto w-full">
              <div ref={headingRef} className="mb-8">
                <h1 className="hearns-font text-6xl md:text-7xl lg:text-8xl tracking-tight text-white mb-6 leading-tight">
                  All Signage<br />Services
                </h1>
                <div className="h-1.5 w-24 bg-[#64a70b] rounded-full" />
              </div>
              <div ref={contentRef} className="max-w-2xl mb-10">
                <p className="text-2xl md:text-3xl text-[#c1c6c8] font-light leading-relaxed">
                  From indoor graphics to outdoor signage and event branding
                </p>
              </div>
              <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#services"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#64a70b] text-white font-semibold text-base hover:bg-[#75b81c] transition-all duration-300 shadow-lg"
                >
                  Explore Services
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-white bg-transparent text-white font-semibold text-base hover:bg-white/10 transition-all duration-300"
                >
                  Get Free Quote
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Indoor Signage */}
        <section className="py-20 px-6 md:px-12 lg:px-24 bg-white relative">
          <div className="absolute top-10 right-10 opacity-10 pointer-events-none">
            <img src="/Website Assets/Circle_Grey.png" alt="" className="w-40 h-40" />
          </div>
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="smilecake-font text-5xl md:text-6xl text-[#333333] mb-4">
                Indoor Signage
              </h2>
              <div className="h-1 w-20 bg-[#64a70b]" />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {indoorServices.map((service, index) => {
                const Icon = service.Icon;
                return (
                  <a
                    key={index}
                    href={service.link}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#f8f8f8] to-white p-8 md:p-10 border-2 border-[#c1c6c8]/30 transition-all duration-300 hover:border-[#64a70b] hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#64a70b]/0 to-[#64a70b]/0 group-hover:from-[#64a70b]/5 group-hover:to-[#64a70b]/10 transition-all duration-300" />

                    <div className="relative">
                      <div className="flex items-start justify-between mb-6">
                        <div className="w-16 h-16 rounded-full bg-[#64a70b]/10 flex items-center justify-center group-hover:bg-[#64a70b]/20 transition-all duration-300">
                          <Icon className="w-8 h-8 text-[#64a70b]" />
                        </div>
                        <span className="aldivaro-stamp text-5xl text-[#333333]/10 group-hover:text-[#64a70b]/20 transition-all duration-300">
                          0{index + 1}
                        </span>
                      </div>

                      <h3 className="smilecake-font text-3xl text-[#333333] mb-4 group-hover:text-[#64a70b] transition-colors">
                        {service.title}
                      </h3>

                      <p className="text-lg text-[#333333]/80 leading-relaxed mb-6">
                        {service.description}
                      </p>

                      <div className="flex items-center text-[#64a70b] font-semibold">
                        Learn More
                        <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Outdoor Signage - Textured Background */}
        <section
          className="py-20 px-6 md:px-12 lg:px-24 bg-cover bg-center relative"
          style={{ backgroundImage: 'url(/Website Assets/ConcreteTexture.jpg)' }}
        >
          <div className="absolute inset-0 bg-[#183028]/90" />
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="hearns-font text-5xl md:text-6xl text-white mb-4">
                Outdoor Signage
              </h2>
              <div className="h-1 w-20 bg-[#64a70b]" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {outdoorServices.map((service, index) => {
                const Icon = service.Icon;
                return (
                  <a
                    key={index}
                    href={service.link}
                    className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm p-8 border-2 border-white/10 transition-all duration-300 hover:border-[#64a70b] hover:bg-white/10 hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#64a70b]/0 to-[#64a70b]/0 group-hover:from-[#64a70b]/10 group-hover:to-[#64a70b]/20 transition-all duration-300" />

                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-[#64a70b]/20 flex items-center justify-center mb-6 group-hover:bg-[#64a70b]/30 transition-all duration-300">
                        <Icon className="w-7 h-7 text-[#64a70b]" />
                      </div>

                      <h3 className="smilecake-font text-2xl text-white mb-4 group-hover:text-[#64a70b] transition-colors">
                        {service.title}
                      </h3>

                      <p className="text-[#c1c6c8] leading-relaxed mb-6">
                        {service.description}
                      </p>

                      <div className="flex items-center text-[#64a70b] font-semibold">
                        Learn More
                        <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Event Signage */}
        <section className="py-20 px-6 md:px-12 lg:px-24 bg-white relative">
          <div className="absolute bottom-10 left-10 opacity-10 pointer-events-none">
            <img src="/Website Assets/Arrow_Green.png" alt="" className="w-32 h-32 rotate-45" />
          </div>
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="smilecake-font text-5xl md:text-6xl text-[#333333] mb-4">
                Event Signage
              </h2>
              <div className="h-1 w-20 bg-[#64a70b]" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {eventServices.map((service, index) => {
                const Icon = service.Icon;
                return (
                  <a
                    key={index}
                    href={service.link}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#f8f8f8] to-white p-8 border-2 border-[#c1c6c8]/30 transition-all duration-300 hover:border-[#64a70b] hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#64a70b]/0 to-[#64a70b]/0 group-hover:from-[#64a70b]/5 group-hover:to-[#64a70b]/10 transition-all duration-300" />

                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-[#64a70b]/10 flex items-center justify-center mb-6 group-hover:bg-[#64a70b]/20 transition-all duration-300">
                        <Icon className="w-7 h-7 text-[#64a70b]" />
                      </div>

                      <h3 className="smilecake-font text-2xl text-[#333333] mb-4 group-hover:text-[#64a70b] transition-colors">
                        {service.title}
                      </h3>

                      <p className="text-[#333333]/80 leading-relaxed mb-6">
                        {service.description}
                      </p>

                      <div className="flex items-center text-[#64a70b] font-semibold">
                        Learn More
                        <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Choose Us - Textured Background */}
        <section
          className="py-24 px-6 md:px-12 lg:px-24 bg-cover bg-center relative"
          style={{ backgroundImage: 'url(/Website Assets/BlackTextureBackground.jpg)' }}
        >
          <div className="absolute inset-0 bg-black/85" />
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="hearns-font text-5xl md:text-6xl text-white mb-6">
                Why Choose Outpost Signs?
              </h2>
              <div className="h-1 w-24 bg-[#64a70b] mx-auto" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#64a70b]/20 flex items-center justify-center">
                  <Palette className="w-8 h-8 text-[#64a70b]" />
                </div>
                <h3 className="smilecake-font text-2xl text-white mb-4">Free Design Service</h3>
                <p className="text-[#c1c6c8] leading-relaxed">
                  Our in-house design team creates mockups and visuals at no extra cost
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#64a70b]/20 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-[#64a70b]" />
                </div>
                <h3 className="smilecake-font text-2xl text-white mb-4">Professional Installation</h3>
                <p className="text-[#c1c6c8] leading-relaxed">
                  Fully insured team with years of experience installing all types of signage
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#64a70b]/20 flex items-center justify-center">
                  <Hammer className="w-8 h-8 text-[#64a70b]" />
                </div>
                <h3 className="smilecake-font text-2xl text-white mb-4">Fast Turnaround</h3>
                <p className="text-[#c1c6c8] leading-relaxed">
                  Most projects completed within 5-10 working days from approval
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="hearns-font text-5xl md:text-6xl text-[#333333] mb-6 leading-tight">
              Let's Chat About Your Next Project
            </h2>
            <p className="text-xl text-[#333333]/70 mb-10">
              Get a free quote and design mockup for any of our signage services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-10 py-4 rounded-lg bg-[#64a70b] text-white font-semibold text-lg hover:bg-[#75b81c] transition-all duration-300 shadow-lg"
              >
                Book FREE Consultation
              </a>
              <a
                href="tel:01562227117"
                className="inline-flex items-center justify-center px-10 py-4 rounded-lg border-2 border-[#333333] bg-transparent text-[#333333] font-semibold text-lg hover:bg-[#333333] hover:text-white transition-all duration-300"
              >
                Call 01562 227 117
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AllSignage;
