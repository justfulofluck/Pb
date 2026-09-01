import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../../types';

interface HighlightPoint {
  title: string;
  desc: string;
}

interface ProductDetailsData {
  title: string;
  subtitle: string;
  paragraph: string;
  badges: string[];
  points: HighlightPoint[];
}

const PRODUCT_DESCRIPTIONS_DATA: Record<string, ProductDetailsData> = {
  'dark-chocolate': {
    title: 'Dark Chocolate Almond Crunchy',
    subtitle: 'Rich Chocolate & Crunchy Almond Indulgence',
    paragraph:
      'Pinobite Peanut Butter Dark Chocolate Almond Crunchy is a delicious blend made with premium roasted peanuts, rich chocolate flavor, and crunchy almond pieces, delivering a perfect balance of creamy texture and satisfying crunch in every spoonful. Crafted from carefully selected roasted peanuts, it offers an authentic peanut butter taste without artificial preservatives.',
    badges: ['Real Cocoa & Almonds', 'Himalayan Pink Salt', 'Brown Sugar', 'Zero Palm Oil'],
    points: [
      {
        title: 'Premium Roasted Peanut Base',
        desc: 'Crafted from selected peanuts roasted to golden perfection for a rich nut flavor.'
      },
      {
        title: 'Dark Cocoa & Almond Crunch',
        desc: 'Fused with antioxidant dark cocoa and crushed California almond nibs.'
      },
      {
        title: 'Smooth & Spreadable Texture',
        desc: 'Velvety smooth texture that glides effortlessly on toast, oats, or smoothies.'
      },
      {
        title: 'Sustained Plant Protein Energy',
        desc: 'Rich in plant protein and healthy fats to keep you energized through active days.'
      },
      {
        title: 'Himalayan Pink Salt & Brown Sugar',
        desc: 'Seasoned with mineral pink salt and brown sugar for a rich, balanced taste.'
      },
      {
        title: 'Versatile Kitchen Companion',
        desc: 'Perfect as a spread, fruit dip, smoothie booster, or healthy baking ingredient.'
      },
      {
        title: 'Uncompromising Quality Standard',
        desc: '100% vegetarian formulation without chemical preservatives or trans fats.'
      }
    ]
  },
  'pineapple': {
    title: 'Pineapple Crunchy Peanut Butter',
    subtitle: 'Refreshing Tropical Pineapple & Peanut Fusion',
    paragraph:
      'Pinobite Peanut Butter Pineapple Crunchy is a delicious and unique blend made with premium roasted peanuts and refreshing pineapple flavor, offering a perfect balance of rich nuttiness and tropical sweetness in every spoonful. Crafted from carefully selected roasted peanuts, it delivers a smooth, creamy texture and authentic peanut butter taste.',
    badges: ['Tropical Pineapple', '100% Roasted Peanuts', 'Clean Source', 'Zero Trans Fat'],
    points: [
      {
        title: 'Premium Roasted Peanuts',
        desc: 'Crafted from high-grade peanuts roasted to unlock optimal nuttiness and aroma.'
      },
      {
        title: 'Zesty Tropical Pineapple Twist',
        desc: 'A refreshing fusion of creamy peanut butter and natural sweet-tangy pineapple flavor.'
      },
      {
        title: 'Smooth & Creamy Spreadability',
        desc: 'Spreads effortlessly over warm toast, waffles, fruit slices, or smoothies.'
      },
      {
        title: 'High Protein & Essential Omegas',
        desc: 'Abundant in natural plant protein and beneficial fatty acids for daily vitality.'
      },
      {
        title: 'Refined Taste Balance',
        desc: 'Lightly seasoned with Himalayan Pink Salt and natural Brown Sugar for a sweet-savory finish.'
      },
      {
        title: 'All-Day Satiety & Fuel',
        desc: 'Combines complex fats and protein to sustain energy and satisfy sweet cravings.'
      },
      {
        title: 'Artisanal Batch Quality',
        desc: 'Small-batch crafted under strict food safety standards with zero artificial palm oils.'
      }
    ]
  },
  'mango': {
    title: 'Mango Flavored Crunchy Peanut Butter',
    subtitle: 'Sweet Mango & Superfood Chia Seed Fusion',
    paragraph:
      'Pinobite Mango Flavored Peanut Butter Crunchy is a delicious and unique blend made with premium roasted peanuts, sweet mango flavor, and nutrient-rich chia seeds, creating a perfect combination of creamy texture, crunchy goodness, and tropical taste in every spoonful.',
    badges: ['Real Chia Seeds', 'Alphonso Mango Notes', 'Omega-3 Rich', 'High Fiber'],
    points: [
      {
        title: 'Wholesome Roasted Peanut Core',
        desc: 'Formulated with carefully roasted peanuts for a rich, hearty nut base and creamy texture.'
      },
      {
        title: 'Alphonso Mango & Superfood Chia',
        desc: 'Infused with natural mango flavor and raw black chia seeds adding fiber and crunch.'
      },
      {
        title: 'Smooth, Velvety Texture',
        desc: 'Glides easily on sourdough, fruit bowls, or protein waffles for a tropical upgrade.'
      },
      {
        title: 'Dense Macro-Nutrient Profile',
        desc: 'Delivers plant protein, dietary fiber, and healthy fats for daily stamina.'
      },
      {
        title: 'Himalayan Pink Salt Enhancement',
        desc: 'Blended with raw brown sugar and mineral pink salt for a gourmet flavor profile.'
      },
      {
        title: 'Creative Kitchen Utility',
        desc: 'Use as a vibrant spread, smoothie bowl topper, yogurt swirl, or clean snack.'
      },
      {
        title: 'Clean & Honest Standard',
        desc: 'No palm oil, zero chemical emulsifiers, and zero artificial dyes. 100% vegetarian.'
      }
    ]
  },
  'american-nuts': {
    title: 'American Nuts Crunchy Peanut Butter',
    subtitle: 'High Protein Muscle Fuel (27g Protein / 100g)',
    paragraph:
      'Pinobite American Nuts Crunchy Peanut Butter is a delicious, protein-rich spread crafted from carefully selected premium roasted peanuts, delivering an authentic nutty flavor and satisfying taste in every spoonful. With 27g of protein per 100g, it is an excellent choice for fitness enthusiasts and gym-goers.',
    badges: ['27g Protein / 100g', 'Multi-Nut Crunch', 'Gym & Workout Fuel', 'Zero Palm Oil'],
    points: [
      {
        title: 'Bold Roasted Peanut Selection',
        desc: 'Uses selected bold-kernel peanuts, slow-roasted for maximum aroma and nut flavor.'
      },
      {
        title: 'High Protein Powerhouse (27g/100g)',
        desc: 'Engineered with 27g of plant protein per 100g to support muscle repair and growth.'
      },
      {
        title: 'Signature Multi-Nut Crunch',
        desc: 'Blends velvety smooth peanut butter with real crushed roasted peanut nibs.'
      },
      {
        title: 'Sustained Satiety & Stamina',
        desc: 'High concentration of healthy fats and protein keeps hunger at bay.'
      },
      {
        title: 'Easy Daily Integration',
        desc: 'Spread over toasted whole wheat bread or blend into pre-workout protein shakes.'
      },
      {
        title: 'Clean Honest Ingredients',
        desc: 'Free from hydrogenated oils, trans fats, and artificial additives.'
      },
      {
        title: 'Crafted for Active Lifestyles',
        desc: 'Designed for athletes, gym-goers, and busy professionals needing quick energy.'
      }
    ]
  },
  'strawberry': {
    title: 'Strawberry Flavored Peanut Butter Crunchy',
    subtitle: 'Fruity Strawberry & Chia Crunch Harmony',
    paragraph:
      'Pinobite Strawberry Flavored Peanut Butter Crunchy is a delicious and unique blend made with premium roasted peanuts, sweet strawberry flavor, and nutrient-rich chia seeds, offering a delightful combination of creamy texture, crunchy goodness, and fruity flavor in every spoonful.',
    badges: ['Natural Berry Notes', 'Superfood Chia Seeds', 'No Preservatives', 'PB&J Twist'],
    points: [
      {
        title: 'Slow-Roasted Peanut Foundation',
        desc: 'Made with premium peanuts roasted to perfection for an authentic nutty taste.'
      },
      {
        title: 'Fruity Strawberry & Chia Blend',
        desc: 'Reimagines classic PB&J with sweet strawberry notes and crunchy chia seeds.'
      },
      {
        title: 'Smooth & Easy Spreadability',
        desc: 'Spreads effortlessly over bread, pancakes, or French toast without tearing.'
      },
      {
        title: 'Omega-3 & Fiber Boost',
        desc: 'Whole chia seeds provide dietary fiber and essential Omega-3 healthy fats.'
      },
      {
        title: 'Himalayan Pink Salt & Brown Sugar',
        desc: 'Balanced sweetness using unrefined brown sugar and mineral pink salt.'
      },
      {
        title: 'Perfect Snacking Versatility',
        desc: 'Ideal for breakfast toast, smoothie bowls, oatmeal toppings, or a spoon treat.'
      },
      {
        title: 'Pure & Honest Guarantee',
        desc: 'No palm oil, zero chemical emulsifiers, and zero artificial colors.'
      }
    ]
  },
  'chocolate-oats': {
    title: 'High Protein Oats Dark Chocolate Mixnut & Berry',
    subtitle: 'Whole Grain Oats, Dark Chocolate, Nuts & Berries',
    paragraph:
      'Pinobite High Protein Oats Dark Chocolate Mixnut & Berry is a delicious and wholesome breakfast option made with 100% whole grain rolled oats, rich dark chocolate, crunchy mixed nuts, and flavorful berries. Designed to combine great taste with everyday nutrition.',
    badges: ['100% Rolled Oats', 'Antioxidant Cocoa', 'Sliced Almonds', 'Sun-Dried Berries'],
    points: [
      {
        title: '100% Whole Grain Rolled Oats',
        desc: 'Uses premium oats rich in Beta-Glucan fiber for digestion and long fullness.'
      },
      {
        title: 'Antioxidant Dark Cocoa & Berries',
        desc: 'Infused with real cocoa and sweet dried berries for a delicious chocolate profile.'
      },
      {
        title: 'California Almond Slivers',
        desc: 'Packed with real almond slices and seeds for healthy nut fats and crunch.'
      },
      {
        title: 'No Refined White Sugar',
        desc: 'Sweetened naturally without high-fructose syrups or chemical sweeteners.'
      },
      {
        title: 'Quick 3-Minute Preparation',
        desc: 'Cooks quickly on a stove with milk or soaks overnight into Overnight Oats.'
      },
      {
        title: 'Gut Health & Satiety Support',
        desc: 'Complex carbs and dietary fiber promote smooth gut motility and energy.'
      },
      {
        title: 'Freshness Zip-Lock Pouch',
        desc: 'Sealed in a moisture-proof pouch to keep oats crisp down to the last spoon.'
      }
    ]
  },
  'coffee-mocha': {
    title: '24g High Protein Oats Coffee Mocha',
    subtitle: 'Real Coffee & Cocoa Energy Blend (24g Protein)',
    paragraph:
      'Pinobite 24g High Protein Oats Coffee Mocha is a delicious and nutritious whole-grain oats option designed to make everyday meals more convenient, satisfying, and flavorful. Made from 100% whole grain rolled oats.',
    badges: ['24g Protein / 100g', 'Real Coffee Powder', 'Organic Jaggery', 'Ready in 3 Mins'],
    points: [
      {
        title: '24g Protein Boost (2x Regular Oats)',
        desc: 'Delivers 24g of plant protein per 100g via high-grade textured soy protein and oats.'
      },
      {
        title: 'Authentic Coffee & Cocoa Blend',
        desc: 'Crafted with genuine roasted coffee beans and dark cocoa for a mocha kick.'
      },
      {
        title: '51% Wholegrain Rolled Oats Core',
        desc: 'High concentration of whole oats providing 12g dietary fiber per 100g.'
      },
      {
        title: 'Naturally Sweetened with Jaggery',
        desc: 'No refined white sugar added. Sweetened with natural unrefined jaggery.'
      },
      {
        title: 'Instant Morning Fuel',
        desc: 'Boil with milk or warm water for 3 minutes for a creamy coffee-infused bowl.'
      },
      {
        title: 'Ideal Pre-Workout Meal',
        desc: 'Combines caffeine energy, complex carbs, and high protein to power workouts.'
      },
      {
        title: 'Sealed for Maximum Aroma',
        desc: 'Protective packaging preserves fresh coffee aroma and oat crunchiness.'
      }
    ]
  },
  'muesli': {
    title: 'High Protein Muesli Dark Chocolate with Berries & Almonds',
    subtitle: 'Nuts, Seeds, Berries & Dark Chocolate Crunch',
    paragraph:
      'Pinobite High Protein Muesli Dark Chocolate with Berries & Almonds is a delicious and balanced breakfast blend crafted with wholesome rolled oats, crunchy almonds, nutritious seeds, rich dark chocolate, and naturally sweet dried fruits.',
    badges: ['Oven Toasted', 'Dark Chocolate Curls', 'Multi-Nut & Seed Mix', 'No Palm Oil'],
    points: [
      {
        title: 'Artisanal Oven-Toasted Grains',
        desc: 'Slow oven-toasted multigrain flakes without deep frying or artificial oils.'
      },
      {
        title: 'Real Dark Chocolate & Fruit Mix',
        desc: 'Loaded with real dark chocolate curls, sliced almonds, pumpkin seeds, and cranberries.'
      },
      {
        title: 'Natural Sweetness from Real Fruit',
        desc: 'Naturally sweetened with raisins, dates, and cranberries. Zero refined white sugar.'
      },
      {
        title: 'High Protein & Dietary Fiber',
        desc: 'Provides steady release complex carbs and plant protein for all-day stamina.'
      },
      {
        title: 'Multi-Way Breakfast Delight',
        desc: 'Enjoy chilled with milk, layer with Greek yogurt, or munch straight out of the bag.'
      },
      {
        title: 'Non-GMO & Clean Label',
        desc: 'Formulated with non-GMO grains and nuts, free from artificial colors or preservatives.'
      },
      {
        title: 'Resealable Freshness Pouch',
        desc: 'Heavy-duty zip-lock bag maintains crunch and aroma after every opening.'
      }
    ]
  }
};

const getProductData = (product: Product): ProductDetailsData => {
  const name = (product.name || '').toLowerCase();
  const slug = (product.slug || '').toLowerCase();
  const category = (product.category || '').toLowerCase();

  if (slug.includes('dark-chocolate') || name.includes('dark chocolate') || name.includes('chocolate almond')) {
    return PRODUCT_DESCRIPTIONS_DATA['dark-chocolate'];
  }
  if (slug.includes('pineapple') || name.includes('pineapple')) {
    return PRODUCT_DESCRIPTIONS_DATA['pineapple'];
  }
  if (slug.includes('mango') || name.includes('mango')) {
    return PRODUCT_DESCRIPTIONS_DATA['mango'];
  }
  if (slug.includes('american') || name.includes('american')) {
    return PRODUCT_DESCRIPTIONS_DATA['american-nuts'];
  }
  if (slug.includes('strawberry') || name.includes('strawberry')) {
    return PRODUCT_DESCRIPTIONS_DATA['strawberry'];
  }
  if (slug.includes('coffee') || name.includes('coffee') || name.includes('mocha')) {
    return PRODUCT_DESCRIPTIONS_DATA['coffee-mocha'];
  }
  if (slug.includes('oats') && (name.includes('chocolate') || name.includes('berry') || name.includes('mixnut'))) {
    return PRODUCT_DESCRIPTIONS_DATA['chocolate-oats'];
  }
  if (slug.includes('muesli') || name.includes('muesli') || category.includes('muesli')) {
    return PRODUCT_DESCRIPTIONS_DATA['muesli'];
  }

  // Fallback
  return {
    title: product.name || 'Pinobite Clean & High Protein Blend',
    subtitle: '100% Honest Source & High Protein Nutrition',
    paragraph: product.description || 'Crafted from carefully selected premium roasted peanuts, delivering an authentic nutty flavor and satisfying taste in every spoonful. Free from artificial preservatives, hydrogenated oils, or unnecessary additives.',
    badges: ['100% Roasted Peanuts', 'Clean Source', 'Zero Trans Fat', 'Himalayan Pink Salt'],
    points: [
      {
        title: 'Premium Roasted Peanut Base',
        desc: 'Crafted from high-grade peanuts roasted to perfection for an authentic nut flavor.'
      },
      {
        title: 'Plant-Based Protein & Omegas',
        desc: 'High concentration of plant protein and healthy fats to power your daily activities.'
      },
      {
        title: 'Zero Hydrogenated Palm Oil',
        desc: 'Made clean without chemical stabilizers, palm oil, or artificial preservatives.'
      },
      {
        title: 'Rich Dietary Fiber Source',
        desc: 'Naturally abundant in fiber to support digestive wellness and comfortable fullness.'
      },
      {
        title: 'Smooth & Spreadable Texture',
        desc: 'Spreads smoothly on toast, fruit slices, oats, or blends into morning protein shakes.'
      },
      {
        title: 'Himalayan Pink Salt & Brown Sugar',
        desc: 'Seasoned with pure pink salt and brown sugar for a rich, balanced taste.'
      },
      {
        title: '100% Quality Guarantee',
        desc: 'Artisanal small-batch crafting delivering consistent purity and taste in every jar.'
      }
    ]
  };
};

const getPointIcon = (title: string, index: number): string => {
  const t = title.toLowerCase();
  if (t.includes('peanut') || t.includes('roasted')) return '🥜';
  if (t.includes('berry') || t.includes('strawberry')) return '🍓';
  if (t.includes('cocoa') || t.includes('chocolate') || t.includes('mocha')) return '🍫';
  if (t.includes('pineapple') || t.includes('mango') || t.includes('tropical')) return '🍍';
  if (t.includes('oat') || t.includes('grain') || t.includes('muesli')) return '🌾';
  if (t.includes('protein') || t.includes('muscle') || t.includes('stamina') || t.includes('power')) return '⚡';
  if (t.includes('spread') || t.includes('toast') || t.includes('texture')) return '🍞';
  if (t.includes('salt') || t.includes('sugar') || t.includes('jaggery') || t.includes('sweet')) return '🧂';
  if (t.includes('chia') || t.includes('seed') || t.includes('omega') || t.includes('fiber')) return '🌱';
  if (t.includes('snack') || t.includes('versatil') || t.includes('kitchen') || t.includes('breakfast')) return '🥣';
  if (t.includes('pure') || t.includes('honest') || t.includes('guarantee') || t.includes('quality') || t.includes('clean')) return '🛡️';

  const defaultIcons = ['🥜', '✨', '⚡', '🌱', '🧂', '🥣', '🛡️'];
  return defaultIcons[index % defaultIcons.length];
};

const ProductDescriptionSection: React.FC<ProductDescriptionSectionProps> = ({
  product,
  bgColor = '#004d25'
}) => {
  const data = getProductData(product);
  const themeColor = bgColor || '#004d25';

  return (
    <section className="w-full py-16 md:py-24 bg-[#f2f2ec] text-slate-800 font-satoshi overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* OPEN 2-COLUMN CATCHY LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT COLUMN: Master Story (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-start relative">
            
            {/* Giant Background Quote Watermark */}
            <div 
              className="absolute -top-12 -left-6 text-9xl font-serif select-none pointer-events-none opacity-[0.07]"
              style={{ color: themeColor }}
            >
              “
            </div>

            {/* Handwritten Mali Sticker */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-slate-900 shadow-sm rotate-[-2deg] mb-5 w-fit"
              style={{ 
                backgroundColor: '#f9bc15',
                fontFamily: "'Mali', cursive, sans-serif"
              }}
            >
              ✨ PinoBite Master Recipe
            </motion.div>

            {/* Product Bold Title */}
            <motion.h2 
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-none mb-6 drop-shadow-sm"
              style={{ 
                fontFamily: "'Anton', sans-serif",
                color: themeColor
              }}
            >
              {data.title}
            </motion.h2>

            {/* Story Narrative */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <p className="text-slate-800 text-base sm:text-lg leading-relaxed font-medium italic">
                "{data.paragraph}"
              </p>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: 7 Specifications List Panel (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Header Tagline */}
            <div className="pb-3.5 mb-6 border-b-2 border-slate-300/80">
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-slate-900 leading-none" style={{ fontFamily: "'Anton', sans-serif" }}>
                KEY SPECIFICATIONS
              </h3>
            </div>

            {/* 7 Highlights Catchy Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.points.map((pt, idx) => {
                const icon = getPointIcon(pt.title, idx);

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    viewport={{ once: true }}
                    className={`bg-white rounded-2xl p-5 border border-slate-300/80 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex items-start gap-4 ${
                      idx === 6 ? 'sm:col-span-2' : ''
                    }`}
                  >
                    {/* Top Accent Stripe on Hover */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ backgroundColor: themeColor }}
                    />

                    {/* Dynamic Icon & Number Badge */}
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-base font-bold shadow-xs relative"
                      style={{ 
                        backgroundColor: '#faf9f5',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <span className="text-base">{icon}</span>
                      <span 
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-black text-white flex items-center justify-center shadow-xs"
                        style={{ backgroundColor: themeColor }}
                      >
                        {idx + 1}
                      </span>
                    </div>

                    {/* Content */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-amber-700 transition-colors">
                        {pt.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1 font-normal">
                        {pt.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default ProductDescriptionSection;
