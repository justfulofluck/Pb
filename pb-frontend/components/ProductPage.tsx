import React, { useEffect, useState, useRef } from 'react';
import { Product, Review, Story } from '../types';
import { API_BASE_URL } from '../config';
import { getMediaUrl, getDynamic3DModel } from '../utils/mediaHelper';
import MultiLayerWave from './snaxxo/MultiLayerWave';


import SnaxxoAddReview from './snaxxo/SnaxxoAddReview';
import Testimonials from './Testimonials';
import StoryCarousel from './StoryCarousel';
import { useSnaxxoAnimations } from '../hooks/useSnaxxoAnimations';
import { gsap } from 'gsap';
import SnaxxoProductComparison from './snaxxo/ProductComparison';
import IngredientShowcase from './snaxxo/IngredientShowcase';
import UsageIdeas from './UsageIdeas';
import NutritionDetailedSection from './snaxxo/NutritionDetailedSection';
import YouMightAlsoLike from './snaxxo/YouMightAlsoLike';
import { formatPrice } from '../utils/formatters';
import { analytics } from '../utils/analytics';
import { Silk } from './snaxxo/Silk';
import ProductGalleryStrip from './snaxxo/ProductGalleryStrip';
import ProductAccordionSection from './snaxxo/ProductAccordionSection';

interface ProductPageProps {
  product: Product;
  products: Product[];
  onAddToCart: (p: Product) => void;
  onBack: () => void;
  onProductClick: (p: Product) => void;
  onShopClick: () => void;
  reviews: Review[];
  onAddReview: (review: Review) => void;
  isLoggedIn?: boolean;
  onLoginClick?: () => void;
  onPopupToggle?: (isOpen: boolean) => void;
  stories: Story[];
  onHomeClick: () => void;
}

const dataUrlToObjectUrl = (dataUrl: string): string | null => {
  try {
    const commaIdx = dataUrl.indexOf(',');
    if (commaIdx === -1) return null;
    let base64 = dataUrl.slice(commaIdx + 1);
    while (base64.length % 4) base64 += '=';
    const binary = atob(base64);
    if (binary.length < 12) return null;
    // Validate GLB header: check magic bytes (glTF) and declared length
    if (binary.charCodeAt(0) !== 0x67 || binary.charCodeAt(1) !== 0x6C ||
      binary.charCodeAt(2) !== 0x54 || binary.charCodeAt(3) !== 0x46) return null;
    const declaredLen =
      (binary.charCodeAt(8)) | (binary.charCodeAt(9) << 8) |
      (binary.charCodeAt(10) << 16) | (binary.charCodeAt(11) << 24);
    if (declaredLen > binary.length) return null;
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: 'model/gltf-binary' });
    return URL.createObjectURL(blob);
  } catch { return null; }
};

const StableModelViewer = React.memo(({ product }: { product: Product }) => {
  const objectUrlRef = React.useRef<string | null>(null);
  const viewerRef = React.useRef<HTMLElement | null>(null);
  const [modelSrc, setModelSrc] = React.useState<string | null>(null);
  const [loadError, setLoadError] = React.useState(false);

  React.useEffect(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setLoadError(false);
    let src: string | null = null;
    if (product.model3d) {
      const url = getMediaUrl(product.model3d);
      if (url && url.startsWith('data:')) {
        const blobUrl = dataUrlToObjectUrl(url);
        objectUrlRef.current = blobUrl;
        src = blobUrl;
      } else if (url) {
        src = url;
      }
    }
    if (!src) {
      src = getDynamic3DModel(product.name);
    }
    setModelSrc(src);
  }, [product.id, product.model3d, product.name]);

  React.useEffect(() => {
    const el = viewerRef.current;
    if (!el || !modelSrc) return;
    const onError = () => setLoadError(true);
    el.addEventListener('error', onError);
    return () => el.removeEventListener('error', onError);
  }, [modelSrc]);

  React.useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  if (!modelSrc || loadError) {
    return <img src={getMediaUrl(product.image)} alt={product.name} className="content-image _100-full" />;
  }

  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <style>{`
        @keyframes floatJar {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        @keyframes floatShadow {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(0.8); opacity: 0.15; }
          100% { transform: scale(1); opacity: 0.5; }
        }
        .pdp-model-viewer {
          height: 480px;
        }
        @media (min-width: 768px) {
          .pdp-model-viewer {
            height: clamp(450px, 72vh, 900px);
          }
        }
      `}</style>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <model-viewer
          ref={viewerRef}
          key={`${product.id}-${modelSrc}`}
          src={modelSrc}
          alt={product.name}
          camera-controls
          disable-zoom
          disable-pan
          disable-tap
          bounds="tight"
          min-camera-orbit="auto auto auto"
          max-camera-orbit="auto auto auto"
          min-field-of-view="auto"
          max-field-of-view="auto"
          touch-action="pan-y"
          interaction-prompt="none"
          auto-rotate
          reveal="auto"
          rotation-speed="20deg"
          orientation={product.orientation || '0deg 0deg -15deg'}
          style={{
            width: '100%',
            maxWidth: '880px',
            outline: 'none',
            margin: '0 auto',
            pointerEvents: 'auto',
            animation: 'floatJar 6s ease-in-out infinite',
            zIndex: 2,
            position: 'relative'
          }}
          className="pdp-model-viewer"
        />
      </div>
      <div style={{ width: '280px', height: '30px', background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 70%)', position: 'absolute', bottom: '0px', animation: 'floatShadow 6s ease-in-out infinite', zIndex: 1, pointerEvents: 'none' }} />
      <style>{`
        @media (max-width: 767px) {
          .chip-single-pdp {
            position: relative;
            padding-top: 100px;
            padding-bottom: 80px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .chip-call-out._01 {
            position: absolute !important;
            top: 20px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            right: auto !important;
            z-index: 10;
          }
          .chip-call-out._02 {
            position: absolute !important;
            bottom: 0px !important;
            left: 10% !important;
            transform: none !important;
            right: auto !important;
            top: auto !important;
            z-index: 10;
          }
          .chip-call-out._03 {
            position: absolute !important;
            bottom: 0px !important;
            right: 10% !important;
            left: auto !important;
            top: auto !important;
            transform: none !important;
            z-index: 10;
          }
          .chip-call-out .call-out-title {
            font-size: 1.2rem !important;
            white-space: nowrap;
          }
          .pdp-arrow-01, .pdp-arrow-02, .pdp-arrow-03 {
            max-width: 60px !important;
            margin-bottom: 5px;
          }
          /* Adjust arrows to point to the jar */
          .pdp-arrow-01 { transform: rotate(180deg); }
          .pdp-arrow-02 { transform: scaleX(-1) rotate(-45deg); }
          .pdp-arrow-03 { transform: rotate(-45deg); }
        }
      `}</style>
    </div>
  );
}, (prev, next) => prev.product.id === next.product.id && prev.product.name === next.product.name);

const PRODUCT_HERO_MAP: Record<string, { desktop: string, mobile: string } | null> = {
  'Dark Chocolate & Almond Crunchy Peanut Butter': {
    desktop: '/productpageimg/dark-chocolate-almond-crunchy-peanut-butter-dex.png',
    mobile: '/productpageimg/dark-chocolate-almond-crunchy-peanut-butter-mobile.png'
  },
  'Mango With Chia Seeds Peanut Butter': {
    desktop: '/productpageimg/mango-with-chia-seeds-peanut-butter-desktop.png',
    mobile: '/productpageimg/mango-with-chia-seeds-peanut-butter-mobile.png'
  },
  'American Nuts Crunchy High Protein Peanut Butter': {
    desktop: '/productpageimg/american-nuts-crunchy-peanut-butter-mobile.png',
    mobile: '/productpageimg/american-nuts-crunchy-peanut-butter-mobile.png'
  },
  'American Nuts Crunchy Peanut Butter': {
    desktop: '/productpageimg/american-nuts-crunchy-peanut-butter-mobile.png',
    mobile: '/productpageimg/american-nuts-crunchy-peanut-butter-mobile.png'
  },
  'Pineapple Crunchy Peanut Butter': {
    desktop: '/productpageimg/pineapple-crunchy-peanut-butter-dektop.png',
    mobile: '/productpageimg/pineapple-crunchy-peanut-butter-mobile.png'
  },
  'Strawberry with Chia Peanut Butter': {
    desktop: '/productpageimg/strawberry-with-chia-peanut-butter-desktop.png',
    mobile: '/productpageimg/strawberry-with-chia-peanut-butter-mobile.png'
  },
  'Natural Crunchy Peanut Butter': {
    desktop: '/productpageimg/natural-crunchy-peanut-butter-desktop.png',
    mobile: '/productpageimg/natural-crunchy-peanut-butter-mobile.png'
  }
  // Add other products here over time
};

const ProductPage: React.FC<ProductPageProps> = ({
  product,
  products,
  onAddToCart,
  onBack,
  onProductClick,
  onShopClick,
  reviews,
  onAddReview,
  isLoggedIn,
  onLoginClick,
  onPopupToggle,
  stories,
  onHomeClick
}) => {
  useSnaxxoAnimations();

  const [quantity, setQuantity] = useState(1);
  const [packSize, setPackSize] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [proteinCount, setProteinCount] = useState(0);
  const statsSectionRef = useRef<HTMLDivElement>(null);

  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const jarWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset defaults on product change
    setQuantity(1);
    setPackSize("");

    // Add initial entry animations
    const tl = gsap.timeline();
    if (titleRef.current) {
      gsap.set(titleRef.current, { y: 50, opacity: 0 });
      tl.to(titleRef.current, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0.2);
    }
    if (imageRef.current) {
      gsap.set(imageRef.current, { scale: 0.8, opacity: 0 });
      tl.to(imageRef.current, { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.5)' }, 0.3);
    }

    if (product) {
      analytics.trackProductView(product);
    }

    return () => {
      tl.kill();
    };
  }, [product?.id]); // Only re-animate and reset if the actual product ID changes

  // Count-up animation for the protein stat
  useEffect(() => {
    const el = statsSectionRef.current;
    if (!el) return;
    let animFrame: number;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const target = 30;
          const duration = 1200;
          const startTime = performance.now();
          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setProteinCount(Math.round(eased * target));
            if (progress < 1) animFrame = requestAnimationFrame(tick);
          };
          animFrame = requestAnimationFrame(tick);
        } else {
          setProteinCount(0);
          cancelAnimationFrame(animFrame);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => { observer.disconnect(); cancelAnimationFrame(animFrame); };
  }, [product?.id]);



  const getProductColor = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('dark chocolate') || lowerName.includes('chocolate')) return '#4a2e15'; // Rich Dark Chocolate Brown
    if (lowerName.includes('natural')) return '#188a67'; // Forest Green (Matches Footer)
    if (lowerName.includes('mango')) return '#eab308'; // Golden Mango
    if (lowerName.includes('american')) return '#002866'; // Vibrant American Blue
    if (lowerName.includes('pineapple')) return '#d97706'; // Pineapple Gold
    if (lowerName.includes('chia') || lowerName.includes('strawberry')) return '#a62427'; // Dark Strawberry Red
    if (lowerName.includes('onion')) return 'hsla(259.4594594594595, 100.00%, 61.83%, 1.00)';
    if (lowerName.includes('ocean') || lowerName.includes('salty')) return 'hsla(211.11111111111114, 100.00%, 50.00%, 1.00)';
    if (lowerName.includes('chili')) return 'hsla(0, 100.00%, 50.00%, 1.00)';
    if (lowerName.includes('pickle')) return 'hsla(145.89928057553956, 93.94%, 38.05%, 1.00)';
    if (lowerName.includes('chive')) return 'hsla(188.51851851851848, 99.11%, 42.59%, 1.00)';
    if (lowerName.includes('cheddar') || lowerName.includes('cheese')) return 'hsla(33.58974358974359, 98.23%, 47.15%, 1.00)';
    if (lowerName.includes('peanut') || lowerName.includes('butter')) return '#d97316'; // Warm Amber Peanut Butter
    return '#d97316';
  };

  if (!product) return null;

  const isTooDarkOrBlackColor = (colorStr?: string) => {
    if (!colorStr || colorStr.trim() === '') return true;
    try {
      const c = new THREE.Color(colorStr as string);
      const luminance = 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
      return luminance < 0.08;
    } catch {
      return true;
    }
  };

  const isNaturalProduct = (product?.name || '').toLowerCase().includes('natural') || (product?.slug || '').toLowerCase().includes('natural');
  const isChocolateProduct = (product?.name || '').toLowerCase().includes('chocolate') || (product?.slug || '').toLowerCase().includes('chocolate');

  const bgColor = isNaturalProduct
    ? '#188a67'
    : isChocolateProduct
      ? '#7d4427'
      : (product?.themeColor && !isTooDarkOrBlackColor(product.themeColor))
        ? product.themeColor
        : getProductColor(product?.name || '');

  // Create a very subtle version of the theme color for sections that are usually white
  const tintColor = bgColor?.startsWith('#')
    ? `${bgColor}0D` // ~5% opacity for hex
    : (bgColor ? bgColor.replace(/1\.00\)$/, '0.05)') : 'rgba(255, 255, 255, 0.05)'); // ~5% opacity for hsla


  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate adding multiple items if needed. For now just passing product to cart.
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
    analytics.trackAddToCart(product, quantity);
  };

  return (
    <div className="page-wrapper" style={{ opacity: 1, backgroundColor: tintColor }}>

      <section ref={heroRef} style={{ backgroundColor: bgColor }} className="section overflow-hidden min-h-[85vh] md:min-h-[95vh] flex flex-col items-center pt-4 md:pt-0 pb-20 md:pb-10 texture-blend relative">
        {/* Dynamic Silk WebGL Background Shader is disabled to use solid colors */}

        <div className="w-layout-blockcontainer container product-page-hero w-container !pt-2 md:!pt-6 !mt-0 relative z-10">
          <div className="content-wrapper product-page-hero">
            <div className="heading-text-box pdp-h1 mt-0 pt-0 px-6 md:px-12 lg:px-16 mb-[-50px] lg:mb-[-4rem] w-full flex justify-center text-center mx-auto">
              <h1 ref={titleRef} style={{ color: '#fff', textShadow: '0 4px 20px rgba(0,0,0,0.2)', lineHeight: '1.1', fontSize: 'clamp(2.2rem, 10vw, 120px)' }} className="!font-anton font-bold uppercase tracking-wide [word-spacing:0.15em] md:[word-spacing:0.05em] text-center mx-auto">
                {product.name}
              </h1>
            </div>
            <div className="product-page-hero-bottom-content flex flex-col lg:flex-row items-center lg:items-end justify-between relative px-2 md:px-0 mt-[-1rem] md:mt-0 pb-16 lg:pb-32 z-20">
              <div className="content-block pdp-01 hidden lg:block lg:w-[22%] order-2 lg:order-1" />
              {/* position of 3D object */}
              <div className="content-block pdp-02 w-full lg:flex-1 order-1 lg:order-2 relative flex justify-center items-center pt-0 pb-0 sm:pb-2 lg:py-0">
                <div ref={imageRef} className="image-wrapper main-product-image w-full" style={{ pointerEvents: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }}>
                  <StableModelViewer product={product} />
                </div>
              </div>
              <div className="content-block pdp-03 w-full lg:w-[25%] order-3 lg:order-3 mt-[-2rem] sm:mt-[-2rem] lg:mt-[-40px] flex flex-col items-center lg:items-end justify-center lg:justify-end mx-auto lg:mx-0" data-snaxxo-animate>
                <div className="pdp-hero-right-block-content mb-0 flex flex-col items-center lg:items-end w-full mx-auto lg:mx-0">
                  <div className="flex items-baseline justify-center lg:justify-end gap-3 overflow-visible whitespace-nowrap">
                    <span style={{ color: '#FFF', textShadow: '0 4px 20px rgba(0,0,0,0.2)' }} className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-wide [word-spacing:-0.15em] !font-anton whitespace-nowrap">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <p style={{ color: 'rgba(255, 255, 255, 0.6)' }} className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] mt-0 text-center lg:text-right force-satoshi">MRP (Inclusive of all taxes)</p>
                </div>
                <div className="add-to-cart-block-wrapper _02 w-full max-w-sm mx-auto lg:mx-0">
                  <form onSubmit={handleAddToCart} className="w-commerce-commerceaddtocartform default-state w-full">
                    <div className="product-page-info-cta-contain flex flex-col sm:flex-row gap-3 items-center justify-center lg:justify-end h-auto md:h-[48px]">
                      <div style={{ borderColor: 'rgba(255,255,255,0.3)' }} className="quantity-wrapper flex items-center border rounded-lg h-[40px] md:h-[48px] w-[160px] sm:w-[200px] overflow-hidden !m-0">
                        <button
                          type="button"
                          onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                          className="flex-1 h-full flex items-center justify-center text-white hover:bg-white/10 transition-colors border-r border-white/20 text-xl pb-1"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          style={{ color: '#FFF' }}
                          className="w-10 h-full text-center bg-transparent border-none focus:outline-none font-bold text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none !m-0"
                          value={quantity}
                          onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                        />
                        <button
                          type="button"
                          onClick={() => setQuantity(prev => prev + 1)}
                          className="flex-1 h-full flex items-center justify-center text-white hover:bg-white/10 transition-colors border-l border-white/20 text-xl pb-1"
                        >
                          +
                        </button>
                      </div>
                      <input
                        className="w-commerce-commerceaddtocartbutton add-to-cart-button-main product-page cursor-pointer transition-transform hover:scale-105 w-[160px] sm:w-[200px] force-anton !m-0"
                        style={{ backgroundColor: '#FFF', color: bgColor || '#008a45', height: '100%', minHeight: '40px', borderRadius: '8px', fontSize: '1.2rem', fontWeight: '400', textTransform: 'uppercase' }}
                        type="submit"
                        value="Add to cart"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>




        </div>
        <div className="absolute bottom-[-1px] left-0 w-full h-[100px] z-[5] pointer-events-none">
          <MultiLayerWave fill="#f2f2ec" className="h-full" />
        </div>
      </section >

      {/* Product Gallery Strip */}
      <ProductGalleryStrip product={product} />



      <section className="section overflow-hidden flex flex-col items-center w-full relative pt-12 md:pt-20" style={{ backgroundColor: '#f2f2ec' }}>
        {/* Subtle radial glow behind center */}
        <div className="hidden md:block absolute pointer-events-none" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '700px', height: '700px', borderRadius: '50%', background: `radial-gradient(circle, ${bgColor}08 0%, transparent 70%)` }} />
        <div className="w-layout-blockcontainer container product-page-intro w-container mx-auto">
          <div className="content-wrapper product-page-intro w-full">

          </div>
          <div className="content-wrapper intro-pdf w-full overflow-hidden">

            {/* Custom Glass Styles */}
            <style>{`
              .glass-card-framer {
                background: rgba(255, 255, 255, 0.82);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.95);
                box-shadow: 0 12px 32px -6px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.02);
              }
              .glass-card-framer:hover {
                box-shadow: 0 22px 45px -8px rgba(0, 0, 0, 0.1), 0 0 24px ${bgColor}30;
                border-color: ${bgColor}50;
              }
            `}</style>



            {/* MOBILE LAYOUT - OVERLAPPING SPOTLIGHT MATCHING PC */}
            <div className="flex flex-col md:hidden items-center relative z-10 px-2 py-4">
              
              {/* TOP 2 CARDS (Overlapping Top of Plate) */}
              <div className="w-full grid grid-cols-2 gap-2.5 sm:gap-4 relative z-20 -mb-6 sm:-mb-10">
                {/* Top-Left Card */}
                <div className="glass-card-framer rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 relative overflow-hidden shadow-lg border border-white/90 flex flex-col justify-between">
                  <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: bgColor }} />
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded" style={{ backgroundColor: `${bgColor}15`, color: bgColor }}>
                      HIGH PROTEIN
                    </span>
                    <span className="text-base sm:text-xl">💪</span>
                  </div>
                  <h3 className="font-satoshi font-black text-base sm:text-2xl leading-none mb-1" style={{ color: bgColor }}>
                    <span className="tabular-nums">{proteinCount || 30}g</span> <span className="text-[9px] sm:text-xs font-extrabold text-gray-700 uppercase">/ 100g</span>
                  </h3>
                  <p className="font-satoshi font-medium text-[10px] sm:text-xs text-gray-600 leading-snug">
                    Supports muscle recovery & strength.
                  </p>
                </div>

                {/* Top-Right Card */}
                <div className="glass-card-framer rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 relative overflow-hidden shadow-lg border border-white/90 text-right flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-1.5 h-full" style={{ backgroundColor: bgColor }} />
                  <div className="flex items-center justify-between mb-1.5 flex-row-reverse">
                    <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded" style={{ backgroundColor: `${bgColor}15`, color: bgColor }}>
                      100% CLEAN
                    </span>
                    <span className="text-base sm:text-xl">🌿</span>
                  </div>
                  <h3 className="font-satoshi font-black text-xs sm:text-base leading-tight mb-1 uppercase" style={{ color: bgColor }}>
                    No Added Sugar,<br />Salt, or Palm Oil
                  </h3>
                  <p className="font-satoshi font-medium text-[10px] sm:text-xs text-gray-600 leading-snug">
                    Purely roasted for clean nutrition.
                  </p>
                </div>
              </div>

              {/* CENTER PLATE / PRODUCT DISPLAY */}
              <div className="w-full flex justify-center relative my-0 z-10">
                <div className="absolute inset-0 rounded-full blur-3xl opacity-30" style={{ background: `radial-gradient(circle, ${bgColor} 0%, transparent 70%)` }} />
                {PRODUCT_HERO_MAP[product.name] ? (
                  <img
                    src={getMediaUrl(PRODUCT_HERO_MAP[product.name]!.mobile)}
                    alt={product.name}
                    className="w-full h-auto object-contain drop-shadow-2xl relative z-10 scale-[1.12] sm:scale-[1.25]"
                    style={{ maxWidth: '98%', maxHeight: '420px' }}
                  />
                ) : (
                  <img
                    src={getMediaUrl(product.image)}
                    alt={product.name}
                    className="w-full h-auto object-contain drop-shadow-2xl relative z-10 scale-[1.12] sm:scale-[1.25]"
                    style={{ maxWidth: '340px' }}
                  />
                )}
              </div>

              {/* BOTTOM 2 CARDS (Overlapping Bottom of Plate) */}
              <div className="w-full grid grid-cols-2 gap-2.5 sm:gap-4 relative z-20 -mt-6 sm:-mt-10">
                {/* Bottom-Left Card */}
                <div className="glass-card-framer rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 relative overflow-hidden shadow-lg border border-white/90 flex flex-col justify-between">
                  <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: bgColor }} />
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded" style={{ backgroundColor: `${bgColor}15`, color: bgColor }}>
                      HEART HEALTH
                    </span>
                    <span className="text-base sm:text-xl">❤️</span>
                  </div>
                  <h3 className="font-satoshi font-black text-xs sm:text-base leading-tight mb-1 uppercase" style={{ color: bgColor }}>
                    Rich in<br />Healthy Fats
                  </h3>
                  <p className="font-satoshi font-medium text-[10px] sm:text-xs text-gray-600 leading-snug">
                    Essential omegas for heart wellness.
                  </p>
                </div>

                {/* Bottom-Right Card */}
                <div className="glass-card-framer rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 relative overflow-hidden shadow-lg border border-white/90 text-right flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-1.5 h-full" style={{ backgroundColor: bgColor }} />
                  <div className="flex items-center justify-between mb-1.5 flex-row-reverse">
                    <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded" style={{ backgroundColor: `${bgColor}15`, color: bgColor }}>
                      FARM FRESH
                    </span>
                    <span className="text-base sm:text-xl">🥜</span>
                  </div>
                  <h3 className="font-satoshi font-black text-xs sm:text-base leading-tight mb-1 uppercase" style={{ color: bgColor }}>
                    The World's<br />Best Peanuts
                  </h3>
                  <p className="font-satoshi font-medium text-[10px] sm:text-xs text-gray-600 leading-snug">
                    Slow-roasted for rich, nutty crunch.
                  </p>
                </div>
              </div>

            </div>

            {/* DESKTOP SPOTLIGHT LAYOUT (Center Product + 4 Surrounding Glass Cards & SVG Pointers) */}
            <div ref={statsSectionRef} className="hidden md:block relative w-full max-w-[1180px] mx-auto pt-24 pb-8" style={{ minHeight: '740px' }}>

              {/* CENTRAL PRODUCT CONTAINER */}
              <div className="absolute inset-0 flex justify-center items-center pointer-events-none" style={{ zIndex: 10 }}>
                <div className="relative pointer-events-auto flex items-center justify-center" style={{ width: '620px', height: '700px' }}>

                  {/* Multi-layered Static Aura Rings */}
                  <div
                    className="absolute rounded-full opacity-25"
                    style={{ width: '640px', height: '640px', background: `radial-gradient(circle, ${bgColor} 0%, transparent 70%)` }}
                  />
                  <div
                    className="absolute rounded-full border border-dashed border-white/80 opacity-50"
                    style={{ width: '520px', height: '520px' }}
                  />

                  {/* Product Pack */}
                  {PRODUCT_HERO_MAP[product.name] ? (
                    <img
                      src={getMediaUrl(PRODUCT_HERO_MAP[product.name]!.desktop)}
                      alt={product.name}
                      className="object-contain scale-[1.45] hover:scale-[1.52] transition-transform duration-700 cursor-pointer drop-shadow-[0_35px_50px_rgba(0,0,0,0.25)]"
                      style={{ maxWidth: '580px', maxHeight: '680px', width: 'auto', height: 'auto' }}
                    />
                  ) : (
                    <img
                      src={getMediaUrl(product.image)}
                      alt={product.name}
                      className="object-contain scale-[1.45] hover:scale-[1.52] transition-transform duration-700 cursor-pointer drop-shadow-[0_35px_50px_rgba(0,0,0,0.25)]"
                      style={{ maxWidth: '560px', maxHeight: '640px', width: 'auto', height: 'auto' }}
                    />
                  )}
                </div>
              </div>

              {/* SVG POINTER CONNECTOR LINES (Static) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 5 }}>
                <defs>
                  <linearGradient id="lineGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={bgColor} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={bgColor} stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient id="lineGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={bgColor} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={bgColor} stopOpacity="0.3" />
                  </linearGradient>
                </defs>

                {/* TOP-LEFT CONNECTOR */}
                <g>
                  <path d="M 280 130 C 350 130, 390 170, 420 210" stroke="url(#lineGradLeft)" strokeWidth="2.5" fill="none" strokeDasharray="6 4" />
                  <circle cx="420" cy="210" r="5" fill={bgColor} />
                </g>

                {/* BOTTOM-LEFT CONNECTOR */}
                <g>
                  <path d="M 280 530 C 350 530, 390 490, 420 470" stroke="url(#lineGradLeft)" strokeWidth="2.5" fill="none" strokeDasharray="6 4" />
                  <circle cx="420" cy="470" r="5" fill={bgColor} />
                </g>

                {/* TOP-RIGHT CONNECTOR */}
                <g>
                  <path d="M 900 130 C 830 130, 790 170, 760 210" stroke="url(#lineGradRight)" strokeWidth="2.5" fill="none" strokeDasharray="6 4" />
                  <circle cx="760" cy="210" r="5" fill={bgColor} />
                </g>

                {/* BOTTOM-RIGHT CONNECTOR */}
                <g>
                  <path d="M 900 530 C 830 530, 790 490, 760 470" stroke="url(#lineGradRight)" strokeWidth="2.5" fill="none" strokeDasharray="6 4" />
                  <circle cx="760" cy="470" r="5" fill={bgColor} />
                </g>
              </svg>

              {/* TOP-LEFT CARD: 30G PROTEIN */}
              <div className="absolute transition-all duration-300 hover:-translate-y-1" style={{ top: '6%', left: '2%', width: '310px', zIndex: 20 }}>
                <div className="glass-card-framer rounded-3xl p-6 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: bgColor }} />
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-md" style={{ backgroundColor: `${bgColor}15`, color: bgColor }}>
                      HIGH PROTEIN
                    </span>
                    <span className="text-2xl">💪</span>
                  </div>
                  <h3 className="font-satoshi font-black text-3xl lg:text-4xl leading-none mb-1" style={{ color: bgColor }}>
                    <span className="tabular-nums">{proteinCount}g</span> <span className="text-sm font-extrabold text-gray-700 uppercase">/ 100g</span>
                  </h3>
                  <p className="font-satoshi font-semibold text-xs lg:text-sm text-gray-600 leading-relaxed mt-2">
                    Supports muscle recovery, strength, and keeps you energized all day.
                  </p>
                </div>
              </div>

              {/* TOP-RIGHT CARD: NO ADDED SUGAR */}
              <div className="absolute transition-all duration-300 hover:-translate-y-1" style={{ top: '6%', right: '2%', width: '310px', zIndex: 20 }}>
                <div className="glass-card-framer rounded-3xl p-6 relative overflow-hidden group text-right">
                  <div className="absolute top-0 right-0 w-2 h-full" style={{ backgroundColor: bgColor }} />
                  <div className="flex items-center justify-between mb-3 flex-row-reverse">
                    <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-md" style={{ backgroundColor: `${bgColor}15`, color: bgColor }}>
                      100% CLEAN
                    </span>
                    <span className="text-2xl">🌿</span>
                  </div>
                  <h3 className="font-satoshi font-black text-xl lg:text-2xl leading-tight mb-1 uppercase" style={{ color: bgColor }}>
                    No Added Sugar,<br />Salt, or Palm Oil
                  </h3>
                  <p className="font-satoshi font-semibold text-xs lg:text-sm text-gray-600 leading-relaxed mt-2">
                    Purely roasted premium peanuts for clean, wholesome nutrition.
                  </p>
                </div>
              </div>

              {/* BOTTOM-LEFT CARD: RICH IN HEALTHY FATS */}
              <div className="absolute transition-all duration-300 hover:-translate-y-1" style={{ bottom: '6%', left: '2%', width: '310px', zIndex: 20 }}>
                <div className="glass-card-framer rounded-3xl p-6 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: bgColor }} />
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-md" style={{ backgroundColor: `${bgColor}15`, color: bgColor }}>
                      HEART HEALTH
                    </span>
                    <span className="text-2xl">❤️</span>
                  </div>
                  <h3 className="font-satoshi font-black text-xl lg:text-2xl leading-tight mb-1 uppercase" style={{ color: bgColor }}>
                    Rich in<br />Healthy Fats
                  </h3>
                  <p className="font-satoshi font-semibold text-xs lg:text-sm text-gray-600 leading-relaxed mt-2">
                    Packed with essential fatty acids promoting heart wellness & vitality.
                  </p>
                </div>
              </div>

              {/* BOTTOM-RIGHT CARD: THE WORLD'S BEST PEANUTS */}
              <div className="absolute transition-all duration-300 hover:-translate-y-1" style={{ bottom: '6%', right: '2%', width: '310px', zIndex: 20 }}>
                <div className="glass-card-framer rounded-3xl p-6 relative overflow-hidden group text-right">
                  <div className="absolute top-0 right-0 w-2 h-full" style={{ backgroundColor: bgColor }} />
                  <div className="flex items-center justify-between mb-3 flex-row-reverse">
                    <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-md" style={{ backgroundColor: `${bgColor}15`, color: bgColor }}>
                      FARM FRESH
                    </span>
                    <span className="text-2xl">🥜</span>
                  </div>
                  <h3 className="font-satoshi font-black text-xl lg:text-2xl leading-tight mb-1 uppercase" style={{ color: bgColor }}>
                    The World's<br />Best Peanuts
                  </h3>
                  <p className="font-satoshi font-semibold text-xs lg:text-sm text-gray-600 leading-relaxed mt-2">
                    Slow-roasted farm-fresh peanuts delivering rich, nutty crunch.
                  </p>
                </div>
              </div>

            </div>

            <div className="w-full max-w-5xl mx-auto mt-6 md:mt-16 mb-8 px-2 sm:px-4" data-snaxxo-animate>
              {(() => {
                const filtered = (product.benefits || []).filter(b => b && b.trim() !== "");
                const displayBenefits = filtered.length > 0 ? filtered : ["100% Roasted Peanuts", "High Protein Power", "Rich In Dietary Fiber", "Zero Trans Fat"];

                const benefitMetaList = [
                  { subtitle: "Farm Fresh Quality", tag: "Pure & Natural" },
                  { subtitle: "Clean Muscle Energy", tag: "High Protein" },
                  { subtitle: "Healthy Digestion", tag: "Dietary Fiber" },
                  { subtitle: "Clean Nutrition", tag: "Zero Trans Fat" },
                ];

                const icons = [
                  // 100% Roasted Peanuts (Flame/Fire)
                  <svg key="flame" className="w-full h-full" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.66 11.2c-.23-.3-.51-.56-.77-.82-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32-2.59 2.08-3.61 5.75-2.39 8.9.04.1.08.2.08.33 0 .22-.15.42-.35.5-.22.1-.46.04-.64-.12-.06-.05-.11-.1-.15-.17-1.1-1.43-1.28-3.48-.53-5.12C5.89 10.02 5 12.3 5.14 14.47c.04.5.1 1 .27 1.5.14.6.4 1.2.72 1.73 1.04 1.73 2.87 2.97 4.84 3.22 2.1.27 4.35-.12 5.96-1.6 1.8-1.66 2.49-4.32 1.5-6.6l-.1-.26c-.19-.46-.42-.88-.67-1.26z"/>
                  </svg>,
                  // High Protein Power (Lightning Bolt)
                  <svg key="bolt" className="w-full h-full" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
                  </svg>,
                  // Rich In Dietary Fiber (Plant)
                  <svg key="plant" className="w-full h-full" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C11.5 4 9.5 6 9 8.5C8.5 7.5 7.5 7 6.5 7C5 7 4 8.5 5 10C6 11.5 8 11.5 9.5 10.5C9.5 12.5 8 14 7.5 16C7 15 6 14.5 5 14.5C3.5 14.5 2.5 16 3.5 17.5C4.5 19 6.5 19 8 18C8.5 20.5 7.5 21.5 7 22H9C10.5 20.5 11.5 18 12 15C12.5 18 13.5 20.5 15 22H17C16.5 21.5 15.5 20.5 16 18C17.5 19 19.5 19 20.5 17.5C21.5 16 20.5 14.5 19 14.5C18 14.5 17 15 16.5 16C16 14 14.5 12.5 14.5 10.5C16 11.5 18 11.5 19 10C20 8.5 19 7 17.5 7C16.5 7 15.5 7.5 15 8.5C14.5 6 12.5 4 12 2Z" />
                  </svg>,
                  // Zero Trans Fat (Shield Check)
                  <svg key="shield" className="w-full h-full" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                  </svg>
                ];

                return (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                    {displayBenefits.map((benefit, idx) => {
                      const meta = benefitMetaList[idx % benefitMetaList.length];
                      return (
                        <div
                          key={idx}
                          className="group relative bg-white/75 hover:bg-white backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center justify-between cursor-default overflow-hidden"
                        >
                          {/* Subtle top ambient glow */}
                          <div
                            className="absolute -top-6 -right-6 w-16 h-16 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none"
                            style={{ backgroundColor: bgColor }}
                          />

                          {/* Glowing Icon Badge */}
                          <div
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 shadow-md text-white shrink-0 p-3"
                            style={{
                              background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}ee 100%)`,
                              boxShadow: `0 6px 18px ${bgColor}30`,
                            }}
                          >
                            {icons[idx % icons.length]}
                          </div>

                          {/* Titles */}
                          <div className="flex flex-col items-center w-full">
                            <span className="font-satoshi font-black text-[13px] sm:text-[14px] text-slate-800 uppercase tracking-tight leading-tight mb-1">
                              {benefit}
                            </span>
                            <span className="font-satoshi font-semibold text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider">
                              {meta.subtitle}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      <IngredientShowcase ingredients={product.ingredientsList} bgColor={bgColor} productId={product.id} />
      <SnaxxoProductComparison product={product} />

      <NutritionDetailedSection product={product} onAddToCart={onAddToCart} bgColor={bgColor} />

      <ProductAccordionSection product={product} bgColor={bgColor} />

      {reviews.length > 0 && (
        <Testimonials reviews={reviews.filter(r => r.productId === product.id)} showHeading={false} />
      )}

      {product.usageIdeas && product.usageIdeas.length > 0 && (
        <UsageIdeas ideas={product.usageIdeas} bgColor={bgColor} />
      )}

      <YouMightAlsoLike
        products={products}
        currentProductId={product.id}
        onProductClick={onProductClick}
        onAddToCart={onAddToCart}
        bgColor={bgColor}
      />

      <StoryCarousel
        stories={[...(stories.filter(s => s.productId === product.id).length > 0
          ? stories.filter(s => s.productId === product.id)
          : stories)].reverse().slice(0, 5)
        }
        products={products}
        onProductClick={onProductClick}
        onAddToCart={onAddToCart}
      />

      <SnaxxoAddReview
        productId={product.id}
        onAddReview={onAddReview}
        color="#f2f2ec"
        isLoggedIn={isLoggedIn}
        onLoginClick={onLoginClick}
      />
    </div>
  );
};

export default ProductPage;
