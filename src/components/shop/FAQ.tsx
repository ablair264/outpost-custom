import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How do I order?',
    answer: `You can add your garments to your quote on our website and submit. A member of our team will then be in contact to discuss customising options and give you a final price. Alternatively, get in touch with us directly and we'll help you find the perfect garment, fit and design for your needs.`,
  },
  {
    question: 'Are your garments good quality?',
    answer: 'Absolutely! We work with quality suppliers to ensure the highest quality garments.',
  },
  {
    question: 'Can I see what my garment will look like?',
    answer: 'Yes. We will send over a digital mock up of your design before we go to print so you can double check it and make any changes if needed.',
  },
  {
    question: 'Which print process do you use?',
    answer: 'We use a vinyl transfer process which keeps the set up cost low, but gives a fantastic finish.',
  },
  {
    question: 'Is there a minimum order?',
    answer: `There's no minimum order, but we do give discounts for large orders - even if the personalisation is different. So if you're organising a group holiday, stag do or hen do, make sure you let us know roughly how many garments you want when you enquire!`,
  },
  {
    question: 'How much does it cost?',
    answer: `Each order is unique and the price will vary depending on the quantity, design, individual personalisations and so on. We want to give you the best price so we don't include customisation prices on our website. Submit an enquiry and speak to us about your designs and we'll provide a full quote - with a discount on larger orders.`,
  },
  {
    question: 'How long do they take to print and deliver?',
    answer: 'Our standard turnaround time is 7-10 working days, depending on design complexity and order size. We do have an express option available if you need your garments sooner, so please discuss this with us if required. Turnaround time starts from when your order has been placed and the design has been confirmed. For delivery outside the UK, please ask us for an estimated time scale.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-20 px-4 md:px-8 lg:px-16 xl:px-24" style={{ background: '#ffffff' }}>
      <div className="max-w-[900px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#000000' }}>
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about ordering custom garments
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl overflow-hidden border-2 transition-all duration-300"
              style={{
                borderColor: openIndex === index ? '#6da71d' : '#e5e7eb',
                background: openIndex === index ? '#f9fafb' : '#ffffff'
              }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-semibold" style={{ color: '#000000' }}>
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 flex-shrink-0 ml-4 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  style={{ color: openIndex === index ? '#6da71d' : '#6b7280' }}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 p-8 rounded-2xl text-center" style={{ background: '#1a1a1a' }}>
          <h3 className="text-2xl font-bold mb-3 text-white">
            Still have questions?
          </h3>
          <p className="text-gray-400 mb-6">
            We take a personal approach to make sure you're 100% happy with your garments
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@outpostcustom.co.uk"
              className="px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:opacity-90"
              style={{ background: '#6da71d', color: '#ffffff' }}
            >
              Email Us
            </a>
            <a
              href="tel:01562227117"
              className="px-6 py-3 rounded-full font-semibold border-2 transition-all duration-300 hover:bg-white/5"
              style={{ borderColor: '#6da71d', color: '#6da71d' }}
            >
              Call 01562 227117
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
