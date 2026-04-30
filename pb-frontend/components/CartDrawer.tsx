import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItem, Product } from '../types';
import { formatPrice } from '../utils/formatters';
import { analytics } from '../utils/analytics';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  products: Product[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onAddToCart: (product: Product) => void;
  onCheckout: () => void;
  onShopClick: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, products, onRemove, onUpdateQty, onAddToCart, onCheckout, onShopClick }) => {
  const [isSummaryExpanded, setIsSummaryExpanded] = React.useState(false);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalSubtotal = items.reduce((sum, item) => sum + ((item.originalPrice || item.price) * item.quantity), 0);
  const savings = originalSubtotal - subtotal;

  // Real products for "Frequently Bought Together"
  const upsellItems = (products || [])
    .filter(p => !items.some(item => item.id === p.id))
    .slice(0, 3);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1050]"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[#f8f9fa] z-[1100] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b-2 border-b-[#0b3d2e] bg-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="text-lg font-bold uppercase tracking-tight text-[#0b3d2e] leading-none">
                    Your Items <span className="font-medium opacity-50">({items.length} Item{items.length !== 1 ? 's' : ''})</span>
                  </div>
                </div>
                <button onClick={onClose} aria-label="Close Cart" className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <span className="material-symbols-outlined text-gray-500">close</span>
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto custom-scroll flex flex-col">
                {items.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-5xl text-gray-300">shopping_basket</span>
                    </div>
                    <p className="text-base font-bold text-gray-400">Your cart is empty</p>
                    <button onClick={onShopClick} className="px-6 py-2 bg-[#0b3d2e] !text-white rounded-lg font-bold hover:opacity-90 transition-opacity">Start Shopping</button>
                  </div>
                ) : (
                  <>
                    {/* Cart Items List */}
                    <div className="p-1.5 space-y-1.5 ">
                      {items.map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                          <div className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                          </div>
                          <div className="flex-1 flex flex-col justify-start gap-1">
                            <div>
                              <h4 className="font-satoshi font-bold text-xs md:text-sm text-[#0b3d2e] leading-tight mb-0">{item.name}</h4>
                              <p className="text-sm font-bold text-gray-900 leading-none m-0">{formatPrice(item.price)}</p>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 h-8">
                                <button onClick={() => onUpdateQty(item.id, -1)} className="w-8 h-full flex items-center justify-center hover:bg-gray-100 transition-colors !text-[#0b3d2e] disabled:opacity-30" disabled={item.quantity <= 1}>
                                  <span className="material-symbols-outlined text-sm !text-[#0b3d2e]">remove</span>
                                </button>
                                <span className="w-6 text-center font-bold text-xs text-gray-800">{item.quantity}</span>
                                <button onClick={() => onUpdateQty(item.id, 1)} className="w-8 h-full flex items-center justify-center hover:bg-gray-100 transition-colors !text-[#0b3d2e]">
                                  <span className="material-symbols-outlined text-sm !text-[#0b3d2e]">add</span>
                                </button>
                              </div>
                              <button
                                onClick={() => {
                                  onRemove(item.id);
                                  analytics.trackRemoveFromCart(item);
                                }}
                                className="h-8 px-3 text-[10px] uppercase font-black tracking-wider !text-[#0b3d2e] !no-underline border border-green-100 rounded-lg hover:bg-green-50 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Frequently Bought Together */}
                    <div className="mt-4 p-4 py-2 bg-[#fff5f2]">
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className="material-symbols-outlined text-yellow-500 text-lg fill-yellow-500">star</span>
                        <span className="text-sm font-bold text-gray-800">Frequently Bought Together!</span>
                      </div>
                      <div className="flex gap-3 overflow-x-auto pb-2 custom-scroll snap-x">
                        {upsellItems.map(upsell => (
                          <div key={upsell.id} className="min-w-[280px] bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm flex snap-start">
                            <div className="w-1/3 bg-gray-50/50 p-2 flex items-center justify-center">
                              <img src={upsell.image} alt={upsell.name} className="w-full h-auto object-contain" />
                            </div>
                            <div className="w-2/3 p-3 flex flex-col justify-between">
                              <div>
                                <h4 className="text-[11px] font-bold font-satoshi leading-tight mb-1 text-[#0b3d2e]">{upsell.name}</h4>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-xs font-black text-[#0b3d2e]">{formatPrice(upsell.price)}</span>
                                  {upsell.originalPrice && (
                                    <span className="text-[9px] text-gray-400 line-through">{formatPrice(upsell.originalPrice)}</span>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => onAddToCart(upsell)}
                                className="w-full mt-2 py-1.5 bg-[#0b3d2e] !text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-[#082d22] transition-colors shadow-sm"
                              >
                                Add To Cart
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </>
                )}
              </div>

              {/* Sticky Footer */}
              {items.length > 0 && (
                <div className="border-t-2 border-[#0b3d2e] bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                  {/* Summary Header */}
                  <div
                    onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                    className="bg-[#0b3d2e] text-white p-3 flex justify-between items-center transition-all cursor-pointer hover:bg-[#082d22]"
                  >
                    <span className="text-sm font-bold uppercase tracking-wide">Price Summary</span>
                    <div className="flex items-center gap-4">
                      {!isSummaryExpanded && (
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-white/50 line-through">{formatPrice(originalSubtotal)}</span>
                          <span className="text-sm font-bold">{formatPrice(subtotal)}</span>
                        </div>
                      )}
                      <motion.span
                        animate={{ rotate: isSummaryExpanded ? 180 : 0 }}
                        className="material-symbols-outlined text-sm"
                      >
                        keyboard_arrow_down
                      </motion.span>
                    </div>
                  </div>

                  {/* Expanded Summary Details */}
                  <AnimatePresence>
                    {isSummaryExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-b border-gray-100 bg-white"
                      >
                        <div className="p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Item MRP</span>
                            <span className="text-sm font-bold text-gray-900">{formatPrice(originalSubtotal)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Discount On Mrp</span>
                            <span className="text-sm font-bold text-green-600">-{formatPrice(savings)}</span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b border-dashed border-gray-200">
                            <span className="text-sm font-medium text-gray-600">Total Savings</span>
                            <span className="text-sm font-bold text-green-600">(-) {formatPrice(savings)}</span>
                          </div>
                          <div className="flex justify-between items-center pt-1">
                            <span className="text-base font-bold text-[#0b3d2e]">Grand Total</span>
                            <span className="text-base font-black text-[#0b3d2e]">{formatPrice(subtotal)}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Savings Banner */}
                  {savings > 0 && (
                    <div className="bg-[#9cd92a] py-0.5 px-4 flex items-center justify-center">
                      <p className="text-[10px] font-bold text-[#0b3d2e] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[12px] text-[#f9bc15] fill-current">auto_awesome</span>
                        You saved {formatPrice(savings)} on this order
                      </p>
                    </div>
                  )}

                  {/* Checkout Actions */}
                  <div className="px-6 pb-6 pt-0 space-y-4">
                    <div className="flex items-center justify-between gap-8 mt-4">
                      <div className="flex flex-col flex-shrink-0">
                        <span className="text-2xl font-black text-[#0b3d2e] leading-none">{formatPrice(subtotal)}</span>
                        <button
                          onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                          className="text-[10px] mt-1 font-bold !text-[#0b3d2e] underline text-left uppercase tracking-tighter hover:opacity-70 transition-opacity"
                        >
                          View Price Details
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          onCheckout();
                          onClose();
                        }}
                        className="flex-1 bg-[#0b3d2e] !text-white h-14 rounded-xl flex items-center justify-center gap-2 group transition-all hover:bg-[#082d22] active:scale-[0.98] shadow-lg shadow-green-900/10"
                      >
                        <span className="text-lg font-bold uppercase tracking-widest !text-white">
                          Place Order
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartDrawer;

