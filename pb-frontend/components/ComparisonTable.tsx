import React from 'react';
import { ComparisonRow } from '../types';

const COMPARISON_DATA: ComparisonRow[] = [
  { feature: "Cost", ghar: "Mom's Pampering", pino: "Moderate", junk: "Too High (Not Deserved)" },
  { feature: "Time", ghar: "20 Mins", pino: "2 Minutes", junk: "Instant (But Regret)" },
  { feature: "Taste", ghar: "Delicious", pino: "Flavorful", junk: "Artificial Flavors" },
  { feature: "Nutrition", ghar: "High", pino: "Very High", junk: "Not Nutritious at All" },
  { feature: "Ingredients", ghar: "100% Natural", pino: "100% Natural", junk: "Far from Natural" },
  { feature: "Protein", ghar: "Moderate", pino: "Very High", junk: "Protein? What's That?" }
];

const ComparisonTable: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-whiteboard texture-overlay texture-speckles overflow-hidden font-satoshi">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-[#c7e9d9] transform -rotate-1 scale-110 rounded-lg"></div>
            <h2 className="relative text-[2.8rem] sm:text-5xl md:text-7xl lg:text-[7rem] !font-anton italic tracking-tight md:tracking-wide [word-spacing:0.05em] leading-[0.95] md:leading-[1.1] text-slate-900 uppercase px-6 md:px-12 py-4">
              Pinobite <span className="text-primary italic block md:inline">vs.</span> Others
            </h2>
          </div>
        </div>

        {/* Desktop View - Refined Column Cards */}
        <div className="hidden md:grid grid-cols-4 gap-0 items-start mt-12 mx-auto max-w-[1050px]">
          {/* Column 1: Features */}
          <div className="flex flex-col mt-6 pr-2 lg:pr-8">
            <div className="h-[100px] lg:h-[120px] flex items-center justify-start pb-4">
              <h3 className="font-anton text-3xl lg:text-[32px] text-slate-800 uppercase tracking-tight">FEATURES</h3>
            </div>
            <div className="flex flex-col">
              {COMPARISON_DATA.map((row, i) => (
                <div key={i} className="h-[64px] lg:h-[72px] flex items-center font-bold text-slate-800 text-sm lg:text-[15px]">
                  {row.feature}
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Traditional */}
          <div className="flex flex-col bg-white rounded-l-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-y border-l border-slate-100 mt-6 z-0">
            <div className="h-[100px] lg:h-[120px] p-4 lg:p-6 text-center flex flex-col justify-center items-center">
              <span className="font-bold text-[10px] lg:text-[11px] text-slate-400 uppercase tracking-[0.15em] mb-1.5">Traditional</span>
              <span className="font-black text-sm lg:text-[15px] text-slate-800 uppercase tracking-widest leading-tight">Home Food</span>
            </div>
            <div className="flex flex-col">
              {COMPARISON_DATA.map((row, i) => (
                <div key={i} className={`h-[64px] lg:h-[72px] px-4 flex items-center justify-center text-center text-slate-500 text-[13px] lg:text-[15px] font-medium border-t border-slate-100/80`}>
                  {row.ghar}
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Pinobite */}
          <div className="flex flex-col bg-[#f4fcf7] rounded-[2rem] lg:rounded-[2.5rem] shadow-[0_20px_40px_rgb(0,138,69,0.15)] border border-primary/20 mt-0 relative z-10 pb-4 lg:pb-6">
            <div className="absolute top-[-12px] left-1/2 -translate-x-1/2 z-40 bg-secondary text-slate-900 px-6 py-1.5 rounded-full text-[10px] lg:text-[11px] font-black shadow-md whitespace-nowrap">
              THE BEST
            </div>
            <div className="h-[124px] lg:h-[144px] bg-primary text-white rounded-t-[2rem] lg:rounded-t-[2.5rem] p-6 text-center flex items-center justify-center">
              <span className="font-black text-xl lg:text-[22px] tracking-[0.15em] uppercase">PINOBITE</span>
            </div>
            <div className="flex flex-col">
              {COMPARISON_DATA.map((row, i) => (
                <div key={i} className={`h-[64px] lg:h-[72px] px-4 flex items-center justify-center text-center font-bold text-primary text-[13px] lg:text-[15px] border-t border-primary/10`}>
                  {row.pino}
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Junk Food */}
          <div className="flex flex-col bg-white rounded-r-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-y border-r border-slate-100 mt-6 z-0">
            <div className="h-[100px] lg:h-[120px] p-4 lg:p-6 text-center flex flex-col justify-center items-center">
              <span className="font-black text-sm lg:text-[15px] text-slate-800 uppercase tracking-widest leading-tight">Junk Food</span>
            </div>
            <div className="flex flex-col">
              {COMPARISON_DATA.map((row, i) => (
                <div key={i} className={`h-[64px] lg:h-[72px] px-4 flex items-center justify-center text-center text-slate-500 text-[13px] lg:text-[15px] font-medium border-t border-slate-100/80`}>
                  {row.junk}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-6">
          <div className="relative bg-white/60 rounded-[3rem] border-2 border-primary/20 overflow-hidden shadow-2xl backdrop-blur-sm">
            <div className="grid grid-cols-3 bg-[#f8fafc]/50 border-b-2 border-primary/10">
              <div className="p-4 text-center text-[11px] font-black text-slate-800 leading-tight flex items-center justify-center border-r border-primary/5 uppercase tracking-tighter">Home<br/>Food</div>
              <div className="p-4 text-center text-[11px] font-black text-slate-800 leading-tight flex items-center justify-center border-r border-primary/5 uppercase tracking-tighter">Junk Food</div>
              <div className="p-4 bg-primary text-white text-center flex flex-col items-center justify-center">
                <span className="font-black text-sm tracking-widest uppercase">PINO</span>
              </div>
            </div>

            <div className="divide-y-2 divide-primary/5">
              {COMPARISON_DATA.map((row, i) => (
                <div key={i} className="p-10">
                  <div className="flex justify-center mb-6">
                    <div className="bg-white text-primary px-10 py-3 rounded-full text-base font-black shadow-md border border-primary/10 uppercase tracking-widest">
                      {row.feature}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 text-center gap-4 items-center">
                    <div className="text-sm font-bold text-slate-500 leading-tight">{row.ghar}</div>
                    <div className="text-sm font-bold text-slate-500 leading-tight">{row.junk}</div>
                    <div className="text-base font-black text-primary bg-primary/5 rounded-2xl py-5 border-2 border-primary/10">{row.pino}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Annotation */}
        <div className="mt-16 md:mt-20 text-center">
          <p className="font-handdrawn text-2xl md:text-3xl text-slate-800" style={{ fontFamily: '"Gochi Hand", cursive' }}>made on trusted nutrition standards for family use 💚</p>
        </div>
      </div>
    </section>
  );
};

export default React.memo(ComparisonTable);
