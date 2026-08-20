import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../types';

interface ProductAccordionSectionProps {
  product: Product;
  bgColor?: string;
}

export const ProductAccordionSection: React.FC<ProductAccordionSectionProps> = ({ product, bgColor = '#188a67' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Generate 5 dynamic, highly accurate, product-specific FAQ items
  const getFaqs = () => {
    const isChocolate = product.name.toLowerCase().includes('chocolate');
    const isSeeds = product.name.toLowerCase().includes('chia') || product.name.toLowerCase().includes('flax') || product.name.toLowerCase().includes('seeds');
    const proteinCount = product.nutrition?.protein || "24";

    return [
      {
        id: '01',
        icon: '🥜',
        category: 'INGREDIENTS & PURITY',
        question: `What makes ${product.name} 100% pure and natural?`,
        answer: isChocolate
          ? `${product.name} is crafted using 100% premium roasted peanuts blended with real dark cocoa and crunchy roasted almonds. We strictly exclude harmful hydrogenated palm oil, trans fats, and artificial chemical preservatives.`
          : isSeeds
          ? `${product.name} combines high-protein slow-roasted peanuts with nutrient-dense superfood seeds. It contains zero added palm oil, zero trans fat, and zero artificial flavors—delivering 100% clean, wholesome nutrition.`
          : `${product.name} is made exclusively from farm-fresh, slow-roasted bold peanuts. We maintain 100% clean ingredients with zero added sugar, zero palm oil, zero trans fats, and zero artificial preservatives.`
      },
      {
        id: '02',
        icon: '🫒',
        category: 'NATURAL QUALITY',
        question: 'Why is there natural oil sitting on top of the jar, and is it normal?',
        answer: 'Yes! Natural oil separation is the ultimate proof of 100% pure nut butter with ZERO hydrogenated palm oil or chemical stabilizers. Simply stir the natural peanut oil back into the jar using a clean spoon before enjoyment. Pro tip: Store unopened jars upside down!'
      },
      {
        id: '03',
        icon: '❄️',
        category: 'STORAGE & SHELF LIFE',
        question: 'How should I store this jar, and does it require refrigeration?',
        answer: 'Refrigeration is completely optional! Storing at cool room temperature keeps the texture smooth, velvety, and easy to spread. Refrigerating will thicken the texture and extend peak freshness for up to 12 months from manufacturing date.'
      },
      {
        id: '04',
        icon: '💪',
        category: 'FITNESS & DIET',
        question: `Is ${product.name} good for muscle building, weight loss, or keto diets?`,
        answer: `Yes! Delivering ${proteinCount}g of clean plant protein per 100g alongside essential healthy fats and dietary fiber, it promotes muscle repair, delivers sustained clean energy without sugar spikes, and keeps you feeling full longer.`
      },
      {
        id: '05',
        icon: '🍞',
        category: 'DAILY USAGE',
        question: 'What are the recommended ways to consume this product daily?',
        answer: 'Enjoy it spread on whole-grain toast, blended into your pre or post-workout protein smoothie, drizzled over warm oatmeal and sliced bananas, or simply eaten by the spoonful for a wholesome guilt-free snack!'
      }
    ];
  };

  const faqs = getFaqs();

  // Compute a slightly darker shade for accents
  const hexToRgb = (hex: string) => {
    const h = hex.replace('#', '');
    return {
      r: parseInt(h.substring(0, 2), 16) || 0,
      g: parseInt(h.substring(2, 4), 16) || 0,
      b: parseInt(h.substring(4, 6), 16) || 0,
    };
  };
  const rgb = hexToRgb(bgColor);

  return (
    <section className="w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ backgroundColor: '#f2f2ec' }}>
      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Background Decorative Aura — top left */}
      <div 
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.07] blur-3xl z-[0]"
        style={{ backgroundColor: bgColor }}
      />
      {/* Background Decorative Aura — bottom right */}
      <div 
        className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.05] blur-3xl z-[0]"
        style={{ backgroundColor: bgColor }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-16">
          <h2
            className="font-normal tracking-normal [word-spacing:0.05em] leading-[1.1] !font-anton uppercase text-textured-any text-[40px] lg:text-[100px] lg:leading-[110px] lg:-mb-[12px] lg:pb-[12px] lg:font-bold"
            style={{ backgroundColor: bgColor, textTransform: 'uppercase' }}
          >
            Everything You Need To Know
          </h2>
        </div>

        {/* CSS for accordion hover/active styling */}
        <style>{`
          .faq-accordion-item {
            transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .faq-accordion-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08), 0 2px 8px rgba(0,0,0,0.04);
          }
          .faq-accordion-item.faq-active {
            box-shadow: 0 8px 30px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12), 0 2px 8px rgba(0,0,0,0.04);
          }
          .faq-toggle-icon {
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          .faq-index-badge {
            transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          }
        `}</style>

        {/* 5 Accordion Items */}
        <div className="space-y-3 md:space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <motion.div
                key={faq.id}
                layout
                className={`faq-accordion-item rounded-2xl md:rounded-3xl overflow-hidden border ${
                  isOpen 
                    ? 'faq-active bg-white border-slate-200/60' 
                    : 'bg-white/80 backdrop-blur-sm border-slate-200/40 hover:bg-white hover:border-slate-200/60'
                }`}
                style={isOpen ? { 
                  borderLeftWidth: '3px', 
                  borderLeftColor: bgColor 
                } : undefined}
              >
                {/* Accordion Header Button */}
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 sm:p-6 md:p-7 text-left flex items-center justify-between gap-4 focus:outline-none group cursor-pointer"
                >
                  <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
                    {/* Index Badge with emoji icon */}
                    <div
                      className="faq-index-badge w-11 h-11 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 text-lg md:text-xl"
                      style={{ 
                        backgroundColor: isOpen ? bgColor : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)`,
                      }}
                    >
                      <span className={`${isOpen ? 'grayscale-0 brightness-200' : ''}`} style={{ filter: isOpen ? 'brightness(2) grayscale(0)' : 'none' }}>
                        {faq.icon}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <span 
                        className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] block mb-0.5 transition-colors duration-300"
                        style={{ color: isOpen ? bgColor : '#94a3b8' }}
                      >
                        {faq.category}
                      </span>
                      <h3 className={`text-[15px] sm:text-base md:text-lg font-bold leading-snug transition-colors duration-300 ${
                        isOpen ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'
                      }`}>
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  {/* Toggle chevron icon */}
                  <div 
                    className="faq-toggle-icon w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ 
                      backgroundColor: isOpen ? bgColor : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.06)`, 
                      color: isOpen ? '#ffffff' : bgColor,
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>

                {/* Accordion Content Panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 md:px-7 pb-6 md:pb-7 pt-0">
                        <div 
                          className="ml-[60px] md:ml-[68px] p-4 md:p-5 rounded-xl md:rounded-2xl text-slate-600 text-sm sm:text-[15px] md:text-base leading-relaxed font-medium"
                          style={{ 
                            backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.04)`,
                            borderLeft: `2px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`,
                          }}
                        >
                          {faq.answer}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA hint */}
        <div className="mt-10 md:mt-14 text-center">
          <p className="text-slate-400 text-xs md:text-sm font-semibold tracking-wide">
            Have more questions?{' '}
            <a 
              href="https://wa.me/919310476476" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:no-underline transition-all duration-300 font-bold"
              style={{ color: bgColor }}
            >
              Chat with us on WhatsApp
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductAccordionSection;
