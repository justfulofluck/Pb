import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Product } from '../../types';
import SnaxxoProductCarousel from './SnaxxoProductCarousel';

interface SnaxxoProductWheelProps {
    products: Product[];
    onAddToCart: (p: Product) => void;
    onProductClick: (p: Product) => void;
    isLoading?: boolean;
    onShopClick?: () => void;
}

const SnaxxoProductWheel: React.FC<SnaxxoProductWheelProps> = ({ products, onAddToCart, onProductClick, isLoading, onShopClick }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const wheelRef = useRef<HTMLDivElement>(null);
    const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
    const goNextRef = useRef<(() => void) | null>(null);
    const goPrevRef = useRef<(() => void) | null>(null);

    const displayProducts = React.useMemo(() => {
        if (!products || products.length === 0) return [];
        let items = [...products];
        // Ensure at least 7 items for seamless wide-arc looping
        while (items.length > 0 && items.length < 7) {
            items = [...items, ...products.map((p, idx) => ({ ...p, id: `${p.id}_dup_${items.length}_${idx}` }))];
        }
        return items;
    }, [products]);

    useEffect(() => {
        const slider = wrapperRef.current;
        if (!slider) return;

        // Skip animation setup if loading or no products
        if (isLoading || !displayProducts.length) return;

        // --- Configuration tuned to be responsive ---
        const getCFG = () => {
            const width = window.innerWidth;
            const isMobile = width < 640;
            const isTablet = width >= 640 && width < 1024;

            return {
                arcStepDeg: isMobile ? 45 : (isTablet ? 25 : 15),
                radiusXFactor: isMobile ? 0.45 : (isTablet ? 0.60 : 0.70),
                radiusYFromWidthFactor: isMobile ? 0.45 : (isTablet ? 0.30 : 0.20),
                rotateFactor: isMobile ? 1.4 : 0.8,
                scaleMin: isMobile ? 0.45 : 0.50,
                ease: "power3.out",
                duration: 0.6,
                visibleRange: isMobile ? 1 : (isTablet ? 2 : 3),
                animateRange: 6,
                dragPixelsPerStep: isMobile ? 70 : 100,
                dragDamp: 0.92,
                heightPadding: isMobile ? 40 : 60,
                heightMin: isMobile ? 350 : 300,
                heightMaxVh: 0.9,
                uiInDuration1: 0.3,
                uiInDuration2: 0.2,
                uiOvershoot: 1.05,
                uiEaseIn: "power2.out",
                uiEaseSettle: "power2.inOut",
                splashDuration: 0.28,
                splashEase: "power2.out",
                dragStartThresholdPx: 8
            };
        };

        const viewport = slider.querySelector(".product-wheel-viewport") as HTMLElement;
        const wheel = wheelRef.current;
        // Limit display products for animation performance if needed
        const slides = slidesRef.current.filter(s => s !== null) as HTMLElement[];
        if (!viewport || !wheel || !slides.length || window.innerWidth < 1024) return;

        // --- Styles setup ---
        slider.style.position = "relative";
        slider.style.width = "100%";
        slider.style.maxWidth = "none";
        slider.style.overflowX = "hidden";
        slider.style.overflowY = "visible";

        viewport.style.position = "relative";
        viewport.style.width = "100%";
        viewport.style.maxWidth = "none";
        viewport.style.overflow = "visible";

        wheel.style.position = "absolute";
        wheel.style.top = "0";
        wheel.style.left = "0";
        wheel.style.width = "100%";
        wheel.style.height = "100%";
        wheel.style.willChange = "transform";
        wheel.style.touchAction = "pan-y";
        wheel.style.cursor = "grab";

        slides.forEach(slide => {
            slide.style.position = "absolute";
            slide.style.top = "50%";
            slide.style.left = "50%";
            slide.style.willChange = "transform, opacity";
            slide.style.transformOrigin = "50% 60%"; // Better "hinge" point for bags

            gsap.set(slide, { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 1 });

            const inner = slide.querySelector(".product-slide-inner") as HTMLElement;
            if (inner) {
                inner.style.willChange = "transform";
                inner.style.transformOrigin = "50% 60%";
                gsap.set(inner, { rotate: 0 });
            }

            const infoBox = slide.querySelector(".product-bottom-info-box");
            if (infoBox) gsap.set(infoBox, { opacity: 0, scale: 0 });
        });

        // --- Core Wheel Logic ---
        let activeAbs = 0;
        let lastActiveAbs = 0;
        let lastVisibleByIndex = Array(displayProducts.length).fill(false);
        let lastRelByIndex: (number | null)[] = Array(displayProducts.length).fill(null);
        let isAnimating = false;
        let animUnlockTimer: any = null;

        const wrapIndex = (i: number, len: number) => {
            i = i % len;
            return i < 0 ? i + len : i;
        };

        const degToRad = (d: number) => (d * Math.PI) / 180;
        const getRect = (el: HTMLElement) => el.getBoundingClientRect();

        const setStableViewportHeight = () => {
            const CFG = getCFG();
            const vr = getRect(viewport);
            if (vr.width <= 0) return;

            let maxCardH = 0;
            slides.forEach(slide => {
                const inner = slide.querySelector(".product-slide-inner") || slide;
                const h = inner.getBoundingClientRect().height;
                if (h > maxCardH) maxCardH = h;
            });

            const arcHeight = vr.width * CFG.radiusYFromWidthFactor;
            let target = Math.ceil(maxCardH + arcHeight + CFG.heightPadding);
            const maxAllowed = Math.floor(window.innerHeight * CFG.heightMaxVh);

            target = Math.max(CFG.heightMin, target);
            target = Math.min(maxAllowed, target);

            gsap.set(viewport, { height: target });
        };

        const hideSlideUI = (slide: HTMLElement) => {
            const infoBox = slide.querySelector(".product-bottom-info-box");
            if (infoBox) gsap.set(infoBox, { opacity: 0, scale: 0, overwrite: true });
        };

        const forceActiveUIVisible = (slide: HTMLElement) => {
            const infoBox = slide.querySelector(".product-bottom-info-box");
            if (infoBox) gsap.set(infoBox, { opacity: 1, scale: 1, overwrite: true });
        };

        const revealActiveUI = (slide: HTMLElement) => {
            const CFG = getCFG();
            const infoBox = slide.querySelector(".product-bottom-info-box");
            if (infoBox) {
                gsap.killTweensOf(infoBox);
                const tl = gsap.timeline();
                tl.set(infoBox, { opacity: 0, scale: 0 });
                tl.to(infoBox, { opacity: 1, scale: CFG.uiOvershoot, duration: CFG.uiInDuration1, ease: CFG.uiEaseIn });
                tl.to(infoBox, { scale: 1, duration: CFG.uiInDuration2, ease: CFG.uiEaseSettle });
            }
        };

        const layout = (animate: boolean) => {
            const CFG = getCFG();
            const vr = getRect(viewport);
            const len = slides.length;
            if (vr.width <= 0 || !len) return;

            const step = CFG.arcStepDeg;
            const radiusX = vr.width * CFG.radiusXFactor;
            const radiusY = vr.width * CFG.radiusYFromWidthFactor;

            // Show as many products as possible; overflow-x clips edges, wrapping detection hides looping
            const effectiveRange = Math.min(CFG.visibleRange, Math.floor((len - 1) / 2));

            const activeIndex = wrapIndex(activeAbs, len);
            const relByIndex = slides.map(() => null as number | null);

            // Robust prioritized indexing for small lists
            for (let k = -effectiveRange; k <= effectiveRange; k++) {
                const idx = wrapIndex(activeAbs + k, len);
                if (relByIndex[idx] === null || Math.abs(k) < Math.abs(relByIndex[idx]!)) {
                    relByIndex[idx] = k;
                }
            }

            slides.forEach((slide, i) => {
                const rel = relByIndex[i];
                const isVisible = rel !== null;
                const wasVisible = lastVisibleByIndex[i] === true;
                const lastRel = lastRelByIndex[i];

                if (!isVisible) {
                    gsap.set(slide, { opacity: 0, pointerEvents: "none" });
                    slide.style.zIndex = "0";
                    hideSlideUI(slide);
                    lastVisibleByIndex[i] = false;
                    lastRelByIndex[i] = null;
                    slide.setAttribute("data-active", "false");
                    return;
                }

                const absRel = Math.abs(rel!);
                const a = degToRad(rel! * step);
                const x = Math.sin(a) * radiusX;
                const y = (1 - Math.cos(a)) * radiusY;
                const rot = (rel! * step) * CFG.rotateFactor;

                const dist = Math.min(absRel, 4);
                const tt = dist / 4;
                const scale = (1 - tt) * (1 - CFG.scaleMin) + CFG.scaleMin;

                const animThis = animate && (absRel <= CFG.animateRange);
                const inner = slide.querySelector(".product-slide-inner") as HTMLElement || slide;

                // Detect wrap-around: slide changed sides (sign flip) or jumped far
                const isWrapping = wasVisible && lastRel !== null &&
                    ((lastRel > 0 && rel! < 0) || (lastRel < 0 && rel! > 0));

                if (!wasVisible || isWrapping) {
                    // Snap to new position invisibly, then fade in
                    gsap.killTweensOf(slide);
                    gsap.set(slide, { x, y, scale, opacity: 0 });
                    gsap.set(inner, { rotate: rot });
                    gsap.to(slide, { opacity: 1, duration: CFG.duration * 0.4, ease: "power2.out", delay: CFG.duration * 0.55 });
                } else if (animThis) {
                    gsap.to(slide, { x, y, scale, duration: CFG.duration, ease: CFG.ease, overwrite: true });
                    gsap.to(inner, { rotate: rot, duration: CFG.duration, ease: CFG.ease, overwrite: true });
                } else {
                    gsap.set(slide, { x, y, scale });
                    gsap.set(inner, { rotate: rot });
                    gsap.set(slide, { opacity: 1 });
                }

                slide.style.pointerEvents = "auto";
                slide.style.zIndex = String(100 - absRel);

                if (rel !== 0) hideSlideUI(slide);
                slide.setAttribute("data-active", rel === 0 ? "true" : "false");
                lastVisibleByIndex[i] = true;
                lastRelByIndex[i] = rel;
            });

            const activeSlide = slides[activeIndex];
            if (activeSlide) {
                if (!animate) {
                    forceActiveUIVisible(activeSlide);
                } else {
                    if (activeAbs !== lastActiveAbs) {
                        lastActiveAbs = activeAbs;
                        revealActiveUI(activeSlide);
                    } else {
                        forceActiveUIVisible(activeSlide);
                    }
                }
            }
        };

        const lockAnimating = () => {
            const CFG = getCFG();
            isAnimating = true;
            if (animUnlockTimer) clearTimeout(animUnlockTimer);
            animUnlockTimer = setTimeout(() => {
                isAnimating = false;
            }, Math.ceil(CFG.duration * 1000 * 0.85));
        };

        const goNext = () => {
            if (isAnimating) return;
            lockAnimating();
            activeAbs += 1;
            layout(true);
        };

        const goPrev = () => {
            if (isAnimating) return;
            lockAnimating();
            activeAbs -= 1;
            layout(true);
        };

        // Wire up refs for external nav buttons
        goNextRef.current = goNext;
        goPrevRef.current = goPrev;


        // --- Drag Logic ---
        let drag = {
            isDown: false,
            startX: 0,
            lastX: 0,
            accumX: 0
        };

        const onPointerDown = (e: PointerEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('a, button')) return;

            drag.isDown = true;
            drag.startX = e.clientX;
            drag.lastX = e.clientX;
            drag.accumX = 0;
            wheel.setPointerCapture(e.pointerId);
            wheel.style.cursor = "grabbing";
        };

        const onPointerMove = (e: PointerEvent) => {
            const CFG = getCFG();
            if (!drag.isDown) return;
            const dx = e.clientX - drag.lastX;
            drag.lastX = e.clientX;
            drag.accumX = (drag.accumX + dx) * CFG.dragDamp;

            if (drag.accumX <= -CFG.dragPixelsPerStep) {
                drag.accumX = 0;
                goNext();
            } else if (drag.accumX >= CFG.dragPixelsPerStep) {
                drag.accumX = 0;
                goPrev();
            }
        };

        const onPointerUp = (e: PointerEvent) => {
            drag.isDown = false;
            wheel.releasePointerCapture(e.pointerId);
            wheel.style.cursor = "grab";
        };

        wheel.addEventListener('pointerdown', onPointerDown as any);
        wheel.addEventListener('pointermove', onPointerMove as any);
        wheel.addEventListener('pointerup', onPointerUp as any);

        const refresh = () => {
            setStableViewportHeight();
            lastVisibleByIndex = Array(displayProducts.length).fill(false);
            layout(false);
        };

        window.addEventListener('resize', refresh);
        setTimeout(refresh, 100);

        return () => {
            window.removeEventListener('resize', refresh);
            wheel.removeEventListener('pointerdown', onPointerDown as any);
            wheel.removeEventListener('pointermove', onPointerMove as any);
            wheel.removeEventListener('pointerup', onPointerUp as any);
        };
    }, [isLoading, displayProducts]);

    if (isLoading) {
        return (
            <div className="py-12 md:py-24 bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }


    return (
        <>
            {/* Desktop View: 3D Wheel */}
            <section className="product-slider-section bg-[#f2f2ec] py-12 md:py-24 overflow-visible hidden lg:block">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex flex-col items-center justify-center text-center">
                    <div className="bg-[#008a45] text-white font-black text-[10px] sm:text-xs md:text-sm uppercase tracking-widest px-3 py-1 md:px-4 md:py-1.5 rounded-sm -rotate-3 mb-1 inline-block shadow-sm z-10" style={{ transformOrigin: 'center' }}>
                        Flavors you Love
                    </div>
                    <h2 className="text-5xl sm:text-6xl md:text-8xl lg:text-[100px] text-[#008a45] tracking-[0.05em] leading-tight sm:leading-none mb-1 relative z-0" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                        CUSTOMER'S FAVORITE
                    </h2>
                    <div className="w-24 md:w-32 h-2 md:h-2.5 bg-[#008a45] mb-4 rounded-full"></div>
                    <div className="relative z-10 w-full flex justify-center mt-2">
                        {onShopClick ? (
                            <button
                                onClick={onShopClick}
                                className="bg-[#008a45] text-white px-6 py-2 md:px-8 md:py-2.5 rounded-full font-bold text-xs md:text-sm uppercase tracking-wider hover:bg-[#007038] transition-colors shadow flex items-center gap-1 hover:scale-105 active:scale-95"
                            >
                                SHOP ALL <span className="text-lg leading-none font-bold mt-[1px]">&raquo;</span>
                            </button>
                        ) : (
                            <button
                                className="bg-[#008a45] text-white px-6 py-2 md:px-8 md:py-2.5 rounded-full font-bold text-xs md:text-sm uppercase tracking-wider hover:bg-[#007038] transition-colors shadow flex items-center gap-1 hover:scale-105 active:scale-95"
                            >
                                SHOP ALL <span className="text-lg leading-none font-bold mt-[1px]">&raquo;</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="product-slider relative w-full" ref={wrapperRef}>

                    {/* Navigation Arrows */}
                    <button
                        className="product-prev z-[200] absolute left-2 sm:left-4 bg-[#008a45] hover:bg-[#007038] text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-100"
                        style={{ top: '45%', transform: 'translateY(-50%)' }}
                        onClick={() => goPrevRef.current?.()}
                        aria-label="Previous product"
                    >
                        <span className="material-symbols-outlined text-lg sm:text-xl">chevron_left</span>
                    </button>
                    <button
                        className="product-next z-[200] absolute right-2 sm:right-4 bg-[#008a45] hover:bg-[#007038] text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
                        style={{ top: '45%', transform: 'translateY(-50%)' }}
                        onClick={() => goNextRef.current?.()}
                        aria-label="Next product"
                    >
                        <span className="material-symbols-outlined text-lg sm:text-xl">chevron_right</span>
                    </button>

                    <div className="product-wheel-viewport relative w-full min-h-[400px]">
                        <div className="product-wheel absolute top-0 left-0 w-full h-full cursor-grab select-none" ref={wheelRef}>
                            {displayProducts.map((product, i) => (
                                <div
                                    key={product.id}
                                    className="product-slide absolute top-[35%] md:top-[40%] left-1/2 z-[100] w-[250px] sm:w-[320px] md:w-[400px] lg:w-[450px]"
                                    ref={el => slidesRef.current[i] = el}
                                >
                                    <div className="product-slide-inner group">
                                        <div className="relative overflow-visible">
                                            <div
                                                className="aspect-[4/5] cursor-pointer relative"
                                                onClick={() => onProductClick(product)}
                                            >
                                                <img
                                                    loading="lazy"
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-700 group-hover:scale-105"
                                                    style={{ mixBlendMode: 'multiply' }}
                                                />
                                            </div>

                                            {/* Top Rated Tag */}
                                            {product.isTopRated && (
                                                <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                                                    <span className="bg-[#008a45] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-black text-[8px] sm:text-[10px] uppercase tracking-widest shadow-lg">
                                                        Top Rated
                                                    </span>
                                                </div>
                                            )}

                                            {/* Sold Out Overlay */}
                                            {product.stock <= 0 && (
                                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                                    <span className="bg-slate-900/90 backdrop-blur-sm text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-xs sm:text-sm font-black uppercase tracking-widest shadow-2xl border border-white/10">Sold Out</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="product-bottom-info-box mt-2 sm:mt-4 flex flex-col items-center text-center px-4 pointer-events-none">
                                            <h3
                                                className="font-black text-lg sm:text-xl text-slate-900 mb-1 cursor-pointer hover:text-[#008a45] transition-colors uppercase tracking-tight leading-tight pointer-events-auto"
                                                onClick={() => onProductClick(product)}
                                            >
                                                {product.name}
                                            </h3>

                                            <div className="flex items-baseline gap-2 mb-2 sm:mb-3 pointer-events-auto">
                                                <span className="font-black text-slate-900 text-2xl sm:text-3xl">₹{product.price}</span>
                                                {product.originalPrice && product.originalPrice > product.price && (
                                                    <span className="font-bold text-slate-400 text-base sm:text-lg line-through">₹{product.originalPrice}</span>
                                                )}
                                            </div>

                                            {/* Action Button */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                                                disabled={product.stock <= 0}
                                                className="pointer-events-auto bg-[#008a45] text-white px-5 py-2 sm:px-6 sm:py-2.5 rounded-lg font-bold text-[10px] sm:text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:bg-[#007038] hover:-translate-y-0.5 transition-all active:scale-95 disabled:bg-slate-300 disabled:shadow-none flex items-center justify-center gap-1.5"
                                            >
                                                <span className="material-symbols-outlined text-sm">add</span>
                                                {product.stock <= 0 ? 'Sold Out' : 'Order'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Mobile/Tablet View: Carousel */}
            <div className="lg:hidden">
                <SnaxxoProductCarousel
                    products={products}
                    onProductClick={onProductClick}
                    onAddToCart={onAddToCart}
                    isLoading={isLoading}
                />
            </div>
        </>
    );
};

export default SnaxxoProductWheel;
