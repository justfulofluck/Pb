import React, { useEffect, useState, useRef } from 'react';
import { Product, Review, Story } from '../types';
import SnaxxoProductWheel from './snaxxo/SnaxxoProductWheel';
import MultiLayerWave from './snaxxo/MultiLayerWave';


import SnaxxoAddReview from './snaxxo/SnaxxoAddReview';
import Testimonials from './Testimonials';
import StoryCarousel from './StoryCarousel';
import { useSnaxxoAnimations } from '../hooks/useSnaxxoAnimations';
import { gsap } from 'gsap';
import PrecisionComparison from './PrecisionComparison';
import UsageIdeas from './UsageIdeas';

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

const StableModelViewer = React.memo(({ product }: { product: Product }) => {
  const modelSrc = React.useMemo(() => {
    if (product.model3d) return product.model3d;
    if (product.name === 'American Nuts Crunchy Peanut Butter') return '/3D-assets/AmericanNuts-v1.glb';
    if (product.name === 'Strawberry with Chia Peanut Butter') return '/3D-assets/Strawberry-with-Chia.glb';
    if (product.name === 'Dark Chocolate & Almond Crunchy Peanut Butter') return '/3D-assets/Dark-Chocolate-Almond.glb';
    return null;
  }, [product.id, product.model3d, product.name]);

  if (!modelSrc) {
    return <img src={product.image} alt={product.name} className="content-image _100-full" />;
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
          height: 350px;
        }
        @media (min-width: 768px) {
          .pdp-model-viewer {
            height: clamp(400px, 65vh, 800px);
          }
        }
      `}</style>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {/* @ts-ignore */}
        <model-viewer
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
            maxWidth: '750px',
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
    </div>
  );
}, (prev, next) => prev.product.id === next.product.id && prev.product.name === next.product.name);

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

    return () => {
    };
  }, [product]);

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

  const bgColor = (product.themeColor && product.themeColor.trim() !== '')

    ? product.themeColor
    : getProductColor(product.name);

  // Create a very subtle version of the theme color for sections that are usually white
  const tintColor = bgColor.startsWith('#')
    ? `${bgColor}0D` // ~5% opacity for hex
    : bgColor.replace(/1\.00\)$/, '0.05)'); // ~5% opacity for hsla


  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate adding multiple items if needed. For now just passing product to cart.
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
  };

  return (
    <div className="page-wrapper" style={{ opacity: 1, backgroundColor: tintColor }}>

      <section ref={heroRef} style={{ backgroundColor: bgColor }} className="section overflow-hidden min-h-[70vh] md:min-h-[90vh] flex flex-col items-center pt-0 pb-20 texture-overlay texture-speckles">
        <div className="w-layout-blockcontainer container product-page-hero w-container !pt-2 md:!pt-8 !mt-0">
          <div className="content-wrapper product-page-hero">
            <div className="heading-text-box pdp-h1 mt-0 pt-0">
              <h1 ref={titleRef} style={{ color: 'rgb(255, 255, 255)' }} className="h1-heading pdp-hero font-anton font-normal uppercase text-5xl md:text-[8rem] leading-[0.95] tracking-[-0.01em] md:[word-spacing:0.25em]">
                {product.name}
              </h1>
            </div>
            <div className="product-page-hero-bottom-content flex flex-col lg:flex-row items-center lg:items-end justify-between relative px-6 md:px-0 lg:min-h-[50vh] mt-2 lg:mt-[-2rem]">
              <div className="content-block pdp-01 w-full lg:w-1/4 order-2 lg:order-1 mt-6 lg:mt-0 flex flex-col items-center lg:items-start">
                <div className="text-box pdp-description text-center lg:text-left mx-auto lg:mx-0" data-snaxxo-animate>
                  <p style={{ color: 'rgb(255, 255, 255)' }} className="text-sm md:text-base mb-6 opacity-80 leading-relaxed">{product.description}</p>

                  {product.benefits && product.benefits.length > 0 && (
                    <div className="mb-8 text-left max-w-sm mx-auto lg:mx-0">
                      <ul className="space-y-3 text-white/90 text-sm list-none p-0">
                        {product.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                            <span className="leading-relaxed font-medium">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pdp-ingredients-popup-container">
                    <a onClick={(e) => { e.preventDefault(); setShowIngredients(true); onPopupToggle?.(true); }} style={{ borderColor: '#FFF', cursor: 'pointer' }} className="pdp-nutrition-popup-toggle w-inline-block">
                      <p style={{ color: '#FFF' }} className="paragraph no-margin">Nutrition &amp; Ingredients</p>
                      <div className="pdp-plus w-embed">
                        <svg xmlns="http://www.w3.org/2000/svg" width="inherit" height="inherit" fill="#FFF" viewBox="0 0 256 256">
                          <path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z" />
                        </svg>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              {/* position of 3D object */}
              <div className="content-block pdp-02 w-full lg:flex-1 order-1 lg:order-2 relative flex justify-center items-center">
                <div ref={imageRef} className="image-wrapper main-product-image w-full" style={{ pointerEvents: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }}>
                  <StableModelViewer product={product} />
                </div>
              </div>
              <div className="content-block pdp-03 w-full lg:w-1/4 order-3 lg:order-3 mt-6 lg:mt-0 flex flex-col items-center lg:items-end justify-center lg:justify-end mx-auto lg:mx-0" data-snaxxo-animate>
                <div className="pdp-hero-right-block-content mb-6 flex flex-col items-center lg:items-end w-full mx-auto lg:mx-0">
                  <div className="flex items-baseline justify-center lg:justify-end gap-4 overflow-visible">
                    <span style={{ color: '#FFF' }} className="text-7xl font-black tracking-tighter">
                      ₹{product.price.toFixed(0)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span style={{ color: 'rgba(255, 255, 255, 0.5)' }} className="text-4xl font-bold line-through">
                        ₹{product.originalPrice.toFixed(0)}
                      </span>
                    )}
                  </div>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)' }} className="text-[12px] font-black uppercase tracking-[0.2em] mt-1 text-center lg:text-right">MRP (Inclusive of all taxes)</p>
                </div>
                <div className="add-to-cart-block-wrapper _02">
                  <form onSubmit={handleAddToCart} className="w-commerce-commerceaddtocartform default-state w-full">
                    <div className="product-page-info-cta-contain flex flex-wrap gap-4 items-center justify-center lg:justify-end">
                      <div style={{ borderColor: '#FFF' }} className="quantity-wrapper flex items-center border rounded-lg h-[64px] w-[160px] overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                          className="flex-1 h-full flex items-center justify-center text-white hover:bg-white/10 transition-colors border-r border-white/20 text-3xl pb-1"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          style={{ color: '#FFF' }}
                          className="w-12 h-full text-center bg-transparent border-none focus:outline-none font-bold text-xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          value={quantity}
                          onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                        />
                        <button
                          type="button"
                          onClick={() => setQuantity(prev => prev + 1)}
                          className="flex-1 h-full flex items-center justify-center text-white hover:bg-white/10 transition-colors border-l border-white/20 text-3xl pb-1"
                        >
                          +
                        </button>
                      </div>
                      <input
                        className="w-commerce-commerceaddtocartbutton add-to-cart-button-main product-page cursor-pointer transition-transform hover:scale-105"
                        style={{ backgroundColor: '#FFF', color: bgColor, minWidth: '220px', height: '64px', borderRadius: '8px', fontSize: '1.1rem' }}
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
                  <div className="grid grid-cols-2 gap-4">
                    {/* Calories Card */}
                    <div className="bg-[#f8fafc] rounded-[24px] p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                          <i className="fa-solid fa-fire text-sm"></i>
                        </div>
                        <span className="text-amber-500 font-bold text-[12px] uppercase">Calories</span>
                      </div>
                      <div className="text-3xl font-black text-slate-900">{product.nutrition?.calories || "450"} <span className="text-[10px] font-medium text-slate-400">KCAL</span></div>
                    </div>

                    {/* Protein Card */}
                    <div className="bg-[#f8fafc] rounded-[24px] p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-sky-500">
                          <i className="fa-solid fa-dumbbell text-sm"></i>
                        </div>
                        <span className="text-sky-500 font-bold text-[12px] uppercase">Protein</span>
                      </div>
                      <div className="text-3xl font-black text-slate-900">{product.nutrition?.protein || "24"} <span className="text-[10px] font-medium text-slate-400">GM</span></div>
                    </div>

                    {/* Carbs Card */}
                    <div className="bg-[#f8fafc] rounded-[24px] p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                          <i className="fa-solid fa-bread-slice text-sm"></i>
                        </div>
                        <span className="text-purple-500 font-bold text-[12px] uppercase">Carbs</span>
                      </div>
                      <div className="text-3xl font-black text-slate-900">{product.nutrition?.carbs || "12"} <span className="text-[10px] font-medium text-slate-400">GM</span></div>
                    </div>

                    {/* Fat Card */}
                    <div className="bg-[#f8fafc] rounded-[24px] p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                          <i className="fa-solid fa-droplet text-sm"></i>
                        </div>
                        <span className="text-emerald-500 font-bold text-[12px] uppercase">Fat</span>
                      </div>
                      <div className="text-3xl font-black text-slate-900">{product.nutrition?.fat || "18"} <span className="text-[10px] font-medium text-slate-400">GM</span></div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-bold text-slate-800 mb-3 text-lg">Detailed Ingredients</h3>
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
      </section >

      {/* NEW: Powerful Natural Ingredient Blend Section */}
      <section className="py-20 relative overflow-hidden bg-[#faf7f2] border-y border-stone-200 texture-overlay texture-speckles">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#008a45]/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -ml-48 -mb-48"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="w-full md:w-1/2" data-snaxxo-animate>
              <h2 className="text-textured-green-big text-5xl md:text-[5.2rem] !italic tracking-normal !leading-[1.1] mb-0 [word-spacing:0.1em] pr-10 overflow-visible">
                THE <br />
                POWERFUL <br />
                NATURAL <br />
                INGREDIENT <br />
                BLEND
              </h2>
            </div>
            <div className="w-full md:w-1/2 flex flex-col items-center relative" data-snaxxo-animate>
              {/* Natural Seal Badge */}
              <div className="absolute -top-10 -right-4 md:right-10 z-20 w-32 h-32 md:w-44 md:h-44 bg-secondary rounded-full flex items-center justify-center border-4 border-white shadow-2xl rotate-12 hover:rotate-0 transition-transform duration-500 cursor-default">
                <div className="text-center font-anton text-primary uppercase leading-tight select-none">
                  <div className="text-xs md:text-sm">100%</div>
                  <div className="text-xl md:text-3xl">NATURAL</div>
                  <div className="text-[10px] md:text-xs">PREMIUM QUALITY</div>
                </div>
              </div>

              <div className="relative w-64 h-64 md:w-[400px] md:h-[400px] mb-8 group">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-[80px] scale-125" />
                <img
                  src={product.mainIngredientImage || "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=800&auto=format&fit=crop"}
                  alt={product.mainIngredient || "Roasted Peanuts"}
                  className="w-full h-full object-contain relative z-10 drop-shadow-[0_30px_50px_rgba(0,0,0,0.25)] group-hover:scale-105 transition-all duration-1000 rotate-[-3deg] group-hover:rotate-0"
                />
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="section overflow-hidden" style={{ backgroundColor: '#f2f2ec' }}>
        <div className="w-layout-blockcontainer container product-page-intro w-container">
          <div className="content-wrapper product-page-intro">
            <div className="pdp-heading-container">
              <div className="image-wrapper start-02" data-snaxxo-animate>
                <div style={{ color: bgColor }} className="content-image _100 w-embed">
                  <svg width="inherit" height="inherit" viewBox="0 0 259 259" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M258.809 257.997C252.02 249.194 245.323 240.289 238.444 231.586C224.666 213.798 210.612 196.216 196.925 178.328C174.398 149.072 175.123 107.306 198.455 78.4639C208.864 65.5899 218.967 52.3507 229.276 39.3867C239.404 26.6234 249.533 13.86 258.741 0C249.732 6.87895 240.723 13.7579 231.72 20.732C213.532 34.881 195.555 49.4006 177.156 63.1791C149.372 83.9514 108.378 83.2777 81.0124 61.9191C56.0481 42.5332 31.3502 22.751 6.47656 3.26448C4.67724 1.83284 2.61211 0.797401 0 0.268603C19.2182 24.927 38.5217 49.39 57.559 74.2489C86.4779 112.043 85.6133 149.424 55.7191 186.16C37.5841 208.423 19.9414 230.945 2.19811 253.378C1.30524 254.571 0.71394 256.035 0.826374 258.13C19.6566 243.469 38.5772 228.708 57.5031 214.042C66.4161 207.168 75.0227 199.929 84.4492 193.696C114.946 173.542 153.168 176.083 181.772 199.094C206.973 219.326 232.53 239.063 257.906 259C258.273 258.694 258.639 258.388 259 257.987L258.809 257.997Z" fill="currentColor" />
                  </svg>
                </div>
              </div>
              <div className="image-wrapper start-01" data-snaxxo-animate>
                <div style={{ color: bgColor }} className="content-image _100 w-embed">
                  <svg width="inherit" height="inherit" viewBox="0 0 379 424" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M223.927 226.081C218.579 218.478 213.313 210.796 207.883 203.271C197.027 187.906 185.926 172.7 175.15 157.256C157.406 131.992 159.917 97.3816 180.984 74.4925C190.382 64.2756 199.538 53.7424 208.856 43.4464C218.012 33.3088 227.167 23.1712 235.594 12.0833C227.654 17.3897 219.713 22.696 211.773 28.0816C195.73 39.0112 179.849 50.2576 163.645 60.8703C139.175 76.8685 104.496 74.4925 82.2957 55.5641C62.0397 38.3776 42.0265 20.8744 21.8514 3.6089C20.3929 2.34171 18.6914 1.39131 16.5037 0.836914C31.6553 22.1417 46.8879 43.288 61.8776 64.7511C84.6452 97.3816 82.2147 128.349 55.2334 157.494C38.8665 175.155 22.9047 193.055 6.86181 210.874C6.05157 211.825 5.48438 213.013 5.48438 214.755C22.0944 203.43 38.7855 192.025 55.4765 180.699C63.336 175.393 70.9524 169.77 79.2167 165.018C105.955 149.653 138.203 153.455 161.376 173.809C181.794 191.708 202.536 209.211 223.116 226.873C223.441 226.635 223.765 226.398 224.088 226.081H223.927Z" fill="currentColor" />
                    <path d="M372.36 286.507C367.741 289.992 363.123 293.398 358.504 296.882C349.187 303.931 339.95 311.059 330.632 318.108C315.319 329.592 293.361 329.196 278.371 317.316C271.647 312.009 264.678 306.782 257.872 301.555C251.228 296.407 244.503 291.18 237.211 286.507C240.857 291.101 244.422 295.694 248.068 300.288C255.442 309.633 263.058 318.742 270.269 328.245C281.126 342.422 280.721 363.331 269.54 377.35C259.331 390.101 249.041 402.693 238.75 415.365C238.021 416.316 237.454 417.345 237.211 418.692C250.094 408.871 262.976 399.05 275.941 389.308C295.711 374.577 315.319 375.052 334.522 390.338C346.189 399.604 357.938 408.633 369.686 417.741C370.334 418.217 371.064 418.533 372.117 418.454C364.419 408.792 356.722 399.129 349.106 389.467C345.541 384.952 341.733 380.517 338.492 375.686C327.958 360.084 329.255 340.522 341.327 325.949C351.942 313.119 362.313 300.051 372.765 287.141C372.603 286.982 372.441 286.745 372.279 286.587L372.36 286.507Z" fill="currentColor" />
                  </svg>
                </div>
              </div>
              <div className="w-layout-grid heading-grid center-two-rows tablet-flex-center max-w-full overflow-hidden">
                <div sa="1" id="w-node-_1456048c-5ed6-222f-c30e-3b71073b440b-98e0d5d3" className="grid-block w-full">
                  <div className="text-box w-full flex justify-center">
                    <h2 style={{
                      backgroundColor: bgColor,
                      fontSize: 'clamp(2.5rem, 12vw, 5.5rem)',
                      lineHeight: '1.1',
                      textAlign: 'center',
                      width: '100%',
                    }} className="h2-heading no-margin break-words font-anton !normal-case text-textured-any" data-snaxxo-animate>
                      Small Size Huge Flavor
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content-wrapper intro-pdf"><div className="image-wrapper chip-single-pdp"><div className="chip-call-out _02"><div className="image-wrapper pdp-arrow-02" data-snaxxo-animate ><div style={{ color: bgColor }} className="content-image _100 w-embed"><svg width="inherit" height="inherit" viewBox="0 0 356 275" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.0025 265.075C2.31717 268.032 4.15899 270.985 7.11634 271.671C10.0737 272.356 13.0267 270.514 13.7121 267.557L3.0025 265.075ZM353.344 48.0257C355.549 45.9384 355.643 42.4594 353.555 40.2552L319.537 4.33797C317.45 2.13392 313.971 2.03945 311.767 4.12697C309.563 6.2145 309.468 9.69353 311.556 11.8976L341.794 43.8241L309.868 74.0624C307.664 76.15 307.569 79.629 309.657 81.8332C311.744 84.037 315.223 84.1316 317.427 82.0439L353.344 48.0257ZM13.7121 267.557C31.0134 192.898 122.206 43.3601 349.416 49.5296L349.714 38.5403C116.308 32.2027 21.2498 186.335 3.0025 265.075L13.7121 267.557Z" fill="currentColor" />
          </svg></div></div><div className="call-out-inner-text-box _02" data-snaxxo-animate ><div style={{ color: bgColor }} className="call-out-title font-anton">So Tangy</div></div></div><div className="chip-call-out _03"><div className="image-wrapper pdp-arrow-03" data-snaxxo-animate ><div style={{ color: bgColor }} className="content-image _100 w-embed"><svg width="inherit" height="inherit" viewBox="0 0 338 301" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M334.124 291.338C334.544 294.344 332.446 297.122 329.439 297.54C326.432 297.959 323.655 295.862 323.237 292.855L334.124 291.338ZM4.5247 43.9237C2.51548 41.6477 2.73149 38.1742 5.0072 36.165L42.0918 3.42312C44.3674 1.41392 47.8409 1.62994 49.8502 3.90563C51.8594 6.18133 51.6432 9.6549 49.3676 11.6641L16.4036 40.7679L45.5074 73.7322C47.5166 76.0078 47.3008 79.4813 45.0252 81.4905C42.7496 83.4998 39.2757 83.2836 37.2664 81.0079L4.5247 43.9237ZM323.237 292.855C312.659 216.952 235.159 59.8798 8.304 45.7717L8.98636 34.7995C242.028 49.2925 322.969 211.284 334.124 291.338L323.237 292.855Z" fill="currentColor" />
          </svg></div></div><div className="call-out-inner-text-box _03" data-snaxxo-animate ><div style={{ color: bgColor }} className="call-out-title font-anton">Plant based &amp;&#160;Delicious</div></div></div><div className="chip-call-out _01"><div className="call-out-inner-text-box _01" data-snaxxo-animate ><div style={{ color: bgColor }} className="call-out-title font-anton">Beautifully Bite Sized</div></div><div className="image-wrapper pdp-arrow-01" data-snaxxo-animate ><div style={{ color: bgColor }} className="content-image _100 w-embed"><svg width="inherit" height="inherit" viewBox="0 0 268 356" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M266.208 5.88567C265.923 2.86328 263.243 0.643578 260.22 0.927845C257.198 1.2121 254.978 3.89269 255.263 6.91505L266.208 5.88567ZM2.40058 322.517C0.969072 325.195 1.97876 328.525 4.65581 329.957L48.2805 353.284C50.9573 354.716 54.288 353.706 55.7197 351.029C57.151 348.352 56.1414 345.022 53.4646 343.59L14.6869 322.854L35.4226 284.077C36.854 281.4 35.8444 278.069 33.1673 276.637C30.4903 275.206 27.1597 276.216 25.7282 278.893L2.40058 322.517ZM255.263 6.91505C262.439 83.2152 223.17 253.907 5.65306 319.849L8.84245 330.37C232.292 262.629 273.776 86.3574 266.208 5.88567L255.263 6.91505Z" fill="currentColor" />
          </svg></div></div></div><img className="content-image _100" src={product.image} alt={product.name} data-snaxxo-animate /></div><div className="benefit-circles flex flex-wrap md:flex-nowrap justify-center gap-x-4 md:gap-x-8 gap-y-12 mt-16 mb-8 py-4" data-snaxxo-animate><div className="sub-icon-block benefits" ><div style={{ backgroundColor: bgColor }} className="benefit-icon-wrap"><div className="benefit-icon w-embed"><svg height="inherit" viewBox="0 0 48 48" width="inherit" fill="currentcolor" xmlns="http://www.w3.org/2000/svg"><g id="Wheat_cultivation" data-name="Wheat cultivation"><path d="m45.3 16.28-2.13 2.1a10.59 10.59 0 0 0 -6.67-2.62 8 8 0 0 0 5.68-8.83c.48-.06.1.2 4.53-4.22a1 1 0 0 0 -1.42-1.42c-4.26 4.26-4.15 4-4.22 4.53a8 8 0 0 0 -8.83 5.68 9.94 9.94 0 0 0 -2.65-6.65c.2-.19-.75.76 2.13-2.15a1 1 0 0 0 -1.44-1.4l-2.09 2.12-.29-.29a9.82 9.82 0 0 0 -2.23 3.42c.87.88.82.82.83.83a11.92 11.92 0 0 1 3.5 9.23l-2.56 2.57c2-5.78-2-10.39-2.34-10.39l-1.44-1.42a10 10 0 0 0 -2.24 3.43c2.88 2.85 4.6 5.77 4.31 10.05l-2.56 2.57a9.92 9.92 0 0 0 -2.33-10.42l-1.43-1.42a9.82 9.82 0 0 0 -2.23 3.42l1.41 1.4a12.14 12.14 0 0 1 2.9 8.66l-2.57 2.56a9.84 9.84 0 0 0 -2.33-10.39l-1.42-1.41a9.82 9.82 0 0 0 -2.23 3.42l.82.83a11.89 11.89 0 0 1 3.48 9.23l-2.53 2.54a10 10 0 0 0 -2.36-10.36l-1.42-1.38a10 10 0 0 0 -2.93 7.07c0 3.43 1.43 5.56 3.64 7.83l-10.35 10.29a1 1 0 0 0 1.42 1.42l10.34-10.35.71.71a10 10 0 0 0 14.14 0c-1.9-1.9-4-4.34-8.48-4.34a10 10 0 0 0 -3.3.56l2.54-2.53c4.31-.27 7.07 1.35 10.06 4.3a9.82 9.82 0 0 0 3.42-2.23c-2.27-2.29-4.22-4.34-8.48-4.34a9.2 9.2 0 0 0 -3.32.59l2.56-2.57a12 12 0 0 1 8.61 2.9c.1 0 0-.1 1.45 1.41a9.82 9.82 0 0 0 3.42-2.23l-1.38-1.43a9.9 9.9 0 0 0 -10.38-2.33l2.57-2.56c4.29-.29 7.17 1.43 10.05 4.31a10 10 0 0 0 3.43-2.24l-1.42-1.41c0-.4-4.6-4.37-10.39-2.34l2.53-2.59a11.9 11.9 0 0 1 9.23 3.47l.83.83a9.82 9.82 0 0 0 3.42-2.23l-.29-.29 2.12-2.09a1 1 0 0 0 -1.4-1.41z" /></g></svg></div></div><div style={{ color: bgColor }} className="benefit-text-box"><div className="benefit-text-box pdp"><div style={{ color: bgColor }} className="benefit-title-pdp">High&#160;Fiber</div></div></div></div><div className="sub-icon-block benefits" ><div style={{ backgroundColor: bgColor }} className="benefit-icon-wrap"><div className="benefit-icon w-embed"><svg id="Capa_1" enableBackground="new 0 0 512 512" height="inherit" viewBox="0 0 512 512" fill="currentcolor" width="inherit" xmlns="http://www.w3.org/2000/svg"><g><path d="m423.72 270.425-120-72c-.87-.52-1.79-.95-2.72-1.28v94.14c0 15.72-8.37 30.51-21.85 38.59l-27.33 16.4 36.46 21.87c2.38 1.43 5.05 2.14 7.72 2.14s5.34-.71 7.72-2.14l120-72c4.52-2.71 7.28-7.59 7.28-12.86s-2.76-10.15-7.28-12.86z" /><path d="m222.67 363.755-61.67 37.01v26.52c0 5.24 2.73 10.09 7.2 12.81l112.8 68.62v-111.01c-2.84-1-5.58-2.28-8.17-3.85z" /><path d="m311 397.705v111.01l112.8-68.62c4.47-2.72 7.2-7.57 7.2-12.81v-100.52l-111.84 67.1c-2.6 1.56-5.33 2.84-8.16 3.84z" /><path d="m271 147.285c0-5.27-2.76-10.15-7.28-12.86l-120-72c-4.74-2.84-10.65-2.85-15.39-.03l-121 72c-4.55 2.7-7.33 7.6-7.33 12.89s2.78 10.19 7.33 12.89l121 72c2.36 1.41 5.02 2.11 7.67 2.11 2.67 0 5.34-.71 7.72-2.14l120-72c4.52-2.71 7.28-7.59 7.28-12.86z" /><path d="m408 3.285c-57.346 0-104 46.654-104 104s46.654 104 104 104 104-46.654 104-104-46.654-104-104-104zm34.606 117.394c5.858 5.858 5.858 15.355 0 21.213-2.929 2.929-6.768 4.394-10.606 4.394s-7.678-1.464-10.606-4.394l-13.394-13.394-13.394 13.394c-2.929 2.929-6.768 4.394-10.606 4.394s-7.678-1.464-10.606-4.394c-5.858-5.858-5.858-15.355 0-21.213l13.394-13.394-13.394-13.394c-5.858-5.858-5.858-15.355 0-21.213 5.857-5.858 15.355-5.858 21.213 0l13.393 13.394 13.394-13.394c5.857-5.858 15.355-5.858 21.213 0s5.858 15.355 0 21.213l-13.394 13.394z" /><path d="m0 190.725v100.56c0 5.29 2.78 10.19 7.33 12.89l113.67 67.64v-110.11c-2.79-.98-5.49-2.25-8.05-3.77z" /><path d="m271 291.285v-100.52l-111.84 67.1c-2.6 1.56-5.33 2.84-8.16 3.84v110.07l112.72-67.63c4.52-2.71 7.28-7.59 7.28-12.86z" /></g></svg></div></div><div style={{ color: bgColor }} className="benefit-text-box"><div className="benefit-text-box pdp"><div style={{ color: bgColor }} className="benefit-title-pdp">Zero Sugar</div></div></div></div><div className="sub-icon-block benefits" ><div style={{ backgroundColor: bgColor }} className="benefit-icon-wrap"><div className="benefit-icon w-embed"><svg id="Capa_1" eight="inherit" enableBackground="new 0 0 512 512" viewBox="0 0 512 512" width="inherit" fill="currentcolor" xmlns="http://www.w3.org/2000/svg"><g><path d="m256 355.521c-43.29 0-78.51 35.099-78.51 78.24s35.22 78.239 78.51 78.239 78.51-35.099 78.51-78.24-35.22-78.239-78.51-78.239zm34.1 91.085c5.86 5.83 5.86 15.297 0 21.137-5.846 5.826-15.348 5.842-21.21 0l-12.89-12.846-12.89 12.846c-5.857 5.837-15.359 5.83-21.21 0-5.86-5.84-5.86-15.307 0-21.137l12.89-12.845-12.89-12.846c-5.86-5.84-5.86-15.297 0-21.137s15.36-5.84 21.21 0l12.89 12.846 12.89-12.846c5.85-5.84 15.35-5.84 21.21 0s5.86 15.297 0 21.137l-12.89 12.846z" /><path d="m359.24 107.509c32.75-32.647 23.94-91.225 23.55-93.706-1.01-6.408-6.06-11.43-12.49-12.437-2.48-.399-61.27-9.178-94.02 23.469-.019.019-.038.038-.057.057-3.398 3.393-5.223 8.046-5.223 12.841v93.932c3.63.339 8.75.668 14.82.668 26.342 0 54.715-6.184 73.42-24.824z" /><path d="m235.777 24.891c-.019-.019-.038-.038-.057-.057-32.75-32.647-91.53-23.867-94.02-23.469-6.43 1.007-11.48 6.029-12.49 12.437-4.174 26.468-.841 69.387 23.55 93.706 21 20.928 52.71 24.824 73.42 24.824 6.07 0 11.19-.329 14.82-.668v-93.931c0-4.795-1.825-9.448-5.223-12.842z" /><path d="m420.78 246.96c0 16.8-13.67 30.47-30.47 30.47-16.81 0-30.48-13.67-30.48-30.47 0-16.81 13.67-30.48 30.48-30.48 16.8 0 30.47 13.67 30.47 30.48z" /><path d="m426.2 162.82h-155.2v-31.16h-30v31.16h-155.2c-25.3 0-45.89 20.52-45.89 45.73v118.03c0 25.21 20.59 45.73 45.89 45.73h80.97c19.59-28.19 52.29-46.69 89.23-46.69 37 0 69.73 18.55 89.32 46.81l80.88-.12c25.3 0 45.89-20.52 45.89-45.73v-118.03c0-25.21-20.59-45.73-45.89-45.73zm-296.28 144.61c-33.35 0-60.48-27.13-60.48-60.47 0-33.35 27.13-60.48 60.48-60.48 12.11 0 23.81 3.58 33.82 10.34 6.86 4.64 8.67 13.96 4.03 20.83-4.64 6.86-13.96 8.67-20.83 4.03-5.03-3.4-10.91-5.2-17.02-5.2-16.81 0-30.48 13.67-30.48 30.48 0 16.8 13.67 30.47 30.48 30.47 11.68 0 18.45-6.71 21.74-15.47h-9.69c-8.29 0-15-6.72-15-15 0-8.29 6.71-15 15-15h27.2c8.29 0 15 6.71 15 15 0 35.6-22.31 60.47-54.25 60.47zm177.83-.97c-8.13 1.55-15.99-3.78-17.54-11.92l-6.7-35.05-10.16 35.64c-.05.17-.1.34-.16.51-2.28 7.02-8.76 11.75-16.13 11.79h-.09c-7.34 0-13.83-4.66-16.17-11.62-.06-.18-.11-.35-.17-.53l-10.52-35.68-6.28 34.79c-1.47 8.15-9.28 13.57-17.43 12.09-8.15-1.47-13.57-9.27-12.1-17.42l15.99-88.57c.01-.06.02-.11.03-.17 1.47-7.61 7.89-13.28 15.61-13.79 7.74-.52 14.84 4.25 17.31 11.59.06.17.11.35.16.52l13.36 45.26 12.85-45.11c.05-.17.11-.34.16-.51 2.39-7.37 9.45-12.2 17.18-11.77 7.73.44 14.21 6.04 15.75 13.62.02.06.03.12.04.18l16.93 88.6c1.56 8.13-3.78 15.99-11.92 17.55zm82.56.97c-33.35 0-60.48-27.13-60.48-60.47 0-33.35 27.13-60.48 60.48-60.48 33.34 0 60.47 27.13 60.47 60.48 0 33.34-27.13 60.47-60.47 60.47z" /></g></svg></div></div><div style={{ color: bgColor }} className="benefit-text-box"><div className="benefit-text-box pdp"><div style={{ color: bgColor }} className="benefit-title-pdp">Non&#160;GMO</div></div></div></div><div className="sub-icon-block benefits" ><div style={{ backgroundColor: bgColor }} className="benefit-icon-wrap"><div className="benefit-icon w-embed"><svg height="inherit" viewBox="0 -1 512.00246 512" width="inherit" fill="currentcolor" xmlns="http://www.w3.org/2000/svg"><path d="m501.890625 107.640625c-12.320313-57.300781-31.421875-97.429687-32.230469-99.109375-3.316406-6.910156-11.300781-10.214844-18.53125-7.675781-1.410156.492187-35.074218 12.429687-77.480468 37.734375-28.855469 17.21875-65.886719 43.304687-97.953126 78.449218 6.398438 8.144532 12.519532 16.664063 18.238282 25.59375.019531.03125.039062.0625.058594.09375 9.617187 15.027344 17.824218 30.695313 24.402343 46.574219 9.300781 22.449219 15.847657 46.3125 19.65625 71.46875l67.191407-162.21875c3.179687-7.671875 11.972656-11.3125 19.644531-8.136719 7.671875 3.179688 11.3125 11.972657 8.136719 19.644532l-91.316407 220.457031c-.757812 19.632813-2.929687 39.882813-6.527343 60.71875-7.285157 42.179687-19 77.800781-27.625 100.433594 13.730468-7 29.589843-15.839844 46.300781-26.636719 29.015625-18.746094 54.582031-39.535156 75.992187-61.785156 27.066406-28.132813 47.546875-58.707032 60.875-90.878906 13.324219-32.167969 20.460938-68.269532 21.214844-107.300782.59375-30.875-2.789062-63.652344-10.046875-97.425781zm0 0" /><path d="m290.613281 200.808594c-5.898437-14.246094-13.285156-28.335938-21.949219-41.878906-.003906-.007813-.011718-.015626-.015624-.023438-36.429688-56.921875-90.960938-96.84375-130.292969-120.316406-42.40625-25.304688-76.066407-37.242188-77.480469-37.738282-1.640625-.578124-3.320312-.851562-4.976562-.851562-5.636719 0-10.988282 3.1875-13.554688 8.527344-.808594 1.679687-19.90625 41.808594-32.230469 99.109375-7.261719 33.773437-10.640625 66.554687-10.0468748 97.429687.7539058 39.027344 7.8906248 75.128906 21.2187498 107.300782 13.324219 32.167968 33.804688 62.746093 60.871094 90.875 21.410156 22.253906 46.980469 43.042968 75.996094 61.789062 38.605468 24.941406 72.6875 39.46875 86.449218 44.871094l-150.304687-362.867188c-3.179687-7.671875.464844-16.46875 8.136719-19.644531s16.464844.464844 19.644531 8.136719l150.300781 362.859375c7.023438-16.144531 23.886719-58.507813 33.171875-112.269531 12.070313-69.890626 7.046875-132.234376-14.9375-185.308594zm0 0" /></svg></div></div><div style={{ color: bgColor }} className="benefit-text-box"><div className="benefit-text-box pdp"><div style={{ color: bgColor }} className="benefit-title-pdp">All&#160;Natural</div></div></div></div><div className="sub-icon-block benefits" ><div style={{ backgroundColor: bgColor }} className="benefit-icon-wrap"><div className="benefit-icon w-embed"><svg id="Layer_1" enableBackground="new 0 0 511.931 511.931" width="inherit" fill="currentcolor" height="inherit" viewBox="0 0 511.931 511.931" xmlns="http://www.w3.org/2000/svg"><g><path d="m470.132 184.746c-28.72-27.9-65.96-41.8-103.17-41.8-38.56 0-77.09 14.93-106.06 44.66l-.14.13c-37.55 37.56-71.83 96.44-89.46 153.66-18.71 60.71-15.57 109.4 8.61 133.57 13.74 13.74 35.4 20.69 62.68 20.69 20.72 0 44.68-4 70.89-12.08 57.22-17.63 116.1-51.91 153.66-89.46l.13-.14c58.42-56.93 59.68-150.75 2.86-209.23zm-182.59 65.96 21.22 21.21-55.66 55.66-21.21-21.22zm-62.27 200.11-21.21-21.21 89.05-89.06 21.21 21.22zm123.24-27.83-21.21-21.21 55.66-55.66 21.21 21.21zm106.33-127.59c-24.375 22.876-60.257 12.646-84.3-11.059-22.754-21.694-33.889-61.339-11.06-84.311 20.53-20.53 57.56-15.669 84.3 11.07 22.749 21.667 33.908 61.343 11.06 84.3z" /><path d="m433.632 274.186c-18.022 14.88-57.082-15.445-56.76-41.94-.163-8.923 5.048-14.963 14.97-14.84 8.88 0 20.53 4.7 30.73 14.9 7.63 7.63 12.89 17.04 14.43 25.82.7 4.03 1.21 11.48-3.37 16.06z" /><path d="m145.942 16.276c-81.53 1.17-146.98 68.41-145.93 149.97v.19c0 53.11 17.4 118.98 45.4 171.91 25 47.27 54.91 77.56 84.14 85.97-1.78-26.61 2.55-57.56 13.08-91.75 18.97-61.58 56.08-125.17 96.85-165.98 14.51-14.87 31.01-26.65 48.67-35.34-14.89-64.96-72.7-113.97-142.21-114.97zm-52.47 254.45h-30v-78.71h30zm52.47-113.89c-37.7 0-67.23-22.69-67.23-51.65s29.53-51.65 67.23-51.65 67.24 22.69 67.24 51.65-29.54 51.65-67.24 51.65z" /><path d="m145.942 83.536c-21.94 0-37.23 11.41-37.23 21.65s15.29 21.65 37.23 21.65c21.95 0 37.24-11.41 37.24-21.65s-15.29-21.65-37.24-21.65z" /></g><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /></svg></div></div><div style={{ color: bgColor }} className="benefit-text-box"><div className="benefit-text-box pdp"><div style={{ color: bgColor }} className="benefit-title-pdp">Keto</div></div></div></div><div className="sub-icon-block benefits" ><div style={{ backgroundColor: bgColor }} className="benefit-icon-wrap"><div className="benefit-icon w-embed"><svg viewBox="0 0 56 40" width="inherit" fill="currentcolor" height="inherit" xmlns="http://www.w3.org/2000/svg"><g id="Page-1" fill="currentcolor" fillRule="evenodd"><g id="038---Meal" fill="currentcolor" fillRule="nonzero"><path id="Shape" d="m36.587 16h-3.298l1.649 2.95z" /><path id="Shape" d="m28.002 10.642-1.878 3.358h3.756z" /><path id="Shape" d="m33.289 26h3.3l-1.65-2.951z" /><circle id="Oval" cx="28" cy="2" r="2" /><path id="Shape" d="m25.006 26h5.992l2.795-5.001-2.795-4.999h-5.992l-2.795 5z" /><path id="Shape" d="m28.002 31.36 1.878-3.36h-3.756z" /><path id="Shape" d="m52.963 28.569c.023.473.037.95.037 1.431 0 4.6-12.576 7-25 7s-25-2.4-25-7c0-.481.014-.958.037-1.431-1.937 1.104-3.037 2.315-3.037 3.431 0 3.784 11.5 8 28 8s28-4.216 28-8c0-1.116-1.1-2.327-3.037-3.431z" /><path id="Shape" d="m22.715 16h-3.298l1.649 2.95z" /><path id="Shape" d="m28 35c14.04 0 23-2.961 23-5 0-13.458-10.1-24-23-24s-23 10.542-23 24c0 2.039 8.96 5 23 5zm-10.817-18.9c-.2435699-.4400635-.237109-.9759369.017-1.41.2472317-.428641.705174-.6919579 1.2-.69h5.435l2.956-5.288c.2609465-.41652645.7172817-.67011702 1.2087944-.67174051s.9495132.24894697 1.2132056.66374051l2.96 5.3h5.427c.4949631-.000508.9525186.263349 1.2.692.2527806.4320089.2603726.9649662.02 1.404l-2.736 4.9 2.741 4.9c.2435906.4381871.2375062.9724738-.016 1.405-.2486196.4322998-.7103142.6977074-1.209.695h-5.428l-2.953 5.283c-.2468825.4417501-.7129439.7158813-1.219.717-.5046714-.0014427-.9690923-.2757342-1.214-.717l-2.953-5.283h-5.433c-.4969947.0022442-.9571466-.2617899-1.206-.692-.2532161-.4325161-.2596769-.9664837-.017-1.405l2.743-4.903zm-3.183-2.1c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1-1-.4477153-1-1 .4477153-1 1-1zm-3.185 3.2c.3081749-.4586725.9298275-.5806749 1.3885-.2725s.5806749.9298275.2725 1.3885c-2.1148617 3.1805321-3.31046093 6.8832562-3.455 10.7-.02356388.5350298-.46445178.9565187-1 .956h-.042c-.55171354-.0237889-.97970613-.4902829-.956-1.042.16081501-4.1843937 1.47295426-8.2433054 3.792-11.73z" /><path id="Shape" d="m21.066 23.049-1.65 2.951h3.299z" /></g></g></svg></div></div><div style={{ color: bgColor }} className="benefit-text-box"><div className="benefit-text-box pdp"><div style={{ color: bgColor }} className="benefit-title-pdp">Kosher</div></div></div></div></div></div></div></section>



      <PrecisionComparison />

      <UsageIdeas ideas={product.usageIdeas || []} bgColor={bgColor} />

      <StoryCarousel
        stories={[...(stories.filter(s => s.productId === product.id).length > 0
          ? stories.filter(s => s.productId === product.id)
          : stories)].reverse().slice(0, 5)
        }
        products={products}
        onProductClick={onProductClick}
      />

      <div className="snaxxo-wrapper relative w-full overflow-hidden py-10" style={{ backgroundColor: '#f2f2ec' }}>

        <SnaxxoProductWheel
          products={products}
          onProductClick={onProductClick}
          onAddToCart={(p) => onAddToCart(p)}
          onShopClick={onShopClick}
        />
      </div>

      <SnaxxoAddReview
        productId={product.id}
        onAddReview={onAddReview}
        color={bgColor}
        isLoggedIn={isLoggedIn}
        onLoginClick={onLoginClick}
      />

      {reviews.length > 0 && (
        <Testimonials reviews={reviews.filter(r => r.productId === product.id)} />
      )}


    </div>
  );
};

export default ProductPage;
