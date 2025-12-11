import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, ChevronLeft, ChevronRight, Star, Car, FileText, Image, Palette, CreditCard, Coffee, TrendingUp, Users, Camera, BookOpen, Square, Gift, Layers, Loader2 } from 'lucide-react';
import PrintingFontStyles from '../components/printing/PrintingFontStyles';
import { blogPosts as hardcodedPosts, caseStudies as hardcodedCaseStudies } from '../lib/blog-data';
import { blogCategories, blogColors, BlogCategory, BlogPost, CaseStudy } from '../lib/blog-types';

// API configuration
const API_BASE = process.env.NODE_ENV === 'production'
  ? '/api/blog'
  : '/.netlify/functions/blog';

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
};

// Transform API response to match our types
interface ApiAuthor {
  id: string;
  name: string;
  role?: string;
  bio?: string;
  avatarUrl?: string;
}

interface ApiPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  iconName?: string;
  author?: ApiAuthor;
  publishedAt?: string;
  readTime: number;
  featured: boolean;
  status: string;
  blocks?: Array<{
    id: string;
    blockType: string;
    content: string;
    sortOrder: number;
  }>;
}

interface ApiCaseStudy {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  clientName: string;
  clientLocation?: string;
  industry?: string;
  tags: string[];
  status: string;
  publishedAt?: string;
  stats?: Array<{ value: string; label: string }>;
  processSteps?: Array<{ title: string; description: string }>;
  results?: Array<{ title: string; description: string; iconName?: string }>;
  gallery?: Array<{ iconName: string; label: string; imageUrl?: string; isLarge?: boolean }>;
}

const BlogList: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<BlogCategory | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [apiPosts, setApiPosts] = useState<BlogPost[]>([]);
  const [apiCaseStudies, setApiCaseStudies] = useState<CaseStudy[]>([]);
  const postsPerPage = 6;

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [postsRes, caseStudiesRes] = await Promise.all([
          fetch(`${API_BASE}/posts`),
          fetch(`${API_BASE}/case-studies`),
        ]);

        const postsData = await postsRes.json();
        const caseStudiesData = await caseStudiesRes.json();

        if (postsData.success && postsData.posts.length > 0) {
          // Transform API posts to match our type
          const transformedPosts: BlogPost[] = postsData.posts.map((post: ApiPost) => ({
            id: post.id,
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt || '',
            category: post.category as BlogCategory,
            tags: post.tags || [],
            featuredImage: post.featuredImage,
            iconName: post.iconName,
            author: post.author ? {
              name: post.author.name,
              role: post.author.role || '',
              bio: post.author.bio,
              avatarUrl: post.author.avatarUrl,
            } : { name: 'Team', role: '' },
            publishedAt: post.publishedAt || new Date().toISOString(),
            readTime: post.readTime || 5,
            featured: post.featured,
            blocks: post.blocks?.map(b => ({
              id: b.id,
              type: b.blockType as any,
              content: b.content,
            })) || [],
          }));
          setApiPosts(transformedPosts);
        }

        if (caseStudiesData.success && caseStudiesData.caseStudies.length > 0) {
          // Transform API case studies to match our type
          const transformedCaseStudies: CaseStudy[] = caseStudiesData.caseStudies.map((cs: ApiCaseStudy) => ({
            id: cs.id,
            slug: cs.slug,
            title: cs.title,
            subtitle: cs.subtitle || '',
            clientName: cs.clientName,
            clientLocation: cs.clientLocation,
            industry: cs.industry || '',
            tags: cs.tags || [],
            publishedAt: cs.publishedAt || new Date().toISOString(),
            stats: cs.stats || [],
            challenge: '',
            solution: '',
            deliverables: [],
            processSteps: cs.processSteps || [],
            results: cs.results || [],
            gallery: cs.gallery?.map(g => ({
              iconName: g.iconName || '',
              label: g.label || '',
              large: g.isLarge,
            })) || [],
          }));
          setApiCaseStudies(transformedCaseStudies);
        }
      } catch (err) {
        console.error('Failed to fetch blog data, using hardcoded data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Use API data if available, otherwise fall back to hardcoded data
  const blogPosts = apiPosts.length > 0 ? apiPosts : hardcodedPosts;
  const caseStudies = apiCaseStudies.length > 0 ? apiCaseStudies : hardcodedCaseStudies;

  // Combine and filter posts
  const allItems = useMemo(() => {
    const posts = blogPosts.map(post => ({
      ...post,
      type: 'post' as const,
      linkPath: `/blog/${post.slug}`,
    }));
    const studies = caseStudies.map(study => ({
      ...study,
      type: 'case-study' as const,
      category: 'case-studies' as BlogCategory,
      excerpt: study.subtitle,
      readTime: 5,
      linkPath: `/case-study/${study.slug}`,
    }));
    return [...posts, ...studies].sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [blogPosts, caseStudies]);

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return allItems;
    if (activeFilter === 'case-studies') {
      return allItems.filter(item => item.type === 'case-study');
    }
    return allItems.filter(item => item.type === 'post' && item.category === activeFilter);
  }, [allItems, activeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / postsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  // Featured post (first featured item)
  const featuredItem = allItems.find(item => item.type === 'post' && (item as any).featured);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getCategoryLabel = (category: string) => {
    const cat = blogCategories.find(c => c.value === category);
    return cat?.label || category;
  };

  return (
    <>
      <PrintingFontStyles />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section
          className="relative py-20 md:py-28 overflow-hidden"
          style={{ backgroundColor: blogColors.dark }}
        >
          {/* Noise texture */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'url(/ConcreteTexture.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              mixBlendMode: 'overlay',
            }}
          />

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <motion.p
              className="embossing-font text-sm md:text-base tracking-[3px] mb-4"
              style={{ color: blogColors.accent }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              INSIGHTS & IDEAS
            </motion.p>

            <motion.h1
              className="hearns-font text-5xl md:text-6xl lg:text-7xl text-white mb-6"
              style={{ transform: 'rotate(-1deg)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              The Print Blog
            </motion.h1>

            <motion.div
              className="w-32 h-1 mx-auto rounded-full mb-6"
              style={{ backgroundColor: blogColors.accent }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />

            <motion.p
              className="neuzeit-light-font text-lg md:text-xl text-white/80 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Tips, trends, and inspiration from our in-house print experts. Everything you need to make your printed materials stand out.
            </motion.p>
          </div>
        </section>

        {/* Blog Grid Section */}
        <section className="py-16 md:py-20 px-6 max-w-7xl mx-auto">
          {/* Filter Bar */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <button
              onClick={() => { setActiveFilter('all'); setCurrentPage(1); }}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
                activeFilter === 'all'
                  ? 'border-[#64a70b] text-[#183028] bg-[#64a70b]/10'
                  : 'border-gray-200 text-gray-500 hover:border-[#64a70b] hover:text-[#183028]'
              }`}
            >
              All Posts
            </button>
            {blogCategories.map(category => (
              <button
                key={category.value}
                onClick={() => { setActiveFilter(category.value); setCurrentPage(1); }}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
                  activeFilter === category.value
                    ? 'border-[#64a70b] text-[#183028] bg-[#64a70b]/10'
                    : 'border-gray-200 text-gray-500 hover:border-[#64a70b] hover:text-[#183028]'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-[#64a70b]" />
            </div>
          )}

          {/* Blog Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Featured Post - spans full width on first page */}
              {currentPage === 1 && activeFilter === 'all' && featuredItem && (
                <motion.article
                  className="col-span-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Image */}
                    <div
                      className="aspect-[4/3] md:aspect-auto md:min-h-[320px] flex items-center justify-center relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${blogColors.dark} 0%, #2d5a47 100%)`
                      }}
                    >
                      {/* Noise texture */}
                      <div
                        className="absolute inset-0 opacity-15 pointer-events-none"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                        }}
                      />
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center relative z-10"
                        style={{ backgroundColor: blogColors.accent }}
                      >
                        {featuredItem.iconName && iconMap[featuredItem.iconName] &&
                          React.createElement(iconMap[featuredItem.iconName], { className: 'w-10 h-10 text-white' })
                        }
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-10 flex flex-col justify-center">
                      <span
                        className="inline-block px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white mb-4 w-fit"
                        style={{ backgroundColor: blogColors.accent }}
                      >
                        Featured
                      </span>

                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                        <span className="font-semibold uppercase tracking-wider" style={{ color: blogColors.accent }}>
                          {getCategoryLabel(featuredItem.category)}
                        </span>
                        <span>{formatDate(featuredItem.publishedAt)}</span>
                      </div>

                      <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight" style={{ color: blogColors.dark }}>
                        <Link
                          to={featuredItem.linkPath}
                          className="hover:text-[#64a70b] transition-colors"
                        >
                          {featuredItem.title}
                        </Link>
                      </h2>

                      <p className="text-gray-500 mb-6 line-clamp-3">
                        {featuredItem.excerpt}
                      </p>

                      <Link
                        to={featuredItem.linkPath}
                        className="inline-flex items-center gap-2 font-semibold text-sm hover:gap-3 transition-all duration-200"
                        style={{ color: blogColors.dark }}
                      >
                        Read Article
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              )}

              {/* Regular Posts */}
              {paginatedItems
                .filter(item => !(currentPage === 1 && activeFilter === 'all' && item === featuredItem))
                .map((item, index) => (
                  <motion.article
                    key={item.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    {/* Image placeholder */}
                    <div
                      className="aspect-[16/10] flex items-center justify-center relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${blogColors.dark} 0%, #2d5a47 100%)`
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-15 pointer-events-none"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                        }}
                      />
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center relative z-10"
                        style={{ backgroundColor: blogColors.accent }}
                      >
                        {item.iconName && iconMap[item.iconName] &&
                          React.createElement(iconMap[item.iconName], { className: 'w-7 h-7 text-white' })
                        }
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-3 text-xs">
                        <span className="font-semibold uppercase tracking-wider" style={{ color: blogColors.accent }}>
                          {item.type === 'case-study' ? 'Case Study' : getCategoryLabel(item.category)}
                        </span>
                        <span className="text-gray-400">{formatDate(item.publishedAt)}</span>
                      </div>

                      <h3 className="text-lg font-bold mb-3 leading-snug line-clamp-2" style={{ color: blogColors.dark }}>
                        <Link
                          to={item.linkPath}
                          className="hover:text-[#64a70b] transition-colors"
                        >
                          {item.title}
                        </Link>
                      </h3>

                      <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                        {item.excerpt}
                      </p>

                      <Link
                        to={item.linkPath}
                        className="inline-flex items-center gap-2 font-semibold text-sm hover:gap-3 transition-all duration-200"
                        style={{ color: blogColors.dark }}
                      >
                        {item.type === 'case-study' ? 'Read Case Study' : 'Read Article'}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.article>
                ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredItems.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No posts found</p>
              <p className="text-gray-400 mt-1">Try selecting a different category</p>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-16">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#64a70b] hover:bg-[#64a70b] hover:text-white disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-11 h-11 rounded-full border-2 font-semibold transition-all duration-200 ${
                    currentPage === page
                      ? 'border-[#64a70b] bg-[#64a70b] text-white'
                      : 'border-gray-200 text-gray-500 hover:border-[#64a70b]'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#64a70b] hover:bg-[#64a70b] hover:text-white disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section
          className="relative py-20 px-6 overflow-hidden"
          style={{ backgroundColor: blogColors.dark }}
        >
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'url(/ConcreteTexture.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              mixBlendMode: 'overlay',
            }}
          />

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <h2
              className="hearns-font text-3xl md:text-4xl lg:text-5xl text-white mb-4"
              style={{ transform: 'rotate(-1deg)' }}
            >
              Ready to Print?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
              Got a project in mind? Get in touch and we'll help bring your ideas to life with quality print.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 rounded-full text-white font-bold text-base hover:scale-105 transition-transform duration-200"
              style={{ backgroundColor: blogColors.accent }}
            >
              Get a Quote
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogList;
