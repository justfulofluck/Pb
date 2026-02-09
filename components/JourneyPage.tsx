
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
}

const JourneyPage: React.FC<JourneyPageProps> = ({ onShopClick }) => {
  return (
    <div className="bg-background-light min-h-screen animate-in fade-in duration-500">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[500px] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
           <img 
             src="https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?q=80&w=2000&auto=format&fit=crop" 
             className="w-full h-full object-cover" 
             alt="Kitchen background"
           />
           <div className="absolute inset-0 bg-slate-900/60" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
           <span className="font-handdrawn text-3xl text-secondary transform -rotate-2 inline-block mb-4">From our kitchen to yours</span>
           <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
             The Pinobite Story
           </h1>
           <p className="text-xl md:text-2xl font-medium text-slate-200 max-w-2xl mx-auto">
             Fueling ambition with honest ingredients, one spoonful at a time.
           </p>
        </div>
      </div>

      {/* The Origin Story */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
           <div className="order-2 md:order-1 relative">
              <div className="aspect-[4/5] rounded-[40px] overflow-hidden rotate-2 shadow-2xl border-4 border-white">
                 <img src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Founders" />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-xl max-w-xs rotate-[-4deg] hidden lg:block doodle-border">
                 <p className="font-handdrawn text-2xl text-primary">"We just wanted a snack that didn't lie to us."</p>
              </div>
           </div>
           <div className="order-1 md:order-2 space-y-8">
              <h2 className="text-4xl md:text-5xl font-black uppercase text-slate-900 leading-tight">It started with a label reading obsession.</h2>
              <div className="prose prose-lg text-slate-600 font-medium">
                <p>
                  Back in 2021, walking down the supermarket aisle was frustrating. Every "healthy" granola bar or peanut butter jar we picked up had sugar as the second ingredient. Or palm oil. Or preservatives with numbers we couldn't memorize.
                </p>
                <p>
                  So, we stopped buying and started making.
                </p>
                <p>
                  Riya (a certified nutritionist) and Arjun (a fitness junkie) turned their Sunday afternoons into experiment sessions. The goal was simple: Make muesli that tastes like dessert but fuels you like a meal.
                </p>
                <p>
                  After 47 failed batches (some burnt, some bland), Batch #48 was perfect. Crunchy, coffee-infused, and zero junk. Pinobite was born.
                </p>
              </div>
           </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 relative z-10">
            <h2 className="text-4xl font-black uppercase text-center mb-20 text-secondary">Our Milestones</h2>
            <div className="relative">
               {/* Line */}
               <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-slate-800 transform md:-translate-x-1/2"></div>
               
               <div className="space-y-12">
                 {TIMELINE_EVENTS.map((event, i) => (
                   <div key={i} className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                      <div className="flex-1 w-full md:text-right">
                         <div className={`bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-primary transition-colors ${i % 2 === 0 ? 'md:mr-8' : 'md:ml-8 text-left'}`}>
                            <span className="text-4xl font-black text-slate-700 block mb-2">{event.year}</span>
                            <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                            <p className="text-slate-400">{event.description}</p>
                         </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-primary border-4 border-slate-900 relative z-10 flex-shrink-0"></div>
                      <div className="flex-1 w-full hidden md:block"></div>
                   </div>
                 ))}
               </div>
            </div>
         </div>
         <span className="absolute top-10 right-10 font-black text-9xl opacity-5 text-white select-none">TIME</span>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-black uppercase text-slate-900 mb-16">What We Stand For</h2>
            <div className="grid md:grid-cols-3 gap-8">
               {VALUES.map((val, i) => (
                 <div key={i} className="p-8 rounded-[40px] bg-secondary/10 border-2 border-transparent hover:border-secondary transition-all group">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-primary text-4xl mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform">
                       <span className="material-symbols-outlined">{val.icon}</span>
                    </div>
                    <h3 className="text-xl font-black uppercase text-slate-900 mb-3">{val.title}</h3>
                    <p className="text-slate-600 font-medium">{val.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary relative overflow-hidden">
         <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-5xl md:text-7xl font-black uppercase text-white tracking-tighter mb-8">Taste The Truth</h2>
            <p className="text-xl text-white/90 mb-12 font-medium">No more reading fine print. Just grab a spoon.</p>
            <button 
              onClick={onShopClick}
              className="bg-white text-slate-900 px-12 py-5 rounded-full font-black text-xl uppercase tracking-widest hover:shadow-2xl hover:scale-105 transition-all"
            >
              Shop Now
            </button>
         </div>
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </section>
    </div>
  );
};

export default JourneyPage;
