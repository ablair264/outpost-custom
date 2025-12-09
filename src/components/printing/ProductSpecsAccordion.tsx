import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { printingColors } from '../../lib/printing-theme';
import { PrintingProduct } from '../../lib/printing-products';

interface ProductSpecsAccordionProps {
  product: PrintingProduct;
  className?: string;
}

interface SpecSection {
  title: string;
  content: string[];
}

// Parse product description to extract spec sections
function parseProductSpecs(product: PrintingProduct): SpecSection[] {
  const desc = product.full_description;
  const sections: SpecSection[] = [];

  // Sizes section
  const sizePatterns = [
    /Available in [\d\w\s,]+sizes?[^.]+/gi,
    /\d+mm x \d+mm/gi,
    /A\d\s/gi,
    /DL/gi,
  ];
  const sizes: string[] = [];

  // Extract size mentions
  const sizeMatch = desc.match(/Available in[^.]+(?:\.|Available|From)/gi);
  if (sizeMatch) {
    sizes.push(...sizeMatch.map(s => s.replace(/Available$|From$/i, '').trim()));
  }

  // Common size formats
  if (desc.includes('85mm x 55mm')) sizes.push('85mm x 55mm (Credit Card Size)');
  if (desc.includes('A4')) sizes.push('A4 (210 x 297mm)');
  if (desc.includes('A5')) sizes.push('A5 (148 x 210mm)');
  if (desc.includes('A6')) sizes.push('A6 (105 x 148.5mm)');
  if (desc.includes('DL')) sizes.push('DL (99 x 210mm)');

  if (sizes.length > 0) {
    sections.push({
      title: 'Sizes & Dimensions',
      content: Array.from(new Set(sizes)).slice(0, 6),
    });
  }

  // Paper options section
  const paperOptions: string[] = [];
  if (desc.includes('gsm')) {
    const gsmMatches = desc.match(/\d+gsm[^,.\d]+/gi);
    if (gsmMatches) {
      paperOptions.push(...gsmMatches.map(s => s.trim()));
    }
  }
  if (desc.toLowerCase().includes('uncoated')) paperOptions.push('Uncoated Stock');
  if (desc.toLowerCase().includes('coated silk')) paperOptions.push('Coated Silk');
  if (desc.toLowerCase().includes('textured')) paperOptions.push('Textured Paper Available');

  if (paperOptions.length > 0) {
    sections.push({
      title: 'Paper Options',
      content: Array.from(new Set(paperOptions)).slice(0, 6),
    });
  }

  // Finishing options section
  const finishingOptions: string[] = [];
  if (desc.toLowerCase().includes('matt lamination')) finishingOptions.push('Matt Lamination');
  if (desc.toLowerCase().includes('gloss lamination')) finishingOptions.push('Gloss Lamination');
  if (desc.toLowerCase().includes('biodegradable')) finishingOptions.push('Biodegradable Lamination Options');
  if (desc.toLowerCase().includes('rounded corner')) finishingOptions.push('Rounded Corners');
  if (desc.toLowerCase().includes('drill')) finishingOptions.push('Drilled Holes');
  if (desc.toLowerCase().includes('wire') || desc.toLowerCase().includes('wiro')) finishingOptions.push('Wire Binding');
  if (desc.toLowerCase().includes('saddle stitch')) finishingOptions.push('Saddle Stitched (Stapled)');
  if (desc.toLowerCase().includes('eyelet')) finishingOptions.push('Metal Eyelets');
  if (desc.toLowerCase().includes('fold')) finishingOptions.push('Creased & Folded');

  if (finishingOptions.length > 0) {
    sections.push({
      title: 'Finishing Options',
      content: Array.from(new Set(finishingOptions)),
    });
  }

  // Quantities section
  const quantities: string[] = [];
  const fromMatch = desc.match(/From (\d+)/i);
  if (fromMatch) {
    quantities.push(`Minimum order: ${fromMatch[1]} units`);
  }
  if (desc.toLowerCase().includes('no minimum')) {
    quantities.push('No minimum order');
  }
  if (desc.toLowerCase().includes('mix')) {
    quantities.push('Mix your designs within one order');
  }
  if (desc.toLowerCase().includes('bespoke')) {
    quantities.push('Bespoke sizes available on request');
  }

  if (quantities.length > 0) {
    sections.push({
      title: 'Quantities',
      content: quantities,
    });
  }

  return sections;
}

// Single accordion item component
const AccordionItem: React.FC<{
  section: SpecSection;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ section, isOpen, onToggle }) => (
  <div className="border-b border-gray-100 last:border-b-0">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-4 px-1 text-left transition-colors hover:bg-gray-50"
    >
      <span
        className="font-semibold text-base"
        style={{ color: printingColors.dark }}
      >
        {section.title}
      </span>
      <ChevronDown
        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`}
      />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <ul className="pb-4 px-1 space-y-2">
            {section.content.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: printingColors.accent }}
                />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export const ProductSpecsAccordion: React.FC<ProductSpecsAccordionProps> = ({
  product,
  className,
}) => {
  const [openSections, setOpenSections] = React.useState<string[]>([]);
  const sections = parseProductSpecs(product);

  const toggleSection = (title: string) => {
    setOpenSections((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  if (sections.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h3
        className="font-bold text-lg mb-4"
        style={{ color: printingColors.dark }}
      >
        Specifications
      </h3>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {sections.map((section) => (
          <AccordionItem
            key={section.title}
            section={section}
            isOpen={openSections.includes(section.title)}
            onToggle={() => toggleSection(section.title)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductSpecsAccordion;
