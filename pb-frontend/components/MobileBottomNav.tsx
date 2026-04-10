
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
        flex items-center justify-center h-12 rounded-full transition-all duration-500 relative overflow-hidden
        ${isActive
            ? 'bg-[#0b3d2e] texture-overlay texture-speckles text-white px-5 shadow-lg'
            : 'text-slate-500 hover:text-slate-800 w-12 hover:bg-black/5'
        }
    `;

    const getLabelClass = (isActive: boolean) => `
        font-black text-[11px] tracking-widest uppercase transition-all duration-500 font-satoshi overflow-hidden whitespace-nowrap
        ${isActive ? 'max-w-[100px] ml-2 opacity-100' : 'max-w-0 opacity-0'}
    `;

    return (
        <div className="lg:hidden fixed bottom-[env(safe-area-inset-bottom,12px)] left-0 right-0 z-[99999] flex justify-center px-4 animate-in slide-in-from-bottom-6 duration-500">
            <div className="w-full max-w-[440px] bg-white/90 backdrop-blur-xl rounded-[32px] p-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/50 flex items-center justify-between">
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
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in duration-300">
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
