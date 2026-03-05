
import React, { useState, useRef, useEffect } from 'react';

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
  onMenuStateChange
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

  const hasAnnouncements = announcements.length > 0;

  return (
    <div className="sticky top-0 z-[1000] w-full">
      {/* Announcement Band */}
      {hasAnnouncements && (
        <div className="bg-[#008a45] text-white px-4 text-center overflow-hidden min-h-[40px] md:min-h-[44px] flex items-center justify-center relative">
          <div className="max-w-7xl mx-auto w-full relative min-h-[40px] md:min-h-[44px]">
            {announcements.map((text, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${idx === currentAnnouncementIdx
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-2 pointer-events-none'
                  }`}
              >
                <p className="text-[10px] md:text-[12px] font-black tracking-[0.25em] uppercase whitespace-nowrap pt-1">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <nav className={`bg-white/80 backdrop-blur-md border-b border-slate-200 ${hasAnnouncements ? '' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-center h-24">
            {/* Left side: Navigation Links */}
            <div className={`flex-1 flex items-center gap-8 font-black text-[11px] tracking-widest text-slate-800 transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <button onClick={onJourneyClick} className="hover:text-primary transition-colors uppercase font-garet">OUR JOURNEY</button>
              <div className="relative group/menu" ref={dropdownRef}>
                <button
                  onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                  className={`hover:text-primary transition-colors uppercase font-garet flex items-center gap-1 ${isProductsDropdownOpen ? 'text-primary' : ''}`}
                >
                  PRODUCTS <span className="material-symbols-outlined text-[14px]">expand_more</span>
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
              <button onClick={() => onCategoryClick?.('Combo Packs') || onProductsClick()} className="hover:text-primary transition-colors uppercase font-garet">COMBO PACKS</button>
              {isLoggedIn && (
                <button onClick={onDashboardClick} className="hover:text-primary transition-colors uppercase text-primary font-black">MY DASHBOARD</button>
              )}
            </div>

            {/* Center: Logo */}
            <div className={`absolute left-1/2 -translate-x-1/2 transition-all duration-300 z-[60] ${isSearchOpen ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100'}`}>
              <button
                onClick={onLogoClick}
                className="flex items-center group pointer-events-auto"
              >
                <img
                  src="/logos/Pinobite-logo.png"
                  alt="Pinobite Logo"
                  className="h-20 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </button>
            </div>

            {/* Right side: Actions */}
            <div className={`flex-1 flex items-center justify-end gap-6 transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-1 hover:text-primary transition-colors text-[11px] font-black uppercase tracking-widest text-slate-800 group"
              >
                SEARCH
              </button>
              <button
                onClick={onAccountClick}
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${isLoggedIn ? 'text-primary bg-primary/10' : 'hover:bg-slate-100'}`}
              >
                <span className="material-symbols-outlined text-[24px]">{isLoggedIn ? 'account_circle' : 'person'}</span>
              </button>
              <button
                onClick={onCartClick}
                className="flex items-center gap-2 bg-[#b8e843] text-slate-900 border-2 border-black px-6 py-2.5 rounded-[4px] font-black text-[12px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all active:shadow-none active:translate-x-0 active:translate-y-0"
                style={{ fontFamily: '"Garet", sans-serif' }}
              >
                CART ({cartCount})
              </button>
            </div>
          </div>

          {/* Mobile Layout (as requested) */}
          <div className="md:hidden flex items-center justify-between h-20">
            {/* Logo Left */}
            <button
              onClick={onLogoClick}
              className={`transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              <img
                src="/logos/Pinobite-logo.png"
                alt="Pinobite Logo"
                className="h-12 w-auto object-contain"
              />
            </button>

            {/* Right Group: Actions + Menu */}
            <div className={`flex items-center gap-3 transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center justify-center w-10 h-10 text-slate-700 hover:text-primary transition-colors"
                aria-label="Search"
              >
                <span className="material-symbols-outlined text-[26px]">search</span>
              </button>

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

          {/* Search Overlay (Shared) */}
          <div className={`absolute inset-0 z-[100] flex items-center justify-center transition-all duration-300 ${isSearchOpen ? 'opacity-100 visible translate-y-0 pointer-events-auto' : 'opacity-0 invisible -translate-y-4 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm"></div>
            <div className="w-full max-w-2xl px-4 relative z-10">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <span className="absolute left-4 material-symbols-outlined text-slate-400 pointer-events-none">search</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for healthy snacks..."
                  className="w-full pl-12 pr-12 py-3 bg-slate-100 border-2 border-transparent focus:border-primary rounded-full text-slate-900 placeholder:text-slate-400 outline-none transition-all font-bold text-lg shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                  className="absolute right-2 p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Side Menu */}
      <div
        className={`md:hidden fixed inset-0 z-[9999] transition-opacity duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={closeMenu}
          aria-hidden="true"
        ></div>

        {/* Menu Panel - Coming from RIGHT */}
        <div className={`absolute top-0 right-0 bottom-0 w-full max-w-[340px] bg-[#1daa61] text-white shadow-2xl transition-transform duration-500 ease-out z-10 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full relative px-8 pt-12 pb-10">

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
                <span className="font-black text-[22px] tracking-tight group-hover:translate-x-2 transition-transform duration-300">PRODUCTS</span>
                <span className="material-symbols-outlined text-[20px] text-white/60">chevron_right</span>
              </button>

              <button
                onClick={() => { onCategoryClick?.('Combo Packs') || onProductsClick(); closeMenu(); }}
                className="flex items-center justify-between w-full group"
              >
                <span className="font-black text-[22px] tracking-tight group-hover:translate-x-2 transition-transform duration-300">COMBO PACKS</span>
                <span className="material-symbols-outlined text-[20px] text-white/60">chevron_right</span>
              </button>

              <button
                onClick={() => { onJourneyClick(); closeMenu(); }}
                className="flex items-center justify-between w-full group"
              >
                <span className="font-black text-[22px] tracking-tight group-hover:translate-x-2 transition-transform duration-300">OUR JOURNEY</span>
                <span className="material-symbols-outlined text-[20px] text-white/60">chevron_right</span>
              </button>

              {isLoggedIn && (
                <button
                  onClick={() => { onDashboardClick(); closeMenu(); }}
                  className="flex items-center justify-between w-full group"
                >
                  <span className="font-black text-[22px] tracking-tight group-hover:translate-x-2 transition-transform duration-300">MY DASHBOARD</span>
                  <span className="material-symbols-outlined text-[20px] text-white/60">chevron_right</span>
                </button>
              )}
            </div>

            {/* Secondary Navigation Section */}
            <div className="flex-1 space-y-4">
              <p className="text-white/50 font-black text-[10px] tracking-[0.2em] mb-4">COLLECTIONS</p>
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
                  onClick={() => { onAccountClick(); closeMenu(); }}
                  className="block font-bold text-base text-white/80 hover:text-white transition-colors pt-4"
                >
                  {isLoggedIn ? 'ACCOUNT SETTINGS' : 'LOG IN / SIGN UP'}
                </button>
                <button
                  onClick={() => { onCartClick(); closeMenu(); }}
                  className="block font-bold text-base text-white/80 hover:text-white transition-colors"
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
