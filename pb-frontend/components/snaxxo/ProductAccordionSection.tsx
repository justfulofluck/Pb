import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../types';

interface ProductAccordionSectionProps {
  product: Product;
  bgColor?: string;
}

export const ProductAccordionSection: React.FC<ProductAccordionSectionProps> = ({ product, bgColor = '#188a67' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getFaqs = () => {
    const isChocolate = product.name.toLowerCase().includes('chocolate');
    const isSeeds = product.name.toLowerCase().includes('chia') || product.name.toLowerCase().includes('flax') || product.name.toLowerCase().includes('seeds');
    const proteinCount = product.nutrition?.protein || "24";

    return [
      {
        id: '01',
        question: `What makes ${product.name} 100% pure and natural?`,
        answer: isChocolate
          ? `${product.name} is crafted using 100% premium roasted peanuts blended with real dark cocoa and crunchy roasted almonds. We strictly exclude harmful hydrogenated palm oil, trans fats, and artificial chemical preservatives.`
          : isSeeds
          ? `${product.name} combines high-protein slow-roasted peanuts with nutrient-dense superfood seeds. It contains zero added palm oil, zero trans fat, and zero artificial flavors—delivering 100% clean, wholesome nutrition.`
          : `${product.name} is made exclusively from farm-fresh, slow-roasted bold peanuts. We maintain 100% clean ingredients with zero added sugar, zero palm oil, zero trans fats, and zero artificial preservatives.`
      },
      {
        id: '02',
        question: 'Why is there natural oil sitting on top of the jar, and is it normal?',
        answer: 'Yes! Natural oil separation is the ultimate proof of 100% pure nut butter with ZERO hydrogenated palm oil or chemical stabilizers. Simply stir the natural peanut oil back into the jar using a clean spoon before enjoyment. Pro tip: Store unopened jars upside down!'
      },
      {
        id: '03',
        question: 'How should I store this jar, and does it require refrigeration?',
        answer: 'Refrigeration is completely optional! Storing at cool room temperature keeps the texture smooth, velvety, and easy to spread. Refrigerating will thicken the texture and extend peak freshness for up to 12 months from manufacturing date.'
      },
      {
        id: '04',
        question: `Is ${product.name} good for muscle building, weight loss, or keto diets?`,
        answer: `Yes! Delivering ${proteinCount}g of clean plant protein per 100g alongside essential healthy fats and dietary fiber, it promotes muscle repair, delivers sustained clean energy without sugar spikes, and keeps you feeling full longer.`
      },
      {
        id: '05',
        question: 'What are the recommended ways to consume this product daily?',
        answer: 'Enjoy it spread on whole-grain toast, blended into your pre or post-workout protein smoothie, drizzled over warm oatmeal and sliced bananas, or simply eaten by the spoonful for a wholesome guilt-free snack!'
      }
    ];
  };

  const faqs = getFaqs();

  // Neumorphic background color base
  const bgNeumorph = '#f2f2ec';

  return (
    <section className="w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ backgroundColor: bgNeumorph }}>
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* CSS for neumorphism */}
        <style>{`
          .neumorph-container {
            background: #f2f2ec;
            box-shadow: 8px 8px 16px #dadad2, -8px -8px 16px #ffffff;
            border-radius: 20px;
          }
          .neumorph-btn {
            background: #f2f2ec;
            box-shadow: 4px 4px 8px #dadad2, -4px -4px 8px #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease-in-out;
          }
          .neumorph-btn:active {
            box-shadow: inset 4px 4px 8px #dadad2, inset -4px -4px 8px #ffffff;
          }
          .neumorph-open .neumorph-btn {
            box-shadow: inset 4px 4px 8px #dadad2, inset -4px -4px 8px #ffffff;
          }
        `}</style>

        <div className="space-y-6 md:space-y-8 max-w-3xl mx-auto mt-8 md:mt-12">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <motion.div
                key={faq.id}
                layout
                className={`neumorph-container overflow-hidden ${isOpen ? 'neumorph-open' : ''}`}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 sm:p-6 md:px-8 text-left flex items-center justify-between focus:outline-none cursor-pointer"
                >
                  <h3 className="text-base sm:text-lg font-medium text-slate-700">
                    {faq.question}
                  </h3>

                  {/* Toggle button */}
                  <div className="neumorph-btn w-10 h-10 shrink-0 ml-4">
                    <span className="text-[#8e9bae] font-light text-2xl leading-none" style={{ marginTop: '-2px' }}>
                      {isOpen ? '-' : '+'}
                    </span>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 md:px-8 pb-6 md:pb-8 pt-0">
                        <div className="text-slate-500 text-sm sm:text-base leading-relaxed">
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

      </div>
    </section>
  );
};

export default ProductAccordionSection;
