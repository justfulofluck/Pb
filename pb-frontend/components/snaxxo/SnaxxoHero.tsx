import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import MultiLayerWave from './MultiLayerWave';


interface SnaxxoHeroProps {
    onShopClick: () => void;
}

const SnaxxoHero: React.FC<SnaxxoHeroProps> = ({ onShopClick }) => {
    const sectionRef = useRef<HTMLElement>(null);
    const contentWrapperRef = useRef<HTMLDivElement>(null);
    const chipsRef = useRef<(HTMLDivElement | null)[]>([]);
    const contentItemsRef = useRef<(HTMLDivElement | HTMLHeadingElement | null)[]>([]);

    useEffect(() => {
        const hero = sectionRef.current;
        if (!hero) return;

        // Elements
        const stars = hero.querySelector(".review-5-stars");
        const h1a = hero.querySelector(".h1-heading.home-hero:not(._02)");
        const h1b = hero.querySelector(".h1-heading.home-hero._02");
        const cta = hero.querySelector(".button-container-03");

        // Chips are already refs, but we can also query if preferred for simplicity in porting
        // Let's use the refs for chips
        const chips: HTMLElement[] = chipsRef.current.filter((c): c is HTMLDivElement => c !== null);

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // 3D Context
        gsap.set(hero, { perspective: 1200, transformStyle: "preserve-3d" });
        if (contentWrapperRef.current) {
            gsap.set(contentWrapperRef.current, { transformStyle: "preserve-3d" });
        }
        chips.forEach(el => gsap.set(el, { transformStyle: "preserve-3d" }));

        if (reduceMotion) {
            gsap.set([stars, h1a, h1b, cta, ...chips], { opacity: 1, clearProps: "transform,filter" });
            return;
        }

        // Initial States
        const contentItems = [stars, h1a, h1b, cta].filter(Boolean);

        gsap.set(contentItems, {
            opacity: 0,
            y: -140,
            x: -10,
            skewY: 10,
            skewX: -8,
            rotateZ: -6,
            rotateX: 18,
            z: -60,
            filter: "blur(8px)",
            force3D: true
        });

        chips.forEach((el, i) => {
            const dir = i % 2 === 0 ? -1 : 1;
            gsap.set(el, {
                opacity: 0,
                y: -180,
                x: 30 * dir,
                skewY: 12,
                skewX: -10 * dir,
                rotateZ: -10 * dir,
                rotateX: 26,
                rotateY: 18 * dir,
                z: -140,
                scale: 0.9,
                filter: "blur(10px)",
                force3D: true
            });
        });

        // Reveal Timeline
        const tl = gsap.timeline({ delay: 0.08, defaults: { ease: "power3.out" } });

        tl.to(contentItems, {
            opacity: 1,
            y: 0,
            x: 0,
            skewY: 0,
            skewX: 0,
            rotateZ: 0,
            rotateX: 0,
            z: 0,
            filter: "blur(0px)",
            duration: 0.95,
            stagger: 0.18,
            ease: "power4.out"
        }, 0);

        tl.to(chips, {
            opacity: 1,
            y: 0,
            x: 0,
            skewY: 0,
            skewX: 0,
            rotateZ: 0,
            rotateX: 0,
            rotateY: 0,
            z: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.05,
            stagger: 0.16,
            ease: "back.out(1.35)"
        }, 0.28);

        // Floating Animation
        const startFloating = () => {
            chips.forEach(el => gsap.killTweensOf(el, "y"));

            const floats = [
                { y: 34, d: 1.6, delay: 0.0 },
                { y: 40, d: 1.9, delay: 0.15 },
                { y: 36, d: 1.8, delay: 0.3 },
                { y: 44, d: 2.2, delay: 0.45 }
            ];

            chips.forEach((el, i) => {
                const f = floats[i] || floats[0];
                gsap.to(el, {
                    y: "+=" + f.y,
                    duration: f.d,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1,
                    delay: f.delay
                });
            });
        };

        tl.call(startFloating, undefined, 1.55);

        // Visibility observer for floating animation
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                startFloating();
            } else {
                chips.forEach(el => gsap.killTweensOf(el, "y"));
            }
        }, { threshold: 0.1 });
        observer.observe(hero);

        return () => {
            tl.kill();
            observer.disconnect();
            chips.forEach(el => gsap.killTweensOf(el));
        }
    }, []);

    return (
        <section className="section red-text" ref={sectionRef}>
            <div className="hero-background-image-wrapper"></div>
            <div className="w-layout-blockcontainer container home-hero w-container">

                {/* Floating Chips */}
                <div className="image-wrapper chip-04" ref={el => chipsRef.current[3] = el}>
                    <img loading="lazy" src="/assets/snaxxo/6959546aec37be417b0d448f_Frame-20914.avif" alt="Baked SNAXX potato chip close-up" className="content-image _100" />
                </div>
                <div className="image-wrapper chip-03" ref={el => chipsRef.current[2] = el}>
                    <img loading="lazy" src="/assets/snaxxo/6959546ad0cbf4f8413b9035_Frame-20915.avif" alt="Single SNAXX baked potato chip" className="content-image _100" />
                </div>
                <div className="image-wrapper chip-02" ref={el => chipsRef.current[1] = el}>
                    <img loading="lazy" src="/assets/snaxxo/6959546aec37be417b0d448f_Frame-20914.avif" alt="Baked SNAXX potato chip" className="content-image _100" />
                </div>
                <div className="image-wrapper chip-01" ref={el => chipsRef.current[0] = el}>
                    <img loading="lazy" src="/assets/snaxxo/6959546a88084dcbb9a6cf8c_Frame-20913.avif" alt="Crispy SNAXX baked chip" className="content-image _100" />
                </div>

                <div className="content-wrapper home-hero" ref={contentWrapperRef}>
                    <div className="review-stars-holder">
                        <div className="review-5-stars">
                            <div className="review-stars-inner">
                                <img loading="lazy" src="/assets/snaxxo/695953c52dc71dad38e5b08c_5-stars.svg" alt="Five star rating" className="_5-stars-image product-image" />
                                <p className="text-block no-margin">334 Reviews</p>
                            </div>
                        </div>
                    </div>

                    <h1 className="h1-heading home-hero">ITS ALL ABOUT THE</h1>
                    <h1 className="h1-heading home-hero _02">SNAXX</h1>

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

                            <div className="goo-svg-for-button w-embed">
                                <svg xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', width: 0, height: 0 }}>
                                    <defs>
                                        <filter id="goo">
                                            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
                                            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 28 -10" result="goo" />
                                            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                                        </filter>
                                    </defs>
                                </svg>
                            </div>
                            <div className="button-text-01">Shop all</div>
                            <img loading="lazy" src="/assets/snaxxo/6959b12f79f76da53d456fb9_right-arrow.svg" alt="" className="right-arrow-button" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Wave Animation at Bottom */}
            {/* Wave Animation at Bottom */}
            <MultiLayerWave className="below" fill="#f2f2ec" />


        </section>
    );
};

export default SnaxxoHero;
