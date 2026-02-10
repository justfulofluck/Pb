
import React from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemove, onUpdateQty, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[60] shadow-2xl transform transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-black uppercase flex items-center gap-2">
            Your Cart <span className="font-handdrawn text-primary text-xl tracking-normal">({items.length} items)</span>
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <span className="material-symbols-outlined text-7xl">shopping_basket</span>
              <p className="font-handdrawn text-2xl">Your basket is feeling light!</p>
              <button onClick={onClose} className="text-primary font-bold hover:underline">Start Shopping</button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm uppercase leading-tight mb-1">{item.name}</h3>
                  <p className="text-primary font-black mb-2">Rs. {item.price}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border rounded-full overflow-hidden">
                      <button onClick={() => onUpdateQty(item.id, -1)} className="px-2 hover:bg-slate-50 border-r text-xs">－</button>
                      <span className="px-3 font-bold text-xs">{item.quantity}</span>
                      <button onClick={() => onUpdateQty(item.id, 1)} className="px-2 hover:bg-slate-50 border-l text-xs">＋</button>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="text-xs text-slate-400 hover:text-red-500 font-bold uppercase tracking-widest">Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t bg-slate-50 space-y-4">
            <div className="flex justify-between items-center text-lg">
              <span className="font-bold">Total</span>
              <span className="font-black text-primary">Rs. {total.toFixed(2)}</span>
            </div>
            <p className="text-xs text-slate-500 text-center italic">Shipping & taxes calculated at checkout</p>
            <button 
              onClick={onCheckout}
              className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              CHECKOUT NOW
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
