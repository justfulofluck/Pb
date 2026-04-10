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
    const activeAbsRef = useRef(0);

    const displayProducts = React.useMemo(() => {
        if (!products || products.length === 0) return [];
        let items = products.map(p => ({ ...p, displayId: String(p.id) }));
        while (items.length > 0 && items.length < 7) {
            const nextBatch = products.map((p, idx) => ({
                ...p,
                displayId: `${String(p.id)}_dup_${items.length}_${idx}`
            }));
            items = [...items, ...nextBatch];
        }
        return items;
    }, [products]);

    const [isInView, setIsInView] = React.useState(false);

    // Track intersection
    useEffect(() => {
        if (!wrapperRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => setIsInView(entry.isIntersecting),
            { threshold: 0.1 }
        );
        observer.observe(wrapperRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const slider = wrapperRef.current;
        if (!slider) return;
        if (isLoading || !displayProducts.length) return;

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
                dragStartThresholdPx: 25
            };
        };

        const viewport = slider.querySelector(".product-wheel-viewport") as HTMLElement;
        const wheel = wheelRef.current;
        const slides = slidesRef.current.filter(s => s !== null) as HTMLElement[];
        if (!viewport || !wheel || !slides.length || window.innerWidth < 1024) return;

        // Styles initialization
        slider.style.position = "relative";
        slider.style.width = "100%";
        slider.style.maxWidth = "none";
        slider.style.overflow = "hidden";

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
            slide.style.transformOrigin = "50% 60%";
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

        let activeAbs = activeAbsRef.current;
        let lastActiveAbs = activeAbs;
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
            const effectiveRange = Math.min(CFG.visibleRange, Math.floor((len - 1) / 2));
            const activeIndex = wrapIndex(activeAbs, len);
            const relByIndex = slides.map(() => null as number | null);
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
                const isWrapping = wasVisible && lastRel !== null && ((lastRel > 0 && rel! < 0) || (lastRel < 0 && rel! > 0));
                if (!wasVisible || isWrapping) {
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
            activeAbsRef.current = activeAbs;
            layout(true);
        };

        const goPrev = () => {
            if (isAnimating) return;
            lockAnimating();
            activeAbs -= 1;
            activeAbsRef.current = activeAbs;
            layout(true);
        };

        goNextRef.current = goNext;
        goPrevRef.current = goPrev;

        let dragState = {
            isDown: false,
            startX: 0,
            startY: 0,
            lastX: 0,
            accumX: 0,
            originalTarget: null as HTMLElement | null
        };

        const onPointerDown = (e: PointerEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('button')) return;

            dragState.isDown = true;
            dragState.startX = e.clientX;
            dragState.startY = e.clientY;
            dragState.lastX = e.clientX;
            dragState.accumX = 0;
            dragState.originalTarget = target;
            wheel.setPointerCapture(e.pointerId);
            wheel.style.cursor = "grabbing";
        };

        const onPointerMove = (e: PointerEvent) => {
            const CFG = getCFG();
            if (!dragState.isDown) return;
            const dx = e.clientX - dragState.lastX;
            dragState.lastX = e.clientX;
            dragState.accumX = (dragState.accumX + dx) * CFG.dragDamp;
            if (dragState.accumX <= -CFG.dragPixelsPerStep) {
                dragState.accumX = 0;
                goNext();
            } else if (dragState.accumX >= CFG.dragPixelsPerStep) {
                dragState.accumX = 0;
                goPrev();
            }
        };

        const onPointerUp = (e: PointerEvent) => {
            if (!dragState.isDown) return;
            dragState.isDown = false;
            wheel.releasePointerCapture(e.pointerId);
            wheel.style.cursor = "grab";
            const CFG = getCFG();
            const dist = Math.sqrt(Math.pow(e.clientX - dragState.startX, 2) + Math.pow(e.clientY - dragState.startY, 2));
            if (dist < CFG.dragStartThresholdPx) {
                const slide = dragState.originalTarget?.closest('.product-slide');
                if (slide) {
                    const displayId = slide.getAttribute('data-display-id');
                    if (displayId) {
                        const baseId = String(displayId).split('_dup_')[0];
                        const product = products.find(p => String(p.id) === String(baseId));
                        if (product) {
                            onProductClick(product);
                        }
                    }
                }
            }
        };

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                goPrev();
            } else if (e.key === 'ArrowRight') {
                goNext();
            }
        };

        wheel.addEventListener('pointerdown', onPointerDown as any);
        wheel.addEventListener('pointermove', onPointerMove as any);
        wheel.addEventListener('pointerup', onPointerUp as any);
        window.addEventListener('keydown', onKeyDown);

        const refresh = () => {
            setStableViewportHeight();
            lastVisibleByIndex = Array(displayProducts.length).fill(false);
            layout(false);
        };
        window.addEventListener('resize', refresh);
        setTimeout(() => {
            if (isInView) refresh();
        }, 100);
        return () => {
            window.removeEventListener('resize', refresh);
            window.removeEventListener('keydown', onKeyDown);
            wheel.removeEventListener('pointerdown', onPointerDown as any);
            wheel.removeEventListener('pointermove', onPointerMove as any);
            wheel.removeEventListener('pointerup', onPointerUp as any);
        };
    }, [isLoading, displayProducts, products, onProductClick, isInView]);

    if (isLoading) {
        return (
            <div className="py-12 md:py-24 bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <section className="product-slider-section bg-whiteboard texture-overlay texture-speckles py-12 md:py-24 overflow-hidden">
            {/* Desktop Header */}
            <div className="hidden lg:flex flex-col items-center justify-center text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 relative z-10">
                <div className="bg-[#0b3d2e] texture-overlay texture-speckles text-white font-black text-[10px] sm:text-xs md:text-sm uppercase tracking-widest px-3 py-1 md:px-4 md:py-1.5 rounded-sm -rotate-3 mb-1 inline-block shadow-sm z-10" style={{ transformOrigin: 'center' }}>
                    Flavors you Love
                </div>
                <h2 className="text-5xl sm:text-6xl md:text-8xl lg:text-[100px] text-textured-green tracking-tight leading-[0.85] mb-1 relative z-0 font-anton font-normal !normal-case">
                    Customer's<br />favorite
                </h2>
                <div className="w-24 md:w-32 h-2 md:h-2.5 bg-[#0b3d2e] mb-4 rounded-full"></div>
                <div className="relative z-[300] w-full flex justify-center mt-2">
                    <button
                        onClick={() => {
                            if (onShopClick) onShopClick();
                            else window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="btn-greenboard text-white px-8 py-3 rounded-full font-bold text-xs md:text-sm uppercase tracking-widest transition-all shadow-md flex items-center gap-2 hover:scale-105 active:scale-95 cursor-pointer pointer-events-auto"
                    >
                        SHOP ALL
                    </button>
                </div>
            </div>

            {/* Desktop Wheel */}
            <div className="hidden lg:block">
                <div className="product-slider relative w-full" ref={wrapperRef}>
                    <div className="product-wheel-viewport relative w-full min-h-[400px] sm:min-h-[500px] lg:min-h-[700px] overflow-visible">
                        {/* Navigation Arrows (Anchored to Viewport) */}
                        <button
                            className="btn-greenboard z-[300] !absolute left-4 sm:left-8 text-white rounded-full w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 pointer-events-auto"
                            style={{ top: '45%', transform: 'translateY(-50%)' }}
                            onClick={() => goPrevRef.current?.()}
                            aria-label="Previous product"
                        >
                            <span className="material-symbols-outlined text-xl sm:text-2xl">chevron_left</span>
                        </button>
                        <button
                            className="btn-greenboard z-[300] !absolute right-4 sm:right-8 text-white rounded-full w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 pointer-events-auto"
                            style={{ top: '45%', transform: 'translateY(-50%)' }}
                            onClick={() => goNextRef.current?.()}
                            aria-label="Next product"
                        >
                            <span className="material-symbols-outlined text-xl sm:text-2xl">chevron_right</span>
                        </button>

                        <div className="product-wheel absolute top-0 left-0 w-full h-full cursor-grab select-none" ref={wheelRef}>
                            {displayProducts.map((product, i) => (
                                <div
                                    key={product.displayId}
                                    className="product-slide absolute top-[35%] md:top-[40%] left-1/2 z-[100] w-[250px] sm:w-[320px] md:w-[400px] lg:w-[450px]"
                                    ref={el => slidesRef.current[i] = el}
                                    data-display-id={product.displayId}
                                >
                                    <div className="product-slide-inner group">
                                        <div className="relative overflow-visible">
                                            <div className="aspect-[4/5] cursor-pointer relative">
                                                <img
                                                    loading="lazy"
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-700 group-hover:scale-105"
                                                    style={{ mixBlendMode: 'multiply' }}
                                                />
                                            </div>
                                            {product.isTopRated && (
                                                <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                                                    <span className="bg-[#008a45] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-black text-[8px] sm:text-[10px] uppercase tracking-widest shadow-lg">
                                                        Top Rated
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="product-bottom-info-box mt-2 sm:mt-4 flex flex-col items-center text-center px-4 pointer-events-none">
                                            <h3 className="text-textured-green-big !text-[1.8rem] sm:!text-[2.2rem] md:!text-[2.8rem] mb-4 sm:mb-6 cursor-default uppercase tracking-normal leading-[1] pointer-events-auto !inline-block">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-baseline gap-2 mb-4 sm:mb-6 pointer-events-auto">
                                                <span className="font-black text-[#0b3d2e] text-2xl sm:text-3xl lg:text-4xl text-shadow-sm">₹{product.price}</span>
                                                {product.originalPrice && product.originalPrice > product.price && (
                                                    <span className="font-bold text-slate-400 text-sm sm:text-base lg:text-lg line-through">₹{product.originalPrice}</span>
                                                )}
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                                                disabled={product.stock <= 0}
                                                className="btn-greenboard pointer-events-auto text-white px-8 py-3.5 sm:px-11 sm:py-4.5 mb-8 sm:mb-12 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:bg-slate-300 disabled:shadow-none flex items-center justify-center gap-1.5"
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
            </div>

            {/* Mobile View */}
            <div className="lg:hidden">
                <SnaxxoProductCarousel products={products} onProductClick={onProductClick} onAddToCart={onAddToCart} isLoading={isLoading} onShopClick={onShopClick} />
            </div>
        </section>
    );
};

export default React.memo(SnaxxoProductWheel);
