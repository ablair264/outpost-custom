import React, { useState, useEffect } from 'react';
import ImageAccordion, { AccordionItem } from './ImageAccordion';
import { fetchAccordionItems } from '../../utils/supabase';

const ImageAccordionDB: React.FC = () => {
  const [items, setItems] = useState<AccordionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccordionItems();
  }, []);

  const loadAccordionItems = async () => {
    setLoading(true);
    const data = await fetchAccordionItems();
    setItems(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="w-full py-16 md:py-24 px-4 md:px-8 lg:px-16 xl:px-24" style={{ backgroundColor: '#183028' }}>
        <div className="max-w-[1400px] mx-auto flex justify-center items-center h-72">
          <div className="text-white/40">Loading...</div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null; // Don't show section if no items
  }

  return <ImageAccordion items={items} />;
};

export default ImageAccordionDB;
