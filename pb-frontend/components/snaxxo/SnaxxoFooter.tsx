import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import MultiLayerWave from './MultiLayerWave';


interface SnaxxoFooterProps {
    onShopClick: (category?: string) => void;
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
    const [openSection, setOpenSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        if (window.innerWidth >= 1024) return;
        setOpenSection(openSection === section ? null : section);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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

    // Helper to render accordion sections
    const AccordionSection = ({ title, id, children }: { title: string, id: string, children: React.ReactNode }) => {
        const isOpen = openSection === id;
        return (
            <div className="lg:border-none w-full flex flex-col items-start px-0">
                <button
                    onClick={() => toggleSection(id)}
                    className="w-full flex items-center justify-start py-1.5 lg:py-0 lg:mb-4 text-left focus:outline-none group px-0 m-0"
                >
                    <div className="font-bold !text-secondary text-xl lg:text-2xl uppercase tracking-wider [word-spacing:0.02em] font-anton leading-tight text-left p-0 m-0">{title}</div>
                    <span className={`lg:hidden transition-transform duration-300 ml-2 ${isOpen ? 'rotate-180' : ''}`}>
                        <i className="fa-solid fa-chevron-down text-white/50 text-xs"></i>
                    </span>
                </button>
                <motion.div
                    initial={false}
                    animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="w-full overflow-hidden lg:!h-auto lg:!opacity-100"
                >
                    <div className="pt-3 lg:pt-4 flex flex-col items-start w-full p-0 m-0 pb-3 lg:pb-0">
                        {children}
                    </div>
                </motion.div>
            </div>
        );
    };

    return (
        <>


            {/* Wave Transition - Moved BEFORE the section to make it visible against bg */}
            <div className="relative z-30 w-full overflow-hidden texture-overlay texture-speckles" style={{ height: '140px', marginBottom: '-1px' }}>
                <MultiLayerWave fill="#0b3d2e" className="flex items-end h-full" />
            </div>

            <section className="section bg-greenboard texture-overlay texture-speckles overflow-hidden relative z-20">
                <div className="!bg-transparent !mt-0 !max-w-7xl mx-auto px-4 !pt-10 pb-28 lg:!pb-10 font-satoshi relative z-10 w-full text-left items-start">
                    {/* Main Footer Content */}
                    <div className="flex flex-col md:flex-row gap-x-12 lg:gap-x-24 gap-y-12 items-start text-left w-full relative">

                        {/* Brand Column - Tight and on the far left */}
                        <div className="flex-shrink-0 flex flex-col items-start text-left gap-6 max-w-xs">
                            <button onClick={onHomeClick} className="block h-12 lg:h-16 transition-transform hover:scale-105">
                                <img
                                    src="/logos/Pinobite-logo.png"
                                    className="h-full w-auto object-contain brightness-0 invert"
                                />
                            </button>
                            <p className="text-white/80 text-sm leading-relaxed text-left">
                                Pinobite is a group of modern healthy snack specialists transforming your daily energy intake with handcrafted, nutritious muesli and peanut butter.
                            </p>
                            <div className="flex gap-4 mt-2 justify-start w-full">
                                <a href="https://www.facebook.com/profile.php?id=61574254086582" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-secondary hover:text-slate-900 hover:border-secondary transition-all duration-300">
                                    <i className="fa-brands fa-facebook-f"></i>
                                </a>
                                <a href="https://www.instagram.com/pino.bite/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-secondary hover:text-slate-900 hover:border-secondary transition-all duration-300">
                                    <i className="fa-brands fa-instagram"></i>
                                </a>
                            </div>
                        </div>

                        {/* Category Columns - Moved closer to the Brand info and strictly left-aligned */}
                        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 lg:gap-x-12 gap-y-1 md:gap-y-8 lg:gap-y-12 text-left items-start">
                            <AccordionSection title="Collections" id="collections">
                                <ul className="flex flex-col items-start gap-4 text-sm text-white/70 font-medium list-none !p-0 !m-0 w-full text-left">
                                    <li className="w-full text-left !p-0 !m-0 flex">
                                        <button onClick={() => onShopClick()} className="hover:text-secondary transition-colors cursor-pointer text-left uppercase tracking-tight block w-full mb-0 !p-0 !m-0 !pl-0">Shop All</button>
                                    </li>
                                    <li className="w-full text-left !p-0 !m-0 flex">
                                        <button onClick={() => onShopClick('Peanut Butter')} className="hover:text-secondary transition-colors cursor-pointer text-left uppercase tracking-tight block w-full mb-0 !p-0 !m-0 !pl-0">Peanut Butter</button>
                                    </li>
                                    <li className="w-full text-left !p-0 !m-0 flex">
                                        <button onClick={() => onShopClick('Muesli')} className="hover:text-secondary transition-colors cursor-pointer text-left uppercase tracking-tight block w-full mb-0 !p-0 !m-0 !pl-0">Healthy Muesli</button>
                                    </li>
                                    <li className="w-full text-left !p-0 !m-0 flex">
                                        <button onClick={() => onShopClick('Oats')} className="hover:text-secondary transition-colors cursor-pointer text-left uppercase tracking-tight block w-full mb-0 !p-0 !m-0 !pl-0">Healthy Oats</button>
                                    </li>
                                </ul>
                            </AccordionSection>

                            <AccordionSection title="Resources" id="resources">
                                <ul className="flex flex-col items-start gap-4 text-sm text-white/70 font-medium list-none !p-0 !m-0 w-full text-left">
                                    <li className="w-full text-left !p-0 !m-0 flex">
                                        <button onClick={onFAQClick} className="hover:text-secondary transition-colors cursor-pointer text-left uppercase tracking-tight block w-full mb-0 !p-0 !m-0 !pl-0">FAQ's</button>
                                    </li>
                                    <li className="w-full text-left !p-0 !m-0 flex">
                                        <button onClick={onShippingClick} className="hover:text-secondary transition-colors cursor-pointer text-left uppercase tracking-tight block w-full mb-0 !p-0 !m-0 !pl-0">Shipping Info</button>
                                    </li>
                                    <li className="w-full text-left !p-0 !m-0 flex">
                                        <button onClick={onRefundClick} className="hover:text-secondary transition-colors cursor-pointer text-left uppercase tracking-tight block w-full mb-0 !p-0 !m-0 !pl-0">Refund Policy</button>
                                    </li>
                                </ul>
                            </AccordionSection>

                            <AccordionSection title="Partners" id="partners">
                                <ul className="flex flex-col items-start gap-4 text-sm text-white/70 font-medium list-none !p-0 !m-0 w-full text-left">
                                    <li className="w-full text-left !p-0 !m-0 flex">
                                        <button onClick={onDistributorClick} className="hover:text-secondary transition-colors cursor-pointer text-left uppercase tracking-tight block w-full mb-0 !p-0 !m-0 !pl-0">Distributors</button>
                                    </li>
                                    <li className="w-full text-left !p-0 !m-0 flex">
                                        <button onClick={onAdminClick} className="hover:text-secondary transition-colors cursor-pointer text-left uppercase tracking-tight block w-full mb-0 !p-0 !m-0 !pl-0">Admin Login</button>
                                    </li>
                                </ul>
                            </AccordionSection>

                            <AccordionSection title="Company" id="company">
                                <ul className="flex flex-col items-start gap-4 text-sm text-white/70 font-medium list-none !p-0 !m-0 w-full text-left">
                                    <li className="w-full text-left !p-0 !m-0 flex">
                                        <button onClick={onJourneyClick} className="hover:text-secondary transition-colors cursor-pointer text-left uppercase tracking-tight block w-full mb-0 !p-0 !m-0 !pl-0">About Us</button>
                                    </li>
                                    <li className="w-full text-left !p-0 !m-0 flex">
                                        <button onClick={onBlogsClick} className="hover:text-secondary transition-colors cursor-pointer text-left uppercase tracking-tight block w-full mb-0 !p-0 !m-0 !pl-0">Healthy Blog</button>
                                    </li>
                                    <li className="w-full text-left !p-0 !m-0 flex">
                                        <button onClick={onEventBlogsClick} className="hover:text-secondary transition-colors cursor-pointer text-left uppercase tracking-tight block w-full mb-0 !p-0 !m-0 !pl-0">Events & News</button>
                                    </li>
                                </ul>
                            </AccordionSection>
                        </div>

                        {/* Scroll to Top - Mobile/Tablet only */}
                        <button
                            onClick={scrollToTop}
                            className="lg:hidden absolute bottom-[-4rem] right-4 w-12 h-12 bg-[#9cd92a] rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform z-20"
                        >
                            <i className="fa-solid fa-arrow-up text-[#228b44]"></i>
                        </button>
                    </div>

                    {/* Divider and Contact Row */}
                    <div className="border-t border-white/5 pt-10 pb-10">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-white hover:text-white/80 transition-colors text-sm md:text-base">
                                <i className="fa-solid fa-phone text-[#f9bc15] text-xl"></i>
                                <a href="tel:+919328173747" className="font-medium tracking-wide">+91 9328173747</a>
                            </div>
                            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-white hover:text-white/80 transition-colors text-sm md:text-base text-center md:text-left">
                                <i className="fa-solid fa-location-dot text-[#f9bc15] text-xl"></i>
                                <a href="https://maps.app.goo.gl/m21Carqf53eYqKaVA" target="_blank" rel="noopener noreferrer" className="font-medium tracking-wide hover:underline cursor-pointer text-center">Tri-origin Ayurveda, Sathod Vasahat, Sathod Road, Dabhoi-391110, Vadodara - Gujarat</a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/60">
                        <p className="text-center md:text-left">© 2025 Pinobite Plan Consultants, Inc. All Rights Reserved.</p>
                        <div className="flex gap-6 sm:gap-8 justify-center">
                            <button onClick={onTermsClick} className="hover:text-white transition-colors cursor-pointer">Terms</button>
                            <button onClick={onPrivacyClick} className="hover:text-white transition-colors cursor-pointer">Privacy</button>
                            <button className="hover:text-white transition-colors cursor-pointer">Cookies</button>
                            <button className="hover:text-white transition-colors cursor-pointer">Sitemap</button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SnaxxoFooter;
