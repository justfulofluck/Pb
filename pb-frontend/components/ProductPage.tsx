import React, { useEffect, useState, useRef } from 'react';
import { Product, Review, Story } from '../types';
import { API_BASE_URL } from '../config';
import { getMediaUrl } from '../utils/mediaHelper';
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
  const [modelSrc, setModelSrc] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
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
      if (product.name === 'Dark Chocolate Berries & Almonds Muesli') {
        src = '/3D-assets/Dark-Chocolate-Berries-Almonds-Muesli.glb';
      } else if (product.name === 'American Nuts Crunchy Peanut Butter') {
        src = '/3D-assets/AmericanNuts-v1.glb';
      } else if (product.name === 'Strawberry with Chia Peanut Butter') {
        src = '/3D-assets/Strawberry-with-Chia.glb';
      } else if (product.name === 'Dark Chocolate & Almond Crunchy Peanut Butter') {
        src = '/3D-assets/Dark-Chocolate-Almond.glb';
      }
    }
    setModelSrc(src);
  }, [product.id, product.model3d, product.name]);

  React.useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  if (!modelSrc) {
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
  'Dark Chocolate Berries & Almonds Muesli': {
    desktop: '/productpageimg/product-hero.png',
    mobile: '/productpageimg/mobile-varient.png'
  },
  'Dark Chocolate & Almond Crunchy Peanut Butter': {
    desktop: '/productpageimg/dark-chocolate-almond-crunchy-peanut-butter-dex.png',
    mobile: '/productpageimg/dark-chocolate-almond-crunchy-peanut-butter-mobile.png'
  },
  'Mango With Chia Seeds Peanut Butter': {
    desktop: '/productpageimg/mango-with-chia-seeds-peanut-butter-desktop.png',
    mobile: '/productpageimg/mango-with-chia-seeds-peanut-butter-mobile.png'
  },
  'American Nuts Crunchy Peanut Butter': {
    desktop: '/productpageimg/american-nuts-crunchy-peanut-butter-desktop.png',
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
  const [showIngredients, setShowIngredients] = useState(false);
  const [activeTab, setActiveTab] = useState<'nutrition' | 'ingredients'>('nutrition');
  const [packSize, setPackSize] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const jarWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset defaults on product change
    setQuantity(1);
    setPackSize("");
    setShowIngredients(false);
    onPopupToggle?.(false);

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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowIngredients(false);
        onPopupToggle?.(false);
      }
    };
    if (showIngredients) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showIngredients, onPopupToggle]);

  const getProductColor = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('chia') || lowerName.includes('strawberry')) return '#a62427'; // Dark Strawberry Red
    if (lowerName.includes('onion')) return 'hsla(259.4594594594595, 100.00%, 61.83%, 1.00)';
    if (lowerName.includes('ocean') || lowerName.includes('salty')) return 'hsla(211.11111111111114, 100.00%, 50.00%, 1.00)';
    if (lowerName.includes('chili')) return 'hsla(0, 100.00%, 50.00%, 1.00)';
    if (lowerName.includes('pickle')) return 'hsla(145.89928057553956, 93.94%, 38.05%, 1.00)';
    if (lowerName.includes('chive')) return 'hsla(188.51851851851848, 99.11%, 42.59%, 1.00)';
    if (lowerName.includes('cheddar') || lowerName.includes('cheese')) return 'hsla(33.58974358974359, 98.23%, 47.15%, 1.00)';
    if (lowerName.includes('peanut') || lowerName.includes('butter')) return '#FF6F00'; // Brand Orange
    return 'hsla(259.4594594594595, 100.00%, 61.83%, 1.00)';
  };

  if (!product) return null;

  const bgColor = (product?.themeColor && product.themeColor.trim() !== '')
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

      <section ref={heroRef} style={{ backgroundColor: bgColor }} className="section overflow-hidden min-h-[85vh] md:min-h-[95vh] flex flex-col items-center pt-4 md:pt-0 pb-20 md:pb-10 texture-overlay texture-speckles">
        <div className="w-layout-blockcontainer container product-page-hero w-container !pt-2 md:!pt-6 !mt-0">
          <div className="content-wrapper product-page-hero">
            <div className="heading-text-box pdp-h1 mt-0 pt-0 px-6 md:px-12 lg:px-16 mb-[-50px] lg:mb-[-4rem]">
              <h1 ref={titleRef} style={{ color: '#fff', textShadow: '0 4px 20px rgba(0,0,0,0.2)', lineHeight: '1.1', fontSize: 'clamp(2.2rem, 10vw, 120px)' }} className="!font-anton font-bold uppercase tracking-wide [word-spacing:0.15em] md:[word-spacing:0.05em]">
                {product.name}
              </h1>
            </div>
            <div className="product-page-hero-bottom-content flex flex-col lg:flex-row items-center lg:items-end justify-between relative px-2 md:px-0 mt-[-1rem] md:mt-0 lg:pb-35">
              <div className="content-block pdp-01 w-full lg:w-[22%] order-2 lg:order-1 mt-2 lg:mt-[-40px] flex flex-col items-center lg:items-start">
                <div className="hidden md:block text-box pdp-description text-center lg:text-left mx-auto lg:mx-0 px-2 sm:px-4 md:px-0" data-snaxxo-animate>
                  <div className="pdp-ingredients-popup-container flex justify-center lg:justify-start">
                    <a onClick={(e) => { e.preventDefault(); setShowIngredients(true); onPopupToggle?.(true); }} style={{ borderColor: '#ffffff', cursor: 'pointer' }} className="pdp-nutrition-popup-toggle w-inline-block hover:bg-white/10 transition-colors py-2 px-4 border rounded-full">
                      <p style={{ color: '#ffffff' }} className="paragraph no-margin !text-[10px] sm:!text-xs uppercase tracking-widest font-bold">Nutrition &amp; Ingredients</p>
                      <div className="pdp-plus w-embed ml-2 w-3 h-3 sm:w-4 sm:h-4">
                        <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 'inherit', height: 'inherit' }} fill="#ffffff" viewBox="0 0 256 256">
                          <path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z" />
                        </svg>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
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
                      <div style={{ borderColor: 'rgba(255,255,255,0.3)' }} className="quantity-wrapper flex items-center border rounded-lg h-[40px] md:h-[48px] !w-[140px] sm:!w-[200px] overflow-hidden">
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
                          className="w-10 h-full text-center bg-transparent border-none focus:outline-none font-bold text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                        className="w-commerce-commerceaddtocartbutton add-to-cart-button-main product-page cursor-pointer transition-transform hover:scale-105 !w-[160px] sm:!w-[200px] force-anton"
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

          {/* Updated Nutrition & Ingredients Popup - Mobile Bottom Drawer & Desktop Side Drawer */}
          <div
            style={{
              visibility: showIngredients ? 'visible' : 'hidden',
              pointerEvents: showIngredients ? 'auto' : 'none',
              zIndex: 1000
            }}
            className="fixed inset-0 z-[1000] font-satoshi transition-all duration-300"
          >
            {/* Backdrop */}
            <div
              style={{ opacity: showIngredients ? 1 : 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => { setShowIngredients(false); onPopupToggle?.(false); }}
            />

            {/* Popup Container */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                transform: showIngredients
                  ? (window.innerWidth < 1024 ? 'translateY(0)' : 'translateX(0)')
                  : (window.innerWidth < 1024 ? 'translateY(110%)' : 'translateX(110%)'),
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: 'blur(16px)'
              }}
              className="absolute bottom-0 left-0 w-full lg:top-0 lg:left-auto lg:right-0 lg:w-[450px] lg:h-full lg:rounded-l-[40px] rounded-t-[40px] p-8 pb-10 lg:pb-8 shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >


              {/* Tabs Switcher */}
              <div className="flex bg-[#f1f5f9] p-1.5 rounded-[20px] mb-8">
                <button
                  onClick={() => setActiveTab('nutrition')}
                  className={`flex-1 py-3 px-4 rounded-[16px] font-bold transition-all ${activeTab === 'nutrition' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                >
                  Nutrition
                </button>
                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={`flex-1 py-3 px-4 rounded-[16px] font-bold transition-all ${activeTab === 'ingredients' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                >
                  Ingredients
                </button>
              </div>

              {/* Conditional Content */}
              <div className="flex-1 overflow-y-auto mb-8 pr-2 custom-scrollbar">
                {activeTab === 'nutrition' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Calories Card */}
                    <div className="bg-[#f8fafc] rounded-[24px] p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                          <i className="fa-solid fa-fire text-sm"></i>
                        </div>
                        <span className="text-amber-500 font-anton text-[14px] uppercase">Calories</span>
                      </div>
                      <div className="text-3xl font-black text-slate-900">{product.nutrition?.calories || "450"} <span className="text-[10px] font-medium text-slate-400">KCAL</span></div>
                    </div>

                    {/* Protein Card */}
                    <div className="bg-[#f8fafc] rounded-[24px] p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-sky-500">
                          <i className="fa-solid fa-dumbbell text-sm"></i>
                        </div>
                        <span className="text-sky-500 font-anton text-[14px] uppercase">Protein</span>
                      </div>
                      <div className="text-3xl font-black text-slate-900">{product.nutrition?.protein || "24"} <span className="text-[10px] font-medium text-slate-400">GM</span></div>
                    </div>

                    {/* Carbs Card */}
                    <div className="bg-[#f8fafc] rounded-[24px] p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                          <i className="fa-solid fa-bread-slice text-sm"></i>
                        </div>
                        <span className="text-purple-500 font-anton text-[14px] uppercase">Carbs</span>
                      </div>
                      <div className="text-3xl font-black text-slate-900">{product.nutrition?.carbs || "12"} <span className="text-[10px] font-medium text-slate-400">GM</span></div>
                    </div>

                    {/* Fat Card */}
                    <div className="bg-[#f8fafc] rounded-[24px] p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                          <i className="fa-solid fa-droplet text-sm"></i>
                        </div>
                        <span className="text-emerald-500 font-anton text-[14px] uppercase">Fat</span>
                      </div>
                      <div className="text-3xl font-black text-slate-900">{product.nutrition?.fat || "18"} <span className="text-[10px] font-medium text-slate-400">GM</span></div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-anton uppercase text-slate-800 mb-3 text-xl">Detailed Ingredients</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {product.ingredients || "Premium roasted peanuts, organic sweetener, heart-healthy flaxseeds, and a pinch of pink Himalayan salt. No artificial preservatives or flavorings."}
                    </p>
                  </div>
                )}
              </div>

              {/* Done Action Button */}
              <button
                onClick={() => { setShowIngredients(false); onPopupToggle?.(false); }}
                className="w-full bg-slate-900/90 text-white rounded-[18px] py-3.5 font-bold text-base active:scale-95 transition-all shadow-lg hover:shadow-xl hover:translate-y-[-1px] tracking-wide"
              >
                DONE
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-[-1px] left-0 w-full h-[100px] z-[5] pointer-events-none">
          <MultiLayerWave fill="#f2f2ec" className="h-full" />
        </div>
      </section >



      <section className="section overflow-hidden" style={{ backgroundColor: '#f2f2ec' }}>
        <div className="w-layout-blockcontainer container product-page-intro w-container">
          <div className="content-wrapper product-page-intro">
            <div className="pdp-heading-container">
              <div className="image-wrapper start-02" data-snaxxo-animate>
                <div style={{ color: bgColor }} className="content-image _100 w-embed">
                  <svg style={{ width: 'inherit', height: 'inherit' }} viewBox="0 0 259 259" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M258.809 257.997C252.02 249.194 245.323 240.289 238.444 231.586C224.666 213.798 210.612 196.216 196.925 178.328C174.398 149.072 175.123 107.306 198.455 78.4639C208.864 65.5899 218.967 52.3507 229.276 39.3867C239.404 26.6234 249.533 13.86 258.741 0C249.732 6.87895 240.723 13.7579 231.72 20.732C213.532 34.881 195.555 49.4006 177.156 63.1791C149.372 83.9514 108.378 83.2777 81.0124 61.9191C56.0481 42.5332 31.3502 22.751 6.47656 3.26448C4.67724 1.83284 2.61211 0.797401 0 0.268603C19.2182 24.927 38.5217 49.39 57.559 74.2489C86.4779 112.043 85.6133 149.424 55.7191 186.16C37.5841 208.423 19.9414 230.945 2.19811 253.378C1.30524 254.571 0.71394 256.035 0.826374 258.13C19.6566 243.469 38.5772 228.708 57.5031 214.042C66.4161 207.168 75.0227 199.929 84.4492 193.696C114.946 173.542 153.168 176.083 181.772 199.094C206.973 219.326 232.53 239.063 257.906 259C258.273 258.694 258.639 258.388 259 257.987L258.809 257.997Z" fill="currentColor" />
                  </svg>
                </div>
              </div>
              <div className="image-wrapper start-01" data-snaxxo-animate>
                <div style={{ color: bgColor }} className="content-image _100 w-embed">
                  <svg style={{ width: 'inherit', height: 'inherit' }} viewBox="0 0 379 424" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M223.927 226.081C218.579 218.478 213.313 210.796 207.883 203.271C197.027 187.906 185.926 172.7 175.15 157.256C157.406 131.992 159.917 97.3816 180.984 74.4925C190.382 64.2756 199.538 53.7424 208.856 43.4464C218.012 33.3088 227.167 23.1712 235.594 12.0833C227.654 17.3897 219.713 22.696 211.773 28.0816C195.73 39.0112 179.849 50.2576 163.645 60.8703C139.175 76.8685 104.496 74.4925 82.2957 55.5641C62.0397 38.3776 42.0265 20.8744 21.8514 3.6089C20.3929 2.34171 18.6914 1.39131 16.5037 0.836914C31.6553 22.1417 46.8879 43.288 61.8776 64.7511C84.6452 97.3816 82.2147 128.349 55.2334 157.494C38.8665 175.155 22.9047 193.055 6.86181 210.874C6.05157 211.825 5.48438 213.013 5.48438 214.755C22.0944 203.43 38.7855 192.025 55.4765 180.699C63.336 175.393 70.9524 169.77 79.2167 165.018C105.955 149.653 138.203 153.455 161.376 173.809C181.794 191.708 202.536 209.211 223.116 226.873C223.441 226.635 223.765 226.398 224.088 226.081H223.927Z" fill="currentColor" />
                    <path d="M372.36 286.507C367.741 289.992 363.123 293.398 358.504 296.882C349.187 303.931 339.95 311.059 330.632 318.108C315.319 329.592 293.361 329.196 278.371 317.316C271.647 312.009 264.678 306.782 257.872 301.555C251.228 296.407 244.503 291.18 237.211 286.507C240.857 291.101 244.422 295.694 248.068 300.288C255.442 309.633 263.058 318.742 270.269 328.245C281.126 342.422 280.721 363.331 269.54 377.35C259.331 390.101 249.041 402.693 238.75 415.365C238.021 416.316 237.454 417.345 237.211 418.692C250.094 408.871 262.976 399.05 275.941 389.308C295.711 374.577 315.319 375.052 334.522 390.338C346.189 399.604 357.938 408.633 369.686 417.741C370.334 418.217 371.064 418.533 372.117 418.454C364.419 408.792 356.722 399.129 349.106 389.467C345.541 384.952 341.733 380.517 338.492 375.686C327.958 360.084 329.255 340.522 341.327 325.949C351.942 313.119 362.313 300.051 372.765 287.141C372.603 286.982 372.441 286.745 372.279 286.587L372.36 286.507Z" fill="currentColor" />
                  </svg>
                </div>
              </div>
              <div className="w-layout-grid heading-grid center-two-rows tablet-flex-center max-w-full overflow-hidden">
                <div id="w-node-_1456048c-5ed6-222f-c30e-3b71073b440b-98e0d5d3" className="grid-block w-full">
                  <div className="text-box w-full flex justify-center">
                    <h2 style={{
                      backgroundColor: bgColor,
                      fontSize: 'clamp(2.5rem, 12vw, 5.5rem)',
                      lineHeight: '1.1',
                      textAlign: 'center',
                      width: '100%',
                    }} className="h2-heading no-margin break-words font-anton uppercase text-textured-any" data-snaxxo-animate>
                      Small Size Huge Flavor
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content-wrapper intro-pdf w-full overflow-hidden">

            {/* Mobile layout: stack */}
            <div className="flex flex-col md:hidden items-center gap-8 px-6 py-10">
              <div className="w-full flex justify-center">
                {PRODUCT_HERO_MAP[product.name] ? (
                  <img src={getMediaUrl(PRODUCT_HERO_MAP[product.name]!.mobile)} alt={product.name}
                    className="w-full h-auto object-contain drop-shadow-2xl" style={{ maxWidth: '100%' }} />
                ) : (
                  <img src={getMediaUrl(product.image)} alt={product.name}
                    className="w-full h-auto object-contain drop-shadow-2xl" style={{ maxWidth: '320px' }} />
                )}
              </div>
              <div className="w-full grid grid-cols-2 gap-6 px-2">
                <div><h3 className="font-satoshi font-black text-[22px] leading-[1.1] mb-1" style={{ color: bgColor }}>30g<br/>Protein<br/><span className="text-[16px]">Per 100g</span></h3><p className="font-satoshi text-[13px] font-semibold" style={{ color: bgColor }}>Supports muscle recovery and keeps you energized all day.</p></div>
                <div className="text-right"><h3 className="font-satoshi font-black text-[22px] leading-[1.1] mb-1" style={{ color: bgColor }}>No Added<br/>Sugar, Salt,<br/>or Palm Oil</h3><p className="font-satoshi text-[13px] font-semibold" style={{ color: bgColor }}>Purely roasted peanuts for clean and nutritious eating.</p></div>
                <div><h3 className="font-satoshi font-black text-[22px] leading-[1.1] mb-1" style={{ color: bgColor }}>Rich in<br/>Healthy Fats</h3><p className="font-satoshi text-[13px] font-semibold" style={{ color: bgColor }}>Promotes heart health and overall well-being naturally.</p></div>
                <div className="text-right"><h3 className="font-satoshi font-black text-[22px] leading-[1.1] mb-1" style={{ color: bgColor }}>The World's<br/>Best Peanuts</h3><p className="font-satoshi text-[13px] font-semibold" style={{ color: bgColor }}>Premium farm-fresh peanuts for rich flavor and perfect crunch.</p></div>
              </div>
            </div>

            {/* Desktop layout: image center + 4 corner text blocks */}
            <div className="hidden md:block relative w-full" style={{ minHeight: '640px' }}>

              {/* Center Image */}
              <div className="absolute inset-0 flex justify-center items-center" style={{ zIndex: 1 }}>
                {PRODUCT_HERO_MAP[product.name] ? (
                  <img
                    src={getMediaUrl(PRODUCT_HERO_MAP[product.name]!.desktop)}
                    alt={product.name}
                    className="object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105"
                    style={{ maxWidth: '70%', maxHeight: '640px', width: 'auto', height: 'auto' }}
                  />
                ) : (
                  <img
                    src={getMediaUrl(product.image)}
                    alt={product.name}
                    className="object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105"
                    style={{ maxWidth: '520px', maxHeight: '580px', width: 'auto', height: 'auto' }}
                  />
                )}
              </div>

              {/* TOP-LEFT: 30g Protein — text only */}
              <div className="absolute" style={{ top: '8%', left: '3%', maxWidth: '220px', zIndex: 2 }}>
                <h3 className="font-satoshi font-black text-[28px] lg:text-[32px] leading-[1.1] mb-2" style={{ color: bgColor }}>
                  30g<br/>Protein<br/><span className="text-[19px] lg:text-[21px]">Per 100g</span>
                </h3>
                <p className="font-satoshi font-semibold text-[14px] leading-snug" style={{ color: bgColor }}>
                  Supports muscle recovery and keeps you energized all day.
                </p>
              </div>

              {/* TOP-RIGHT: No Added Sugar — text only */}
              <div className="absolute text-right" style={{ top: '8%', right: '3%', maxWidth: '220px', zIndex: 2 }}>
                <h3 className="font-satoshi font-black text-[28px] lg:text-[32px] leading-[1.1] mb-2" style={{ color: bgColor }}>
                  No Added<br/>Sugar, Salt, or<br/>Palm Oil
                </h3>
                <p className="font-satoshi font-semibold text-[14px] leading-snug" style={{ color: bgColor }}>
                  Purely roasted peanuts for clean and nutritious eating.
                </p>
              </div>

              {/* BOTTOM-LEFT: Rich in Healthy Fats — text only */}
              <div className="absolute" style={{ bottom: '8%', left: '3%', maxWidth: '220px', zIndex: 2 }}>
                <h3 className="font-satoshi font-black text-[28px] lg:text-[32px] leading-[1.1] mb-2" style={{ color: bgColor }}>
                  Rich in<br/>Healthy Fats
                </h3>
                <p className="font-satoshi font-semibold text-[14px] leading-snug" style={{ color: bgColor }}>
                  Promotes heart health and overall well-being naturally.
                </p>
              </div>

              {/* BOTTOM-RIGHT: The World's Best Peanuts — text only */}
              <div className="absolute text-right" style={{ bottom: '8%', right: '3%', maxWidth: '220px', zIndex: 2 }}>
                <h3 className="font-satoshi font-black text-[28px] lg:text-[32px] leading-[1.1] mb-2" style={{ color: bgColor }}>
                  The World's<br/>Best Peanuts
                </h3>
                <p className="font-satoshi font-semibold text-[14px] leading-snug" style={{ color: bgColor }}>
                  Premium farm-fresh peanuts for rich flavor and perfect crunch.
                </p>
              </div>

              {/* ARROWS — 4 individual divs, each spanning from text edge to image edge */}
              {/* At 1920px: text right/left edges at ~14.5%, image edges at ~38% (left) and ~62% (right) */}
              {/* At 640px height: top text center ~20%, bottom text center ~80%, image occupies ~10-90% */}

              {/* TOP-LEFT arrow: from text bottom-right corner → image top-left */}
              <div style={{ position: 'absolute', left: '15%', top: '15%', width: '23%', height: '22%', pointerEvents: 'none', zIndex: 3 }}>
                <svg viewBox="0 0 100 100" fill="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <path d="M 0,0 Q 60,10 100,100" stroke={bgColor} strokeWidth="2" strokeLinecap="round" fill="none"/>
                  <rect x="93" y="92" width="10" height="10" fill={bgColor} transform="rotate(45 98 97)"/>
                </svg>
              </div>

              {/* BOTTOM-LEFT arrow: from text top-right corner → image bottom-left */}
              <div style={{ position: 'absolute', left: '15%', bottom: '15%', width: '23%', height: '22%', pointerEvents: 'none', zIndex: 3 }}>
                <svg viewBox="0 0 100 100" fill="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <path d="M 0,100 Q 60,90 100,0" stroke={bgColor} strokeWidth="2" strokeLinecap="round" fill="none"/>
                  <rect x="93" y="-8" width="10" height="10" fill={bgColor} transform="rotate(45 98 -3)"/>
                </svg>
              </div>

              {/* TOP-RIGHT arrow: from text bottom-left corner → image top-right */}
              <div style={{ position: 'absolute', right: '15%', top: '15%', width: '23%', height: '22%', pointerEvents: 'none', zIndex: 3 }}>
                <svg viewBox="0 0 100 100" fill="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <path d="M 100,0 Q 40,10 0,100" stroke={bgColor} strokeWidth="2" strokeLinecap="round" fill="none"/>
                  <rect x="-3" y="92" width="10" height="10" fill={bgColor} transform="rotate(45 2 97)"/>
                </svg>
              </div>

              {/* BOTTOM-RIGHT arrow: from text top-left corner → image bottom-right */}
              <div style={{ position: 'absolute', right: '15%', bottom: '15%', width: '23%', height: '22%', pointerEvents: 'none', zIndex: 3 }}>
                <svg viewBox="0 0 100 100" fill="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <path d="M 100,100 Q 40,90 0,0" stroke={bgColor} strokeWidth="2" strokeLinecap="round" fill="none"/>
                  <rect x="-3" y="-8" width="10" height="10" fill={bgColor} transform="rotate(45 2 -3)"/>
                </svg>
              </div>

            </div>

            <div className="benefit-circles flex flex-wrap md:flex-nowrap justify-center gap-x-4 md:gap-x-8 gap-y-12 mt-4 md:mt-16 mb-8 py-4" data-snaxxo-animate>
              {(() => {
                const filtered = (product.benefits || []).filter(b => b && b.trim() !== "");
                const displayBenefits = filtered.length > 0 ? filtered : ["100% Roasted Peanuts", "High Protein Power", "Rich In Dietary Fiber", "Zero Trans Fat"];

                const icons = [
                  // High Fiber / Plant
                  <svg style={{ height: 'inherit', width: 'inherit' }} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C11.5 4 9.5 6 9 8.5C8.5 7.5 7.5 7 6.5 7C5 7 4 8.5 5 10C6 11.5 8 11.5 9.5 10.5C9.5 12.5 8 14 7.5 16C7 15 6 14.5 5 14.5C3.5 14.5 2.5 16 3.5 17.5C4.5 19 6.5 19 8 18C8.5 20.5 7.5 21.5 7 22H9C10.5 20.5 11.5 18 12 15C12.5 18 13.5 20.5 15 22H17C16.5 21.5 15.5 20.5 16 18C17.5 19 19.5 19 20.5 17.5C21.5 16 20.5 14.5 19 14.5C18 14.5 17 15 16.5 16C16 14 14.5 12.5 14.5 10.5C16 11.5 18 11.5 19 10C20 8.5 19 7 17.5 7C16.5 7 15.5 7.5 15 8.5C14.5 6 12.5 4 12 2Z" />
                  </svg>,
                  // All Natural / Leaves
                  <svg style={{ height: 'inherit', width: 'inherit' }} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 8C14.2 8 12 10.2 12 13C12 15.8 14.2 18 17 18C19.8 18 22 15.8 22 13C22 8 17 8 17 8ZM15.5 14.5C14.7 13.7 14.7 12.3 15.5 11.5C16.3 10.7 17.7 10.7 18.5 11.5L15.5 14.5Z" />
                    <path d="M7 10C4.2 10 2 12.2 2 15C2 17.8 4.2 20 7 20C9.8 20 12 17.8 12 15C12 10 7 10 7 10ZM5.5 16.5C4.7 15.7 4.7 14.3 5.5 13.5C6.3 12.7 7.7 12.7 8.5 13.5L5.5 16.5Z" opacity="0.9" />
                  </svg>,
                  // Zero Sugar / Cubes
                  <svg style={{ height: 'inherit', width: 'inherit' }} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 14.5L8 12.5L12 14.5L8 16.5L4 14.5Z" />
                    <path d="M4 14.5V18.5L8 20.5V16.5L4 14.5Z" opacity="0.8" />
                    <path d="M8 16.5V20.5L12 18.5V14.5L8 16.5Z" opacity="0.9" />
                    <path d="M10 8.5L14 6.5L18 8.5L14 10.5L10 8.5Z" />
                    <path d="M10 8.5V12.5L14 14.5V10.5L10 8.5Z" opacity="0.8" />
                    <path d="M14 10.5V14.5L18 12.5V8.5L14 10.5Z" opacity="0.9" />
                    <path d="M16.5 2C14.6 2 13 3.6 13 5.5C13 7.4 14.6 9 16.5 9C18.4 9 20 7.4 20 5.5C20 3.6 18.4 2 16.5 2ZM18 6.5L17.3 7.2L16.5 6.4L15.7 7.2L15 6.5L15.8 5.7L15 5L15.7 4.3L16.5 5.1L17.3 4.3L18 5L17.2 5.7L18 6.5Z" fill="currentColor" />
                  </svg>,
                  // Keto / Drop
                  <svg style={{ height: 'inherit', width: 'inherit' }} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6C9.5 9 6 12 6 15C6 17.8 8.2 20 11 20C13.8 20 16 17.8 16 15C16 12 14.5 9 12 6ZM11 18C9.3 18 8 16.7 8 15C8 13.8 9.5 11.5 11 9.5V18Z" opacity="0.9" />
                    <path d="M16 10C14.5 11.8 12.5 13.8 12.5 15.8C12.5 17.7 14 19.2 15.8 19.2C17.7 19.2 19.2 17.7 19.2 15.8C19.2 13.8 18.2 11.8 16 10Z" />
                  </svg>,
                  // Kosher / Dome
                  <svg style={{ height: 'inherit', width: 'inherit' }} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4C7 4 3 8 3 13H21C21 8 17 4 12 4ZM12 2C12.6 2 13 2.4 13 3C13 3.6 12.6 4 12 4C11.4 4 11 3.6 11 3C11 2.4 11.4 2 12 2ZM2 14C2 14.6 2.4 15 3 15H21C21.6 15 22 14.6 22 14C22 13.4 21.6 13 21 13H3C2.4 13 2 13.4 2 14Z" />
                    <path d="M12 6.5L13.2 9H16L13.8 10.5L14.6 13L12 11.5L9.4 13L10.2 10.5L8 9H10.8L12 6.5Z" fill={bgColor} stroke="currentColor" strokeWidth="0.5" />
                  </svg>
                ];

                return displayBenefits.map((benefit, idx) => (
                  <div key={idx} className="sub-icon-block benefits">
                    <div style={{ backgroundColor: bgColor }} className="benefit-icon-wrap">
                      <div className="benefit-icon w-embed text-white">
                        {icons[idx % icons.length]}
                      </div>
                    </div>
                    <div style={{ color: bgColor }} className="benefit-text-box">
                      <div className="benefit-text-box pdp">
                        <div style={{ color: bgColor }} className="benefit-title-pdp">{benefit}</div>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      </section>

      <IngredientShowcase ingredients={product.ingredientsList} bgColor={bgColor} />
      <SnaxxoProductComparison product={product} />

      <NutritionDetailedSection product={product} onAddToCart={onAddToCart} bgColor={bgColor} />

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
