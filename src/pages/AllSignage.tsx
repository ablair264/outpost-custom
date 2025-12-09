import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'motion/react';
import { Frame, Shield, Map, ArrowUpRight, Palette, Hammer, Umbrella, Table } from 'lucide-react';
import SlimGridMotion from '../components/SlimGridMotion';
import { ExpandableCard } from '../components/ui/expandable-card';
import { usePageTheme } from '../contexts/ThemeContext';

const AllSignage: React.FC = () => {
  // Set purple theme for this page
  usePageTheme('purple');
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

  // Category card data with modals
  const signageCategories = [
    {
      title: 'Indoor',
      image: '/signboards/signboard1.jpg',
      galleryImages: [
        '/signboards/signboard1.jpg',
        '/signboards/signboard2.jpg',
        '/signboards/signboard3.jpg',
        '/signboards/signboard4.jpg',
      ],
      hoverItems: ['Glass Manifestation', 'Window Privacy Film'],
      serviceGroups: [
        {
          title: 'Indoor',
          items: [
            {
              label: 'Glass Manifestation',
              href: '/services/glass-manifestation',
              icon: Frame,
              description: 'Frosted, etched-effect or decorative graphics for glass surfaces. Meets building regulations while enhancing your brand.'
            },
            {
              label: 'Window Privacy Film',
              href: '/services/window-privacy-film',
              icon: Shield,
              description: 'Control visibility and light levels with decorative frosted film. Perfect for offices and commercial spaces.'
            },
          ],
        },
      ],
    },
    {
      title: 'Outdoor',
      image: '/pavement-signs/pavement1.jpg',
      galleryImages: [
        '/pavement-signs/pavement1.jpg',
        '/pavement-signs/pavement2.jpg',
        '/projecting-signs/projecting1.jpg',
        '/projecting-signs/projecting2.jpg',
        '/signboards/signboard1.jpg',
        '/signboards/signboard2.jpg',
      ],
      hoverItems: ['Signboards', 'Pavement Signs', 'Projecting Signs'],
      serviceGroups: [
        {
          title: 'Outdoor',
          items: [
            {
              label: 'Signboards',
              href: '/services/signboards',
              icon: Map,
              description: 'Premium flat-panel signage for building facades. Available in aluminium composite or built-up acrylic letters.'
            },
            {
              label: 'Pavement Signs',
              href: '/services/pavement-signs',
              icon: Frame,
              description: 'Catch attention of passers-by with free-standing A-boards. From budget eco-swing to premium chalkboard options.'
            },
            {
              label: 'Projecting Signs',
              href: '/services/projecting-signs',
              icon: ArrowUpRight,
              description: 'Wall-mounted brackets with custom panels, visible from all angles. Mix and match from 5 bracket styles.'
            },
          ],
        },
      ],
    },
    {
      title: 'Events',
      image: '/what-we-do/printing.webp',
      galleryImages: [
        '/pavement-signs/pavement3.jpg',
        '/projecting-signs/projecting3.jpg',
        '/signboards/signboard3.jpg',
        '/pavement-signs/pavement4.jpg',
      ],
      hoverItems: ['Gazebos', 'Parasols', 'Tablecloths'],
      serviceGroups: [
        {
          title: 'Events',
          items: [
            {
              label: 'Gazebos',
              href: '/services/gazebos',
              icon: Umbrella,
              description: 'Branded pop-up gazebos for events and outdoor promotions. Available in multiple sizes with custom printing.'
            },
            {
              label: 'Parasols',
              href: '/services/parasols',
              icon: Umbrella,
              description: 'Custom-printed outdoor parasols for cafes, bars, and events. Durable, weather-resistant branding.'
            },
            {
              label: 'Tablecloths',
              href: '/services/tablecloths',
              icon: Table,
              description: 'Printed tablecloths for exhibitions, events, and trade shows. Professional presentation with full-colour printing.'
            },
          ],
        },
      ],
    },
  ];

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
        @font-face {
          font-family: 'Neuzeit Grotesk Bold';
          src: url('/fonts/font/NeuzeitGro-Bol.ttf') format('truetype');
          font-weight: bold;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Neuzeit Grotesk';
          src: url('/fonts/neuzeit-grotesk-regular_freefontdownload_org/neuzeit-grotesk-regular.woff2') format('woff2'),
               url('/fonts/neuzeit-grotesk-regular_freefontdownload_org/neuzeit-grotesk-regular.woff') format('woff');
          font-weight: 400;
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
        .neuzeit-bold {
          font-family: 'Neuzeit Grotesk Bold', 'Helvetica Neue', sans-serif;
          font-weight: bold;
        }
        .grotesk-font {
          font-family: 'Neuzeit Grotesk', 'Helvetica Neue', sans-serif;
        }
        @font-face {
          font-family: 'Embossing Tape';
          src: url('/fonts/embossing_tape/embosst3.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        .embossing-font {
          font-family: 'Embossing Tape', monospace;
          letter-spacing: 0.2em;
        }
      `}</style>

      <div className="min-h-screen bg-white">
        {/* Hero Section - flows into categories */}
        <section className="relative min-h-[70vh] w-full overflow-hidden bg-[#908d9a] pb-0">
          {/* Background grid - extends behind categories */}
          <div className="absolute inset-0 h-[85%]">
            <SlimGridMotion items={signageImages} gradientColor="#221c35" />
          </div>
          {/* Overlay with gradient fade to grey */}
          <div
            className="absolute inset-0 z-[5]"
            style={{
              background: 'linear-gradient(to bottom, #383349 0%, rgba(34,28,53,0.7) 80%, #221c35 50%)'
            }}
          />

          <div className="relative z-10 flex flex-col">
            {/* Hero content */}
            <div className="flex-1 flex items-center px-6 md:px-12 lg:px-24 py-20 md:py-28">
              <div className="max-w-6xl mx-auto w-full">
                <div ref={headingRef} className="mb-8">
                  <h1 className="hearns-font text-6xl md:text-7xl lg:text-9xl tracking-tight text-white mb-4 leading-none">
                    Signage
                  </h1>
                  <div className="h-1 w-20 bg-[#908d9a] rounded-full" />
                </div>
                <div ref={contentRef} className="max-w-2xl mb-8">
                  <p className="neuzeit-bold text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed">
                    From indoor graphics to outdoor signage and event branding - We're here to help you promote your business, build your brand or simply just to show your individuality.
                  </p>
                </div>
                <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="#categories"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#221c35] text-white font-semibold text-sm hover:bg-[#383349] transition-all duration-300 shadow-lg"
                  >
                    Explore Categories
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-white/80 bg-transparent text-white font-semibold text-sm hover:bg-white/10 transition-all duration-300"
                  >
                    Get Free Quote
                  </a>
                </div>
              </div>
            </div>

            {/* Categories Section - part of same visual flow */}
            <div id="categories" className="px-4 sm:px-6 md:px-8 pb-12 md:pb-20">
              <div className="mx-auto w-full max-w-[1450px] rounded-[10px] bg-[#c1c6c8] px-4 pt-8 pb-10 shadow-[0_35px_80px_rgba(26,24,32,0.25)] sm:px-8 sm:pt-10 sm:pb-14 md:px-10 md:pt-[40px] md:pb-[60px] lg:px-[60px]">
                <div className="flex flex-col gap-5 md:gap-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
                    {signageCategories.map((category) => (
                      <div key={category.title} className="h-[240px] sm:h-[280px] md:h-[300px]">
                        <ExpandableCard
                          title={category.title}
                          src={category.image}
                          serviceGroups={category.serviceGroups}
                          galleryImages={category.galleryImages}
                          hoverItems={category.hoverItems}
                          className="h-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="bg-[#221c35] py-20 md:py-24 overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: Palette, title: 'FREE DESIGN', body: "Our in-house design team creates mockups and visuals at no extra cost. We'll bring your vision to life before production begins." },
                { icon: Shield, title: 'PRO INSTALL', body: 'Fully insured team with years of experience installing all types of signage. We handle everything from survey to fitting.' },
                { icon: Hammer, title: 'FAST TURNAROUND', body: 'Most projects completed within 5-10 working days from approval. Express service available when you need it.' },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  className="text-center text-white flex flex-col items-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
                >
                  <item.icon className="h-12 w-12 text-white" strokeWidth={1.5} />
                  <h3 className="embossing-font text-2xl md:text-[26px] uppercase mt-5 text-white">
                    {item.title}
                  </h3>
                  <p className="grotesk-font text-base md:text-[16px] leading-relaxed mt-4 max-w-xs text-white">
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 px-6 md:px-12 lg:px-24 bg-white overflow-hidden">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="hearns-font text-5xl md:text-6xl text-[#333333] mb-6 leading-tight">
              Let's Chat About Your Next Project
            </h2>
            <p className="grotesk-font text-xl text-[#333333]/70 mb-10">
              Get a free quote and design mockup for any of our signage services
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            >
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-10 py-4 rounded-lg bg-[#221c35] text-white font-semibold text-lg hover:bg-[#383349] transition-all duration-300 shadow-lg"
              >
                Book FREE Consultation
              </a>
              <a
                href="tel:01562227117"
                className="inline-flex items-center justify-center px-10 py-4 rounded-lg border-2 border-[#333333] bg-transparent text-[#333333] font-semibold text-lg hover:bg-[#333333] hover:text-white transition-all duration-300"
              >
                Call 01562 227 117
              </a>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default AllSignage;
