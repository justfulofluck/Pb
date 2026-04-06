
import React from 'react';

const PrecisionComparison: React.FC = () => {
    return (
        <section className="py-24 px-6 max-w-7xl mx-auto bg-transparent relative z-10 font-jakarta">
            {/* Comparison Header */}
            <header className="text-center mb-16 md:mb-24">
                <h1 className="font-anton text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.9] tracking-tight mb-4 text-slate-800">
                    The Science of <br /><span className="text-alpino-primary">Superior</span> Fuel
                </h1>
                <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium">
                    Comparing the nutritional precision of Pinobite Super Foods against leading generic alternatives.
                </p>
            </header>

            {/* Side-by-Side Comparison Container */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-8 relative">

                {/* Others Card */}
                <div className="w-full max-w-md md:w-5/12 lg:w-5/12 bg-white/60 backdrop-blur-sm rounded-[32px] p-8 md:p-8 lg:p-12 order-2 md:order-1 md:opacity-90 border border-slate-200">
                    <div className="mb-8 text-center">
                        <span className="text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Leading Competitor</span>
                        <h2 className="font-anton text-2xl lg:text-3xl uppercase text-slate-800">Standard Oats</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-end pb-4 border-b border-slate-100">
                            <span className="text-[10px] lg:text-sm font-bold text-slate-400 uppercase tracking-wider">Protein / 100g</span>
                            <span className="font-anton text-xl lg:text-2xl text-slate-700">11G</span>
                        </div>
                        <div className="flex justify-between items-end pb-4 border-b border-slate-100">
                            <span className="text-[10px] lg:text-sm font-bold text-slate-400 uppercase tracking-wider">Added Sugar</span>
                            <span className="font-anton text-xl lg:text-2xl text-alpino-error">18G</span>
                        </div>
                        <div className="flex justify-between items-end pb-4 border-b border-slate-100">
                            <span className="text-[10px] lg:text-sm font-bold text-slate-400 uppercase tracking-wider">Fiber Content</span>
                            <span className="font-anton text-xl lg:text-2xl text-slate-700">4G</span>
                        </div>
                        <div className="flex justify-between items-end pb-4 border-b border-slate-100">
                            <span className="text-[10px] lg:text-sm font-bold text-slate-400 uppercase tracking-wider">Superfoods</span>
                            <span className="font-anton text-xl lg:text-2xl text-slate-700">0</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] lg:text-sm font-bold text-slate-400 uppercase tracking-wider">Artificial Flavors</span>
                            <span className="font-anton text-xl lg:text-2xl text-alpino-error">YES</span>
                        </div>
                    </div>
                </div>

                {/* Pinobite Highlight Card */}
                <div className="w-full max-w-lg md:w-7/12 lg:w-6/12 bg-alpino-primary rounded-[40px] p-8 md:p-10 lg:p-16 relative order-1 md:order-2 z-10 shadow-2xl shadow-alpino-primary/30">
                    {/* Floating Badge */}
                    <div className="absolute -top-4 md:-top-5 left-1/2 -translate-x-1/2 bg-alpino-tertiary-container text-alpino-on-tertiary-container px-4 lg:px-6 py-2 rounded-full font-black text-[10px] lg:text-sm uppercase tracking-widest shadow-xl whitespace-nowrap">
                        Ultimate Winner
                    </div>

                    <div className="mb-8 lg:mb-12">
                        <span className="text-[10px] lg:text-xs font-black uppercase tracking-[0.3em] text-white/60 mb-2 block">The Gold Standard</span>
                        <h2 className="font-anton text-3xl md:text-3xl lg:text-5xl uppercase text-white leading-none">Pinobite Super <br />Food Range</h2>
                    </div>

                    <div className="space-y-6 lg:space-y-8">
                        <div className="flex justify-between items-end pb-4 border-b border-white/20">
                            <span className="text-[10px] lg:text-sm font-bold text-white uppercase tracking-widest">Protein / 100g</span>
                            <div className="flex items-center gap-2">
                                <span className="font-anton text-2xl md:text-3xl lg:text-4xl text-white">22G</span>
                                <span className="material-symbols-outlined text-alpino-tertiary-container text-xl md:text-2xl fill-1">check_circle</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-end pb-4 border-b border-white/20">
                            <span className="text-[10px] lg:text-sm font-bold text-white uppercase tracking-widest">Added Sugar</span>
                            <div className="flex items-center gap-2">
                                <span className="font-anton text-2xl md:text-3xl lg:text-4xl text-white">0G</span>
                                <span className="material-symbols-outlined text-alpino-tertiary-container text-xl md:text-2xl fill-1">check_circle</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-end pb-4 border-b border-white/20">
                            <span className="text-[10px] lg:text-sm font-bold text-white uppercase tracking-widest">Fiber Content</span>
                            <div className="flex items-center gap-2">
                                <span className="font-anton text-2xl md:text-3xl lg:text-4xl text-white">12G</span>
                                <span className="material-symbols-outlined text-alpino-tertiary-container text-xl md:text-2xl fill-1">check_circle</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-end pb-4 border-b border-white/20">
                            <span className="text-[10px] lg:text-sm font-bold text-white uppercase tracking-widest">Superfoods</span>
                            <span className="font-anton text-2xl md:text-3xl lg:text-4xl text-white">5+ Mapped</span>
                        </div>
                    </div>

                    <div className="mt-8 lg:mt-12">
                        <button className="w-full bg-white text-alpino-primary font-anton text-lg lg:text-xl uppercase py-4 lg:py-5 rounded-full hover:bg-alpino-tertiary-container hover:text-alpino-on-tertiary-container transition-all duration-300 tracking-wider shadow-lg active:scale-95">
                            Shop Now
                        </button>
                        <p className="text-center text-[8px] lg:text-[10px] text-white/50 uppercase tracking-widest mt-4 font-bold">Free Express Shipping on Orders Above ₹500</p>
                    </div>
                </div>
            </div>

            {/* Metric Details / Why it matters */}
            <div className="mt-24 grid md:grid-cols-3 gap-6 lg:gap-8">
                <div className="bg-white/50 backdrop-blur-sm p-6 lg:p-8 rounded-[32px] border border-slate-100 hover:shadow-xl transition-all duration-500 group">
                    <span className="material-symbols-outlined text-alpino-primary text-2xl lg:text-3xl mb-4 p-3 bg-alpino-primary/10 rounded-2xl group-hover:bg-alpino-primary group-hover:text-white transition-colors duration-500">bolt</span>
                    <h3 className="font-anton text-lg lg:text-xl uppercase mb-2 text-slate-800">Double Protein</h3>
                    <p className="text-[13px] lg:text-sm text-slate-500 font-medium leading-relaxed">Isolated whey and pea protein blend ensures maximum bioavailability for muscle recovery.</p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm p-6 lg:p-8 rounded-[32px] border border-slate-100 hover:shadow-xl transition-all duration-500 group">
                    <span className="material-symbols-outlined text-alpino-primary text-2xl lg:text-3xl mb-4 p-3 bg-alpino-primary/10 rounded-2xl group-hover:bg-alpino-primary group-hover:text-white transition-colors duration-500">spa</span>
                    <h3 className="font-anton text-lg lg:text-xl uppercase mb-2 text-slate-800">Glycemic Control</h3>
                    <p className="text-[13px] lg:text-sm text-slate-500 font-medium leading-relaxed">Zero refined sugars means steady energy levels without the traditional insulin spike.</p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm p-6 lg:p-8 rounded-[32px] border border-slate-100 hover:shadow-xl transition-all duration-500 group">
                    <span className="material-symbols-outlined text-alpino-primary text-2xl lg:text-3xl mb-4 p-3 bg-alpino-primary/10 rounded-2xl group-hover:bg-alpino-primary group-hover:text-white transition-colors duration-500">biotech</span>
                    <h3 className="font-anton text-lg lg:text-xl uppercase mb-2 text-slate-800">Superfood Matrix</h3>
                    <p className="text-[13px] lg:text-sm text-slate-500 font-medium leading-relaxed">Infused with Chia, Flax, and Raw Cacao for natural antioxidants and omega-3s.</p>
                </div>
            </div>
        </section>
    );
};

export default PrecisionComparison;
