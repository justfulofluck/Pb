
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
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-[#c7e9d9] transform -rotate-1 scale-110 rounded-lg"></div>
            <h2 className="relative text-5xl md:text-7xl lg:text-[7rem] font-anton italic tracking-tight leading-[1] text-slate-900 !normal-case px-12 py-4">
              Pinobite <span className="text-primary italic">vs.</span> Others
            </h2>
          </div>
        </div>

        {/* Desktop View - Unified Column Cards */}
        <div className="hidden md:block">
          <div className="grid grid-cols-4 gap-x-8">
            {/* --- Headers Row --- */}
            <div className="p-8 flex items-end">
              <h3 className="font-anton text-7xl text-slate-800 uppercase tracking-tighter">FEATURES</h3>
            </div>
            
            {/* Traditional Header */}
            <div className="bg-white/60 backdrop-blur-sm rounded-t-[2.5rem] p-10 text-center flex flex-col justify-end relative z-10">
              <span className="font-bold text-sm text-slate-400 uppercase tracking-[0.2em] mb-3">Traditional</span>
              <span className="font-black text-2xl text-slate-700 uppercase tracking-widest leading-none">Home Food</span>
            </div>

            {/* Pinobite Header */}
            <div className="relative z-30">
              <div className="absolute top-[-25px] left-1/2 -translate-x-1/2 z-40 bg-secondary text-slate-900 px-10 py-2.5 rounded-full text-[12px] font-black shadow-xl whitespace-nowrap transform -rotate-1 ring-4 ring-whiteboard">
                THE BEST
              </div>
              <div className="bg-primary text-white rounded-t-[3.5rem] p-12 text-center flex items-center justify-center">
                <span className="font-black text-3xl tracking-[0.2em]">PINOBITE</span>
              </div>
            </div>

            {/* Junk Food Header */}
            <div className="bg-white/60 backdrop-blur-sm rounded-t-[2.5rem] p-10 text-center flex flex-col justify-end relative z-10">
              <span className="font-black text-2xl text-slate-700 uppercase tracking-widest leading-none">Junk Food</span>
            </div>

            {/* --- Data Rows --- */}
            {COMPARISON_DATA.map((row, i) => (
              <React.Fragment key={i}>
                {/* Feature Name */}
                <div className={`py-10 px-8 flex items-center font-black text-slate-800 text-2xl border-b border-transparent uppercase tracking-tight ${i === 0 ? '-mt-1' : ''}`}>
                  {row.feature}
                </div>

                {/* Traditional Value */}
                <div className={`py-10 px-8 text-center bg-white/60 backdrop-blur-sm flex items-center justify-center text-slate-500 text-xl font-bold ${i === 0 ? '-mt-1 border-none' : 'border-t border-slate-100/50'} ${i === COMPARISON_DATA.length - 1 ? 'rounded-b-[2.5rem]' : ''}`}>
                  {row.ghar}
                </div>

                {/* Pinobite Value */}
                <div className={`py-10 px-8 text-center bg-[#f0fdf4] border-x-4 border-primary font-black text-primary text-3xl flex items-center justify-center relative z-20 ${i === 0 ? '-mt-1 border-none' : 'border-t border-primary/20'} ${i === COMPARISON_DATA.length - 1 ? 'rounded-b-[3.5rem] border-b-4 shadow-[0_40px_80px_-15px_rgba(0,138,69,0.25)]' : ''}`}>
                  <span className="relative z-10">{row.pino}</span>
                </div>

                {/* Junk Food Value */}
                <div className={`py-10 px-8 text-center bg-white/60 backdrop-blur-sm flex items-center justify-center text-slate-500 text-xl font-bold ${i === 0 ? '-mt-1 border-none' : 'border-t border-slate-100/50'} ${i === COMPARISON_DATA.length - 1 ? 'rounded-b-[2.5rem]' : ''}`}>
                  {row.junk}
                </div>
              </React.Fragment>
            ))}
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
        <div className="mt-24 md:mt-32 text-center">
          <p className="font-handdrawn text-4xl md:text-5xl text-slate-400 opacity-60">made on trusted nutrition standards for family use 💚</p>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;
