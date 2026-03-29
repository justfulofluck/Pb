import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface SnaxxoVarietyProps {
    onShopClick: () => void;
}

const SnaxxoVariety: React.FC<SnaxxoVarietyProps> = ({ onShopClick }) => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        // Apply specific animations if needed, but the main SnaxxoLanding hook 
        // handles generic [data-gsap-init-*] attributes if we add the logic there.
        // For now, let's replicate the basic structure and classes.
        // The original script handles "words-slide-up", "scale-up", etc. globally.
        // We should ensure useSnaxxoAnimations handles these or we add local effects.

        // Local effect for variety pack specific items if global hook doesn't catch them
        // (Assuming global hook catches them based on attributes)
    }, []);

    return (
        <section className="section bg-whiteboard texture-overlay texture-speckles" ref={sectionRef}>
            <div className="w-layout-blockcontainer container variety-pack w-container">
                <div className="variety-pack-content-wrapper">
                    <div className="w-layout-grid content-grid variety">
                        <div className="grid-block">
                            <div className="content-wrapper variety-pack">
                                <div className="text-box variety-pack-left-block">
                                    <h2
                                        className="h2-heading two-column"
                                        data-words-slide-up=""
                                        data-text-split=""
                                    >
                                        Get the Snaxx variety pack delivered today
                                    </h2>
                                    <div className="variety-pack-icons-container">
                                        <div className="variety-pack-icons-wrapper">
                                            <img
                                                className="variety-pack-icon"
                                                src="/assets/snaxxo/6959b3921e39302170b5895f_union.svg"
                                                alt="Antioxidants icon"
                                                loading="lazy"
                                                data-scale-up=""
                                                data-delay="0.2"
                                                data-duration="0.5"
                                            />
                                            <div className="w-layout-vflex flex-block-wrapper">
                                                <div className="variety-pack-icon-title" data-lines-drop="" data-text-split="">
                                                    PACKED WITH ANTIOXIDANTS
                                                </div>
                                                <p className="small-paragraph no-margin" data-lines-drop="" data-text-split="" data-delay="0.4" data-duration="0.3">
                                                    Packed with antioxidants to support everyday balance
                                                </p>
                                            </div>
                                        </div>

                                        <div className="variety-pack-icons-wrapper">
                                            <img
                                                className="variety-pack-icon"
                                                src="/assets/snaxxo/6959b3740a875e25c7c775b9_pyramid.svg"
                                                alt="Nutrient icon"
                                                loading="lazy"
                                                data-scale-up=""
                                                data-delay="0.2"
                                                data-duration="0.5"
                                            />
                                            <div className="w-layout-vflex flex-block-wrapper">
                                                <div className="variety-pack-icon-title" data-lines-drop="" data-text-split="">
                                                    NUTRIENT-RICH
                                                </div>
                                                <p className="small-paragraph no-margin" data-lines-drop="" data-text-split="" data-delay="0.4" data-duration="0.3">
                                                    Nutrient-rich ingredients for smarter snacking
                                                </p>
                                            </div>
                                        </div>

                                        <div className="variety-pack-icons-wrapper">
                                            <img
                                                className="variety-pack-icon"
                                                src="/assets/snaxxo/6959b3c7c8204500815a8ac8_intestine.svg"
                                                alt="Gut-friendly icon"
                                                loading="lazy"
                                                data-scale-up=""
                                                data-delay="0.2"
                                                data-duration="0.5"
                                            />
                                            <div className="w-layout-vflex flex-block-wrapper">
                                                <div className="variety-pack-icon-title" data-lines-drop="" data-text-split="">
                                                    GUT-FRIENDLY
                                                </div>
                                                <p className="small-paragraph no-margin" data-lines-drop="" data-text-split="" data-delay="0.4" data-duration="0.3">
                                                    Gut-friendly recipes made to satisfy without the crash
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="button-container-03">
                        <button onClick={onShopClick} className="blob-button w-inline-block cursor-pointer border-none bg-transparent appearance-none">
                            <div className="blob-button-inner">
                                <div className="blob-button-blobs" style={{ filter: 'url(#goo)' }}>
                                    <div className="blob-button-blob _01"></div>
                                    <div className="blob-button-blob _02"></div>
                                    <div className="blob-button-blob _03"></div>
                                    <div className="blob-button-blob _04"></div>
                                </div>
                            </div>
                            <div className="button-text-01">Shop all</div>
                            <img loading="lazy" src="/assets/snaxxo/6959b12f79f76da53d456fb9_right-arrow.svg" alt="" className="right-arrow-button" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SnaxxoVariety;
