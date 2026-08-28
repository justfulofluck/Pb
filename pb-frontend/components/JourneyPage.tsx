
import React from 'react';

const TIMELINE_EVENTS = [
  { year: '2021', title: 'The Spark', description: "It started in a small kitchen in Mumbai. Tired of 'healthy' snacks loaded with hidden sugars, our founders Riya and Arjun decided to bake their own batch of muesli." },
  { year: '2022', title: 'Farmers Markets', description: "We took our jars to local farmers markets. Sold out in 2 hours. We knew we were onto something." },
  { year: '2023', title: 'Going Online', description: "Launched pinobite.com. Shipped our first 10,000 orders across India. The Pinobite family started growing rapidly." },
  { year: '2024', title: 'The Nut Butter Revolution', description: "Expanded our range to include stone-ground nut butters. Zero palm oil, 100% texture." },
];

const VALUES = [
  { icon: 'visibility', title: 'Radical Transparency', desc: 'No hidden ingredients. If you can\'t read it, we don\'t put it in.' },
  { icon: 'eco', title: 'Earth First', desc: 'Sustainably sourced nuts and plastic-neutral packaging.' },
  { icon: 'handshake', title: 'Community Driven', desc: 'We listen. Your feedback shapes our next flavor.' }
];

interface JourneyPageProps {
  onShopClick: () => void;
  onHomeClick: () => void;
}

const JourneyPage: React.FC<JourneyPageProps> = ({ onShopClick, onHomeClick }) => {
  return (
    <div className="bg-[#f2f2ec] min-h-screen font-satoshi">
      {/* Sleek, Brand-Aligned Hero Banner */}
      <div className="relative py-14 md:py-20 bg-[#0a192f] overflow-hidden">
        {/* Subtle Background Overlay & Ambient Glow */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=2000&auto=format&fit=crop"
            className="w-full h-full object-cover"
            alt="Roasted Peanuts & Kitchen Craft"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f]/90 via-[#0a192f]/80 to-[#f2f2ec]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-yellow-400 text-xs md:text-sm font-bold uppercase tracking-widest mb-4 shadow-sm">
            🥜 From Our Kitchen to Yours
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal uppercase text-white tracking-wide leading-tight !font-anton mb-3 drop-shadow-md">
            The Pinobite Story
          </h1>
          <p className="text-sm sm:text-base md:text-lg font-medium text-slate-300 max-w-xl mx-auto leading-relaxed">
            Fueling ambition with honest ingredients, slow-roasted nuts, and zero shortcuts—one spoonful at a time.
          </p>
        </div>
      </div>

      <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="order-2 md:order-1 relative">
            <div className="aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white">
              <img src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Founders" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl max-w-xs rotate-[-3deg] hidden lg:block border border-slate-100">
              <p className="font-handdrawn text-xl text-primary font-bold">"We just wanted a snack that didn't lie to us."</p>
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-normal uppercase text-slate-900 leading-[1.15] !font-anton tracking-wide">It started with a label reading obsession.</h2>
            <div className="prose prose-slate text-slate-600 font-medium space-y-4">
              <p>
                Back in 2021, walking down the supermarket aisle was frustrating. Every "healthy" granola bar or peanut butter jar we picked up had sugar as the second ingredient. Or palm oil. Or preservatives with numbers we couldn't memorize.
              </p>
              <p>So, we stopped buying and started making.</p>
              <p>Riya (a certified nutritionist) and Arjun (a fitness junkie) turned their Sunday afternoons into experiment sessions. After 47 failed batches, Batch #48 was perfect.</p>
            </div>
            <div className="pt-2">
              <button
                onClick={onShopClick}
                className="px-6 py-3 rounded-xl bg-primary text-white font-black uppercase text-sm tracking-wider shadow-lg hover:bg-primary/90 transition-all cursor-pointer"
              >
                Explore Products →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white/60 border-t border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl md:text-3xl font-normal uppercase text-slate-900 !font-anton tracking-wide">Our Core Pillars</h3>
            <p className="text-sm text-slate-500 mt-2 font-medium">Uncompromising standards in every batch we craft.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {VALUES.map((val, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start">
                <span className="material-symbols-outlined text-primary text-3xl mb-3">{val.icon}</span>
                <h4 className="text-lg font-bold text-slate-800 mb-2">{val.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default JourneyPage;
