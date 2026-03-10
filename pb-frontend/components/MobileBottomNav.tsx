
import React from 'react';

interface MobileBottomNavProps {
    currentView: string;
    onHomeClick: () => void;
    onShopClick: () => void;
    onCartClick: () => void;
    onAccountClick: () => void;
    cartCount: number;
    isCartOpen?: boolean;
    isAuthOpen?: boolean;
    isMenuOpen?: boolean;
}

const MobileBottomNav: React.FC<MobileBottomNavProps & { isHidden?: boolean }> = ({
    currentView,
    onHomeClick,
    onShopClick,
    onCartClick,
    onAccountClick,
    cartCount,
    isCartOpen = false,
    isAuthOpen = false,
    isMenuOpen = false,
    isHidden = false
}) => {
    if (isMenuOpen || isHidden || isCartOpen || isAuthOpen) return null;
    // Explicit Active States
    const isCartActive = isCartOpen;
    const isProfileActive = (isAuthOpen || currentView === 'dashboard') && !isCartOpen;
    const isShopActive = (currentView === 'shop' || currentView === 'product') && !isCartOpen && !isAuthOpen;
    const isHomeActive = currentView === 'home' && !isCartOpen && !isAuthOpen;

    const getButtonClass = (isActive: boolean) => `
        flex items-center justify-center h-12 rounded-full transition-all duration-500
        ${isActive
            ? 'bg-[#1daa61] text-white px-5 shadow-sm'
            : 'text-slate-500 hover:text-slate-800 w-12 hover:bg-black/5'
        }
    `;

    const getLabelClass = (isActive: boolean) => `
        font-black text-[11px] tracking-widest uppercase transition-all duration-500 font-garet overflow-hidden whitespace-nowrap
        ${isActive ? 'max-w-[100px] ml-2 opacity-100' : 'max-w-0 opacity-0'}
    `;

    return (
        <div className="lg:hidden fixed bottom-[env(safe-area-inset-bottom,1px)] left-1/2 -translate-x-1/2 z-[99999] w-[95%] max-w-[500px] animate-in slide-in-from-bottom-10 duration-500 pb-1">
            <div className="bg-[#f2f2ec]/95 backdrop-blur-md rounded-full p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-2 border-white/80 flex items-center justify-between">

                {/* Home Item */}
                <button
                    onClick={onHomeClick}
                    className={getButtonClass(isHomeActive)}
                >
                    <span className="material-symbols-outlined text-[24px]">home</span>
                    <span className={getLabelClass(isHomeActive)}>Home</span>
                </button>

                {/* Shop Item */}
                <button
                    onClick={onShopClick}
                    className={getButtonClass(isShopActive)}
                >
                    <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
                    <span className={getLabelClass(isShopActive)}>Shop</span>
                </button>

                {/* Cart Item */}
                <button
                    onClick={onCartClick}
                    className={`relative ${getButtonClass(isCartActive)}`}
                >
                    <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
                    <span className={getLabelClass(isCartActive)}>Cart</span>
                    {!isCartActive && cartCount > 0 && (
                        <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#f2f2ec] animate-in zoom-in duration-300">
                            {cartCount}
                        </span>
                    )}
                </button>

                {/* Profile Item */}
                <button
                    onClick={onAccountClick}
                    className={getButtonClass(isProfileActive)}
                >
                    <span className="material-symbols-outlined text-[24px]">person</span>
                    <span className={getLabelClass(isProfileActive)}>Profile</span>
                </button>

            </div>
        </div>
    );
};

export default MobileBottomNav;
