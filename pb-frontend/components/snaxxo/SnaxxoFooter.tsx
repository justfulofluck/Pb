import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import SnaxxoWave from './SnaxxoWave';

interface SnaxxoFooterProps {
    onShopClick: () => void;
    onHomeClick: () => void;
    onFAQClick?: () => void;
    onBlogsClick?: () => void;
    onEventBlogsClick?: () => void;
    onAdminClick?: () => void;
    onJourneyClick: () => void;
    onPrivacyClick?: () => void;
    onTermsClick?: () => void;
    onRefundClick?: () => void;
    onShippingClick?: () => void;
    onDistributorClick?: () => void;
}

const SnaxxoFooter: React.FC<SnaxxoFooterProps> = ({
    onShopClick,
    onHomeClick,
    onFAQClick,
    onBlogsClick,
    onEventBlogsClick,
    onAdminClick,
    onJourneyClick,
    onPrivacyClick,
    onTermsClick,
    onRefundClick,
    onShippingClick,
    onDistributorClick
}) => {
    const marqueeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const marquee = marqueeRef.current;
        if (!marquee) return;

        // Simple marquee animation
        const panels = marquee.querySelectorAll('.marquee-horizontal-panel-alternate-01');
        if (panels.length) {
            gsap.to(panels, {
                xPercent: -100,
                repeat: -1,
                duration: 20,
                ease: "none"
            });
        }
    }, []);

    return (
        <>


            <section className="section darker-red !bg-[#008a45] !bg-none">
                <div className="wave-lottie-animation below footer !bg-[#f2f2ec]">
                    <SnaxxoWave fill="#008a45" />
                </div>

                <div className="w-layout-blockcontainer container footer-main w-container !bg-[#008a45] !mt-[-1rem] !max-w-7xl mx-auto px-4 !py-16">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div>
                            <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Quick Links</h3>
                            <ul className="space-y-4 text-xs">
                                <li><button onClick={onShopClick} className="text-left hover:opacity-80 transition-opacity uppercase font-bold tracking-widest cursor-pointer">ALL PRODUCTS</button></li>
                                <li><button onClick={onJourneyClick} className="text-left hover:opacity-80 transition-opacity uppercase font-bold tracking-widest cursor-pointer">OUR STORY</button></li>
                                <li><button onClick={onBlogsClick} className="text-left hover:opacity-80 transition-opacity uppercase font-bold tracking-widest cursor-pointer">RECIPES & LIFESTYLE</button></li>
                                <li><button onClick={onEventBlogsClick} className="text-left hover:opacity-80 transition-opacity uppercase font-bold tracking-widest cursor-pointer">EVENT BLOGS</button></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Partner With Us</h3>
                            <ul className="space-y-4 text-xs">
                                <li><button onClick={onAdminClick} className="text-left hover:opacity-80 transition-opacity uppercase font-bold tracking-widest cursor-pointer">PINOBITE GLOBAL</button></li>
                                <li><button onClick={onDistributorClick} className="text-left hover:opacity-80 transition-opacity uppercase font-bold tracking-widest cursor-pointer">BECOME A DISTRIBUTOR</button></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Policies</h3>
                            <ul className="space-y-4 text-xs">
                                <li><button onClick={onTermsClick} className="text-left hover:opacity-80 transition-opacity uppercase font-bold tracking-widest cursor-pointer">TERMS & CONDITIONS</button></li>
                                <li><button onClick={onFAQClick} className="text-left hover:opacity-80 transition-opacity uppercase font-bold tracking-widest cursor-pointer">FAQ'S</button></li>
                                <li><button onClick={onShippingClick} className="text-left hover:opacity-80 transition-opacity uppercase font-bold tracking-widest cursor-pointer">SHIPPING</button></li>
                                <li><button onClick={onRefundClick} className="text-left hover:opacity-80 transition-opacity uppercase font-bold tracking-widest cursor-pointer">RETURNS & REFUNDS</button></li>
                                <li><button onClick={onPrivacyClick} className="text-left hover:opacity-80 transition-opacity uppercase font-bold tracking-widest cursor-pointer">PRIVACY POLICY</button></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Contact</h3>
                            <div className="space-y-4 text-sm">
                                <p className="leading-relaxed">
                                    <span className="text-white font-bold block mb-1">Address:</span>
                                    Fairyland School Dabhoi – Sinor Chowkdi, Sathod – Dist. Dabhoi Dabhoi, India 391110 Gujarat
                                </p>
                                <p>
                                    <span className="text-white font-bold block mb-1">Phone:</span>
                                    <a href="tel:+919328173747" className="hover:opacity-80 transition-opacity">+91 9328173747</a>
                                </p>
                                <p>
                                    <span className="text-white font-bold block mb-1">E-mail:</span>
                                    <a href="mailto:pinobites@gmail.com" className="hover:opacity-80 transition-opacity underline underline-offset-4 decoration-white/50">pinobites@gmail.com</a>
                                </p>

                                <div className="flex flex-wrap gap-2 pt-4">
                                    <div className="bg-white px-2 py-1.5 rounded flex items-center justify-center w-[70px] h-8 shadow-sm">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="w-full h-auto object-contain" />
                                    </div>
                                    <div className="bg-white px-2 py-1.5 rounded flex items-center justify-center w-[70px] h-8 shadow-sm">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Meesho_Logo.svg" alt="Meesho" className="w-full h-auto object-contain" />
                                    </div>
                                    <div className="bg-white px-2 py-1.5 rounded flex items-center justify-center w-[70px] h-8 shadow-sm">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Flipkart_logo.svg" alt="Flipkart" className="w-full h-auto object-contain" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-display">
                        <p>© 2025 Pinobite. All Rights Reserved.</p>
                        <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
                            <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-[8px] font-bold text-white uppercase">VISA</div>
                            <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-[8px] font-bold text-white uppercase">MASTER</div>
                            <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-[8px] font-bold text-white uppercase">PAYPAL</div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SnaxxoFooter;
