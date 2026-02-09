import React, { useState } from 'react';

interface FAQPageProps {
  onContactClick: () => void;
}

const FAQ_DATA = [
  {
    question: "What makes Pinobite nuts different?",
    answer: "We source only premium, export-quality nuts and roast them in small batches to ensure maximum crunch and flavor retention. No additives, just pure nutty goodness. Unlike mass-produced brands, we don't use palm oil or excessive sodium.",
    category: "General Munchies"
  },
  {
    question: "Is your packaging compostable?",
    answer: "Yes! We are committed to the planet. Our outer boxes are 100% recyclable cardboard, and our inner pouches are made from materials that are easier on the environment. We're constantly working towards 100% plastic-free packaging.",
    category: "General Munchies"
  },
  {
    question: "How long do they stay crunchy?",
    answer: "Our specialized roasting process locks in the crunch. Once opened, if stored in an airtight container (like our glass jars), they stay crunchy for up to 4 weeks. Unopened packs stay fresh for 6 months.",
    category: "General Munchies"
  },
  {
    question: "Do you offer wholesale for cafes?",
    answer: "Absolutely! We love fueling local cafes and gyms. We have special bulk rates and packaging for our partners. Drop us a message on the Contact page to get our wholesale catalog.",
    category: "General Munchies"
  },
  {
    question: "Are your products gluten-free?",
    answer: "Most of our products are naturally gluten-free, including our nut butters and muesli. However, they are processed in a facility that handles oats, so there might be trace amounts.",
    category: "Nutrition"
  }
];

const FAQPage: React.FC<FAQPageProps> = ({ onContactClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFAQs = FAQ_DATA.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-background-light min-h-screen py-20 relative overflow-hidden">
      {/* Background doodles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-[0.03] z-0">
        <div className="font-handdrawn text-9xl absolute top-20 left-10 rotate-12">?</div>
        <div className="font-handdrawn text-9xl absolute top-1/2 right-20 -rotate-12">Q&A</div>
        <div className="font-handdrawn text-9xl absolute bottom-20 left-1/3 rotate-45">!</div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 relative">
           <div className="relative inline-block">
             <h1 className="text-4xl md:text-6xl font-black uppercase text-slate-900 tracking-tight leading-tight">
               Nuts & Bolts: <span className="text-accent-brown">Your Questions</span>
             </h1>
             <div className="absolute -top-8 -right-8 md:-right-24 transform rotate-6 border-2 border-slate-900 px-3 py-1 rounded bg-white shadow-sm hidden sm:block">
               <div className="flex items-center gap-1 text-green-500 font-bold text-xs uppercase tracking-widest">
                 <span className="material-symbols-outlined text-sm">check_circle</span>
                 Frequently Asked
               </div>
             </div>
           </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-20 relative">
          <div className="relative group">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
              <span className="material-symbols-outlined">search</span>
            </span>
            <input 
              type="text" 
              placeholder="Search for a nutty answer..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-slate-900 focus:border-primary focus:ring-0 outline-none text-lg font-bold text-slate-700 shadow-sm transition-all"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400">
               <span className="material-symbols-outlined transform rotate-45">auto_fix</span>
            </span>
          </div>
          
          {/* Handdrawn Arrow Annotation */}
          <div className="absolute -right-32 top-0 hidden md:block">
            <span className="font-handdrawn text-green-500 text-xl transform -rotate-12 block mb-1">Search anything!</span>
            <svg width="60" height="40" viewBox="0 0 60 40" className="text-green-500 fill-none stroke-current stroke-2 transform rotate-12">
               <path d="M50,0 Q10,20 0,35 l5,-5 m-5,5 l5,5" />
            </svg>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column: FAQs */}
          <div className="lg:col-span-2 space-y-8 relative">
            {/* Annotation */}
            <div className="absolute -left-32 top-0 hidden lg:block text-right">
              <span className="font-handdrawn text-slate-400 text-xl block">Curious?</span>
              <span className="font-handdrawn text-slate-400 text-sm block max-w-[100px] ml-auto">Commonly asked by the fam</span>
               <svg width="40" height="40" viewBox="0 0 40 40" className="text-slate-300 fill-none stroke-current stroke-2 ml-auto mt-2">
                 <path d="M0,0 Q30,10 35,35 l-5,-5 m5,5 l5,-5" />
               </svg>
            </div>

            <h3 className="font-black text-2xl uppercase text-slate-700 mb-6 pl-2 border-l-4 border-slate-900">General Munchies</h3>

            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`bg-white border-2 border-slate-900 rounded-2xl overflow-hidden transition-shadow duration-300 ${openIndex === index ? 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]'}`}
                >
                  <button 
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left"
                    aria-expanded={openIndex === index}
                  >
                    <span className="font-bold text-lg text-slate-800">{faq.question}</span>
                    <span className={`material-symbols-outlined transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  <div 
                    className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${openIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-6 pt-0">
                        <p className="text-slate-600 font-medium leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredFAQs.length === 0 && (
                <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-slate-300">
                  <span className="font-handdrawn text-2xl text-slate-400">Hmm, that's a tough nut to crack...</span>
                  <p className="text-slate-500 mt-2">Try searching for something else!</p>
                </div>
              )}
            </div>

            {/* Pro Tip Box */}
            <div className="bg-[#e8f5e9] border-2 border-slate-900 rounded-2xl p-6 flex gap-6 items-start mt-8 transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="w-12 h-12 rounded-full bg-green-300 flex items-center justify-center flex-shrink-0 border-2 border-slate-900">
                <span className="material-symbols-outlined text-slate-900">lightbulb</span>
              </div>
              <div>
                <h4 className="font-bold text-lg text-slate-900 font-display">Pro-Tip from the Roastery</h4>
                <p className="font-handdrawn text-slate-600 text-lg mt-1">
                  Try crushing them over your morning porridge for an extra artisanal texture!
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-8">
            {/* Help Card */}
            <div className="bg-[#fcfbf9] border-2 border-slate-900 rounded-2xl p-8 relative transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <h3 className="font-bold text-xl text-slate-900 mb-4 font-display">Need More Help?</h3>
              <p className="text-slate-600 text-sm font-medium mb-6">
                Can't find what you're looking for? Our nutty support team is just a message away.
              </p>
              <button 
                onClick={onContactClick}
                className="text-green-600 font-bold text-sm uppercase tracking-widest flex items-center gap-2 hover:underline group"
              >
                Go to Contact Page 
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
              <div className="absolute -bottom-3 -right-3 text-slate-300">
                <span className="material-symbols-outlined text-4xl">help</span>
              </div>
            </div>

            {/* Newsletter Card */}
            <div className="bg-[#e8f5e9] border-2 border-slate-900 rounded-2xl p-8 relative">
               <h3 className="font-bold text-xl text-slate-900 mb-4 font-display">Join the Fam</h3>
               <p className="text-slate-600 text-sm font-medium mb-6">
                 Get early access to limited seasonal roasts and sustainability tips.
               </p>
               <div className="flex gap-2">
                 <input 
                   type="email" 
                   placeholder="Your email"
                   className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-200 text-sm focus:border-slate-900 focus:ring-0 outline-none"
                 />
                 <button className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors">
                   Join
                 </button>
               </div>
               <div className="absolute -right-8 top-10">
                 <span className="material-symbols-outlined text-4xl text-slate-400 transform -rotate-12">send</span>
               </div>
            </div>

             {/* Map Placeholder Card */}
             <div className="bg-slate-200 border-2 border-slate-900 rounded-2xl h-48 relative overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform duration-300 group">
               <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-12 h-12 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white text-slate-600 group-hover:scale-110 transition-transform">
                   <span className="material-symbols-outlined text-2xl">explore</span>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;