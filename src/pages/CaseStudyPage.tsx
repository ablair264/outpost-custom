import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  CheckCircle,
  Quote,
  Car,
  FileText,
  Image,
  Palette,
  CreditCard,
  Coffee,
  TrendingUp,
  Users,
  Camera,
  BookOpen,
  Square,
  Gift,
  Layers,
  Star,
  DollarSign,
  Home,
  Globe,
} from 'lucide-react';
import PrintingFontStyles from '../components/printing/PrintingFontStyles';
import { getCaseStudyBySlug, getRelatedCaseStudies } from '../lib/blog-data';
import { blogColors } from '../lib/blog-types';

// Icon mapping
const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Car,
  FileText,
  Image,
  Palette,
  CreditCard,
  Coffee,
  TrendingUp,
  Users,
  Camera,
  BookOpen,
  Square,
  Gift,
  Layers,
  Star,
  DollarSign,
  Home,
  Globe,
  CheckCircle,
};

const CaseStudyPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const caseStudy = slug ? getCaseStudyBySlug(slug) : undefined;

  if (!caseStudy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Case Study Not Found</h1>
          <Link to="/blog" className="text-[#64a70b] hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const relatedStudies = caseStudy.relatedCaseStudies
    ? getRelatedCaseStudies(caseStudy.relatedCaseStudies)
    : [];

  return (
    <>
      <PrintingFontStyles />

      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <nav className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center gap-2 text-sm">
            <Link to="/" className="text-[#64a70b] hover:underline">Home</Link>
            <span className="text-gray-400">›</span>
            <Link to="/blog?category=case-studies" className="text-[#64a70b] hover:underline">Case Studies</Link>
            <span className="text-gray-400">›</span>
            <span className="text-gray-500 truncate max-w-[200px]">{caseStudy.clientName}</span>
          </div>
        </nav>

        {/* Hero Section */}
        <section
          className="relative py-16 md:py-24 px-6 overflow-hidden"
          style={{ backgroundColor: blogColors.dark }}
        >
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'url(/ConcreteTexture.webp)',
              backgroundSize: 'cover',
              mixBlendMode: 'overlay',
            }}
          />

          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Text */}
              <motion.div
                className="text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span
                  className="inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6"
                  style={{ backgroundColor: `${blogColors.accent}33`, color: blogColors.accent }}
                >
                  Case Study
                </span>

                <h1
                  className="hearns-font text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight"
                  style={{ transform: 'rotate(-0.5deg)' }}
                >
                  {caseStudy.title}
                </h1>

                <p className="text-white/80 text-lg mb-8 leading-relaxed">
                  {caseStudy.subtitle}
                </p>

                <div className="flex flex-wrap gap-3">
                  {caseStudy.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 rounded-full text-sm text-white/90 bg-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Client Logo Box */}
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="w-72 h-72 bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center p-8">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                    style={{ backgroundColor: blogColors.accent }}
                  >
                    {caseStudy.iconName && iconMap[caseStudy.iconName] &&
                      React.createElement(iconMap[caseStudy.iconName], { className: 'w-10 h-10 text-white' })
                    }
                  </div>
                  <h2 className="text-2xl font-serif text-[#183028] text-center leading-tight">
                    {caseStudy.clientName}
                  </h2>
                  {caseStudy.clientLocation && (
                    <p className="text-gray-500 text-sm mt-2">{caseStudy.clientLocation}</p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-white py-10 border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {caseStudy.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div
                    className="text-4xl md:text-5xl font-bold mb-2"
                    style={{ color: blogColors.accent }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-gray-500">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-6 py-16">
          {/* The Challenge */}
          <section className="mb-16">
            <span
              className="text-xs font-bold uppercase tracking-widest mb-3 block"
              style={{ color: blogColors.accent }}
            >
              The Challenge
            </span>
            <h2
              className="text-2xl md:text-3xl font-bold uppercase mb-6 relative inline-block"
              style={{ color: blogColors.dark }}
            >
              Starting Fresh
              <span
                className="absolute -bottom-2 left-0 w-16 h-1 rounded-full"
                style={{ backgroundColor: blogColors.accent }}
              />
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              {caseStudy.challenge}
            </p>
          </section>

          {/* The Solution */}
          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <span
                  className="text-xs font-bold uppercase tracking-widest mb-3 block"
                  style={{ color: blogColors.accent }}
                >
                  The Solution
                </span>
                <h2
                  className="text-2xl md:text-3xl font-bold uppercase mb-6 relative inline-block"
                  style={{ color: blogColors.dark }}
                >
                  A Complete Print Identity
                  <span
                    className="absolute -bottom-2 left-0 w-16 h-1 rounded-full"
                    style={{ backgroundColor: blogColors.accent }}
                  />
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {caseStudy.solution}
                </p>
              </div>

              {/* Deliverables */}
              <div className="grid grid-cols-2 gap-4">
                {caseStudy.deliverables.map((deliverable, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-[#64a70b]/10 transition-colors duration-200"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: blogColors.accent }}
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-[#183028]">{deliverable}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Project Gallery */}
          <section className="mb-16">
            <div className="grid grid-cols-2 gap-4">
              {caseStudy.gallery.map((item, index) => (
                <motion.div
                  key={index}
                  className={`relative overflow-hidden rounded-xl flex flex-col items-center justify-center aspect-[4/3] ${
                    item.large ? 'col-span-2 aspect-[2/1]' : ''
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${blogColors.dark} 0%, #2d5a47 100%)`
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <div
                    className="absolute inset-0 opacity-12 pointer-events-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                  />
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center relative z-10 mb-3"
                    style={{ backgroundColor: blogColors.accent }}
                  >
                    {iconMap[item.iconName] &&
                      React.createElement(iconMap[item.iconName], { className: 'w-7 h-7 text-white' })
                    }
                  </div>
                  <span className="text-white font-semibold text-sm relative z-10">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Testimonial Quote */}
          {caseStudy.testimonial && (
            <motion.section
              className="relative rounded-2xl p-10 md:p-12 mb-16 text-center overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${blogColors.dark} 0%, #2d5a47 100%)` }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
              />

              <div className="relative z-10">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: blogColors.accent }}
                >
                  <Quote className="w-6 h-6 text-white" />
                </div>

                <p className="text-white text-xl md:text-2xl italic leading-relaxed mb-6 max-w-3xl mx-auto">
                  "{caseStudy.testimonial.text}"
                </p>

                <p className="text-white font-semibold">{caseStudy.testimonial.author}</p>
                <p className="text-sm" style={{ color: blogColors.accent }}>
                  {caseStudy.testimonial.role}
                </p>
              </div>
            </motion.section>
          )}

          {/* Our Process */}
          <section className="mb-16">
            <span
              className="text-xs font-bold uppercase tracking-widest mb-3 block"
              style={{ color: blogColors.accent }}
            >
              How We Did It
            </span>
            <h2
              className="text-2xl md:text-3xl font-bold uppercase mb-8 relative inline-block"
              style={{ color: blogColors.dark }}
            >
              Our Process
              <span
                className="absolute -bottom-2 left-0 w-16 h-1 rounded-full"
                style={{ backgroundColor: blogColors.accent }}
              />
            </h2>

            <div className="space-y-6">
              {caseStudy.processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className="flex gap-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="relative">
                    <div
                      className="w-14 h-14 rounded-full bg-white border-4 flex items-center justify-center flex-shrink-0 font-bold text-lg"
                      style={{ borderColor: blogColors.accent, color: blogColors.dark }}
                    >
                      {index + 1}
                    </div>
                    {index < caseStudy.processSteps.length - 1 && (
                      <div
                        className="absolute top-14 left-1/2 -translate-x-1/2 w-1 h-full bg-gray-200"
                      />
                    )}
                  </div>
                  <div className="pb-6">
                    <h4 className="font-bold text-lg text-[#183028] mb-2">{step.title}</h4>
                    <p className="text-gray-500">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </main>

        {/* Results Section */}
        <section className="bg-gray-50 py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <span
              className="text-xs font-bold uppercase tracking-widest mb-3 block"
              style={{ color: blogColors.accent }}
            >
              The Outcome
            </span>
            <h2
              className="text-2xl md:text-3xl font-bold uppercase mb-10 relative inline-block"
              style={{ color: blogColors.dark }}
            >
              Real Results
              <span
                className="absolute -bottom-2 left-0 w-16 h-1 rounded-full"
                style={{ backgroundColor: blogColors.accent }}
              />
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {caseStudy.results.map((result, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-md text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${blogColors.accent}15` }}
                  >
                    {result.iconName && iconMap[result.iconName] &&
                      React.createElement(iconMap[result.iconName], {
                        className: 'w-7 h-7',
                        style: { color: blogColors.accent },
                      })
                    }
                  </div>
                  <h3 className="font-bold text-[#183028] mb-2">{result.title}</h3>
                  <p className="text-gray-500 text-sm">{result.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Case Studies */}
        {relatedStudies.length > 0 && (
          <section className="py-16 px-6 max-w-5xl mx-auto">
            <h2
              className="text-2xl font-bold uppercase text-center mb-10"
              style={{ color: blogColors.dark }}
            >
              More Case Studies
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {relatedStudies.map((study) => (
                <Link
                  key={study.id}
                  to={`/case-study/${study.slug}`}
                  className="flex gap-5 p-5 border border-gray-200 rounded-xl hover:border-[#64a70b] hover:shadow-lg transition-all duration-300"
                >
                  <div
                    className="w-28 h-28 flex-shrink-0 rounded-lg flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${blogColors.dark} 0%, #2d5a47 100%)`
                    }}
                  >
                    {study.iconName && iconMap[study.iconName] &&
                      React.createElement(iconMap[study.iconName], {
                        className: 'w-8 h-8',
                        style: { color: blogColors.accent },
                      })
                    }
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-bold text-[#183028] mb-1">{study.clientName}</h3>
                    <p className="text-sm text-gray-500">{study.industry} • {study.tags[0]}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section
          className="relative py-16 px-6 overflow-hidden"
          style={{ backgroundColor: blogColors.dark }}
        >
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'url(/ConcreteTexture.webp)',
              backgroundSize: 'cover',
              mixBlendMode: 'overlay',
            }}
          />

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <h2
              className="hearns-font text-3xl md:text-4xl text-white mb-4"
              style={{ transform: 'rotate(-1deg)' }}
            >
              Your Story Next?
            </h2>
            <p className="text-white/80 mb-8 max-w-lg mx-auto">
              Every business has a story to tell. Let's make yours look as good in print as it sounds in person.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 rounded-full text-white font-bold hover:scale-105 transition-transform duration-200"
              style={{ backgroundColor: blogColors.accent }}
            >
              Start Your Project
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default CaseStudyPage;
