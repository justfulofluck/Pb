
import React, { useState } from 'react';
import { CartItem } from '../types';

interface CheckoutPageProps {
  items: CartItem[];
  onBack: () => void;
  onOrderSuccess: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ items, onBack, onOrderSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 999 ? 0 : 50;
  const tax = subtotal * 0.05; // 5% GST
  const total = subtotal + shipping + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onOrderSuccess();
      }, 3000);
    }, 2000);
  };

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6">
        <span className="material-symbols-outlined text-8xl text-slate-200">shopping_cart_off</span>
        <h2 className="text-3xl font-black uppercase text-slate-400 tracking-tight">Your cart is empty!</h2>
        <button onClick={onBack} className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all">
          BACK TO STORE
        </button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background-light">
        <div className="bg-white doodle-border p-12 text-center space-y-6 max-w-lg w-full animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-6xl">check</span>
          </div>
          <h2 className="text-4xl font-black uppercase text-slate-900 tracking-tighter leading-none">Order Placed!</h2>
          <p className="font-handdrawn text-2xl text-primary italic">You're on your way to a healthier morning! 🚀</p>
          <p className="text-slate-500 font-medium">We've sent a confirmation email with your order details. You'll be redirected to the home page shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-primary font-bold text-xs tracking-widest uppercase transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to cart
        </button>
        <div className="flex items-center gap-2 font-extrabold text-primary">
          <span className="material-symbols-outlined">lock</span>
          SECURE CHECKOUT
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-10">
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm">1</span>
              <h3 className="text-2xl font-black uppercase tracking-tight">Contact Information</h3>
            </div>
            <div className="grid gap-4">
              <input required type="email" placeholder="Email Address" className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-primary outline-none font-semibold transition-all" />
              <input required type="tel" placeholder="Phone Number" className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-primary outline-none font-semibold transition-all" />
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm">2</span>
              <h3 className="text-2xl font-black uppercase tracking-tight">Shipping Address</h3>
            </div>
            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input required type="text" placeholder="First Name" className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-primary outline-none font-semibold transition-all" />
                <input required type="text" placeholder="Last Name" className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-primary outline-none font-semibold transition-all" />
              </div>
              <input required type="text" placeholder="Address line 1" className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-primary outline-none font-semibold transition-all" />
              <input type="text" placeholder="Apartment, suite, etc. (optional)" className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-primary outline-none font-semibold transition-all" />
              <div className="grid md:grid-cols-3 gap-4">
                <input required type="text" placeholder="City" className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-primary outline-none font-semibold transition-all" />
                <input required type="text" placeholder="State / Province" className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-primary outline-none font-semibold transition-all" />
                <input required type="text" placeholder="PIN Code" className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-primary outline-none font-semibold transition-all" />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm">3</span>
              <h3 className="text-2xl font-black uppercase tracking-tight">Payment</h3>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full border-4 border-primary bg-white"></div>
                <span className="font-bold text-slate-700">Online Payment / UPI / Credit Card</span>
              </div>
              <p className="text-xs text-slate-400 pl-9 font-medium">After clicking "Complete Purchase", you will be redirected to our secure payment gateway to finish your transaction safely.</p>
            </div>
          </section>

          <button 
            disabled={isProcessing}
            className={`w-full py-6 rounded-3xl font-black text-2xl transition-all flex items-center justify-center gap-4 shadow-xl ${
              isProcessing ? 'bg-slate-200 text-slate-400' : 'bg-primary text-white hover:shadow-2xl hover:-translate-y-1 active:scale-95'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-6 h-6 border-4 border-slate-400 border-t-white rounded-full animate-spin"></div>
                VERIFYING...
              </>
            ) : (
              <>
                COMPLETE PURCHASE
                <span className="material-symbols-outlined">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Order Summary Sticky */}
        <aside className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="bg-white doodle-border p-8 space-y-8 shadow-xl">
            <h3 className="text-2xl font-black uppercase tracking-tight border-b pb-4 border-slate-100">Order Summary</h3>
            
            <div className="max-h-[300px] overflow-y-auto custom-scroll space-y-4 pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="relative w-16 h-16 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-1 -right-1 bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">{item.quantity}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm uppercase leading-tight">{item.name}</h4>
                    <p className="text-xs text-slate-400 font-bold tracking-widest mt-1">SINGLE: Rs. {item.price}</p>
                  </div>
                  <div className="font-black text-slate-900">Rs. {(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-100">
              <div className="flex justify-between text-slate-500 font-bold">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-bold">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-primary' : ''}>{shipping === 0 ? 'FREE' : `Rs. ${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-bold">
                <span>Tax (GST 5%)</span>
                <span>Rs. {tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-6 text-2xl font-black text-slate-900 border-t border-slate-100">
                <span>TOTAL</span>
                <span className="text-primary">Rs. {total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-secondary/10 p-4 rounded-xl space-y-2">
              <p className="text-xs font-bold text-slate-700 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">local_shipping</span>
                ESTIMATED DELIVERY
              </p>
              <p className="text-sm font-black text-slate-900 uppercase">3 - 5 Business Days</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
