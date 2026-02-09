
import React, { useState, useEffect } from 'react';
import { Product, Review } from '../types';

interface ProductPageProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onBack: () => void;
  reviews: Review[];
  onAddReview: (review: Review) => void;
  isLoggedIn: boolean;
  currentUser?: { name: string; role: string; avatar: string };
}

const ProductPage: React.FC<ProductPageProps> = ({ 
  product, 
  onAddToCart, 
  onBack,
  reviews,
  onAddReview,
  isLoggedIn,
  currentUser
}) => {
  // Construct gallery list: Main image + gallery images
  // If no gallery, fallback to duplicating the main image so the UI still looks full
  const galleryImages = [product.image, ...(product.gallery || [])];
  const displayImages = galleryImages.length > 1 
    ? galleryImages 
    : [product.image, product.image, product.image, product.image];

  const [activeIndex, setActiveIndex] = useState(0);
  
  // Zoom & Hover State
  const [isHovering, setIsHovering] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when product changes
  useEffect(() => {
    setActiveIndex(0);
    setRating(5);
    setComment('');
  }, [product]);

  // Auto-play Carousel Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    // Only auto-play if not hovering and we have multiple images (or duplicates)
    if (!isHovering) {
      interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % displayImages.length);
      }, 3000); // Change image every 3 seconds
    }

    return () => clearInterval(interval);
  }, [isHovering, displayImages.length]);

  // Handle Zoom Mouse Movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  // Handle Click to Email
  const handleMainImageClick = () => {
    const currentImage = displayImages[activeIndex];
    const subject = `Inquiry: ${product.name} Image`;
    const body = `Hi,\n\nI am viewing this product image and would like to inquire about it:\n${currentImage}`;
    
    // Using mailto to open default email client
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Filter reviews for this product
  const productReviews = reviews.filter(r => r.productId === product.id || r.productId === 'general');

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn || !currentUser) return;

    setIsSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      const newReview: Review = {
        id: Date.now().toString(),
        productId: product.id,
        productName: product.name,
        userName: currentUser.name,
        userRole: currentUser.role,
        rating: rating,
        comment: comment,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        avatar: currentUser.avatar
      };

      onAddReview(newReview);
      setComment('');
      setRating(5);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="pb-24">
      {/* Breadcrumb / Back Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-primary font-bold text-xs tracking-widest transition-colors uppercase"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to all products
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Left: Product Images (Carousel & Zoom) */}
          <div className="space-y-6">
            <div 
              className="bg-white rounded-[40px] p-8 doodle-border overflow-hidden relative group h-[500px] flex items-center justify-center cursor-pointer"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onMouseMove={handleMouseMove}
              onClick={handleMainImageClick}
              title="Click to email this image"
            >
              {/* Image Container for Zoom */}
              <div 
                className="w-full h-full relative overflow-hidden rounded-[32px]"
                style={{ cursor: isHovering ? 'crosshair' : 'pointer' }}
              >
                <img 
                  src={displayImages[activeIndex]} 
                  alt={product.name} 
                  className="w-full h-full object-contain transition-transform duration-200 ease-out"
                  style={{
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transform: isHovering ? 'scale(2.5)' : 'scale(1)',
                  }}
                />
              </div>

              {/* Email Hint Overlay (Visible on hover) */}
              {!isHovering && (
                <div className="absolute bottom-6 right-6 bg-slate-900/10 text-slate-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm pointer-events-none">
                  Hover to Zoom • Click to Email
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {displayImages.slice(0, 4).map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveIndex(i)}
                  className={`aspect-square bg-white rounded-2xl border-2 cursor-pointer transition-all p-2 overflow-hidden ${activeIndex === i ? 'border-primary ring-2 ring-primary/20 scale-95' : 'border-slate-100 hover:border-primary'}`}
                >
                  <img src={img} alt={`thumbnail-${i}`} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex text-secondary">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`material-symbols-outlined ${i < Math.floor(product.rating) ? 'fill-1' : ''}`}>star</span>
                  ))}
                </div>
                <span className="font-bold text-slate-400 text-sm tracking-widest">{product.reviewCount} REVIEWS</span>
                {product.isTopRated && (
                  <span className="font-handdrawn bg-secondary text-slate-900 px-4 py-1 rounded-full text-sm -rotate-2">Best Seller</span>
                )}
              </div>
              <h1 className="text-5xl md:text-6xl font-black uppercase leading-none tracking-tight text-slate-900">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-6">
                <span className="text-4xl font-black text-primary">Rs. {product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-slate-300 line-through">Rs. {product.originalPrice.toFixed(2)}</span>
                )}
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-black uppercase">Save 10% Today</span>
              </div>
            </div>

            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              {product.description}
            </p>

            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Nutritional Benefits</h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                {product.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-lg">check</span>
                    </div>
                    <span className="font-bold text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-slate-900 rounded-3xl text-white space-y-6 shadow-xl">
              <h3 className="font-black text-sm uppercase tracking-widest text-secondary">Fuel Breakdown (per 100g)</h3>
              <div className="grid grid-cols-4 gap-4">
                {product.nutrients.map((n, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-black text-white">{n.value}</div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1">{n.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button 
                onClick={() => onAddToCart(product)}
                className="w-full bg-primary text-white py-6 rounded-[32px] font-black text-2xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-4"
              >
                <span className="material-symbols-outlined text-3xl">shopping_bag</span>
                ADD TO YOUR BASKET
              </button>
              <p className="text-center mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                🚚 Free shipping on orders above Rs. 999
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Description / Story */}
        <section className="mt-32 border-t pt-32 grid md:grid-cols-3 gap-16">
          <div className="md:col-span-2 space-y-8">
            <h2 className="text-4xl font-black uppercase">Why we made this</h2>
            <div className="prose prose-slate prose-lg font-medium text-slate-600">
              <p>
                At Pinobite, we believe breakfast shouldn't be a compromise. Most store-bought options are either packed with refined sugar or taste like cardboard. We spent 14 months perfecting the recipe for {product.name} to ensure it hits the perfect balance of taste and performance.
              </p>
              <p>
                Using only high-quality, ethically sourced ingredients, we've created a fuel source that doesn't just fill you up—it sets the tone for your entire day. No crashes, no fillers, just pure goodness.
              </p>
            </div>
          </div>
          <div className="bg-secondary/10 p-10 rounded-3xl doodle-border h-fit">
            <h4 className="font-handdrawn text-3xl text-primary mb-4 transform -rotate-1">Coach's Tip ✨</h4>
            <p className="font-bold text-slate-700 italic leading-relaxed">
              "Try pairing this with some fresh greek yogurt and a drizzle of honey. It's the ultimate pre-workout snack that keeps you energized for hours!"
            </p>
          </div>
        </section>

        {/* REVIEWS SECTION */}
        <section className="mt-24 pt-24 border-t border-slate-100">
           <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-black uppercase text-slate-900">
                Reviews <span className="text-slate-400 text-2xl align-top">({productReviews.length})</span>
              </h2>
           </div>

           <div className="grid lg:grid-cols-2 gap-16">
             {/* Review List */}
             <div className="space-y-8">
               {productReviews.length > 0 ? (
                 productReviews.map((review) => (
                   <div key={review.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <div className="flex justify-between items-start mb-4">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white border border-slate-200 overflow-hidden">
                               <img src={review.avatar || `https://ui-avatars.com/api/?name=${review.userName}&background=random`} alt={review.userName} className="w-full h-full object-cover" />
                            </div>
                            <div>
                               <h4 className="font-bold text-slate-900 text-sm uppercase">{review.userName}</h4>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{review.userRole}</p>
                            </div>
                         </div>
                         <div className="flex text-secondary text-xs">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`material-symbols-outlined text-sm ${i < review.rating ? 'fill-1' : ''}`}>star</span>
                            ))}
                         </div>
                      </div>
                      <p className="text-slate-600 italic font-medium">"{review.comment}"</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4 text-right">{review.date}</p>
                   </div>
                 ))
               ) : (
                 <div className="p-8 bg-slate-50 rounded-3xl text-center border-2 border-dashed border-slate-200">
                   <p className="text-slate-400 font-medium">No reviews yet. Be the first to share your thoughts!</p>
                 </div>
               )}
             </div>

             {/* Add Review Form */}
             <div className="bg-white p-8 rounded-[40px] doodle-border shadow-xl h-fit border-2 border-slate-50">
                <h3 className="text-2xl font-black uppercase text-slate-900 mb-2">Write a Review</h3>
                <p className="text-slate-500 text-sm font-medium mb-8">Tried {product.name}? Let the community know what you think!</p>

                {isLoggedIn ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Your Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`transition-transform hover:scale-110 ${star <= rating ? 'text-secondary' : 'text-slate-200'}`}
                          >
                            <span className="material-symbols-outlined text-3xl fill-1">star</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Your Comment</label>
                       <textarea 
                         required
                         rows={4}
                         value={comment}
                         onChange={(e) => setComment(e.target.value)}
                         className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none transition-all font-bold text-slate-800 bg-slate-50 focus:bg-white resize-none"
                         placeholder="Tell us what you liked (or didn't)..."
                       ></textarea>
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-primary transition-colors hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          POSTING...
                        </>
                      ) : (
                        <>POST REVIEW</>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                      <span className="material-symbols-outlined text-3xl">lock</span>
                    </div>
                    <p className="text-slate-600 font-bold mb-4">Please log in to submit a review.</p>
                    <button disabled className="bg-slate-200 text-slate-400 px-8 py-3 rounded-full font-black uppercase text-sm cursor-not-allowed">
                      Log In to Review
                    </button>
                    <p className="text-xs text-slate-400 mt-2">(Use the profile icon in the navbar)</p>
                  </div>
                )}
             </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default ProductPage;
