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
    const name = (product.name || '').toLowerCase();

    // 1. Oats with Dark Chocolate Mixnut & Berry
    if (name.includes('oat')) {
      return [
        {
          id: '01',
          question: `What makes ${product.name} a superior breakfast choice?`,
          answer: `${product.name} combines 100% whole grain rolled oats with rich antioxidant dark cocoa, sliced California almonds, and sun-dried berries—delivering high dietary fiber and sustained morning energy without refined sugar crashes.`
        },
        {
          id: '02',
          question: 'How do I prepare these oats for quick breakfast or overnight meals?',
          answer: 'Cook with warm milk or water on a stove for 3-4 minutes, or soak overnight in the refrigerator with milk or yogurt for delicious, creamy ready-to-eat Overnight Oats.'
        },
        {
          id: '03',
          question: 'Does this contain refined white sugar or artificial sweeteners?',
          answer: 'No refined white sugar, trans fats, or artificial flavors are used. The delightful flavor profile comes naturally from whole dried berries, roasted nuts, and real cocoa.'
        },
        {
          id: '04',
          question: 'How does it help with digestion, heart health, and weight management?',
          answer: 'Rich in beta-glucan soluble dietary fiber and wholesome plant protein, it aids smooth gut digestion, helps maintain healthy cholesterol levels, and keeps you feeling full longer.'
        },
        {
          id: '05',
          question: 'Can I combine this with Pinobite Peanut Butter?',
          answer: 'Absolutely! Adding a generous tablespoon of Pinobite Peanut Butter and fresh sliced bananas on top creates the ultimate high-protein fitness powerhouse breakfast.'
        }
      ];
    }

    // 2. Dark Chocolate Berries & Almonds Muesli
    if (name.includes('muesli')) {
      return [
        {
          id: '01',
          question: `What premium ingredients are packed inside ${product.name}?`,
          answer: 'An artisan blend of oven-toasted multigrain flakes, real dark chocolate curls, roasted California almond slivers, pumpkin seeds, and tart dried cranberries for an irresistible crunch.'
        },
        {
          id: '02',
          question: 'What are the best ways to enjoy this muesli daily?',
          answer: 'Pour over chilled dairy or plant-based milk, layer into Greek yogurt breakfast parfaits, or simply enjoy straight out of the box as a wholesome, crunchy afternoon snack.'
        },
        {
          id: '03',
          question: 'Is this muesli fried or roasted with added oils?',
          answer: 'It is 100% slow-oven-toasted without any deep frying, palm oils, or artificial preservatives, locking in essential micronutrients and natural crispness.'
        },
        {
          id: '04',
          question: 'How should I store this pack to maintain peak crunch?',
          answer: 'After opening, seal the inner pouch tightly or transfer the contents to an airtight container stored in a cool, dry pantry away from moisture and direct sunlight.'
        },
        {
          id: '05',
          question: 'Why choose this over typical processed breakfast cereals?',
          answer: 'Unlike refined supermarket cereals loaded with empty sugar calories, this muesli delivers complex carbs, heart-healthy nut fats, and real fruit antioxidants for long-lasting vitality.'
        }
      ];
    }

    // 3. American Nuts Crunchy High Protein Peanut Butter
    if (name.includes('american')) {
      return [
        {
          id: '01',
          question: 'What gives American Nuts Peanut Butter its signature multi-nut crunch?',
          answer: 'We slow-roast premium bold peanuts to golden perfection, then blend them with real crushed California almonds and cashew nibs, crafting an unbeatable nutty crunch with 30g of plant protein per 100g.'
        },
        {
          id: '02',
          question: 'Does it contain any added oils, preservatives, or artificial flavorings?',
          answer: 'Zero hydrogenated palm oil, zero trans fats, zero chemical stabilizers, and zero synthetic preservatives. It is 100% clean, vegetarian, and nutrient-dense fuel.'
        },
        {
          id: '03',
          question: 'Why is it an ideal companion for gym workouts and athletic training?',
          answer: 'With its concentrated plant protein profile and healthy mono-unsaturated fats, it provides clean sustained stamina before workouts and speeds up post-exercise muscle recovery.'
        },
        {
          id: '04',
          question: 'Why does natural oil sit on top of the jar, and how do I store it?',
          answer: 'Natural peanut oil separation is the ultimate badge of 100% pure nut butter with no chemical emulsifiers! Simply stir with a spoon before use. Storing in a cool pantry keeps it easily spreadable.'
        },
        {
          id: '05',
          question: 'What are the most popular recipes for American Nuts Peanut Butter?',
          answer: 'Spread over warm multigrain toast, blend into post-workout whey protein smoothies, swirl into warm morning porridge, or enjoy directly by the spoonful for clean guilt-free indulgence.'
        }
      ];
    }

    // 4. Dark Chocolate & Almond Crunchy Peanut Butter
    if (name.includes('chocolate') && (name.includes('almond') || name.includes('dark'))) {
      return [
        {
          id: '01',
          question: 'What type of chocolate is used in Dark Chocolate & Almond Peanut Butter?',
          answer: 'We use genuine antioxidant-rich dark cocoa powder smoothly blended with slow-roasted bold peanuts and crushed California roasted almond bits for a gourmet dessert-like crunch.'
        },
        {
          id: '02',
          question: 'Is this truly healthy despite tasting like rich chocolate spread?',
          answer: 'Yes! Unlike commercial chocolate spreads that are over 50% refined palm oil and sugar, ours is high in plant protein, low in sugar, and powered exclusively by real nuts and wholesome dark cocoa.'
        },
        {
          id: '03',
          question: 'Can children and fitness athletes enjoy this as a daily treat?',
          answer: 'Absolutely! It delivers clean protein, essential magnesium, and healthy dietary fats without the severe sugar spikes and crashes of conventional chocolate spreads.'
        },
        {
          id: '04',
          question: 'How should I store this jar to preserve a smooth, velvety texture?',
          answer: 'Store at cool room temperature in a dry pantry for smooth spreadability. If refrigerated, allow the jar to sit at room temperature for 5 minutes before spreading.'
        },
        {
          id: '05',
          question: 'What are creative pairing ideas for this dark chocolate flavor?',
          answer: 'Drizzle over warm pancakes or waffles, dip fresh banana and strawberry slices, fold into overnight chia pudding, or blend into creamy chocolate banana protein shakes.'
        }
      ];
    }

    // 5. Mango With Chia Seeds Peanut Butter
    if (name.includes('mango')) {
      return [
        {
          id: '01',
          question: 'How is the refreshing tropical mango flavor crafted in this peanut butter?',
          answer: 'We infuse natural Alphonso mango essence with golden slow-roasted peanuts and raw black chia seeds, creating a delightful sweet-tangy tropical flavor profile with a pleasant popping crunch.'
        },
        {
          id: '02',
          question: 'What superfood nutritional benefits do raw Chia Seeds provide?',
          answer: 'Chia seeds enrich every spoonful with essential Omega-3 fatty acids, insoluble dietary fiber, and vital minerals like calcium and iron, promoting optimal digestion and cardiovascular health.'
        },
        {
          id: '03',
          question: 'Are there any artificial colors or synthetic mango essences used?',
          answer: 'None whatsoever. We never use artificial colors, chemical preservatives, or hydrogenated oils. Every color and flavor note originates from natural ingredients.'
        },
        {
          id: '04',
          question: 'What is the shelf life and storage recommendation for Mango Chia PB?',
          answer: 'It maintains peak flavor, aroma, and seed crispness for up to 12 months. Keep the jar tightly closed in a cool, dry place away from direct sunlight.'
        },
        {
          id: '05',
          question: 'How should I serve Mango With Chia Seeds Peanut Butter?',
          answer: 'Top vibrant smoothie bowls, spread over toasted sourdough with fresh kiwi slices, stir into cold yogurt bowls, or spread across crunchy rice cakes.'
        }
      ];
    }

    // 6. Strawberry with Chia Peanut Butter
    if (name.includes('strawberry')) {
      return [
        {
          id: '01',
          question: 'What makes Strawberry with Chia Peanut Butter the ultimate healthy PB&J?',
          answer: 'It combines the natural berry aroma of real strawberries with slow-roasted peanut butter and nutrient-packed chia seeds—giving you the taste of classic PB&J in a single clean spoonful!'
        },
        {
          id: '02',
          question: 'Does this contain high-fructose corn syrup or commercial jelly additives?',
          answer: 'Zero high-fructose corn syrup, zero gelatin, zero palm oil, and zero synthetic preservatives. It is a 100% plant-based, vegan-friendly superfood spread.'
        },
        {
          id: '03',
          question: 'What are the tiny black specks distributed throughout the butter?',
          answer: 'Those are 100% whole raw black chia seeds, naturally suspended in the butter to provide extra texture, dietary fiber, and Omega-3 healthy fats in every single bite.'
        },
        {
          id: '04',
          question: 'How does it support children, students, and active lifestyles?',
          answer: 'It pairs energizing clean plant protein with natural fruit goodness and fiber, keeping kids and adults satisfied with sustained focus and zero sugar crashes.'
        },
        {
          id: '05',
          question: 'What are delicious meal ideas with Strawberry Chia Peanut Butter?',
          answer: 'Spread generously on toasted multigrain bread for an effortless wholesome PB&J sandwich, blend into mixed berry breakfast smoothies, or drizzle over French toast.'
        }
      ];
    }

    // 7. Pineapple Crunchy Peanut Butter
    if (name.includes('pineapple') || name.includes('pinapple')) {
      return [
        {
          id: '01',
          question: 'What makes Pineapple Crunchy Peanut Butter unique in flavor and texture?',
          answer: 'It offers an exhilarating tropical fusion of zesty natural pineapple and golden slow-roasted bold peanuts, delivering a sweet-tangy flavor explosion with satisfying peanut crunch.'
        },
        {
          id: '02',
          question: 'Is Pineapple Peanut Butter 100% vegan and dairy-free?',
          answer: 'Yes! It is 100% vegan, dairy-free, gluten-free, and plant-based, prepared without animal derivatives, trans fats, palm oil, or chemical emulsifiers.'
        },
        {
          id: '03',
          question: 'What wellness benefits does natural pineapple fruit provide?',
          answer: 'Natural pineapple contains bromelain and vitamin C, well known for assisting smooth digestive comfort, reducing inflammation, and revitalizing daily vitality.'
        },
        {
          id: '04',
          question: 'How do I keep the pineapple crunch crispy and fresh in the jar?',
          answer: 'Always use a dry spoon and keep the lid sealed securely at room temperature. Avoid letting any water droplets or moisture get inside the jar.'
        },
        {
          id: '05',
          question: 'What are creative ways to enjoy Pineapple Peanut Butter?',
          answer: 'Spread over toasted brioche, blend into tropical green morning smoothies, dip whole-wheat digestive biscuits, or roll into homemade coconut energy bites.'
        }
      ];
    }

    // 8. Natural Crunchy / 100% Pure Bold Peanut Butter (Default)
    const proteinCount = product.nutrition?.protein || "30";
    return [
      {
        id: '01',
        question: `What ingredients are inside ${product.name}?`,
        answer: 'Just 100% farm-sourced slow-roasted bold peanuts—and absolutely nothing else. No added sugar, no added salt, no hydrogenated palm oil, and zero chemical preservatives.'
      },
      {
        id: '02',
        question: 'Why does natural oil separate on top of the jar, and is it normal?',
        answer: 'Yes! Natural oil separation is the ultimate proof of 100% raw purity with zero hydrogenated palm oils or artificial stabilizers. Simply stir the natural oils back into the jar using a clean spoon before eating!'
      },
      {
        id: '03',
        question: 'Is this suitable for strict Keto, Diabetic, and Low-Carb diets?',
        answer: 'Yes! With 0g added sugar, very low net carbohydrates, and high healthy fats and plant protein, it is the gold standard choice for Keto, Paleo, and Diabetic dietary regimens.'
      },
      {
        id: '04',
        question: 'How much protein does each serving provide for muscle recovery?',
        answer: `It delivers ${proteinCount}g of pure plant-based protein per 100g (approx. 9.6g per 32g scoop), promoting lean muscle synthesis, tissue repair, and prolonged satiety throughout the day.`
      },
      {
        id: '05',
        question: 'What are the recommended ways to consume this 100% natural butter?',
        answer: 'Stir into morning post-workout protein shakes, mix into hot oatmeal bowls, dip crisp green apples or celery sticks, or use as a rich base for savory peanut satay sauces.'
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
