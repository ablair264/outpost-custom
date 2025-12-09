import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const storyCards = [
  {
    title: 'Customisation Specialists',
    body: [
      'Based out of our industrial unit in Kidderminster, Worcestershire, Outpost Custom has fast made a name for itself in the world of signage and workwear.',
      'We offer a wide range of design, print, clothing and signage solutions to businesses and individuals across the Midlands.',
    ],
  },
  {
    title: "We don't cut corners… unless they are on signs.",
    body: [
      "Our extensive knowledge and experience means we're able to recommend the products and services that best suit your budget.",
      "We will advise and guide you on every aspect of the process whether you're a small business or a national company.",
      'We believe that by going the extra mile, and genuinely caring about every business who walks though our doors, has been crucial to our success.',
    ],
  },
];

const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#c1c6c8] py-20 md:py-24"
    >
      <style>{`
        @font-face {
          font-family: 'Hearns';
          src: url('/fonts/Hearns/Hearns.woff') format('woff');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Aldivaro';
          src: url('/fonts/aldivaro/Aldivaro Stamp Demo.otf') format('opentype');
          font-weight: normal;
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
        .hearns-font { font-family: 'Hearns', Georgia, serif; letter-spacing: 0.18em; }
        .aldivaro-font { font-family: 'Aldivaro', 'Times New Roman', serif; }
        .grotesk-font { font-family: 'Neuzeit Grotesk', 'Helvetica Neue', sans-serif; }
      `}</style>

      <div
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: "url('/ConcreteTexture.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="absolute left-8 md:left-14 top-0 bottom-0 w-px bg-[#0f1818]/25" />
      <div className="absolute right-8 md:right-14 top-0 bottom-0 w-px bg-[#0f1818]/15" />

      <div className="relative max-w-6xl mx-auto px-6 md:px-10">
        <div className="flex flex-col items-center md:items-end gap-3 mb-8 md:mb-10">
          <div className="space-y-2 text-center md:text-right">
            <h2 className="aldivaro-font text-3xl sm:text-4xl md:text-5xl lg:text-[56px] text-[#0f1818] uppercase tracking-tight">
              Outpost Custom
            </h2>
            <div className="h-1 w-16 md:w-20 bg-[#0f1818] mx-auto md:ml-auto md:mr-0" />
          </div>
          <div className="inline-flex items-center gap-2 md:gap-3 bg-[#0f1818] text-[#c1c6c8] px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-md">
            <span className="aldivaro-font text-base md:text-lg italic tracking-wide">
              Warning: Original Content
            </span>
            <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 md:gap-10 lg:gap-14 items-start">
          <div className="grid gap-4 md:gap-6">
            {storyCards.map((card) => (
              <div
                key={card.title}
                className="relative bg-[#0f1818] text-white p-5 md:p-8 rounded-xl md:rounded-2xl shadow-2xl border border-white/5 overflow-hidden"
              >
              <div
                className="absolute inset-0 opacity-20"
                style={{ backgroundImage: "url('/BlackTextureBackground.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
                <div className="absolute -left-10 top-6 h-14 w-14 rotate-12 bg-white/5 blur-3xl" />
                <div className="flex items-start gap-2 md:gap-3">
                  <span className="hearns-font text-sm md:text-lg uppercase text-white tracking-[0.14em] md:tracking-[0.16em] leading-tight">
                    {card.title}
                  </span>
                  <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5 text-white/70 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                </div>
                <div className="h-0.5 w-10 md:w-14 bg-white/30 mt-3 md:mt-4 mb-2 md:mb-3" />
                <div className="space-y-2 md:space-y-3">
                  {card.body.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="grotesk-font text-sm md:text-base leading-relaxed text-white/85"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="relative flex flex-col gap-4 md:gap-6 mt-0 lg:mt-6">
            {/* On mobile, show these side by side */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
              <div className="overflow-hidden rounded-xl md:rounded-3xl shadow-2xl border border-[#0f1818]/10 bg-[#0f1818]">
                <div
                  className="relative w-full bg-center bg-cover"
                  style={{ backgroundImage: "url('/BlackTextureBackground.webp')" }}
                >
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: "url('/BlackTextureBackground.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }}
                  />
                  <div className="absolute inset-0 bg-[#0f1818]/65" />
                  <div className="relative flex flex-col gap-2 md:gap-3 p-4 md:p-7">
                    <p className="grotesk-font text-xs md:text-sm text-[#c1c6c8]/80 max-w-lg hidden md:block">
                      Industrial precision, bespoke execution, and an obsession with detail. This is how we build every sign, garment, and experience that leaves our workshop.
                    </p>
                    <div className="h-px w-8 md:w-12 bg-[#c1c6c8]/40" />
                    <p className="hearns-font text-xs md:text-base uppercase text-[#c1c6c8] tracking-[0.14em] md:tracking-[0.18em]">
                      Built in Kidderminster
                    </p>
                    <p className="grotesk-font text-xs md:text-sm text-[#c1c6c8]/80">
                      Design, print, clothing, signage — assembled under one roof.
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl md:rounded-3xl shadow-2xl border border-[#0f1818]/10 bg-[#0f1818]">
                <div
                  className="relative aspect-square md:aspect-[5/4] w-full bg-center bg-cover"
                  style={{ backgroundImage: "url('/parallax-bg.jpg')" }}
                >
                  <div className="absolute inset-0 bg-[#0f1818]/55" />
                  <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "url('/ConcreteTexture.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div className="relative flex h-full flex-col justify-end p-3 md:p-6">
                    <div className="h-0.5 md:h-1 w-8 md:w-12 bg-[#c1c6c8]/50 mb-2 md:mb-3" />
                    <p className="hearns-font text-xs md:text-base uppercase text-[#c1c6c8] tracking-[0.12em] md:tracking-[0.16em]">
                      Under One Roof
                    </p>
                    <p className="grotesk-font text-[10px] md:text-sm text-[#c1c6c8]/85 mt-1">
                      Full-stack production from brief to install.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -left-4 -bottom-6 h-16 w-16 border border-[#0f1818] rounded-full opacity-30 hidden lg:block" />
            <div className="absolute -right-6 -top-6 h-20 w-20 border border-[#0f1818]/50 rounded-full opacity-30 hidden lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
