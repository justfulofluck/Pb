
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
  announcements?: string[];
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
  announcements = []
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentAnnouncementIdx, setCurrentAnnouncementIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

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
          <div className="relative flex justify-between items-center h-24">

            {/* Left side: Navigation Links */}
            <div className={`flex-1 hidden md:flex items-center gap-8 transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <div className="flex items-center gap-8 font-black text-[11px] tracking-widest text-slate-800">
                <button onClick={onJourneyClick} className="hover:text-primary transition-colors uppercase font-garet">OUR JOURNEY</button>
                <div className="relative group/menu">
                  <button onClick={onProductsClick} className="hover:text-primary transition-colors uppercase font-garet flex items-center gap-1">
                    PRODUCTS <span className="material-symbols-outlined text-xs">expand_more</span>
                  </button>
                </div>
                <button onClick={onProductsClick} className="hover:text-primary transition-colors uppercase font-garet">COMBO PACKS</button>
                {isLoggedIn && (
                  <button onClick={onDashboardClick} className="hover:text-primary transition-colors uppercase text-primary font-black">MY DASHBOARD</button>
                )}
              </div>
            </div>

            {/* Center: Logo */}
            <div className={`absolute left-1/2 -translate-x-1/2 transition-all duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100'}`}>
              <button
                onClick={onLogoClick}
                className="flex items-center group"
              >
                <img
                  src="/logos/Pinobite-logo.png"
                  alt="Pinobite Logo"
                  className="h-16 md:h-20 w-auto object-contain transition-transform group-hover:scale-105"
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
                <span className="material-symbols-outlined">{isLoggedIn ? 'account_circle' : 'person'}</span>
              </button>
              <button
                onClick={onCartClick}
                className="flex items-center gap-2 bg-[#b8e843] text-slate-900 border-2 border-black px-6 py-2.5 rounded-[4px] font-black text-[12px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all active:shadow-none active:translate-x-0 active:translate-y-0"
                style={{ fontFamily: '"Garet", sans-serif' }}
              >
                <span className="hidden xs:inline">CART ({cartCount})</span>
              </button>
            </div>

            {/* Search Overlay */}
            <div className={`absolute inset-0 z-50 flex items-center justify-center transition-all duration-300 ${isSearchOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}>
              {/* Background cover */}
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
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
