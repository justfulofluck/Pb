import React from 'react';
import { Product } from '../../types';

interface NutritionDetailedSectionProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  bgColor?: string;
}

const NutritionDetailedSection: React.FC<NutritionDetailedSectionProps> = ({ product, onAddToCart, bgColor = '#a4eb14' }) => {
  const limeGreen = bgColor;
  const darkGreen = '#004d25';
  const peachBg = '#f2f2ec';

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: peachBg, minHeight: '300px' }}
    >
      <style>{`
        @keyframes floatOrb1 { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-30px) scale(1.1); } }
        @keyframes floatOrb2 { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(20px) scale(0.9); } }
        @keyframes floatOrb3 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-15px,-20px); } }
      `}</style>

      {/* Mobile colored overlay */}
      <div
        className="block lg:hidden absolute inset-0 z-[0]"
        style={{ backgroundColor: limeGreen }}
      />

      {/* Top wave transition — clean solid wave with no contour artifacts */}
      <svg className="absolute left-0 w-full z-[6] pointer-events-none" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ top: '-2px', height: '82px' }}>
        <path d="M0,40 C180,100 360,110 540,80 C720,50 900,20 1080,50 C1200,70 1320,100 1440,80 L1440,0 L0,0 Z" fill={peachBg} />
      </svg>

      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 z-[4] pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Wave layer 1 — lightest, furthest back */}
      <svg className="absolute bottom-0 left-0 w-full z-[1] pointer-events-none h-full opacity-[0.18] lg:opacity-[0.25]" viewBox="0 0 1440 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="wg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={limeGreen} /><stop offset="100%" stopColor={limeGreen} stopOpacity="0.5" /></linearGradient></defs>
        <path d="M0,80 C160,20 320,60 480,100 C640,140 800,160 960,120 C1120,80 1280,40 1440,90 L1440,600 L0,600 Z" fill="url(#wg1)" />
      </svg>

      {/* Wave layer 2 — medium */}
      <svg className="absolute bottom-0 left-0 w-full z-[2] pointer-events-none h-full opacity-[0.35] lg:opacity-[0.55]" viewBox="0 0 1440 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="wg2" x1="0" y1="0" x2="1" y2="0.5"><stop offset="0%" stopColor={limeGreen} stopOpacity="0.9" /><stop offset="100%" stopColor={limeGreen} /></linearGradient></defs>
        <path d="M0,160 C120,90 280,70 440,130 C600,190 720,240 900,190 C1080,140 1200,80 1360,130 C1420,150 1440,170 1440,170 L1440,600 L0,600 Z" fill="url(#wg2)" />
      </svg>

      {/* Wave layer 3 — main solid */}
      <svg className="absolute bottom-0 left-0 w-full z-[3] pointer-events-none h-full opacity-[0.85] lg:opacity-100" viewBox="0 0 1440 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,220 C100,150 240,120 400,170 C560,220 720,280 920,230 C1120,180 1260,120 1380,170 C1420,190 1440,200 1440,200 L1440,600 L0,600 Z" fill={limeGreen} />
      </svg>

      {/* Floating decorative orbs (desktop only) */}
      <div className="hidden lg:block absolute z-[5] pointer-events-none" style={{ top: '15%', left: '8%', width: '80px', height: '80px', borderRadius: '50%', background: `radial-gradient(circle, ${limeGreen}44, transparent)`, animation: 'floatOrb1 6s ease-in-out infinite' }} />
      <div className="hidden lg:block absolute z-[5] pointer-events-none" style={{ bottom: '25%', right: '5%', width: '120px', height: '120px', borderRadius: '50%', background: `radial-gradient(circle, ${limeGreen}33, transparent)`, animation: 'floatOrb2 8s ease-in-out infinite' }} />
      <div className="hidden lg:block absolute z-[5] pointer-events-none" style={{ top: '40%', right: '15%', width: '50px', height: '50px', borderRadius: '50%', background: `radial-gradient(circle, ${limeGreen}22, transparent)`, animation: 'floatOrb3 7s ease-in-out infinite' }} />

      {/* ── Content ── */}
      <div className="relative z-10 w-full">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-10 lg:px-16 pt-[110px] sm:pt-[140px] lg:pt-[200px] pb-[60px] sm:pb-20 md:pb-24">

          {/* Two-column grid — stacks on mobile */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">

            {/* ─── LEFT column ─── */}
            <div
              className="w-full lg:w-[42%] flex flex-col [--left-col-pt:0px] lg:[--left-col-pt:calc(var(--spacing)*50)]"
              style={{
                paddingLeft: '10px',
                paddingRight: '10px',
                paddingTop: 'var(--left-col-pt)'
              } as React.CSSProperties}
            >
              {/* Decorative accent line */}
              <div className="hidden lg:flex items-center gap-3 mb-6">
                <div style={{ width: '40px', height: '3px', background: '#fff', borderRadius: '2px', opacity: 0.6 }} />
                <span className="text-white/60 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ fontFamily: 'var(--font-satoshi, sans-serif)' }}>Nutrition Facts</span>
              </div>

              {/* Heading */}
              <h2
                className="font-anton leading-[1.05] uppercase mb-4 sm:mb-6 tracking-wide"
                style={{
                  color: '#ffffff',
                  fontSize: 'clamp(3rem, 10vw, 85px)',
                  textShadow: '0 4px 30px rgba(0,0,0,0.15)'
                }}
              >
                WE SERVE<br className="hidden md:block" />{' '}
                GOODNESS WITH<br className="hidden md:block" />{' '}
                NUTS
              </h2>

              {/* Body copy */}
              <p
                className="text-[14px] md:text-[16px] leading-[1.7] font-medium mb-6 sm:mb-10 max-w-[420px]"
                style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-satoshi, sans-serif)' }}
              >
                Well, that can't stand true during the 1800s when audiences used to throw peanuts in theatres at the performers if they didn't like the performance. This act was known as peanut gallery!
              </p>

              {/* Add to Cart button */}
              <button
                onClick={(e) => { e.preventDefault(); onAddToCart(product); }}
                className="group inline-flex items-center gap-2 rounded-full pl-6 pr-4 py-3 sm:pl-7 sm:pr-5 sm:py-3.5 font-bold text-[12px] sm:text-[13px] tracking-[0.12em] uppercase transition-all duration-300 hover:scale-[1.04] shadow-lg hover:shadow-xl w-fit mb-8 lg:mb-0"
                style={{ background: '#ffffff', color: darkGreen }}
              >
                Add to Cart
                <span className="w-6 h-6 rounded-full flex items-center justify-center ml-1 transition-transform duration-300 group-hover:translate-x-0.5" style={{ background: `${limeGreen}22` }}>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
              </button>
            </div>

            {/* ─── RIGHT column: Nutrition table ─── */}
            <div
              className="w-full lg:w-[58%] pt-3 sm:pt-4 lg:pt-5 relative mt-4 lg:mt-0"
              style={{ paddingLeft: '10px', paddingRight: '10px' }}
            >
              {/* Prominent Tilted Green Badge Overlapping Top-Left of Purple Card */}
              <div 
                className="absolute -top-3 sm:-top-4 left-3 sm:left-6 z-20 select-none transition-transform duration-300 hover:scale-105"
                style={{ transform: 'rotate(-5deg)' }}
              >
                <div 
                  className="inline-flex items-center px-4 py-1.5 sm:px-5 sm:py-2 rounded-2xl shadow-xl border-2 sm:border-3"
                  style={{
                    backgroundColor: '#ffffff',
                    borderColor: '#008a45',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.22), 0 4px 10px rgba(0,138,69,0.3)'
                  }}
                >
                  <span
                    className="font-bold text-[16px] sm:text-[19px] md:text-[22px] tracking-wide whitespace-nowrap"
                    style={{
                      fontFamily: "'Mali', 'Gochi Hand', 'Fredoka', cursive, sans-serif",
                      color: '#008a45',
                      textShadow: '0.5px 0.5px 0px rgba(0,138,69,0.2)'
                    }}
                  >
                    Serving Size: 32g (2 tbsp)
                  </span>
                </div>
              </div>

              <div
                className="rounded-[24px] overflow-hidden shadow-2xl relative"
                style={{ border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.06)' }}
              >
                {/* Header */}
                <div
                  className="px-5 py-5 sm:px-6 sm:py-5 pt-8 sm:pt-9"
                  style={{ background: 'linear-gradient(135deg, #6B21A8 0%, #9333EA 50%, #7C3AED 100%)' }}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end w-full mb-3 sm:mb-2">
                    <h3 className="text-white text-[26px] sm:text-[36px] md:text-[40px] leading-[1.1] m-0 font-anton uppercase !tracking-[3px] sm:!tracking-[4px]" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
                      Nutritional Information
                    </h3>
                    <p className="text-amber-300 text-[12px] sm:text-[13px] md:text-[12px] font-semibold leading-normal mt-1 sm:mt-0 mb-0">
                      (Approx. Values)
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full">
                    <p className="text-white/80 text-[13px] sm:text-[14px] md:text-[16px] font-medium leading-snug m-0">
                      No. of servings per pack: 31 (Approx)
                    </p>
                  </div>
                </div>

                {/* Table body */}
                <div style={{ backgroundColor: '#fff' }}>
                  <table className="w-full text-[11px] sm:text-[12px] md:text-[13px]" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #ddd' }}>
                        <th className="py-2 text-left font-bold text-gray-800 w-[35%] pl-2 sm:pl-3 pr-1" style={{ paddingRight: '4px' }}>Nutrients</th>
                        <th className="py-2 text-center font-bold text-gray-800 w-[21%] border-l border-dashed border-gray-300 pl-1 pr-1" style={{ paddingLeft: '4px', paddingRight: '4px' }}>Per 100g</th>
                        <th className="py-2 text-center font-bold text-gray-800 w-[21%] border-l border-dashed border-gray-300 pl-1 pr-1" style={{ paddingLeft: '4px', paddingRight: '4px' }}>Per 32g</th>
                        <th className="py-2 text-center font-bold text-gray-800 w-[23%] border-l border-dashed border-gray-300 pl-1 pr-1" style={{ paddingLeft: '4px', paddingRight: '4px' }}>% Daily Value*</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600">
                      {(() => {
                        if (product.detailedNutrition && Array.isArray(product.detailedNutrition) && product.detailedNutrition.length > 0) {
                          return product.detailedNutrition;
                        }

                        const slug = (product.slug || product.name || '').toLowerCase();
                        const category = (product.category || '').toLowerCase();

                        if (slug.includes('natural') || category.includes('natural')) {
                          return [
                            { n: 'Energy (kcal)', v100: '527', v32: '168.6', r: '- -', b: true },
                            { n: 'Total Fat (g)', v100: '35 g', v32: '11.2 g', r: '45 %', b: true },
                            { n: 'Saturated Fat (g)', v100: '5.9 g', v32: '1.88 g', r: '30 %', i: true },
                            { n: 'Trans Fat (g)', v100: '0 g', v32: '- -', r: '- -', i: true },
                            { n: 'Polyunsaturated Fat (g)', v100: '10 g', v32: '3.2 g', r: '- -', i: true },
                            { n: 'Monounsaturated Fat (g)', v100: '19.1 g', v32: '6.11 g', r: '- -', i: true },
                            { n: 'Cholesterol (mg)', v100: '0 mg', v32: '- -', r: '- -', b: true },
                            { n: 'Sodium (mg)', v100: '45 mg', v32: '14.4 mg', r: '2 %', b: true },
                            { n: 'Total Carbohydrate (g)', v100: '14 g', v32: '4.48 g', r: '5 %', b: true },
                            { n: 'Dietary Fiber (g)', v100: '10 g', v32: '3.2 g', r: '36 %', i: true },
                            { n: 'Natural Sugar (g)', v100: '5.9 g', v32: '1.5 g', r: '- -', i: true },
                            { n: 'Added Sugar (g)', v100: '0 g', v32: '- -', r: '- -', i: true },
                            { n: 'Sugar (g)', v100: '5.9 g', v32: '1.5 g', r: '- -', i: true },
                            { n: 'Protein (g)', v100: '36 g', v32: '11.52 g', r: '72 %', b: true },
                            { n: 'Calcium (mg)', v100: '35 mg', v32: '11.2 mg', r: '3 %', b: false },
                            { n: 'Iron (mg)', v100: '0.5 mg', v32: '0.16 mg', r: '3 %', b: false },
                            { n: 'Potassium (mg)', v100: '323 mg', v32: '103.36 mg', r: '7 %', b: false },
                          ];
                        }

                        if (slug.includes('dark-chocolate') || slug.includes('chocolate') || slug.includes('cocoa')) {
                          return [
                            { n: 'Energy (kcal)', v100: '540', v32: '173', r: '9 %', b: true },
                            { n: 'Total Fat (g)', v100: '38 g', v32: '12.16 g', r: '18 %', b: true },
                            { n: 'Saturated Fat (g)', v100: '6.2 g', v32: '1.984 g', r: '10 %', i: true },
                            { n: 'Trans Fat (g)', v100: '0 mg', v32: '- -', r: '- -', i: true },
                            { n: 'Polyunsaturated Fat (g)', v100: '13 g', v32: '4.16 g', r: '- -', i: true },
                            { n: 'Monounsaturated Fat (g)', v100: '18 g', v32: '5.76 g', r: '- -', i: true },
                            { n: 'Cholesterol (mg)', v100: '0 mg', v32: '- -', r: '0 %', b: true },
                            { n: 'Sodium (mg)', v100: '20 mg', v32: '6.4 mg', r: '0 %', b: true },
                            { n: 'Total Carbohydrate (g)', v100: '25 g', v32: '8 g', r: '3 %', b: true },
                            { n: 'Natural Sugar (g)', v100: '2.1 g', v32: '0.67 g', r: '- -', i: true },
                            { n: 'Added Sugar (g)', v100: '7 g', v32: '2.24 g', r: '9 %', i: true },
                            { n: 'Sugar (g)', v100: '9.1 g', v32: '2.91 g', r: '- -', i: true },
                            { n: 'Dietary Fiber (g)', v100: '7.9 g', v32: '2.5 g', r: '9 %', i: true },
                            { n: 'Protein (g)', v100: '25 g', v32: '8 g', r: '16 %', b: true },
                            { n: 'Calcium (mg)', v100: '0.1 mg', v32: '0.032 mg', r: '0 %', b: false },
                            { n: 'Iron (mg)', v100: '0.5 mg', v32: '0.16 mg', r: '1 %', b: false },
                            { n: 'Potassium (mg)', v100: '0.1 mg', v32: '0.032 mg', r: '0 %', b: false },
                          ];
                        }

                        if (slug.includes('muesli') || slug.includes('granola') || slug.includes('oats')) {
                          return [
                            { n: 'Energy (kcal)', v100: '412', v32: '164.8', r: '8 %', b: true },
                            { n: 'Total Fat (g)', v100: '12 g', v32: '4.8 g', r: '7 %', b: true },
                            { n: 'Saturated Fat (g)', v100: '2.5 g', v32: '1.0 g', r: '5 %', i: true },
                            { n: 'Trans Fat (g)', v100: '0 g', v32: '0 g', r: '- -', i: true },
                            { n: 'Cholesterol (mg)', v100: '0 mg', v32: '0 mg', r: '0 %', b: true },
                            { n: 'Sodium (mg)', v100: '15 mg', v32: '6 mg', r: '0 %', b: true },
                            { n: 'Total Carbohydrate (g)', v100: '65 g', v32: '26 g', r: '10 %', b: true },
                            { n: 'Dietary Fiber (g)', v100: '11 g', v32: '4.4 g', r: '18 %', i: true },
                            { n: 'Natural Sugar (g)', v100: '8 g', v32: '3.2 g', r: '- -', i: true },
                            { n: 'Added Sugar (g)', v100: '0 g', v32: '0 g', r: '0 %', i: true },
                            { n: 'Protein (g)', v100: '14 g', v32: '5.6 g', r: '11 %', b: true },
                            { n: 'Calcium (mg)', v100: '52 mg', v32: '20.8 mg', r: '2 %', b: false },
                            { n: 'Iron (mg)', v100: '3.8 mg', v32: '1.52 mg', r: '8 %', b: false },
                          ];
                        }

                        if (slug.includes('seed') || slug.includes('chia') || slug.includes('superfood')) {
                          return [
                            { n: 'Energy (kcal)', v100: '486', v32: '145.8', r: '7 %', b: true },
                            { n: 'Total Fat (g)', v100: '31 g', v32: '9.3 g', r: '14 %', b: true },
                            { n: 'Saturated Fat (g)', v100: '3.3 g', v32: '0.99 g', r: '5 %', i: true },
                            { n: 'Trans Fat (g)', v100: '0 g', v32: '0 g', r: '- -', i: true },
                            { n: 'Omega-3 Fatty Acids (g)', v100: '17.5 g', v32: '5.25 g', r: '- -', i: true },
                            { n: 'Cholesterol (mg)', v100: '0 mg', v32: '0 mg', r: '0 %', b: true },
                            { n: 'Sodium (mg)', v100: '16 mg', v32: '4.8 mg', r: '0 %', b: true },
                            { n: 'Total Carbohydrate (g)', v100: '42 g', v32: '12.6 g', r: '5 %', b: true },
                            { n: 'Dietary Fiber (g)', v100: '34 g', v32: '10.2 g', r: '41 %', i: true },
                            { n: 'Sugar (g)', v100: '0 g', v32: '0 g', r: '- -', i: true },
                            { n: 'Protein (g)', v100: '17 g', v32: '5.1 g', r: '10 %', b: true },
                            { n: 'Calcium (mg)', v100: '631 mg', v32: '189.3 mg', r: '19 %', b: false },
                            { n: 'Iron (mg)', v100: '7.7 mg', v32: '2.31 mg', r: '13 %', b: false },
                          ];
                        }

                        // Default Flavored PB fallback
                        return [
                          { n: 'Energy (kcal)', v100: '578', v32: '185', r: '9 %', b: true },
                          { n: 'Total Fat (g)', v100: '42 g', v32: '13.44 g', r: '20 %', b: true },
                          { n: 'Saturated Fat (g)', v100: '11 g', v32: '3.52 g', r: '18 %', i: true },
                          { n: 'Trans Fat (g)', v100: '0 mg', v32: '- -', r: '- -', i: true },
                          { n: 'Polyunsaturated Fat (g)', v100: '13 g', v32: '4.16 g', r: '- -', i: true },
                          { n: 'Monounsaturated Fat (g)', v100: '18 g', v32: '5.76 g', r: '- -', i: true },
                          { n: 'Cholesterol (mg)', v100: '0 mg', v32: '- -', r: '0 %', b: true },
                          { n: 'Sodium (mg)', v100: '52 mg', v32: '16.64 mg', r: '1 %', b: true },
                          { n: 'Total Carbohydrate (g)', v100: '23 g', v32: '7.36 g', r: '3 %', b: true },
                          { n: 'Natural Sugar (g)', v100: '6 g', v32: '1.92 g', r: '- -', i: true },
                          { n: 'Added Sugar (g)', v100: '12 g', v32: '3.84 g', r: '15 %', i: true },
                          { n: 'Sugar (g)', v100: '18 g', v32: '5.76 g', r: '- -', i: true },
                          { n: 'Dietary Fiber (g)', v100: '6 g', v32: '1.92 g', r: '7 %', i: true },
                          { n: 'Protein (g)', v100: '23 g', v32: '7.36 g', r: '15 %', b: true },
                          { n: 'Vitamin D (mcg)', v100: '0.2 mcg', v32: '0.064 mcg', r: '0 %', b: false },
                          { n: 'Calcium (mg)', v100: '46 mg', v32: '14.72 mg', r: '1 %', b: false },
                          { n: 'Iron (mg)', v100: '1.3 mg', v32: '0.416 mg', r: '2 %', b: false },
                          { n: 'Potassium (mg)', v100: '3.4 mg', v32: '1 mg', r: '0 %', b: false },
                        ];
                      })().map((row: any, idx: number) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0', background: idx % 2 === 0 ? '#ffffff' : '#faf9f7', transition: 'background 0.2s' }} className="hover:!bg-purple-50/40">
                          <td
                            className={`${row.b ? 'font-bold text-gray-800' : 'text-gray-500'}`}
                            style={{
                              paddingTop: '7px',
                              paddingBottom: '7px',
                              paddingLeft: row.i ? '22px' : '12px',
                              paddingRight: '4px'
                            }}
                          >
                            {row.n}
                          </td>
                          <td className="text-center" style={{ borderLeft: '1px dashed #e8e8e8', paddingTop: '7px', paddingBottom: '7px', paddingLeft: '4px', paddingRight: '4px' }}>{row.v100}</td>
                          <td className="text-center font-semibold text-gray-700" style={{ borderLeft: '1px dashed #e8e8e8', paddingTop: '7px', paddingBottom: '7px', paddingLeft: '4px', paddingRight: '4px' }}>{row.v32}</td>
                          <td className="text-center" style={{ borderLeft: '1px dashed #e8e8e8', paddingTop: '7px', paddingBottom: '7px', paddingLeft: '4px', paddingRight: '4px' }}>{row.r}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Footnote */}
                  <div className="px-4 sm:px-6 py-3 text-[8px] sm:text-[9px] md:text-[10px] text-gray-400 leading-snug" style={{ borderTop: '1px solid #eee', background: '#faf9f7' }}>
                    *as per RDA for Indians, ICMR-NIN, 2020 | ~%RDA values not estimated | ^%RDA values per serving calculated on the basis of 2000Kcal
                  </div>
                </div>
              </div>


            </div>

          </div>
        </div>
      </div>

      {/* Bottom wave transition — mirrors the top wave aesthetic */}
      <svg className="absolute bottom-0 left-0 w-full z-[6] pointer-events-none" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ height: '80px' }}>
        <path d="M0,40 C180,100 360,110 540,80 C720,50 900,20 1080,50 C1200,70 1320,100 1440,80 L1440,120 L0,120 Z" fill={peachBg} />
      </svg>
      <svg className="absolute bottom-0 left-0 w-full z-[5] pointer-events-none" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ height: '100px' }}>
        <path d="M0,60 C200,110 400,100 600,70 C800,40 1000,30 1200,60 C1320,80 1400,90 1440,70 L1440,120 L0,120 Z" fill={peachBg} opacity="0.5" />
      </svg>
    </section>
  );
};

export default NutritionDetailedSection;
