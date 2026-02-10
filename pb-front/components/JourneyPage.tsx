
import React from 'react';
import Breadcrumbs from './Breadcrumbs';

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
    <div className="bg-background-light min-h-screen animate-in fade-in duration-500">
      <div className="relative h-[60vh] min-h-[500px] overflow-hidden flex flex-col">
        <div className="absolute inset-0">
           <img 
             src="https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?q=80&w=2000&auto=format&fit=crop" 
             className="w-full h-full object-cover" 
             alt="Kitchen background"
           />
           <div className="absolute inset-0 bg-slate-900/60" />
        </div>
        <div className="max-w-7xl mx-auto px-4 w-full pt-10 relative z-20">
           <Breadcrumbs onHomeClick={onHomeClick} steps={[{ label: 'Our Journey' }]} className="text-white/60 !py-0" />
        </div>
        <div className="relative z-10 flex-1 flex items-center justify-center text-center text-white px-4 max-w-4xl mx-auto">
           <div className="space-y-4">
              <span className="font-handdrawn text-3xl text-secondary transform -rotate-2 inline-block">From our kitchen to yours</span>
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                The Pinobite Story
              </h1>
              <p className="text-xl md:text-2xl font-medium text-slate-200 max-w-2xl mx-auto">
                Fueling ambition with honest ingredients, one spoonful at a time.
              </p>
           </div>
        </div>
      </div>

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
                <p>So, we stopped buying and started making.</p>
                <p>Riya (a certified nutritionist) and Arjun (a fitness junkie) turned their Sunday afternoons into experiment sessions. After 47 failed batches, Batch #48 was perfect.</p>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default JourneyPage;
