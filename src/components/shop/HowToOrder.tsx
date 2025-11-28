import React from 'react';
import { ShoppingCart, Palette, Printer } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const steps = [
  {
    icon: ShoppingCart,
    number: '01',
    title: 'Get Started',
    description: `Browse our catalogue and submit a quote for the garments you'd like. Or get in touch directly and we'll help find the perfect fit for you.`,
  },
  {
    icon: Palette,
    number: '02',
    title: 'Customise It!',
    description: `Send us your logo, pick from our designs, or share your ideas. Our in-house designers will create an awesome mock-up for you to confirm.`,
  },
  {
    icon: Printer,
    number: '03',
    title: 'Print & Deliver',
    description: `We'll print using vinyl transfer for a fantastic finish at low setup costs. Standard turnaround is 7-10 working days with express options available.`,
  },
];

const HowToOrder = () => {
  return (
    <section className="w-full py-20 px-4 md:px-8 lg:px-16 xl:px-24" style={{ background: '#000000' }}>
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ background: '#6da71d', color: '#ffffff' }}>
            Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            How to Order
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Getting your custom garments is easy. Just three simple steps from start to finish.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="relative overflow-hidden border-2 transition-all duration-300 hover:scale-105" style={{ background: '#1a1a1a', borderColor: '#2a2a2a' }}>
                <CardContent className="p-8">
                  {/* Number Badge */}
                  <div className="absolute top-6 right-6 text-6xl font-bold opacity-10" style={{ color: '#6da71d' }}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(109, 167, 29, 0.1)' }}>
                    <Icon className="w-8 h-8" style={{ color: '#6da71d' }} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-6">
            Have questions? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="mailto:info@outpostcustom.co.uk" className="text-white hover:opacity-80 transition-opacity" style={{ color: '#6da71d' }}>
              info@outpostcustom.co.uk
            </a>
            <span className="text-gray-600 hidden sm:inline">•</span>
            <a href="tel:01562227117" className="text-white hover:opacity-80 transition-opacity" style={{ color: '#6da71d' }}>
              01562 227117
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToOrder;
