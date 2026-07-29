import React from 'react';
import { Product } from '../../types';

interface NutritionDetailedSectionProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  bgColor?: string;
}

const NutritionDetailedSection: React.FC<NutritionDetailedSectionProps> = ({ product, onAddToCart, bgColor = '#a4eb14' }) => {
  // Fixed colors matching the reference design
  const limeGreen = bgColor; // Use the dynamic product color for the wave background
  const darkGreen = '#004d25';
  const tableHeaderBg = '#7c439f'; // Purple from screenshot
  const peachBg = '#f2f2ec'; // Matches product page background

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: peachBg, minHeight: '300px' }}
    >
      {/* Mobile colored overlay so white text is always readable */}
      <div
        className="block lg:hidden absolute inset-0 z-[0]"
        style={{
          backgroundColor: limeGreen,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundBlendMode: 'overlay',
          opacity: 1
        }}
      />
      {/* ── Layered organic green waves ── */}
      {/* These sit at the bottom and create the organic flowing green shape */}

      {/* Wave layer 1 — lightest, furthest back, highest reach */}
      <svg
        className="absolute bottom-0 left-0 w-full z-[1] pointer-events-none h-full opacity-[0.22] lg:opacity-[0.35]"
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,120 C120,60 240,30 400,80 C560,130 640,180 800,140 C960,100 1100,40 1280,80 C1360,100 1400,120 1440,130 L1440,600 L0,600 Z"
          fill={limeGreen}
        />
      </svg>

      {/* Wave layer 2 — medium, middle depth */}
      <svg
        className="absolute bottom-0 left-0 w-full z-[2] pointer-events-none h-full opacity-[0.4] lg:opacity-[0.6]"
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,180 C100,100 220,70 380,120 C540,170 680,230 840,190 C1000,150 1140,80 1300,120 C1380,140 1420,160 1440,170 L1440,600 L0,600 Z"
          fill={limeGreen}
        />
      </svg>

      {/* Wave layer 3 — main solid wave */}
      <svg
        className="absolute bottom-0 left-0 w-full z-[3] pointer-events-none h-full opacity-[0.9] lg:opacity-100"
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,240 C80,160 200,130 360,170 C520,210 700,270 880,230 C1060,190 1200,130 1340,170 C1400,190 1440,210 1440,210 L1440,600 L0,600 Z"
          fill={limeGreen}
        />
      </svg>

      {/* ── Content ── */}
      <div className="relative z-10 w-full">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-10 lg:px-14 pt-[60px] sm:pt-[140px] lg:pt-[220px] pb-[60px] sm:pb-16 md:pb-20">

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

              {/* Heading */}
              <h2
                className="font-anton leading-[1.05] uppercase mb-4 sm:mb-6 tracking-wide"
                style={{
                  color: '#ffffff',
                  fontSize: 'clamp(3rem, 10vw, 80px)'
                }}
              >
                WE SERVE<br className="hidden md:block" />{' '}
                GOODNESS WITH<br className="hidden md:block" />{' '}
                NUTS
              </h2>

              {/* Body copy */}
              <p
                className="text-[14px] md:text-[16px] leading-[1.6] font-bold mb-6 sm:mb-10 max-w-[420px]"
                style={{ color: '#ffffff', fontFamily: 'var(--font-satoshi, sans-serif)' }}
              >
                Well, that can't stand true during the 1800s when audiences used to throw peanuts in theatres at the performers if they didn't like the performance. This act was known as peanut gallery!
              </p>

              {/* Add to Cart button */}
              <button
                onClick={(e) => { e.preventDefault(); onAddToCart(product); }}
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#004d25] rounded-full pl-5 pr-3 py-2 sm:pl-6 sm:pr-4 sm:py-2.5 font-bold text-[11px] sm:text-[12px] tracking-[0.1em] uppercase transition-all duration-300 hover:scale-[1.03] shadow-sm w-fit border border-gray-100"
              >
                Add to Cart
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[#004d25] ml-1 opacity-70">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
              </button>
            </div>

            {/* ─── RIGHT column: Nutrition table ─── */}
            <div
              className="w-full lg:w-[58%] pt-4 lg:pt-6"
              style={{ paddingLeft: '10px', paddingRight: '10px' }}
            >
              <div
                className="rounded-[20px] overflow-hidden border-4 border-white shadow-xl"
              >
                {/* Header */}
                <div
                  className="px-4 py-4 sm:px-4 sm:py-4"
                  style={{ backgroundColor: tableHeaderBg }}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end w-full mb-4 sm:mb-2">
                    <h3 className="text-white text-[28px] sm:text-[36px] md:text-[40px] leading-[1.1] m-0 font-anton uppercase !tracking-[4px]">
                      Nutritional Information
                    </h3>
                    <p className="text-amber-300 text-[13px] md:text-[12px] font-semibold leading-normal mt-2 sm:mt-0 mb-0">
                      (Approx. Values)
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full">
                    <p className="text-white/80 text-[14px] md:text-[17px] font-medium leading-snug m-0 mb-2 sm:mb-0">
                      No. of servings per pack: 31 (Approx)
                    </p>
                    <p className="text-white text-[14px] md:text-[17px] font-bold leading-snug m-0">
                      Serving Size: 32g (2 tbsp)
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
                        const slug = product.slug?.toLowerCase() || '';
                        if (slug.includes('natural-crunchy')) {
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
                        if (slug.includes('american-nuts')) {
                          return [
                            { n: 'Energy(kcal)', v100: '578', v32: '185', r: '9 %', b: true },
                            { n: 'Total Fat', v100: '42 g', v32: '13.44 g', r: '20 %', b: true },
                            { n: 'Saturated Fat', v100: '11 g', v32: '3.52 g', r: '18 %', i: true },
                            { n: 'trans fat', v100: '0 mg', v32: '- -', r: '- -', i: true },
                            { n: 'polyunsaturated fat', v100: '13 g', v32: '4.16 g', r: '- -', i: true },
                            { n: 'monounsaturated fat', v100: '18 g', v32: '5.76 g', r: '- -', i: true },
                            { n: 'Cholesterol', v100: '0 mg', v32: '- -', r: '0 %', b: true },
                            { n: 'Sodium', v100: '52 mg', v32: '16.64 mg', r: '1 %', b: true },
                            { n: 'Total Carbohydrate', v100: '23 g', v32: '7.36 g', r: '3 %', b: true },
                            { n: 'Natural sugar', v100: '6 g', v32: '1.92 g', r: '- -', i: true },
                            { n: 'Added sugar', v100: '12 g', v32: '3.84 g', r: '15 %', i: true },
                            { n: 'Sugar', v100: '18 g', v32: '5.76 g', r: '- -', i: true },
                            { n: 'Dietary Fiber', v100: '6 g', v32: '1.92 g', r: '7 %', i: true },
                            { n: 'Protein', v100: '23 g', v32: '7.36 g', r: '15 %', b: true },
                            { n: 'Calcium', v100: '0.2 mcg', v32: '0.064 mcg', r: '0 %', b: false },
                            { n: 'Iron', v100: '46 mg', v32: '14.72 mg', r: '1 %', b: false },
                            { n: 'Potassium', v100: '1.3 mg', v32: '.416 mg', r: '2 %', b: false },
                          ];
                        }
                        if (slug.includes('dark-chocolate')) {
                          return [
                            { n: 'Energy(kcal)', v100: '540', v32: '173', r: '9 %', b: true },
                            { n: 'Total Fat', v100: '38 g', v32: '12.16 g', r: '18 %', b: true },
                            { n: 'Saturated Fat', v100: '6.2 g', v32: '1.984 g', r: '10 %', i: true },
                            { n: 'trans fat', v100: '0 mg', v32: '- -', r: '- -', i: true },
                            { n: 'polyunsaturated fat', v100: '13 g', v32: '4.16 g', r: '- -', i: true },
                            { n: 'monounsaturated fat', v100: '18 g', v32: '5.76 g', r: '- -', i: true },
                            { n: 'Cholesterol', v100: '0 mg', v32: '- -', r: '0 %', b: true },
                            { n: 'Sodium', v100: '20 mg', v32: '6.4 mg', r: '0 %', b: true },
                            { n: 'Total Carbohydrate', v100: '25 g', v32: '8 g', r: '3 %', b: true },
                            { n: 'Natural sugar', v100: '2.1 g', v32: '0.67 g', r: '- -', i: true },
                            { n: 'Added sugar', v100: '7 g', v32: '2.24 g', r: '9 %', i: true },
                            { n: 'Sugar', v100: '9.1 g', v32: '2.91 g', r: '- -', i: true },
                            { n: 'Dietary Fiber', v100: '7.9 g', v32: '2.5 g', r: '9 %', i: true },
                            { n: 'Protein', v100: '25 g', v32: '8 g', r: '16 %', b: true },
                            { n: 'Calcium', v100: '0.1 mg', v32: '0.032 mg', r: '0 %', b: false },
                            { n: 'Iron', v100: '0.5 mg', v32: '0.16 mg', r: '1 %', b: false },
                            { n: 'Potassium', v100: '0.1 mg', v32: '0.032 mg', r: '0 %', b: false },
                          ];
                        }
                        if (slug.includes('pineapple')) {
                          return [
                            { n: 'Energy(kcal)', v100: '578', v32: '185', r: '9 %', b: true },
                            { n: 'Total Fat', v100: '42 g', v32: '13.44 g', r: '20 %', b: true },
                            { n: 'Saturated Fat', v100: '11 g', v32: '3.52 g', r: '18 %', i: true },
                            { n: 'trans fat', v100: '0 mg', v32: '- -', r: '- -', i: true },
                            { n: 'polyunsaturated fat', v100: '13 g', v32: '4.16 g', r: '- -', i: true },
                            { n: 'monounsaturated fat', v100: '18 g', v32: '5.76 g', r: '- -', i: true },
                            { n: 'Cholesterol', v100: '0 mg', v32: '- -', r: '0 %', b: true },
                            { n: 'Sodium', v100: '52 mg', v32: '16.64 mg', r: '1 %', b: true },
                            { n: 'Total Carbohydrate', v100: '23 g', v32: '7.36 g', r: '3 %', b: true },
                            { n: 'Natural sugar', v100: '6 g', v32: '1.92 g', r: '- -', i: true },
                            { n: 'Added sugar', v100: '12 g', v32: '3.84 g', r: '15 %', i: true },
                            { n: 'Sugar', v100: '18 g', v32: '5.76 g', r: '- -', i: true },
                            { n: 'Dietary Fiber', v100: '6 g', v32: '1.92 g', r: '7 %', i: true },
                            { n: 'Protein', v100: '23 g', v32: '7.36 g', r: '15 %', b: true },
                            { n: 'Vitamin D', v100: '0.2 mcg', v32: '0.064 mcg', r: '0 %', b: false },
                            { n: 'Calcium', v100: '46 mg', v32: '14.72 mg', r: '1 %', b: false },
                            { n: 'Iron', v100: '1.3 mg', v32: '.416 mg', r: '2 %', b: false },
                            { n: 'Potassium', v100: '3.4 mg', v32: '1 mg', r: '0 %', b: false },
                          ];
                        }
                        if (slug.includes('mango')) {
                          return [
                            { n: 'Energy(kcal)', v100: '578', v32: '185', r: '9 %', b: true },
                            { n: 'Total Fat (g)', v100: '42 g', v32: '13.44 g', r: '20 %', b: true },
                            { n: 'Saturated Fat (g)', v100: '11 g', v32: '3.52 g', r: '18 %', i: true },
                            { n: 'trans fat (g)', v100: '0 mg', v32: '- -', r: '- -', i: true },
                            { n: 'polyunsaturated fat (g)', v100: '13 g', v32: '4.16 g', r: '- -', i: true },
                            { n: 'monounsaturated fat (g)', v100: '18 g', v32: '5.76 g', r: '- -', i: true },
                            { n: 'Cholesterol (mg)', v100: '0 mg', v32: '- -', r: '0 %', b: true },
                            { n: 'Sodium (mg)', v100: '52 mg', v32: '16.64 mg', r: '1 %', b: true },
                            { n: 'Total Carbohydrate(g)', v100: '23 g', v32: '7.36 g', r: '3 %', b: true },
                            { n: 'Natural sugar (g)', v100: '6 g', v32: '1.92 g', r: '- -', i: true },
                            { n: 'Added sugar (g)', v100: '12 g', v32: '3.84 g', r: '15 %', i: true },
                            { n: 'Sugar (g)', v100: '18 g', v32: '5.76 g', r: '- -', i: true },
                            { n: 'Dietary Fiber (g)', v100: '6 g', v32: '1.92 g', r: '7 %', i: true },
                            { n: 'Protein (g)', v100: '23 g', v32: '7.36 g', r: '15 %', b: true },
                            { n: 'Vitamin D (mg)', v100: '0.2 mcg', v32: '0.064 mcg', r: '0 %', b: false },
                            { n: 'Calcium (mg)', v100: '46 mg', v32: '14.72 mg', r: '1 %', b: false },
                            { n: 'Iron (mg)', v100: '1.3 mg', v32: '.416 mg', r: '2 %', b: false },
                            { n: 'Potassium (mg)', v100: '3.4 mg', v32: '1 mg', r: '0 %', b: false },
                          ];
                        }

                        // Default / Strawberry
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
                        <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <td
                            className={`${row.b ? 'font-bold text-gray-800' : 'text-gray-500'}`}
                            style={{
                              paddingTop: '5px',
                              paddingBottom: '5px',
                              paddingLeft: row.i ? '18px' : '8px',
                              paddingRight: '4px'
                            }}
                          >
                            {row.n}
                          </td>
                          <td className="text-center" style={{ borderLeft: '1px dashed #e8e8e8', paddingTop: '5px', paddingBottom: '5px', paddingLeft: '4px', paddingRight: '4px' }}>{row.v100}</td>
                          <td className="text-center" style={{ borderLeft: '1px dashed #e8e8e8', paddingTop: '5px', paddingBottom: '5px', paddingLeft: '4px', paddingRight: '4px' }}>{row.v32}</td>
                          <td className="text-center" style={{ borderLeft: '1px dashed #e8e8e8', paddingTop: '5px', paddingBottom: '5px', paddingLeft: '4px', paddingRight: '4px' }}>{row.r}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Footnote */}
                  <div className="px-4 sm:px-6 py-2 text-[8px] sm:text-[9px] md:text-[10px] text-gray-400 leading-snug" style={{ borderTop: '1px solid #eee' }}>
                    *as per RDA for Indians, ICMR-NIN, 2020 | ~%RDA values not estimated | ^%RDA values per serving calculated on the basis of 2000Kcal
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default NutritionDetailedSection;
