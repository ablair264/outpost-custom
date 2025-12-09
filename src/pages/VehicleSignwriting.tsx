import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import SlimGridMotion from '../components/SlimGridMotion';
import { usePageTheme } from '../contexts/ThemeContext';
import HowItWorksSection from '../components/HowItWorksSection';

const VehicleSignwriting: React.FC = () => {
  // Set purple theme for this page
  usePageTheme('purple');
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Vehicle signwriting images for SlimGridMotion
  const vehicleImages = Array.from({ length: 21 }, (_, index) => {
    const imageNum = (index % 4) + 1;
    return `/vehicle-signwriting/vehicle${imageNum}.jpg`;
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
      title: 'Arrange a FREE consultation',
      description: 'For standard vehicles, we use our library of scaled drawings. For off-spec vehicles, pop down to our Kidderminster unit for photos and measurements.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Get a FREE quote + mockup',
      description: 'Send us your logo and our design team will create a visual of how your vehicle could look. Need a logo designed? We can help with that.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Approve your order',
      description: 'After approval, book a slot with our team. We have late night slots on Wednesdays or midday slots on Saturdays. We can also come to you on-site.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Order up!',
      description: 'Bring your vehicle to our unit, or our professional and fully insured installation team will meet you at a location of your choice.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    }
  ];

  const pricingData = [
    { vehicle: 'Cars', price: '£200 - £400' },
    { vehicle: 'SWB - LWB Vans', price: '£300 - £550' },
    { vehicle: 'Luton / Box', price: '£500 - £800' },
  ];

  const vinylSpecs = [
    { label: 'Gloss', value: 'Available in a high gloss or matt finish' },
    { label: 'Matt', value: 'Outdoor use, matt or gloss finish. Indoor use, matt finish' },
    { label: 'Application', value: 'Wet or dry application, wet for better results as you can reposition easily' },
    { label: 'Color', value: 'Printed full colour or cut from a range of coloured vinyl' },
    { label: 'Finishes', value: 'Gloss, matt, metallic, reflective, fluorescent, carbon fibre, brushed aluminium, wood effect' },
    { label: 'Longevity', value: 'Indoor vinyl lasts 2-3 years. Outdoor vinyl lasts 5-7 years' },
    { label: 'Removal', value: 'Heat can be used to remove adhesive vinyl from most surfaces. No damage to paintwork' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Black */}
      <section className="relative h-[70vh] w-full overflow-hidden bg-black">
        <div className="absolute inset-0">
          <SlimGridMotion items={vehicleImages} gradientColor="black" />
        </div>

        <div className="absolute inset-0 bg-black/70 z-[5]" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/50 via-black/25 to-transparent backdrop-blur-sm z-[5]" />

        <div className="relative z-10 h-full flex items-center px-6 md:px-12 lg:px-24">
          <div className="max-w-5xl mx-auto w-full">
            <div ref={headingRef} className="mb-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-4 leading-[0.95]">
                Let your vehicle<br />do the talking
              </h1>
              <div className="h-1 w-20 bg-[#383349] rounded-full" />
            </div>

            <div ref={contentRef} className="max-w-2xl mb-10">
              <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed">
                Custom decals allow you turn any text, logo, or graphic into a promotional tool for your business. Get spotted on the road or parked on any job.
              </p>
            </div>

            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#383349] text-white font-semibold text-base hover:bg-[#4a4460] transition-all duration-300 shadow-lg shadow-[#383349]/30"
              >
                How It Works
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-white bg-transparent text-white font-semibold text-base hover:bg-white/10 transition-all duration-300"
              >
                Book FREE Consultation
              </a>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black z-[6]" />
      </section>

      {/* How It Works Section with Brush Stroke Animation */}
      <HowItWorksSection
        serviceType="vehicle-signwriting"
        sectionId="how-it-works"
        subtitle="Our vehicle signwriting service comes in a range of styles and sizes to suit your needs."
      />

      {/* Can't Lose Your Vehicle Section - Gray */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                Can not lose your work vehicle for the day?
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                We have late night application slots on Wednesdays or midday slots on Saturdays.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                We will also come to you on-site… Let us do our job, while you are doing yours.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#383349] text-white font-semibold text-base hover:bg-[#4a4460] transition-all duration-300 shadow-lg shadow-[#383349]/30"
              >
                Book a Slot
              </a>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl bg-white border border-gray-200 p-12 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🚐</div>
                  <div className="text-2xl font-bold text-gray-900 mb-3">Flexible Installation</div>
                  <div className="text-base text-gray-600">
                    Late nights • Midday Saturdays • On-site service
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Section - Black */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Signwriting pays for itself
            </h2>
            <div className="h-1 w-20 bg-[#383349] mx-auto rounded-full mb-8" />
            <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
              We offer a wide range of graphic options to suit your budget. Vehicle signage is round-the-clock advertising. Since vinyl decals can last for many years, you will not be replacing yours for quite a while.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 mb-12">
            <p className="text-lg text-white/80 leading-relaxed mb-6">
              Whatever goods or services you provide, unique vehicle graphics will put you ahead of the competition and help your brand stand out.
            </p>
            <p className="text-lg text-white/80 leading-relaxed">
              If you compare the cost of £500 signwriting to the cost of any other advertising then there really is no comparison. A vehicle on the road gets seen by thousands of other road users every day, 365 days a year. It is even working whilst you are off the clock.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-8 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-4xl font-black text-[#383349] mb-3">£500</div>
              <div className="text-sm text-white/60">One-time investment</div>
            </div>
            <div className="text-center p-8 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-4xl font-black text-[#383349] mb-3">365</div>
              <div className="text-sm text-white/60">Days advertising per year</div>
            </div>
            <div className="text-center p-8 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-4xl font-black text-[#383349] mb-3">1000s</div>
              <div className="text-sm text-white/60">Impressions daily</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - White */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Pricing Guide
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Transparent pricing for your vehicle signwriting needs
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-[#383349]">
                  <th className="text-left py-4 px-6 text-gray-900 font-bold text-lg">Vehicle Type</th>
                  <th className="text-right py-4 px-6 text-gray-900 font-bold text-lg">Price Range</th>
                </tr>
              </thead>
              <tbody>
                {pricingData.map((item, idx) => (
                  <tr key={idx} className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <td className="py-6 px-6 text-gray-900 font-medium">{item.vehicle}</td>
                    <td className="py-6 px-6 text-right text-[#383349] font-bold text-xl">{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 bg-gray-50 border border-gray-200 rounded-2xl p-8">
            <p className="text-gray-700 leading-relaxed mb-4">
              <span className="font-bold text-gray-900">Note:</span> Prices vary depending on the complexity of the design and the amount of coverage required.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Get a <span className="text-[#383349] font-semibold">FREE quote and mockup</span> to see exactly how your vehicle will look before committing.
            </p>
          </div>
        </div>
      </section>

      {/* Magnetic Signs Section - Gray */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-video rounded-3xl bg-gradient-to-br from-[#383349]/20 to-[#383349]/5 border border-[#383349]/30 p-12 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🧲</div>
                  <div className="text-2xl font-bold text-gray-900">Magnetic Signs</div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                Need something removable?
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Magnetic signs are perfect if you use your vehicle for both work and personal use, or if you need temporary branding.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Simply attach them when you need them and remove them when you do not. Easy to swap between vehicles too.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#383349] text-white font-semibold text-base hover:bg-[#4a4460] transition-all duration-300 shadow-lg shadow-[#383349]/30"
              >
                Ask About Magnetic Signs
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Team Section - Black */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-black">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Professional installation team
          </h2>
          <div className="h-1 w-20 bg-[#383349] mx-auto rounded-full mb-8" />
          <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed mb-12">
            Our installation team are professional, fully insured, and experienced in working with all types of vehicles. Whether you come to our unit in Kidderminster or we come to you on-site, you can trust us to deliver exceptional results.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-xl font-bold text-white mb-3">Professional</h3>
              <p className="text-white/70">
                Years of experience with vehicles of all shapes and sizes
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-white mb-3">Fully Insured</h3>
              <p className="text-white/70">
                Complete peace of mind with comprehensive insurance coverage
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-white mb-3">Quality Guarantee</h3>
              <p className="text-white/70">
                We stand behind our work with a satisfaction guarantee
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Types of Customisation Section - White */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Types of customisation
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose between printed vinyl for full-colour designs or cut vinyl for clean, professional lettering
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Printed Vinyl */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Printed Vinyl</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-[#383349] text-2xl flex-shrink-0">✓</span>
                  <span className="text-gray-700">Full colour printing for complex designs and photos</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#383349] text-2xl flex-shrink-0">✓</span>
                  <span className="text-gray-700">Perfect for logos with gradients and multiple colours</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#383349] text-2xl flex-shrink-0">✓</span>
                  <span className="text-gray-700">Can include photographs and intricate graphics</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#383349] text-2xl flex-shrink-0">✓</span>
                  <span className="text-gray-700">Available in gloss or matt finish</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 text-2xl flex-shrink-0">✗</span>
                  <span className="text-gray-500">Slightly shorter lifespan than cut vinyl</span>
                </li>
              </ul>
            </div>

            {/* Cut Vinyl */}
            <div className="bg-[#383349]/5 border-2 border-[#383349] rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Cut Vinyl</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-[#383349] text-2xl flex-shrink-0">✓</span>
                  <span className="text-gray-700">Longest lasting option (5-7 years outdoor)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#383349] text-2xl flex-shrink-0">✓</span>
                  <span className="text-gray-700">Sharp, clean edges for professional lettering</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#383349] text-2xl flex-shrink-0">✓</span>
                  <span className="text-gray-700">Available in 100+ solid colours plus special finishes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#383349] text-2xl flex-shrink-0">✓</span>
                  <span className="text-gray-700">Metallic, reflective, and fluorescent options available</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 text-2xl flex-shrink-0">✗</span>
                  <span className="text-gray-500">Not suitable for complex multi-colour designs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Vinyl Specifications Section - Gray */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Vinyl specifications
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              High-quality vinyl designed specifically for vehicle applications
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {vinylSpecs.map((spec, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-[#383349] mb-2">{spec.label}</h3>
                <p className="text-gray-700 leading-relaxed">{spec.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white border-2 border-[#383349] rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Easy removal when needed
            </h3>
            <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
              When it is time to update your branding or sell your vehicle, our vinyl can be removed using heat without damaging the paintwork underneath.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Black */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Ready to get noticed on the road?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Get a free mockup and quote for your vehicle signwriting
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-[#383349] text-white font-semibold text-lg hover:bg-[#4a4460] transition-all duration-300 shadow-lg shadow-[#383349]/30"
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

export default VehicleSignwriting;
