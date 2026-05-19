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
  const peachBg = '#fdf4f0'; // Very light cream/peach

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: peachBg, minHeight: '520px' }}
    >
      {/* ── Layered organic green waves ── */}
      {/* These sit at the bottom and create the organic flowing green shape */}

      {/* Wave layer 1 — lightest, furthest back, highest reach */}
      <svg
        className="absolute bottom-0 left-0 w-full z-[1] pointer-events-none h-[140%] sm:h-[125%] lg:h-full opacity-[0.22] lg:opacity-[0.35]"
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
        className="absolute bottom-0 left-0 w-full z-[2] pointer-events-none h-[140%] sm:h-[125%] lg:h-full opacity-[0.4] lg:opacity-[0.6]"
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
        className="absolute bottom-0 left-0 w-full z-[3] pointer-events-none h-[140%] sm:h-[125%] lg:h-full opacity-[0.9] lg:opacity-100"
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
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-14 pt-[110px] sm:pt-[140px] lg:pt-[220px] pb-14 md:pb-20">

          {/* Two-column grid */}
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
                className="text-[2.2rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem] leading-[1.05] uppercase mb-4 sm:mb-6"
                style={{ color: '#ffffff', fontFamily: 'var(--font-bombi, "Gochi Hand", cursive)' }}
              >
                We Serve<br className="hidden md:block" />{' '}
                Goodness With<br className="hidden md:block" />{' '}
                Nuts
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
                ADD TO CART
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
                  className="px-3 sm:px-4 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                  style={{ backgroundColor: tableHeaderBg }}
                >
                  <div>
                    <h3 className="text-white text-[14px] sm:text-[16px] md:text-[18px] font-bold leading-tight mb-0.5 font-satoshi">
                      Nutritional Information
                    </h3>
                    <p className="text-white/75 text-[10px] sm:text-[11px] md:text-[12px] font-medium">
                      No. of servings per pack: 31 (Approx)
                    </p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <p className="text-amber-300 text-[10px] sm:text-[11px] md:text-[12px] font-semibold">(Approx. Values)</p>
                    <p className="text-white text-[10px] sm:text-[11px] md:text-[12px] font-bold">Serving Size: 32g (2 tbsp)</p>
                  </div>
                </div>

                {/* Table body */}
                <div style={{ backgroundColor: '#fff' }}>
                  <table className="w-full text-[11px] sm:text-[12px] md:text-[13px]" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #ddd' }}>
                        <th className="py-2 text-left font-bold text-gray-800 w-[45%] pl-2 sm:pl-3 pr-1" style={{ paddingRight: '4px' }}>Nutrients</th>
                        <th className="py-2 text-center font-bold text-gray-800 w-[27%] border-l border-dashed border-gray-300 pl-1 pr-1" style={{ paddingLeft: '4px', paddingRight: '4px' }}>Per 100g</th>
                        <th className="py-2 text-center font-bold text-gray-800 w-[28%] border-l border-dashed border-gray-300 pl-1 pr-1" style={{ paddingLeft: '4px', paddingRight: '4px' }}>Per Serve %RDA^</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600">
                      {[
                        { n: 'Energy', v: '625 Kcal', r: '10 %', b: true },
                        { n: 'Protein*', v: '30 g', r: '18 %', b: true },
                        { n: 'Carbohydrate', v: '18 g', r: '- -', b: true },
                        { n: 'Total Sugar', v: '3 g', r: '- -', i: true },
                        { n: 'Added Sugar', v: '0 g', r: '0 %', i: true },
                        { n: 'Dietary Fibre', v: '6 g', r: '5 %', i: true },
                        { n: 'Total Fat', v: '49 g', r: '23 %', b: true },
                        { n: 'Saturated Fat', v: '12 g', r: '17 %', i: true },
                        { n: 'Polyunsaturated Fat', v: '16 g', r: '- -', i: true },
                        { n: 'Monounsaturated Fat', v: '21 g', r: '- -', i: true },
                        { n: 'Cholesterol', v: '0.0 mg', r: '- -', b: true },
                        { n: 'Trans Fat', v: '0 g', r: '- -', b: true },
                        { n: 'Sodium', v: '25 mg', r: '0.4 %', b: true },
                      ].map((row, idx) => (
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
                          <td className="text-center" style={{ borderLeft: '1px dashed #e8e8e8', paddingTop: '5px', paddingBottom: '5px', paddingLeft: '4px', paddingRight: '4px' }}>{row.v}</td>
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
