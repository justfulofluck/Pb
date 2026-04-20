
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
    <section className="py-12 md:py-24 bg-whiteboard texture-overlay texture-speckles overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-normal text-center mb-12 md:mb-20 italic tracking-tight leading-[0.9] text-slate-900 font-anton !normal-case">
          Pinobite <span className="text-primary italic">vs.</span> Others
        </h2>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto pb-8 pt-8">
          <table className="w-full border-separate border-spacing-x-1 border-spacing-y-0 min-w-[800px]">
            <thead>
              <tr className="text-slate-900 uppercase">
                <th className="p-6 text-left font-satoshi text-3xl align-bottom w-1/4">Features</th>
                <th className="p-6 text-center bg-white/50 backdrop-blur rounded-t-3xl font-black text-sm tracking-widest w-1/4">
                  TRADITIONAL<br />HOME FOOD
                </th>
                <th className="relative p-0 w-1/4">
                  <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-10 bg-secondary text-slate-900 px-4 py-1.5 rounded-full text-[10px] font-black shadow-sm whitespace-nowrap transform -rotate-1">
                    THE BEST
                  </div>
                  <div className="p-6 bg-primary text-white rounded-t-3xl font-black text-sm tracking-widest h-full flex items-center justify-center shadow-lg">
                    PINOBITE
                  </div>
                </th>
                <th className="p-6 text-center bg-white/50 backdrop-blur rounded-t-3xl font-black text-sm tracking-widest w-1/4">Junk Food</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 font-medium text-sm">
              {COMPARISON_DATA.map((row, i) => (
                <tr key={i} className="group">
                  <td className="p-6 border-b border-slate-200/50 font-bold text-slate-900 group-last:border-none">
                    {row.feature}
                  </td>
                  <td className="p-6 text-center bg-white/40 group-last:rounded-b-3xl border-b border-slate-100">
                    {row.ghar}
                  </td>
                  <td className="p-6 text-center bg-[#f0fdf4] border-x-2 border-primary border-b border-primary/10 font-black text-primary group-last:rounded-b-3xl group-last:border-b-2 shadow-sm">
                    {row.pino}
                  </td>
                  <td className="p-6 text-center bg-white/40 group-last:rounded-b-3xl border-b border-slate-100">
                    {row.junk}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View - Matching Reference Screenshot */}
        <div className="md:hidden">
          <div className="relative bg-white/60 rounded-[2.5rem] border border-primary/20 overflow-hidden shadow-2xl backdrop-blur-sm">
            {/* Mobile Header */}
            <div className="grid grid-cols-3 bg-[#f8fafc]/50 border-b border-primary/10">
              <div className="p-4 text-center text-[10px] font-black text-slate-800 leading-tight flex items-center justify-center border-r border-primary/5 uppercase tracking-tighter">
                Ghar Ka<br />Khaana
              </div>
              <div className="p-4 text-center text-[10px] font-black text-slate-800 leading-tight flex items-center justify-center border-r border-primary/5 uppercase tracking-tighter">
                Junk Food
              </div>
              <div className="p-4 bg-primary text-white text-center flex flex-col items-center justify-center">
                <img src="/logos/Pinobite-logo.png" className="h-5 w-auto brightness-0 invert" alt="Pinobite" />
              </div>
            </div>

            {/* Mobile Rows */}
            <div className="divide-y divide-primary/5">
              {COMPARISON_DATA.map((row, i) => (
                <div key={i} className="relative py-6 px-1">
                  {/* Feature Pill Separator */}
                  <div className="flex justify-center mb-4">
                    <div className="bg-white text-primary px-6 py-1.5 rounded-full text-sm font-black shadow-sm border border-primary/10 uppercase tracking-widest">
                      {row.feature}
                    </div>
                  </div>

                  {/* Values Row */}
                  <div className="grid grid-cols-3 text-center items-stretch min-h-[60px]">
                    <div className="px-3 text-[11px] font-bold text-slate-600 leading-snug border-r border-primary/5 flex items-center justify-center">
                      {row.ghar}
                    </div>
                    <div className="px-3 text-[11px] font-bold text-slate-600 leading-snug border-r border-primary/5 flex items-center justify-center">
                      {row.junk}
                    </div>
                    <div className="px-3 text-xs font-black text-primary bg-primary/5 rounded-xl flex items-center justify-center py-2 h-full">
                      {row.pino}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Annotation */}
        <div className="mt-8 md:mt-12 text-center">
          <p className="font-handdrawn text-lg md:text-xl text-slate-400 transform -rotate-1">made on trusted nutrition standards for family use 💚</p>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;
