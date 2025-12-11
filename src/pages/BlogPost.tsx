import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Info,
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
  CheckCircle,
} from 'lucide-react';
import PrintingFontStyles from '../components/printing/PrintingFontStyles';
import { getBlogPostBySlug, getRelatedPosts } from '../lib/blog-data';
import { blogCategories, blogColors, ContentBlock } from '../lib/blog-types';

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
  Info,
  Quote,
  CheckCircle,
};

// Block renderer component
const BlockRenderer: React.FC<{ block: ContentBlock }> = ({ block }) => {
  switch (block.type) {
    case 'text':
      return (
        <div
          className="prose prose-lg max-w-none prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-[#183028] prose-a:text-[#64a70b] prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: block.content }}
        />
      );

    case 'heading':
      const level = (block as any).level || 2;
      const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
      return (
        <HeadingTag
          className={`font-bold uppercase relative pl-4 ${
            level === 2 ? 'text-2xl md:text-3xl mt-12 mb-6' :
            level === 3 ? 'text-xl md:text-2xl mt-8 mb-4' :
            'text-lg md:text-xl mt-6 mb-3'
          }`}
          style={{ color: blogColors.dark }}
        >
          <span
            className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
            style={{ backgroundColor: blogColors.accent }}
          />
          {block.content}
        </HeadingTag>
      );

    case 'quote': {
      const quoteData = JSON.parse(block.content);
      return (
        <blockquote
          className="bg-gray-50 border-l-4 py-6 px-8 my-8 italic text-gray-600"
          style={{ borderLeftColor: blogColors.accent }}
        >
          <p className="text-lg mb-4">"{quoteData.text}"</p>
          {quoteData.author && (
            <footer className="text-sm not-italic">
              <strong className="text-[#183028]">{quoteData.author}</strong>
              {quoteData.role && <span className="text-gray-500"> — {quoteData.role}</span>}
            </footer>
          )}
        </blockquote>
      );
    }

    case 'info-box': {
      const infoData = JSON.parse(block.content);
      return (
        <div
          className="relative rounded-xl p-6 my-8 overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${blogColors.dark} 0%, #2d5a47 100%)` }}
        >
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
          <div className="relative z-10">
            <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
              <Info className="w-5 h-5" style={{ color: blogColors.accent }} />
              {infoData.title}
            </h4>
            <p className="text-white/85 text-sm leading-relaxed">{infoData.text}</p>
          </div>
        </div>
      );
    }

    case 'table': {
      const tableData = JSON.parse(block.content);
      return (
        <div className="overflow-x-auto my-8">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr style={{ backgroundColor: blogColors.dark }}>
                {tableData.headers.map((header: string, i: number) => (
                  <th
                    key={i}
                    className={`text-white font-semibold p-4 text-left ${
                      i === 0 ? 'rounded-tl-lg' : i === tableData.headers.length - 1 ? 'rounded-tr-lg' : ''
                    }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map((row: string[], rowIndex: number) => (
                <tr
                  key={rowIndex}
                  className={rowIndex % 2 === 1 ? 'bg-gray-50' : ''}
                >
                  {row.map((cell: string, cellIndex: number) => (
                    <td
                      key={cellIndex}
                      className={`p-4 border-b border-gray-200 ${
                        rowIndex === tableData.rows.length - 1 && cellIndex === 0 ? 'rounded-bl-lg' :
                        rowIndex === tableData.rows.length - 1 && cellIndex === row.length - 1 ? 'rounded-br-lg' : ''
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'list': {
      const listData = JSON.parse(block.content);
      const ListTag = listData.ordered ? 'ol' : 'ul';
      return (
        <ListTag className={`my-6 pl-6 space-y-3 ${listData.ordered ? 'list-decimal' : 'list-disc'}`}>
          {listData.items.map((item: string, i: number) => (
            <li
              key={i}
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: item }}
            />
          ))}
        </ListTag>
      );
    }

    default:
      return null;
  }
};

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const post = slug ? getBlogPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-[#64a70b] hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const relatedPosts = post.relatedPosts ? getRelatedPosts(post.relatedPosts) : [];

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

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post.title;
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    };
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      return;
    }
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <>
      <PrintingFontStyles />

      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <nav className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm">
            <Link to="/" className="text-[#64a70b] hover:underline">Home</Link>
            <span className="text-gray-400">›</span>
            <Link to="/blog" className="text-[#64a70b] hover:underline">Blog</Link>
            <span className="text-gray-400">›</span>
            <span className="text-gray-500 truncate max-w-[200px]">{post.title}</span>
          </div>
        </nav>

        {/* Article Header */}
        <header
          className="relative py-16 md:py-20 px-6 overflow-hidden"
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

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.span
              className="inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6"
              style={{ backgroundColor: `${blogColors.accent}33`, color: blogColors.accent }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {getCategoryLabel(post.category)}
            </motion.span>

            <motion.h1
              className="hearns-font text-3xl md:text-4xl lg:text-5xl text-white mb-6 leading-tight"
              style={{ transform: 'rotate(-0.5deg)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {post.title}
            </motion.h1>

            <motion.div
              className="flex flex-wrap items-center justify-center gap-6 text-white/70 text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 opacity-80" />
                {formatDate(post.publishedAt)}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 opacity-80" />
                {post.readTime} min read
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 opacity-80" />
                By {post.author.name}
              </div>
            </motion.div>
          </div>
        </header>

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-6 py-12 md:py-16">
          {/* Content blocks */}
          <div className="article-content">
            {post.blocks.map((block) => (
              <BlockRenderer key={block.id} block={block} />
            ))}
          </div>

          {/* Share Section */}
          <div className="flex items-center gap-4 py-8 border-y border-gray-200 my-12">
            <span className="font-semibold text-[#183028]">Share this article:</span>
            <div className="flex gap-3">
              {[
                { platform: 'facebook', icon: Facebook },
                { platform: 'twitter', icon: Twitter },
                { platform: 'linkedin', icon: Linkedin },
                { platform: 'copy', icon: Link2 },
              ].map(({ platform, icon: Icon }) => (
                <button
                  key={platform}
                  onClick={() => handleShare(platform)}
                  className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#64a70b] hover:bg-[#64a70b]/10 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Author Box */}
          <div className="flex flex-col sm:flex-row gap-6 bg-gray-50 p-6 md:p-8 rounded-xl mb-12">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: blogColors.accent }}
            >
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-[#183028] mb-1">{post.author.name}</h4>
              <p className="text-sm font-medium mb-3" style={{ color: blogColors.accent }}>
                {post.author.role}
              </p>
              {post.author.bio && (
                <p className="text-gray-500 text-sm leading-relaxed">{post.author.bio}</p>
              )}
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="bg-gray-50 py-16 px-6">
            <div className="max-w-5xl mx-auto">
              <h2
                className="text-2xl md:text-3xl font-bold uppercase text-center mb-10"
                style={{ color: blogColors.dark }}
              >
                You Might Also Like
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div
                      className="h-36 flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${blogColors.dark} 0%, #2d5a47 100%)`
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: blogColors.accent }}
                      >
                        {relatedPost.iconName && iconMap[relatedPost.iconName] &&
                          React.createElement(iconMap[relatedPost.iconName], { className: 'w-6 h-6 text-white' })
                        }
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-[#183028] mb-2 leading-tight line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-xs text-gray-500">{formatDate(relatedPost.publishedAt)}</p>
                    </div>
                  </Link>
                ))}
              </div>
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
              Need Help Choosing?
            </h2>
            <p className="text-white/80 mb-8 max-w-lg mx-auto">
              Book a free design consultation and we'll help you pick the perfect solution for your project.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 rounded-full text-white font-bold hover:scale-105 transition-transform duration-200"
              style={{ backgroundColor: blogColors.accent }}
            >
              Book Consultation
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogPost;
