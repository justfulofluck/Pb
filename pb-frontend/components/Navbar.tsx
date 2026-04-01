
import React, { useState, useRef, useEffect } from 'react';
import { Product, BlogPost, EventBlog } from '../types';

interface NavbarProps {
  cartCount: number;
  isLoggedIn?: boolean;
  onCartClick: () => void;
  onAccountClick: () => void;
  onLogoClick: () => void;
  onProductsClick: () => void;
  onDashboardClick: () => void;
  onStoriesClick?: () => void;
  onJourneyClick: () => void;
  onSearch: (query: string) => void;
  categories?: any[];
  onCategoryClick?: (category: string) => void;
  announcements?: string[];
  onMenuStateChange?: (isOpen: boolean) => void;
  products: Product[];
  blogPosts: BlogPost[];
  events: EventBlog[];
  onProductClick: (p: Product) => void;
  onBlogClick: (b: BlogPost) => void;
  onEventClick: (e: EventBlog) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  isLoggedIn,
  onCartClick,
  onAccountClick,
  onLogoClick,
  onProductsClick,
  onDashboardClick,
  onStoriesClick,
  onJourneyClick,
  onSearch,
  categories = [],
  onCategoryClick,
  announcements = [],
  onMenuStateChange,
  products,
  blogPosts,
  events,
  onProductClick,
  onBlogClick,
  onEventClick
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentAnnouncementIdx, setCurrentAnnouncementIdx] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProductsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (announcements.length > 1) {
      const timer = setInterval(() => {
        setCurrentAnnouncementIdx((prev) => (prev + 1) % announcements.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [announcements.length]);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      onMenuStateChange?.(true);
    } else {
      document.body.style.overflow = 'unset';
      onMenuStateChange?.(false);
    }
  }, [isMenuOpen, onMenuStateChange]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  const filteredProducts = (products || []).filter(p =>
    (p.name || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
    (p.description || '').toLowerCase().includes((searchQuery || '').toLowerCase())
  ).slice(0, 4);

  const filteredBlogs = (blogPosts || []).filter(b =>
    (b.title || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
    (b.excerpt || '').toLowerCase().includes((searchQuery || '').toLowerCase())
  ).slice(0, 3);

  const filteredEvents = (events || []).filter(e =>
    (e.title || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
    (e.summary || '').toLowerCase().includes((searchQuery || '').toLowerCase())
  ).slice(0, 3);

  const hasResults = (searchQuery || '').length > 1 && (filteredProducts.length > 0 || filteredBlogs.length > 0 || filteredEvents.length > 0);

  const hasAnnouncements = announcements.length > 0;

  return (
    <div className="sticky top-0 z-[1000] w-full">
      {/* Announcement Band */}
      {hasAnnouncements && (
        <div className="bg-[#008a45] text-white px-4 text-center overflow-hidden min-h-[40px] lg:min-h-[44px] flex items-center justify-center relative">
          <div className="max-w-7xl mx-auto w-full relative min-h-[40px] lg:min-h-[44px]">
            {announcements.map((text, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${idx === currentAnnouncementIdx
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-2 pointer-events-none'
                  }`}
              >
                <p className="text-[10px] lg:text-[12px] font-black tracking-[0.25em] uppercase whitespace-nowrap pt-1">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <nav className={`bg-white/80 backdrop-blur-md border-b border-slate-200 ${hasAnnouncements ? '' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Desktop Layout */}
          <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center h-24">
            {/* Left side: Navigation Links */}
            <div className="flex items-center gap-10 font-black text-[13px] tracking-widest text-slate-800 transition-all duration-300">
              <button onClick={onJourneyClick} className="hover:text-primary transition-colors uppercase font-anton text-lg tracking-widest">OUR JOURNEY</button>
              <div className="relative group/menu" ref={dropdownRef}>
                <button
                  onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                  className={`hover:text-primary transition-colors uppercase font-anton text-lg tracking-widest flex items-center gap-1 ${isProductsDropdownOpen ? 'text-primary' : ''}`}
                >
                  PRODUCTS <span className="material-symbols-outlined text-[14px] font-bold">expand_more</span>
                </button>

                {/* Products Dropdown */}
                <div className={`absolute top-full left-0 mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-xl transition-all duration-200 origin-top-left ${isProductsDropdownOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                  <div className="p-2 py-3">
                    <button
                      onClick={() => { onProductsClick(); setIsProductsDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-primary/5 hover:text-primary transition-colors rounded-lg font-bold text-[12px] uppercase"
                    >
                      Shop All
                    </button>
                    <button
                      onClick={() => { onCategoryClick?.('Combo Packs') || onProductsClick(); setIsProductsDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-primary/5 hover:text-primary transition-colors rounded-lg font-bold text-[12px] uppercase text-primary"
                    >
                      Combo Packs
                    </button>
                    <div className="h-px bg-slate-100 my-2"></div>
                    {categories.map((cat: any) => (
                      <button
                        key={cat.id || cat.name}
                        onClick={() => { onCategoryClick?.(cat.name); setIsProductsDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-primary/5 hover:text-primary transition-colors rounded-lg font-bold text-[12px] uppercase"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Center: Logo */}
            <div className="flex justify-center transition-all duration-300 z-[60]">
              <button
                onClick={onLogoClick}
                className="flex items-center group pointer-events-auto"
              >
                <img
                  src="/logos/Pinobite-logo.png"
                  alt="Pinobite Logo"
                  className="h-14 w-auto object-contain"
                />
              </button>
            </div>

            {/* Right side: Actions */}
            <div className="flex items-center justify-end gap-6">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isSearchOpen ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-100 text-slate-800'} group`}
                aria-label="Search"
              >
                <span className="material-symbols-outlined text-[24px]">search</span>
              </button>
              <button
                onClick={onAccountClick}
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${isLoggedIn ? 'text-primary bg-primary/10' : 'hover:bg-slate-100'}`}
              >
                <span className="material-symbols-outlined text-[24px]">{isLoggedIn ? 'account_circle' : 'person'}</span>
              </button>
              <button
                onClick={onCartClick}
                className="flex items-center gap-2 bg-[#b8e843] text-slate-900 border-2 border-black px-6 py-2.5 rounded-[4px] font-anton"
              >
                CART ({cartCount})
              </button>
            </div>
          </div>

          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden grid grid-cols-3 items-center h-20 relative">
            {/* Left: Search */}
            <div className="flex items-center">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`flex items-center justify-center w-10 h-10 transition-all duration-300 ${isSearchOpen ? 'text-primary scale-110' : 'text-slate-700'}`}
                aria-label="Search"
              >
                <span className="material-symbols-outlined text-[26px]">{isSearchOpen ? 'close' : 'search'}</span>
              </button>
            </div>

            {/* Center: Logo */}
            <div className="flex justify-center">
              <button
                onClick={onLogoClick}
                className="flex items-center"
              >
                <img
                  src="/logos/Pinobite-logo.png"
                  alt="Pinobite Logo"
                  className="h-12 w-auto object-contain"
                />
              </button>
            </div>

            {/* Right: Menu */}
            <div className="flex items-center justify-end">
              {/* Hamburger Button (Colored Square) */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="w-11 h-11 bg-primary text-white rounded-lg flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                aria-label="Open menu"
              >
                <span className="material-symbols-outlined text-[28px]">menu</span>
              </button>
            </div>
          </div>

          {/* Integrated Search Row (Slides down) */}
          <div className={`
            overflow-hidden transition-all duration-500 ease-in-out border-t border-slate-50
            ${isSearchOpen ? 'max-h-[800px] opacity-100 py-8' : 'max-h-0 opacity-0 pointer-events-none py-0'}
          `}>
            <div className="max-w-4xl mx-auto px-4 relative">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center group">
                <span className="absolute left-6 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for healthy snacks..."
                  className="w-full pl-16 pr-24 py-5 bg-white border-2 border-slate-200 focus:border-primary rounded-[28px] text-slate-900 placeholder:text-slate-400 outline-none transition-all font-bold text-xl shadow-lg"
                />
                <div className="absolute right-4 flex items-center gap-2">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl">backspace</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2 hover:bg-primary/10 rounded-full text-slate-400 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-2xl">close</span>
                  </button>
                </div>
              </form>

              {/* Universal Search Results - Positioned below the search bar */}
              <div className={`
                mt-8 space-y-8 max-h-[50vh] overflow-y-auto custom-scroll pr-2 transition-all duration-300
                ${hasResults ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none hidden'}
              `}>
                {/* Products Section */}
                {filteredProducts.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 px-2">
                      <span className="w-8 h-px bg-slate-100"></span>
                      Products
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filteredProducts.map(product => (
                        <div
                          key={product.id}
                          onClick={() => { onProductClick(product); setIsSearchOpen(false); setSearchQuery(''); }}
                          className="flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-2xl cursor-pointer hover:border-primary/30 hover:shadow-md transition-all group"
                        >
                          <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-sm uppercase text-slate-900 truncate group-hover:text-primary transition-colors">{product.name}</h5>
                            <p className="text-primary font-bold text-xs">Rs. {product.price}</p>
                          </div>
                          <span className="material-symbols-outlined text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all">chevron_right</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Blogs Section */}
                  {filteredBlogs.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 px-2">
                        <span className="w-8 h-px bg-slate-100"></span>
                        Insights
                      </h4>
                      <div className="space-y-2">
                        {filteredBlogs.map(post => (
                          <div
                            key={post.id}
                            onClick={() => { onBlogClick(post); setIsSearchOpen(false); setSearchQuery(''); }}
                            className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-all group"
                          >
                            <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-[13px] text-slate-900 truncate">{post.title}</h5>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{post.type} • {post.readTime}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Events Section */}
                  {filteredEvents.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 px-2">
                        <span className="w-8 h-px bg-slate-100"></span>
                        Community
                      </h4>
                      <div className="space-y-2">
                        {filteredEvents.map(event => (
                          <div
                            key={event.id}
                            onClick={() => { onEventClick(event); setIsSearchOpen(false); setSearchQuery(''); }}
                            className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-100 transition-all"
                          >
                            <h5 className="font-bold text-[13px] text-slate-900 mb-1">{event.title}</h5>
                            <div className="flex justify-between items-center">
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">location_on</span>
                                {event.location}
                              </p>
                              <span className="text-[9px] font-black text-primary uppercase">{event.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {!hasResults && searchQuery.length > 1 && (
                  <div className="text-center py-12">
                    <span className="material-symbols-outlined text-6xl text-slate-100 mb-4">sentiment_dissatisfied</span>
                    <p className="text-slate-400 font-bold text-lg">No results found for "{searchQuery}"</p>
                    <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest mt-2">Try different keywords</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Side Menu */}
      <div
        className={`lg:hidden fixed inset-0 z-[9999] transition-opacity duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={closeMenu}
          aria-hidden="true"
        ></div>

        {/* Menu Panel - Coming from RIGHT */}
        <div className={`absolute top-0 right-0 bottom-0 w-full max-w-[340px] bg-[#0b3d2e] text-white shadow-2xl transition-transform duration-500 ease-out z-10 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="!absolute inset-0 texture-overlay texture-speckles pointer-events-none z-0"></div>
          <div className="flex flex-col h-full relative z-20 px-8 pt-12 pb-10">

            {/* Sidebar Top Header */}
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-6">
                <a href="tel:+918882828282" className="text-white/90 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[24px]">call</span>
                </a>
                <a href="mailto:care@pinobite.com" className="text-white/90 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[24px]">mail</span>
                </a>
              </div>

              {/* Boxed Close Button */}
              <button
                onClick={closeMenu}
                className="w-12 h-12 border-2 border-white/40 flex items-center justify-center rounded-sm hover:border-white transition-colors active:scale-90"
              >
                <span className="material-symbols-outlined text-[28px]">close</span>
              </button>
            </div>

            {/* Primary Navigation Items */}
            <div className="space-y-6 mb-12 overflow-y-auto pr-4 custom-scrollbar">
              <button
                onClick={() => { onProductsClick(); closeMenu(); }}
                className="flex items-center justify-between w-full group"
              >
                <span className="font-anton text-[22px] tracking-tight group-hover:translate-x-2 transition-transform duration-300">PRODUCTS</span>
                <span className="material-symbols-outlined text-[20px] text-white/60">chevron_right</span>
              </button>


              <button
                onClick={() => { onJourneyClick(); closeMenu(); }}
                className="flex items-center justify-between w-full group"
              >
                <span className="font-anton text-[22px] tracking-tight group-hover:translate-x-2 transition-transform duration-300">OUR JOURNEY</span>
                <span className="material-symbols-outlined text-[20px] text-white/60">chevron_right</span>
              </button>

            </div>

            {/* Secondary Navigation Section */}
            <div className="flex-1 space-y-4">
              <p className="text-white/50 font-anton text-[10px] tracking-[0.2em] mb-4 uppercase">COLLECTIONS</p>
              <div className="space-y-3">
                {categories.map((cat: any) => (
                  <button
                    key={cat.id || cat.name}
                    onClick={() => { onCategoryClick?.(cat.name); closeMenu(); }}
                    className="block font-bold text-base text-white/80 hover:text-white transition-colors"
                  >
                    {cat.name}
                  </button>
                ))}
                <button
                  onClick={() => { onCategoryClick?.('Combo Packs') || onProductsClick(); closeMenu(); }}
                  className="block font-bold text-base text-primary/90 hover:text-white transition-colors"
                >
                  COMBO PACKS
                </button>
                <button
                  onClick={() => { onAccountClick(); closeMenu(); }}
                  className="block font-bold text-base text-white/80 hover:text-white transition-colors pt-4"
                >
                  {isLoggedIn ? 'ACCOUNT SETTINGS' : 'LOG IN / SIGN UP'}
                </button>
                <button
                  onClick={() => { onCartClick(); closeMenu(); }}
                  className="block font-anton text-base text-white/80 hover:text-white transition-colors"
                >
                  VIEW CART ({cartCount})
                </button>
              </div>
            </div>

            {/* Footer Social Icons */}
            <div className="flex items-center gap-8 pt-8 border-t border-white/10 mt-auto">
              <a href="#" className="text-white/70 hover:text-white active:scale-90 transition-all">
                <i className="fa-brands fa-facebook-f text-xl"></i>
              </a>
              <a href="#" className="text-white/70 hover:text-white active:scale-90 transition-all">
                <i className="fa-brands fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-white/70 hover:text-white active:scale-90 transition-all">
                <i className="fa-brands fa-linkedin-in text-xl"></i>
              </a>
              <a href="#" className="text-white/70 hover:text-white active:scale-90 transition-all">
                <i className="fa-brands fa-youtube text-xl"></i>
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
