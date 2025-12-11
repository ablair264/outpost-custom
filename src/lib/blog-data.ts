// Blog Posts and Case Studies Data
import { BlogPost, CaseStudy, ContentBlock } from './blog-types';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Initial Blog Posts
export const blogPosts: BlogPost[] = [
  {
    id: generateId(),
    slug: 'vehicle-signwriting-transform-your-business',
    title: 'The Power of Vehicle Signwriting: Transform Your Business on Wheels',
    excerpt: 'Your vehicle is more than just transport – it\'s a moving billboard that works around the clock. Discover how professional vehicle signwriting can transform your business visibility.',
    category: 'signage',
    tags: ['Vehicle Signwriting', 'Business Branding', 'Marketing'],
    iconName: 'Car',
    author: {
      name: 'James Thompson',
      role: 'Signage Specialist at Outpost Custom',
      bio: 'James has been helping businesses stand out on the road for over 10 years. When he\'s not designing vehicle wraps, he\'s probably out spotting interesting vans in the wild.',
    },
    publishedAt: '2025-12-10',
    readTime: 7,
    featured: true,
    blocks: [
      {
        id: generateId(),
        type: 'text',
        content: '<p>Picture this: you\'re sitting in traffic, tapping your fingers on the steering wheel, when a van pulls up alongside. Your eyes drift to its side – a striking design, bold colours, a phone number you can actually remember. By the time the lights change, you\'ve already decided that\'s who you\'ll call for your bathroom renovation.</p><p>That\'s the power of vehicle signwriting. It\'s not just decoration – it\'s one of the most cost-effective forms of advertising available to small and medium businesses. And unlike online ads that disappear the moment you stop paying, your vehicle keeps working for you every single day.</p>',
      },
      {
        id: generateId(),
        type: 'heading',
        content: 'Why Vehicle Signwriting Works',
        level: 2,
      } as ContentBlock,
      {
        id: generateId(),
        type: 'text',
        content: '<p>The numbers speak for themselves. A single vehicle wrap can generate between 30,000 to 70,000 impressions daily, depending on your driving habits. That\'s potential customers seeing your brand at traffic lights, in car parks, parked outside jobs, and cruising down the high street.</p><p>Unlike other advertising, you\'re not paying per view. You invest once, and that investment keeps delivering for years. Most quality vehicle graphics last 5-7 years with proper care – that\'s thousands of pounds worth of equivalent advertising space.</p>',
      },
      {
        id: generateId(),
        type: 'info-box',
        content: JSON.stringify({
          title: 'Did You Know?',
          text: 'Research shows that 97% of people recall ads on vehicles, compared to just 19% for static billboards. Your van isn\'t just transport – it\'s your most powerful marketing tool.',
        }),
      },
      {
        id: generateId(),
        type: 'heading',
        content: 'Full Wrap vs. Partial Graphics: What\'s Right for You?',
        level: 2,
      } as ContentBlock,
      {
        id: generateId(),
        type: 'text',
        content: '<p>When it comes to vehicle graphics, there\'s no one-size-fits-all. The right choice depends on your budget, your brand, and what you\'re trying to achieve.</p>',
      },
      {
        id: generateId(),
        type: 'heading',
        content: 'Full Vehicle Wraps',
        level: 3,
      } as ContentBlock,
      {
        id: generateId(),
        type: 'text',
        content: '<p>The showstopper. Full wraps cover every panel of your vehicle in printed vinyl, creating a seamless, eye-catching design that\'s impossible to ignore. They\'re ideal for businesses that want maximum impact and have the budget to match. Full wraps also protect your paintwork, which can add to the vehicle\'s resale value.</p>',
      },
      {
        id: generateId(),
        type: 'heading',
        content: 'Partial Wraps & Decals',
        level: 3,
      } as ContentBlock,
      {
        id: generateId(),
        type: 'text',
        content: '<p>Strategic graphics on key panels – typically the sides, rear doors, and bonnet. You still get strong visual impact but at a lower cost. This option works brilliantly for businesses that want to look professional without the investment of a full wrap.</p>',
      },
      {
        id: generateId(),
        type: 'heading',
        content: 'Magnetic Signs & Cut Vinyl',
        level: 3,
      } as ContentBlock,
      {
        id: generateId(),
        type: 'text',
        content: '<p>Perfect for those who need flexibility. Magnetic signs can be removed when you\'re off duty, while cut vinyl lettering offers a clean, professional look at the most affordable price point. Great for personal vehicles used for business or those just starting out.</p>',
      },
      {
        id: generateId(),
        type: 'table',
        content: JSON.stringify({
          headers: ['Option', 'Cost', 'Impact', 'Best For'],
          rows: [
            ['Full Wrap', '£££', 'Maximum', 'Established businesses, fleet branding'],
            ['Partial Wrap', '££', 'High', 'Growing businesses, strong brand presence'],
            ['Cut Vinyl/Magnetics', '£', 'Moderate', 'Startups, secondary vehicles, flexibility'],
          ],
        }),
      },
      {
        id: generateId(),
        type: 'heading',
        content: 'Design Tips That Get Results',
        level: 2,
      } as ContentBlock,
      {
        id: generateId(),
        type: 'text',
        content: '<p>Effective vehicle graphics aren\'t about cramming as much information as possible onto every surface. Here\'s what actually works:</p>',
      },
      {
        id: generateId(),
        type: 'list',
        content: JSON.stringify({
          items: [
            '<strong>Keep it simple:</strong> Passing motorists have seconds to absorb your message. Focus on your business name, what you do, and one contact method.',
            '<strong>Think about readability:</strong> That fancy script font might look lovely up close, but can someone read it from 30 metres away at 40mph?',
            '<strong>Use high contrast:</strong> Dark text on light backgrounds (or vice versa) ensures your message pops in all lighting conditions.',
            '<strong>Consider all angles:</strong> Your vehicle will be seen from the front, sides, and rear. Make sure important information appears in multiple places.',
            '<strong>Don\'t forget the back:</strong> When you\'re parked at a job or stuck in traffic, the vehicle behind has plenty of time to note your details.',
          ],
          ordered: false,
        }),
      },
      {
        id: generateId(),
        type: 'quote',
        content: JSON.stringify({
          text: 'The best vehicle graphics tell a story at a glance. You should be able to understand what a business does before you can read a single word.',
          author: 'James Thompson',
          role: 'Outpost Custom',
        }),
      },
      {
        id: generateId(),
        type: 'heading',
        content: 'The Installation Process',
        level: 2,
      } as ContentBlock,
      {
        id: generateId(),
        type: 'text',
        content: '<p>Professional installation makes all the difference. Here\'s what to expect when you work with us:</p>',
      },
      {
        id: generateId(),
        type: 'list',
        content: JSON.stringify({
          items: [
            '<strong>Consultation:</strong> We discuss your goals, measure your vehicle, and talk through options that fit your budget.',
            '<strong>Design:</strong> Our designer creates mockups showing exactly how your vehicle will look. We refine until it\'s perfect.',
            '<strong>Production:</strong> Graphics are printed on premium cast vinyl using UV-stable inks that won\'t fade in the British weather.',
            '<strong>Preparation:</strong> Your vehicle is thoroughly cleaned and decontaminated. Any existing graphics are removed.',
            '<strong>Installation:</strong> Our fitters apply the graphics using specialist techniques to ensure bubble-free, long-lasting results.',
            '<strong>Aftercare:</strong> We provide care instructions and stand behind our work with a comprehensive warranty.',
          ],
          ordered: true,
        }),
      },
      {
        id: generateId(),
        type: 'heading',
        content: 'Caring for Your Vehicle Graphics',
        level: 2,
      } as ContentBlock,
      {
        id: generateId(),
        type: 'text',
        content: '<p>Quality graphics are an investment worth protecting. A few simple habits will keep them looking fresh for years:</p>',
      },
      {
        id: generateId(),
        type: 'list',
        content: JSON.stringify({
          items: [
            'Hand wash where possible, or use touchless car washes',
            'Avoid pressure washers directly on edges',
            'Clean bird droppings and tree sap promptly',
            'Park in the shade when you can to reduce UV exposure',
            'Apply vinyl protectant every few months',
          ],
          ordered: false,
        }),
      },
      {
        id: generateId(),
        type: 'heading',
        content: 'Ready to Transform Your Vehicle?',
        level: 2,
      } as ContentBlock,
      {
        id: generateId(),
        type: 'text',
        content: '<p>Whether you\'re running a single van or managing a fleet, vehicle signwriting is one of the smartest marketing investments you can make. It builds brand recognition, generates leads, and works around the clock – all for a one-time cost.</p><p>At Outpost Custom, we\'ve helped businesses across Kidderminster and beyond turn their vehicles into mobile billboards. From initial design to final installation, we handle everything in-house, giving you complete control over quality and timing.</p><p>Curious about what\'s possible? Get in touch for a free consultation and no-obligation quote. We\'ll visit your premises, measure up your vehicle, and show you exactly what we can do.</p>',
      },
    ],
    relatedPosts: ['choosing-paper-stock-guide', 'business-cards-that-get-kept'],
  },
  {
    id: generateId(),
    slug: 'choosing-paper-stock-guide',
    title: 'The Complete Guide to Choosing Paper Stock for Your Project',
    excerpt: 'From silky smooth to textured and tactile – your choice of paper can transform how your print feels in someone\'s hands. Everything you need to know about GSM, finishes, and when to use what.',
    category: 'design-tips',
    tags: ['Paper Stock', 'Print Design', 'GSM'],
    iconName: 'FileText',
    author: {
      name: 'Sarah Mitchell',
      role: 'Senior Designer at Outpost Custom',
      bio: 'Sarah has been designing for print for over 15 years. When she\'s not helping customers choose the perfect paper, she\'s probably sketching new ideas.',
    },
    publishedAt: '2025-12-08',
    readTime: 8,
    featured: true,
    blocks: [
      {
        id: generateId(),
        type: 'text',
        content: '<p>When you hand someone a business card, brochure, or flyer, they\'re not just seeing your design – they\'re feeling it. The weight, texture, and finish of your paper creates an immediate impression before anyone reads a single word.</p>',
      },
      {
        id: generateId(),
        type: 'heading',
        content: 'Understanding GSM: Weight Matters',
        level: 2,
      } as ContentBlock,
      {
        id: generateId(),
        type: 'text',
        content: '<p>GSM stands for "grams per square metre" and it\'s the universal measure of paper weight. The higher the number, the thicker and heavier the paper feels.</p>',
      },
      {
        id: generateId(),
        type: 'table',
        content: JSON.stringify({
          headers: ['GSM Range', 'Feel', 'Best For'],
          rows: [
            ['80-100 GSM', 'Lightweight, flexible', 'Letterheads, internal documents'],
            ['120-170 GSM', 'Sturdy but foldable', 'Flyers, posters, leaflets'],
            ['200-300 GSM', 'Card-like, rigid', 'Postcards, invitations, covers'],
            ['350-450 GSM', 'Thick, premium feel', 'Business cards, luxury packaging'],
          ],
        }),
      },
    ],
    relatedPosts: ['vehicle-signwriting-transform-your-business'],
  },
  {
    id: generateId(),
    slug: 'why-bleed-matters',
    title: 'Why Bleed Matters: Avoiding White Edges on Your Prints',
    excerpt: 'Nothing ruins a beautiful design like unexpected white borders. Learn how to set up your artwork with proper bleed and safe zones.',
    category: 'print-guides',
    tags: ['Print Setup', 'Bleed', 'Artwork'],
    iconName: 'Image',
    author: {
      name: 'Sarah Mitchell',
      role: 'Senior Designer at Outpost Custom',
    },
    publishedAt: '2025-12-05',
    readTime: 5,
    blocks: [
      {
        id: generateId(),
        type: 'text',
        content: '<p>One of the most common issues we see with print-ready artwork is incorrect bleed settings. Here\'s how to get it right every time.</p>',
      },
    ],
  },
  {
    id: generateId(),
    slug: 'colour-matching-screen-to-print',
    title: 'Colour Matching 101: Getting Screen to Print Right',
    excerpt: 'Why does your print look different from your screen? We explain CMYK, Pantone, and how to get the colours you expect.',
    category: 'design-tips',
    tags: ['Colour', 'CMYK', 'Pantone'],
    iconName: 'Palette',
    author: {
      name: 'Sarah Mitchell',
      role: 'Senior Designer at Outpost Custom',
    },
    publishedAt: '2025-11-28',
    readTime: 6,
    blocks: [
      {
        id: generateId(),
        type: 'text',
        content: '<p>Understanding the difference between RGB and CMYK is crucial for getting accurate print colours.</p>',
      },
    ],
  },
  {
    id: generateId(),
    slug: 'business-cards-that-get-kept',
    title: 'Business Cards That Actually Get Kept: Design Secrets',
    excerpt: 'Most business cards end up in the bin. Here\'s how to create one that stays in the wallet and makes an impression.',
    category: 'print-guides',
    tags: ['Business Cards', 'Design', 'Networking'],
    iconName: 'CreditCard',
    author: {
      name: 'Sarah Mitchell',
      role: 'Senior Designer at Outpost Custom',
    },
    publishedAt: '2025-11-22',
    readTime: 6,
    blocks: [
      {
        id: generateId(),
        type: 'text',
        content: '<p>A business card is often your first physical touchpoint with a potential customer. Make it count.</p>',
      },
    ],
  },
];

// Initial Case Studies
export const caseStudies: CaseStudy[] = [
  {
    id: generateId(),
    slug: 'green-room-cafe',
    title: 'The Green Room Café',
    subtitle: 'How we helped a local Kidderminster café create a cohesive print identity that boosted brand recognition and customer engagement.',
    clientName: 'The Green Room',
    clientLocation: 'Kidderminster, UK',
    industry: 'Hospitality',
    tags: ['Hospitality', 'Full Rebrand', 'Menu Design'],
    iconName: 'Coffee',
    publishedAt: '2025-11-18',
    stats: [
      { value: '5', label: 'Print Products' },
      { value: '2', label: 'Weeks Turnaround' },
      { value: '40%', label: 'Avg. Order Increase' },
      { value: '100%', label: 'Client Satisfaction' },
    ],
    challenge: 'When The Green Room first opened their doors in 2024, they were using a mix of handwritten menus and generic templates downloaded from the internet. While the food was exceptional – locally sourced, beautifully presented – the printed materials didn\'t reflect the quality of what was on the plate.',
    solution: 'We started with a design consultation to understand The Green Room\'s brand values: sustainable, local, welcoming. From there, we developed a print system that could grow with the business. The centrepiece was a new menu design – A4 folded, printed on 350gsm recycled card with a soft-touch matt lamination.',
    deliverables: [
      'Folded Menus',
      'Table Talkers',
      'Loyalty Cards',
      'Business Cards',
      'Pavement A-Board',
      'Gift Vouchers',
    ],
    processSteps: [
      {
        title: 'Discovery & Consultation',
        description: 'We visited The Green Room, tasted the menu, and discussed Emma\'s vision for the brand.',
      },
      {
        title: 'Design Development',
        description: 'Our designer created three initial concepts, each exploring a different direction.',
      },
      {
        title: 'Proof & Approval',
        description: 'We provided digital proofs and a physical sample of the menu on the exact paper stock.',
      },
      {
        title: 'Production & Delivery',
        description: 'All items were printed in-house at our Kidderminster facility.',
      },
    ],
    results: [
      {
        title: 'Increased Average Order',
        description: 'The new menu layout encouraged customers to add sides and drinks, boosting average ticket value by 40%.',
        iconName: 'TrendingUp',
      },
      {
        title: 'Repeat Customers',
        description: 'The loyalty card scheme drove repeat visits, with over 200 cards collected in the first three months.',
        iconName: 'Users',
      },
      {
        title: 'Social Media Boost',
        description: 'Customers regularly share photos of the menus and gift vouchers, extending the café\'s reach organically.',
        iconName: 'Camera',
      },
    ],
    testimonial: {
      text: 'Outpost completely transformed how we present ourselves. Customers now photograph our menus almost as much as the food.',
      author: 'Emma Williams',
      role: 'Owner, The Green Room Café',
    },
    gallery: [
      { iconName: 'BookOpen', label: 'Folded Menu Design', large: true },
      { iconName: 'Square', label: 'Table Talkers' },
      { iconName: 'CreditCard', label: 'Business Cards' },
      { iconName: 'Gift', label: 'Gift Vouchers' },
      { iconName: 'Layers', label: 'Loyalty Cards' },
    ],
    relatedCaseStudies: [],
  },
];

// Helper functions
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find(study => study.slug === slug);
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter(post => post.featured);
}

export function getPostsByCategory(category: string): BlogPost[] {
  if (category === 'all' || !category) return blogPosts;
  if (category === 'case-studies') return [];
  return blogPosts.filter(post => post.category === category);
}

export function getRelatedPosts(slugs: string[]): BlogPost[] {
  return blogPosts.filter(post => slugs.includes(post.slug));
}

export function getRelatedCaseStudies(slugs: string[]): CaseStudy[] {
  return caseStudies.filter(study => slugs.includes(study.slug));
}
