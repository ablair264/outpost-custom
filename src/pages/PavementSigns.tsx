import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import SlimGridMotion from '../components/SlimGridMotion';

const PavementSigns: React.FC = () => {
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const pavementImages = Array.from({ length: 21 }, (_, index) => {
    const imageNum = (index % 4) + 1;
    return `/pavement-signs/pavement${imageNum}.jpg`;
  });

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(headingRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, delay: 0.3 })
    .fromTo(contentRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.6')
    .fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.4');
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Black Background */}
      <section className="relative h-[70vh] w-full overflow-hidden bg-black">
        <div className="absolute inset-0">
          <SlimGridMotion items={pavementImages} gradientColor="black" />
        </div>
        <div className="absolute inset-0 bg-black/70 z-[5]" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/50 via-black/25 to-transparent backdrop-blur-sm z-[5]" />

        <div className="relative z-10 h-full flex items-center px-6 md:px-12 lg:px-24">
          <div className="max-w-5xl mx-auto w-full text-center">
            <div ref={headingRef} className="mb-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-4 leading-tight">
                Pavement Signs
              </h1>
              <div className="h-1 w-20 bg-[#6da71d] rounded-full mx-auto" />
            </div>
            <div ref={contentRef} className="max-w-2xl mb-10 mx-auto">
              <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed">
                Capture the attention of passers by
              </p>
            </div>
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#how-it-works" className="inline-flex items-center justify-center px-8 py-4 rounded-md bg-[#6da71d] text-white font-semibold text-base hover:bg-[#7dbf23] transition-all duration-300">
                How It Works
              </a>
              <a href="/contact" className="inline-flex items-center justify-center px-8 py-4 rounded-md border-2 border-white bg-transparent text-white font-semibold text-base hover:bg-white/10 transition-all duration-300">
                Get FREE Quote
              </a>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-white z-[6]" />
      </section>

      {/* How It Works - White Background */}
      <section id="how-it-works" className="py-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4">How's it work?</h2>
            <p className="text-lg text-gray-700">Our pavement signs come in a range of styles and sizes.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                num: '1',
                title: 'Get a FREE quote',
                desc: 'Choose from our range of pavement signs or A-boards.',
                detail: 'Already have a frame but need new customisation? Drop off your pavement sign to us for our design team to look at.',
                buttons: ['GET SOME ADVICE FROM OUR TEAM', 'BOOK A FREE CONSULTATION']
              },
              {
                num: '2',
                title: 'Design Stage',
                desc: 'Already have your artwork ready? Send it to our design team for a proof.',
                detail: 'Need help with the design? Send us your logo and our design team will put together a visual of how your pavement sign could look',
                detail2: 'Need a logo designed first? Our in-house design team can help with that.',
                buttons: ['EMAIL OUR DESIGN TEAM']
              },
              {
                num: '3',
                title: 'Approve your order',
                desc: 'After you approve your order, we will get it into production which usually takes 5-10 working days.',
                detail: 'Got a deadline and need your order sooner? Chat to our team – We will do our best to make sure you have got everything you need in time!'
              },
              {
                num: '4',
                title: 'Order up!',
                desc: 'We will let you know when your order is ready to collect from our shop in Kidderminster or we can arrange posting your order to you (Delivery from £10).'
              }
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="64" cy="64" r="56" fill="none" stroke="#e5e7eb" strokeWidth="8" />
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
                    <div className="w-20 h-20 bg-[#6da71d] rounded-full flex items-center justify-center">
                      {idx === 0 && <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>}
                      {idx === 1 && <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd"/></svg>}
                      {idx === 2 && <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>}
                      {idx === 3 && <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z"/></svg>}
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-black mb-3">{step.num}. {step.title}</h3>
                <p className="text-gray-700 mb-2">{step.desc}</p>
                {step.detail && <p className="text-gray-700 mb-2">{step.detail}</p>}
                {step.detail2 && <p className="text-gray-700 mb-4">{step.detail2}</p>}
                {step.buttons && (
                  <div className="flex flex-col gap-2 mt-4">
                    {step.buttons.map((btn, i) => (
                      <a key={i} href="/contact" className="px-4 py-2 bg-[#6da71d] text-white text-sm font-semibold rounded hover:bg-[#7dbf23] transition-colors">
                        {btn}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Choose Your Sign - White Background */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4">Choose your pavement sign</h2>
            <p className="text-lg text-gray-700">Our pavement signs come in a range of styles and sizes.</p>
          </div>

          {/* Eco Swing Pavement Sign */}
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
            <h3 className="text-3xl md:text-4xl font-black text-[#6da71d] mb-2 text-center">Eco Swing Pavement Sign</h3>
            <div className="h-1 w-32 bg-[#6da71d] mx-auto mb-6" />
            <p className="text-xl font-semibold text-center mb-12">Best for windy locations!</p>

            <div className="grid lg:grid-cols-3 gap-12 items-start">
              {/* Product Image */}
              <div className="lg:col-span-1">
                <img src="/pavement-signs/pavement1.jpg" alt="Eco Swing Pavement Sign" className="w-full h-auto rounded-lg" />
              </div>

              {/* Features */}
              <div className="lg:col-span-1">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-[#6da71d] mt-1">•</span>
                    <span className="text-gray-700">Frame available in black or white</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#6da71d] mt-1">•</span>
                    <span className="text-gray-700">Base is made from black recycled PVC</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#6da71d] mt-1">•</span>
                    <span className="text-gray-700">The large base is water fillable with wheels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#6da71d] mt-1">•</span>
                    <span className="text-gray-700">Frame is made from steel tubing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#6da71d] mt-1">•</span>
                    <span className="text-gray-700">Aluminium Double Sided Panel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#6da71d] mt-1">•</span>
                    <span className="text-gray-700">Easily swap out panels</span>
                  </li>
                </ul>
              </div>

              {/* Specs */}
              <div className="lg:col-span-1 grid grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-black mb-4">Panel Sizes</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-gray-900">Small:</p>
                      <p className="text-gray-700">• 430 x 625mm</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Medium:</p>
                      <p className="text-gray-700">• 500 x 750mm</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Large:</p>
                      <p className="text-gray-700">• 588 x 917mm</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-4">Weights</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-gray-900">Small:</p>
                      <p className="text-gray-700">• 11Kg</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Medium:</p>
                      <p className="text-gray-700">• 16Kg</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Large:</p>
                      <p className="text-gray-700">• 13Kg (empty)</p>
                      <p className="text-gray-700">• 31Kg with water</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Made - Black Background */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-[#6da71d] mb-8">Custom made for you.</h2>
          <p className="text-lg text-white/90 leading-relaxed mb-6">
            All of our pavement signs can be made to your exact specifications, are manufactured using the best materials and then finished to a very high standard.
          </p>
          <p className="text-lg text-white/90 leading-relaxed mb-6">
            Pavement signs are designed primarily for outdoor usage and are built to withstand all weathers – however, some of our styles are better suited to high wind than others.
          </p>
          <p className="text-lg text-white/90 leading-relaxed mb-10">
            Contact us for advice on selecting your frame, panel & customisation style, design or any other questions you may have.
          </p>
          <a href="/contact" className="inline-flex items-center justify-center px-10 py-4 rounded-md bg-[#6da71d] text-white font-bold text-lg hover:bg-[#7dbf23] transition-all duration-300">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
            GET SOME ADVICE FROM OUR TEAM
          </a>
        </div>
      </section>

      {/* Types of Customisation - White Background */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4">Types of customisation</h2>
            <p className="text-lg text-gray-700">We believe in always using high performance materials</p>
            <p className="text-base text-gray-600 mt-2">Chat to our team who can advise on the best type of customisation for your business.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Printed Vinyl */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-[#6da71d] mb-6">Printed Vinyl</h3>
              <p className="text-gray-700 mb-6">Printed vinyl is great for multiple colours & small details</p>
              <ul className="space-y-2 mb-6">
                {['Very small text and fine lines', 'Gradients', 'Photos', 'Grunge / stamp effects', 'Fluorescent / neon colours', 'Metallic finishes', 'Glitter + holographic'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#6da71d] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-700"><strong>What is printed vinyl?</strong></p>
                <p className="text-sm text-gray-600 mt-2">Printed vinyl is exactly what it sounds like: inks are used to print a design onto clear or white vinyl. Printed vinyl is ideal for multiple colours, gradients, shading, photographs and complex illustrations. Due to the ink being on the surface of the vinyl, the colour can fade quicker than cut vinyl which has the colour throughout the material.</p>
              </div>
            </div>

            {/* Cut Vinyl */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-[#6da71d] mb-6">Cut Vinyl</h3>
              <p className="text-gray-700 mb-6">Cut Vinyl is best suited to simple designs, logos and lettering.</p>
              <ul className="space-y-2 mb-6">
                {['Fluorescent / Neon Colours', 'Metallic Finishes', 'Glitter + Holographic'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#6da71d] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-600 mb-4">Not suitable for:</p>
              <ul className="space-y-2 mb-6">
                {['Very small text and fine lines', 'Gradients', 'Photos', 'Grunge / Stamp Effects'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-700"><strong>What is Cut Vinyl?</strong></p>
                <p className="text-sm text-gray-600 mt-2">A specialist machine follows the design using a sharp blade, which cuts out shapes and letters from pre-coloured rolls of vinyl. This gives a sharper edge to the artwork than printed graphics. Cut vinyl decals have no background, the background that you see behind the cut vinyl design is what you install it onto, be that a bare coloured surface or pre-applied coloured vinyl.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PavementSigns;
