
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
    <section className="py-24 bg-whiteboard texture-overlay texture-speckles overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-normal text-center mb-20 italic tracking-tight leading-[0.9] text-slate-900 font-anton !normal-case">
          Pinobite <span className="text-primary italic">vs.</span> Others
        </h2>

        <div className="overflow-x-auto pb-8 pt-8">
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

        {/* Bottom Annotation */}
        <div className="mt-12 text-center">
          <p className="font-handdrawn text-xl text-slate-400 transform -rotate-1">made on trusted nutrition standards for family use 💚</p>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;
