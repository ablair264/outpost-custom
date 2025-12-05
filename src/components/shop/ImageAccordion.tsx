import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface AccordionItem {
  id: string;
  image_url: string;
  title: string;
  description: string;
  link_url?: string;
  order_position: number;
  is_active: boolean;
}

interface ImageAccordionProps {
  items: AccordionItem[];
}

const ImageAccordion: React.FC<ImageAccordionProps> = ({ items }) => {
  const navigate = useNavigate();

  const handleItemClick = (item: AccordionItem) => {
    if (item.link_url) {
      if (item.link_url.startsWith('/')) {
        navigate(item.link_url);
      } else {
        window.location.href = item.link_url;
      }
    }
  };

  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-8 lg:px-16 xl:px-24 bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="group flex max-md:flex-col justify-center gap-2 w-full">
          {items.map((item) => (
            <article
              key={item.id}
              className="group/article relative w-full md:w-[20%] md:hover:w-full rounded-xl overflow-hidden transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.15)] before:absolute before:inset-x-0 before:bottom-0 before:h-1/3 before:bg-gradient-to-t before:from-black/50 before:transition-opacity before:opacity-0 hover:before:opacity-100 cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              <div className="absolute inset-0 text-white z-10 p-3 md:p-6 flex flex-col justify-end w-full pointer-events-none">
                <h1 className="text-xl font-medium whitespace-nowrap truncate opacity-0 group-hover/article:opacity-100 translate-y-2 group-hover/article:translate-y-0 transition duration-200 ease-[cubic-bezier(.5,.85,.25,1.8)] group-hover/article:delay-300">
                  {item.title}
                </h1>
                <span className="text-3xl font-medium whitespace-nowrap truncate opacity-0 group-hover/article:opacity-100 translate-y-2 group-hover/article:translate-y-0 transition duration-200 ease-[cubic-bezier(.5,.85,.25,1.8)] group-hover/article:delay-500">
                  {item.description}
                </span>
              </div>
              <img
                className="object-cover h-72 md:h-[420px] w-full pointer-events-none"
                src={item.image_url}
                alt={item.title}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageAccordion;
