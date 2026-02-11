
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
  onSearch
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between items-center h-20">
          
          {/* Standard Navbar Content */}
          <div className={`flex items-center gap-8 transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <button 
              onClick={onLogoClick}
              className="text-2xl font-extrabold tracking-tighter text-primary flex items-center gap-2 group"
            >
              <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform">eco</span>
              PINOBITE
            </button>
            <div className="hidden md:flex items-center gap-6 font-semibold text-xs tracking-widest text-slate-500">
              <button onClick={onJourneyClick} className="hover:text-primary transition-colors uppercase">OUR JOURNEY</button>
              <button onClick={onProductsClick} className="hover:text-primary transition-colors uppercase">PRODUCTS</button>
              <button onClick={onStoriesClick} className="hover:text-primary transition-colors uppercase">STORIES</button>
              {isLoggedIn && (
                <button onClick={onDashboardClick} className="hover:text-primary transition-colors uppercase text-primary font-black">MY DASHBOARD</button>
              )}
            </div>
          </div>

          {/* Actions (Search, Account, Cart) */}
          <div className={`flex items-center gap-4 transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors hidden sm:block group"
            >
              <span className="material-symbols-outlined group-hover:text-primary">search</span>
            </button>
            <button 
              onClick={onAccountClick}
              className={`p-2 rounded-full transition-colors hidden sm:block ${isLoggedIn ? 'text-primary bg-primary/10' : 'hover:bg-slate-100'}`}
            >
              <span className="material-symbols-outlined">{isLoggedIn ? 'account_circle' : 'person'}</span>
            </button>
            <button 
              onClick={onCartClick}
              className="flex items-center gap-2 bg-secondary text-slate-900 px-5 py-2.5 rounded-full font-bold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <span className="material-symbols-outlined text-xl">shopping_cart</span>
              <span className="hidden xs:inline">CART</span>
              <span className="bg-white/40 px-2 py-0.5 rounded-full text-xs">{cartCount}</span>
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
  );
};

export default Navbar;
