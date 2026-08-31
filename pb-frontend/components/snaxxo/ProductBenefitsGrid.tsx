import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../../types';

interface ProductBenefitsGridProps {
  product?: Product;
  bgColor?: string;
}

interface BenefitItem {
  id: string;
  icon: string;
  sticker: string;
  title: string;
  description: string;
  badgeBg: string;
  textColor: string;
  tilt: string;
}

// ─── CATEGORY SPECIFIC BENEFIT PRESETS ───

const PEANUT_BUTTER_BENEFITS: BenefitItem[] = [
  {
    id: 'pb-protein',
    icon: 'fitness_center',
    sticker: '30g Protein / 100g',
    title: 'HIGH PROTEIN POWER',
    description: 'Fuel muscle recovery and daily strength with 30g+ plant-based protein in every 100g serving.',
    badgeBg: '#008a45',
    textColor: '#ffffff',
    tilt: 'rotate-[-3deg]',
  },
  {
    id: 'pb-clean',
    icon: 'eco',
    sticker: 'Zero Palm Oil',
    title: '100% CLEAN SOURCE',
    description: 'Zero hydrogenated oils, zero chemical preservatives, and zero artificial flavors. Pure & honest food.',
    badgeBg: '#f9bc15',
    textColor: '#1e293b',
    tilt: 'rotate-[4deg]',
  },
  {
    id: 'pb-heart',
    icon: 'favorite',
    sticker: 'Healthy Omegas',
    title: 'HEART HEALTHY FATS',
    description: 'Packed with essential MUFA & PUFA healthy fats that actively support cardiovascular wellness.',
    badgeBg: '#e11d48',
    textColor: '#ffffff',
    tilt: 'rotate-[-4deg]',
  },
  {
    id: 'pb-sugar',
    icon: 'block',
    sticker: 'Guilt Free',
    title: 'ZERO ADDED SUGAR',
    description: 'Enjoy delicious naturally sweet peanut richness without any refined sugar spikes or energy crashes.',
    badgeBg: '#7c3aed',
    textColor: '#ffffff',
    tilt: 'rotate-[3deg]',
  },
  {
    id: 'pb-fiber',
    icon: 'grain',
    sticker: 'Gut Friendly',
    title: 'HIGH DIETARY FIBER',
    description: 'Keeps your digestion smooth and maintains healthy satiety so you feel full and energized longer.',
    badgeBg: '#2563eb',
    textColor: '#ffffff',
    tilt: 'rotate-[-2deg]',
  },
  {
    id: 'pb-energy',
    icon: 'bolt',
    sticker: 'Instant Stamina',
    title: 'NATURAL ENERGY BOOST',
    description: 'Dense macro-nutrients provide steady, long-lasting stamina for workouts, active days, and sports.',
    badgeBg: '#ea580c',
    textColor: '#ffffff',
    tilt: 'rotate-[4deg]',
  },
];

const OATS_BENEFITS: BenefitItem[] = [
  {
    id: 'oat-fiber',
    icon: 'grain',
    sticker: '100% Whole Oats',
    title: 'BETA-GLUCAN RICH OATS',
    description: 'High in soluble Beta-Glucan fiber that actively supports heart health and smooth, healthy digestion.',
    badgeBg: '#008a45',
    textColor: '#ffffff',
    tilt: 'rotate-[-3deg]',
  },
  {
    id: 'oat-energy',
    icon: 'bolt',
    sticker: 'Low Glycemic',
    title: 'SLOW-RELEASE ENERGY',
    description: 'Complex carbohydrates provide steady, sustained energy throughout the morning without sugar crashes.',
    badgeBg: '#ea580c',
    textColor: '#ffffff',
    tilt: 'rotate-[4deg]',
  },
  {
    id: 'oat-heart',
    icon: 'favorite',
    sticker: 'Heart Wellness',
    title: 'CHOLESTEROL CONTROL',
    description: 'Natural soluble oat fibers bind with cholesterol compounds to help manage healthy lipid levels.',
    badgeBg: '#e11d48',
    textColor: '#ffffff',
    tilt: 'rotate-[-4deg]',
  },
  {
    id: 'oat-protein',
    icon: 'fitness_center',
    sticker: 'Plant Protein',
    title: 'MORNING MUSCLE FUEL',
    description: 'Rich in essential amino acids and natural plant protein for a deeply nourishing breakfast.',
    badgeBg: '#2563eb',
    textColor: '#ffffff',
    tilt: 'rotate-[3deg]',
  },
  {
    id: 'oat-clean',
    icon: 'eco',
    sticker: 'Zero Preservatives',
    title: '100% CLEAN & UNREFINED',
    description: 'Pure, unadulterated whole rolled oats processed with zero artificial additives or chemicals.',
    badgeBg: '#f9bc15',
    textColor: '#1e293b',
    tilt: 'rotate-[-2deg]',
  },
  {
    id: 'oat-gut',
    icon: 'spa',
    sticker: 'Gut Microbiome',
    title: 'SMOOTH DIGESTION',
    description: 'Prebiotic oat fibers nourish beneficial gut bacteria for optimum digestion and daily vitality.',
    badgeBg: '#7c3aed',
    textColor: '#ffffff',
    tilt: 'rotate-[4deg]',
  },
];

const MUESLI_BENEFITS: BenefitItem[] = [
  {
    id: 'muesli-nuts',
    icon: 'nutrition',
    sticker: 'Nuts & Berries',
    title: 'ANTIOXIDANT POWERHOUSE',
    description: 'Loaded with roasted almonds, berries, and super-seeds for cellular defense and daily vitality.',
    badgeBg: '#e11d48',
    textColor: '#ffffff',
    tilt: 'rotate-[-3deg]',
  },
  {
    id: 'muesli-fiber',
    icon: 'grain',
    sticker: 'Multi-Grain',
    title: 'COMPLEX FIBER BLEND',
    description: 'Synergistic mix of oats, seeds, and grains for superior digestive wellness and bowel regularity.',
    badgeBg: '#008a45',
    textColor: '#ffffff',
    tilt: 'rotate-[4deg]',
  },
  {
    id: 'muesli-energy',
    icon: 'bolt',
    sticker: 'Power Breakfast',
    title: 'HIGH ENERGY CRUNCH',
    description: 'Nutritious crunch that keeps you energized through long work hours and active morning routines.',
    badgeBg: '#ea580c',
    textColor: '#ffffff',
    tilt: 'rotate-[-4deg]',
  },
  {
    id: 'muesli-fats',
    icon: 'verified_user',
    sticker: 'Zero Trans Fats',
    title: '100% CLEAN ROASTED',
    description: 'Dry-roasted grains and seeds prepared with zero hydrogenated oils or harmful palm oils.',
    badgeBg: '#f9bc15',
    textColor: '#1e293b',
    tilt: 'rotate-[3deg]',
  },
  {
    id: 'muesli-satiety',
    icon: 'shield',
    sticker: 'Zero Cravings',
    title: 'SUSTAINED SATIETY',
    description: 'Protein & fiber dense formula naturally curbs mid-day hunger pangs and sugar cravings.',
    badgeBg: '#7c3aed',
    textColor: '#ffffff',
    tilt: 'rotate-[-2deg]',
  },
  {
    id: 'muesli-immunity',
    icon: 'health_and_safety',
    sticker: 'Immunity Shield',
    title: 'MICRONUTRIENT DENSE',
    description: 'Rich in essential minerals like Zinc, Magnesium, and Vitamin E from premium almonds and pumpkin seeds.',
    badgeBg: '#2563eb',
    textColor: '#ffffff',
    tilt: 'rotate-[4deg]',
  },
];

const SEEDS_BENEFITS: BenefitItem[] = [
  {
    id: 'seed-omega',
    icon: 'psychology',
    sticker: 'Omega-3 Power',
    title: 'HEART & BRAIN SUPPORT',
    description: 'Exceptional concentration of plant-based ALA Omega-3 fatty acids for cognitive and cardiovascular wellness.',
    badgeBg: '#2563eb',
    textColor: '#ffffff',
    tilt: 'rotate-[-3deg]',
  },
  {
    id: 'seed-fiber',
    icon: 'spa',
    sticker: 'Super Fiber',
    title: 'GUT HEALTH ELIXIR',
    description: 'High mucilage dietary fiber that promotes optimal bowel balance and intestinal health.',
    badgeBg: '#008a45',
    textColor: '#ffffff',
    tilt: 'rotate-[4deg]',
  },
  {
    id: 'seed-antiox',
    icon: 'verified',
    sticker: 'Cellular Shield',
    title: 'ANTIOXIDANT BOOST',
    description: 'Fights oxidative stress and neutralizes free radicals for healthy skin, hair, and immune resilience.',
    badgeBg: '#7c3aed',
    textColor: '#ffffff',
    tilt: 'rotate-[-4deg]',
  },
  {
    id: 'seed-clean',
    icon: 'eco',
    sticker: '100% Pure & Raw',
    title: 'ZERO CHEMICAL GLAZE',
    description: 'Raw, unpolished seeds free from chemical treatments, sodium glaze, or artificial preservatives.',
    badgeBg: '#f9bc15',
    textColor: '#1e293b',
    tilt: 'rotate-[3deg]',
  },
  {
    id: 'seed-protein',
    icon: 'fitness_center',
    sticker: 'Vegan Protein',
    title: 'SEED PROTEIN POWER',
    description: 'Concentrated plant protein source perfect for sprinkling over smoothies, oats, salads, and bowls.',
    badgeBg: '#e11d48',
    textColor: '#ffffff',
    tilt: 'rotate-[-2deg]',
  },
  {
    id: 'seed-minerals',
    icon: 'bolt',
    sticker: 'Vital Minerals',
    title: 'NATURAL VITALITY',
    description: 'Packed with bioavailable Iron, Calcium, Zinc, and Magnesium for daily athletic performance.',
    badgeBg: '#ea580c',
    textColor: '#ffffff',
    tilt: 'rotate-[4deg]',
  },
];

// Helper to select appropriate benefits list based on product category / name
const getBenefitsForProduct = (product?: Product): BenefitItem[] => {
  if (!product) return PEANUT_BUTTER_BENEFITS;

  const name = (product.name || '').toLowerCase();
  const category = (product.category || '').toLowerCase();

  if (category.includes('oats') || name.includes('oat')) {
    return OATS_BENEFITS;
  }
  if (category.includes('muesli') || name.includes('muesli') || name.includes('granola')) {
    return MUESLI_BENEFITS;
  }
  if (category.includes('seed') || name.includes('seed') || name.includes('chia') || name.includes('flax')) {
    return SEEDS_BENEFITS;
  }

  // Default to Peanut Butter benefits (or fallback)
  return PEANUT_BUTTER_BENEFITS;
};

const ProductBenefitsGrid: React.FC<ProductBenefitsGridProps> = ({
  product,
  bgColor = '#0b3d2e',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  const benefitItems = getBenefitsForProduct(product);

  // Auto-play timer for mobile & tablet (runs every 3 seconds unless paused)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % benefitItems.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused, benefitItems.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % benefitItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + benefitItems.length) % benefitItems.length);
  };

  // Touch handlers for swipe support on mobile/tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const currentX = e.touches[0].clientX;
    const diffX = touchStartXRef.current - currentX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      touchStartXRef.current = null;
    }
  };

  const handleTouchEnd = () => {
    touchStartXRef.current = null;
    setIsPaused(false);
  };

  return (
    <section className="py-16 md:py-24 bg-[#f2f2ec] texture-overlay texture-speckles font-satoshi flex flex-col items-center overflow-hidden w-full relative">
      {/* PinoBite Header with Textured Title Badge */}
      <div className="flex flex-col items-center justify-center w-full mb-10 md:mb-16 px-4">
        <h2
          className="font-anton uppercase text-textured-any text-center leading-[1.1] tracking-wider py-2 px-6 rounded-2xl"
          style={{
            backgroundColor: bgColor,
            fontSize: 'clamp(2.2rem, 8vw, 70px)',
            width: 'fit-content',
          }}
        >
          BENEFITS OF {product?.name ? product.name.toUpperCase() : 'PINOBITE'}
        </h2>
        <p className="mt-4 text-[#3a4a40] text-center font-bold text-sm sm:text-base md:text-lg max-w-xl">
          Crafted with 100% real ingredients for peak athletic performance, clean snacking, and daily health.
        </p>
      </div>

      {/* ─── DESKTOP VIEW: 3-Column Grid (Hidden on mobile/tablet) ─── */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-8 max-w-6xl w-full mx-auto px-4 sm:px-6">
        {benefitItems.map((item, idx) => (
          <div
            key={item.id}
            className="group relative rounded-[28px] p-8 bg-white border-3 border-[#0b3d2e]/15 shadow-[0_10px_30px_rgba(11,61,46,0.08)] hover:shadow-[0_20px_45px_rgba(11,61,46,0.16)] transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between overflow-visible"
          >
            {/* Tilted Sticker Tag */}
            <div className={`absolute -top-3.5 left-4 z-10 transition-transform duration-300 group-hover:scale-110 ${item.tilt}`}>
              <span
                className="inline-block px-3.5 py-1 rounded-xl text-sm font-bold tracking-wider uppercase border-2 shadow-md"
                style={{
                  backgroundColor: item.badgeBg,
                  color: item.textColor,
                  borderColor: '#ffffff',
                  fontFamily: "'Mali', 'Fredoka', cursive, sans-serif",
                }}
              >
                {item.sticker}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mt-2 mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 border-2 border-white"
                  style={{ backgroundColor: item.badgeBg, color: item.textColor }}
                >
                  <span className="material-symbols-outlined text-4xl">{item.icon}</span>
                </div>
                <span className="font-anton text-3xl text-[#0b3d2e]/20 tracking-widest">
                  0{idx + 1}
                </span>
              </div>

              <h3 className="text-2xl font-anton uppercase text-[#0b3d2e] mb-3 tracking-wide group-hover:text-[#008a45] transition-colors">
                {item.title}
              </h3>

              <p className="text-[#3a4a40] text-sm font-semibold leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-dashed border-[#0b3d2e]/10 flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${item.badgeBg}22`, color: item.badgeBg }}
              >
                <span className="material-symbols-outlined text-sm font-bold">check</span>
              </div>
              <span className="text-[11px] font-bold text-[#0b3d2e]/70 uppercase tracking-wider">
                Lab Tested & Verified
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ─── MOBILE & TABLET VIEW: Auto-Playing Slider (< 1024px) ─── */}
      <div
        className="block lg:hidden w-full max-w-md mx-auto px-4 relative overflow-hidden pt-4 pb-2"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Sliding Card Wrapper */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {benefitItems.map((item, idx) => (
            <div key={item.id} className="w-full flex-shrink-0 px-2">
              <div className="relative rounded-[28px] p-6 sm:p-8 bg-white border-3 border-[#0b3d2e]/15 shadow-[0_10px_30px_rgba(11,61,46,0.12)] flex flex-col justify-between overflow-visible min-h-[320px]">
                {/* Tilted Sticker Tag */}
                <div className={`absolute -top-3.5 left-4 z-10 ${item.tilt}`}>
                  <span
                    className="inline-block px-3.5 py-1 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase border-2 shadow-md"
                    style={{
                      backgroundColor: item.badgeBg,
                      color: item.textColor,
                      borderColor: '#ffffff',
                      fontFamily: "'Mali', 'Fredoka', cursive, sans-serif",
                    }}
                  >
                    {item.sticker}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mt-2 mb-5">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md border-2 border-white"
                      style={{ backgroundColor: item.badgeBg, color: item.textColor }}
                    >
                      <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                    </div>
                    <span className="font-anton text-2xl text-[#0b3d2e]/25 tracking-widest">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-anton uppercase text-[#0b3d2e] mb-2.5 tracking-wide">
                    {item.title}
                  </h3>

                  <p className="text-[#3a4a40] text-xs sm:text-sm font-semibold leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t-2 border-dashed border-[#0b3d2e]/10 flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${item.badgeBg}22`, color: item.badgeBg }}
                  >
                    <span className="material-symbols-outlined text-xs font-bold">check</span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#0b3d2e]/70 uppercase tracking-wider">
                    Lab Tested & Verified
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductBenefitsGrid;
