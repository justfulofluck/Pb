import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import SnaxxoWave from './SnaxxoWave';

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
            <div className="border-b border-white/10 lg:border-none w-full">
                <button
                    onClick={() => toggleSection(id)}
                    className="w-full flex items-center justify-between py-3 lg:py-0 lg:mb-3 text-left focus:outline-none group"
                >
                    <h4 className="font-bold text-white text-base lg:text-lg uppercase tracking-wider">{title}</h4>
                    <span className={`lg:hidden transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <i className="fa-solid fa-chevron-down text-white/50 text-xs"></i>
                    </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 lg:h-auto lg:opacity-100 ${isOpen ? 'max-h-[500px] opacity-100 pb-3' : 'max-h-0 opacity-0 lg:max-h-none'}`}>
                    {children}
                </div>
            </div>
        );
    };

    return (
        <>


            <section className="section darker-red !bg-[#f2f2ec] !bg-none">
                <div className="wave-lottie-animation below footer !bg-[#f2f2ec]">
                    <SnaxxoWave fill="#228b44" />
                </div>

                <div className="w-layout-blockcontainer container footer-main w-container !bg-[#228b44] !mt-[-1rem] !max-w-7xl mx-auto px-4 !pt-20 !pb-10 font-display">
                    {/* Main Footer Content */}
                    {/* Main Footer Content */}
                    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-y-0 lg:gap-y-12 lg:gap-x-8 mb-16 px-4 sm:px-0 relative">

                        {/* Brand Column - Full width on mobile/tablet */}
                        <div className="lg:col-span-4 max-w-sm mb-12 lg:mb-0">
                            <button onClick={onHomeClick} className="block mb-6 lg:h-28 h-12">
                                <img
                                    src="/logos/Pinobite-logo.png"
                                    alt="Pinobite Logo"
                                    className="h-full w-auto object-contain brightness-0 invert"
                                />
                            </button>
                            <p className="text-white/90 text-sm leading-relaxed mb-8">
                                Pinobite is a group of modern healthy snack specialists transforming your daily energy intake with handcrafted, nutritious muesli and peanut butter. Founded with a passion for goodness.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                                    <i className="fa-brands fa-linkedin-in text-sm"></i>
                                </a>
                                <a href="#" className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                                    <i className="fa-brands fa-x-twitter text-sm"></i>
                                </a>
                                <a href="#" className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                                    <i className="fa-brands fa-facebook-f text-sm"></i>
                                </a>
                                <a href="#" className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                                    <i className="fa-brands fa-youtube text-sm"></i>
                                </a>
                            </div>
                        </div>

                        {/* Accordion Sections for Mobile, Columns for Desktop */}
                        <div className="lg:contents">
                            <div className="lg:col-span-2">
                                <AccordionSection title="Collections" id="collections">
                                    <ul className="space-y-3 text-sm text-white/80 font-medium uppercase tracking-tight pl-0 list-none">
                                        <li><button onClick={() => onShopClick()} className="hover:text-white transition-colors cursor-pointer text-left">Shop All</button></li>
                                        <li><button onClick={() => onShopClick('Peanut Butter')} className="hover:text-white transition-colors cursor-pointer text-left">Peanut Butter</button></li>
                                        <li><button onClick={() => onShopClick('Muesli')} className="hover:text-white transition-colors cursor-pointer text-left">Healthy Muesli</button></li>
                                        <li><button onClick={() => onShopClick('Oats')} className="hover:text-white transition-colors cursor-pointer text-left">Healthy Oats</button></li>
                                    </ul>
                                </AccordionSection>
                            </div>

                            <div className="lg:col-span-2">
                                <AccordionSection title="Resources" id="resources">
                                    <ul className="space-y-3 text-sm text-white/80 font-medium uppercase tracking-tight pl-0 list-none">
                                        <li><button onClick={onFAQClick} className="hover:text-white transition-colors cursor-pointer text-left">FAQ's</button></li>
                                        <li><button onClick={onShippingClick} className="hover:text-white transition-colors cursor-pointer text-left">Shipping Info</button></li>
                                        <li><button onClick={onRefundClick} className="hover:text-white transition-colors cursor-pointer text-left">Refund Policy</button></li>
                                    </ul>
                                </AccordionSection>
                            </div>

                            <div className="lg:col-span-2">
                                <AccordionSection title="Partners" id="partners">
                                    <ul className="space-y-3 text-sm text-white/80 font-medium uppercase tracking-tight pl-0 list-none">
                                        <li><button onClick={onDistributorClick} className="hover:text-white transition-colors cursor-pointer text-left">Become a Distributor</button></li>
                                        <li><button onClick={onAdminClick} className="hover:text-white transition-colors cursor-pointer text-left">Pinobite Login</button></li>
                                    </ul>
                                </AccordionSection>
                            </div>

                            <div className="lg:col-span-2">
                                <AccordionSection title="Company" id="company">
                                    <ul className="space-y-3 text-sm text-white/80 font-medium uppercase tracking-tight pl-0 list-none">
                                        <li><button onClick={onJourneyClick} className="hover:text-white transition-colors cursor-pointer text-left">About Us</button></li>
                                        <li><button onClick={onJourneyClick} className="hover:text-white transition-colors cursor-pointer text-left">Our Story</button></li>
                                        <li><button onClick={onBlogsClick} className="hover:text-white transition-colors cursor-pointer text-left">Healthy Blog</button></li>
                                        <li><button onClick={onEventBlogsClick} className="hover:text-white transition-colors cursor-pointer text-left">Events & News</button></li>
                                    </ul>
                                </AccordionSection>
                            </div>
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
                    <div className="border-t border-white/10 pt-10 pb-10">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16">
                            <div className="flex items-center gap-4 text-white hover:text-white/80 transition-colors text-sm md:text-base">
                                <i className="fa-solid fa-phone text-[#f9bc15] text-xl"></i>
                                <a href="tel:+919328173747" className="font-medium tracking-wide">+91 9328173747</a>
                            </div>
                            <div className="flex items-center gap-4 text-white hover:text-white/80 transition-colors text-sm md:text-base text-center md:text-left">
                                <i className="fa-solid fa-location-dot text-[#f9bc15] text-xl"></i>
                                <span className="font-medium tracking-wide">Fairyland School Dabhoi – Sinor Chowkdi, India 391110</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/60">
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
