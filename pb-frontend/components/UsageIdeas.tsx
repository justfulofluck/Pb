import React from 'react';
import { UsageIdea } from '../types';

interface UsageIdeasProps {
    ideas: UsageIdea[];
    bgColor?: string;
}

const UsageIdeas: React.FC<UsageIdeasProps> = ({ ideas, bgColor = '#0b3d2e' }) => {
    if (!ideas || ideas.length === 0) return null;

    return (
        <section className="py-24 px-6 overflow-hidden" style={{ backgroundColor: '#fff5f0' }}>
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <h2 className="font-handdrawn text-5xl md:text-6xl text-center mb-16 uppercase tracking-wider" style={{ color: bgColor }}>
                    Usage Ideas
                </h2>

                {/* Ideas Grid/Scroll */}
                <div className="flex overflow-x-auto pb-8 gap-8 no-scrollbar snap-x snap-mandatory">
                    {ideas.sort((a, b) => a.order - b.order).map((idea) => (
                        <div key={idea.id} className="flex-none w-72 md:w-80 group snap-center first:pl-4 last:pr-4">
                            <div className="aspect-square rounded-[48px] overflow-hidden mb-8 shadow-2xl shadow-black/5 transition-all duration-700 group-hover:rounded-[32px] group-hover:shadow-alpino-primary/20">
                                <img
                                    src={idea.image}
                                    alt={idea.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <div className="px-2">
                                <h3 className="font-satoshi font-black text-2xl lg:text-3xl text-slate-900 mb-2 tracking-tight group-hover:text-alpino-primary transition-colors duration-300">
                                    {idea.title}
                                </h3>
                                <p className="font-satoshi text-slate-600 text-sm lg:text-base font-medium leading-relaxed opacity-80">
                                    {idea.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
};

export default UsageIdeas;
