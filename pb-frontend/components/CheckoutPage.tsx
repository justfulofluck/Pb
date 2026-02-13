
import React, { useState } from 'react';
import { CartItem } from '../types';
import { API_BASE_URL } from '../config';

interface CheckoutPageProps {
  items: CartItem[];
  onBack: () => void;
  onOrderSuccess: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ items, onBack, onOrderSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
    state: ''
  });

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 999 ? 0 : 50;
  const tax = subtotal * 0.05; // 5% GST
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentSuccess = async (response: any, orderId: number) => {
    try {
      const verifyResponse = await fetch(`${API_BASE_URL}/api/orders/verify/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization if user is logged in, assuming local storage token
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          order_id: orderId
        })
      });

      if (verifyResponse.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          onOrderSuccess();
        }, 3000); // Wait 3 seconds to show success message
      } else {
        alert("Payment verification failed. Please contact support.");
      }
    } catch (error) {
      console.error("Verification Error:", error);
      alert("Payment verification failed. Please check your connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert("Please login to complete purchase.");
        setIsProcessing(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/orders/initiate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: items.map(item => ({ id: item.id, quantity: item.quantity })),
          shipping_address: {
            street: formData.address,
            city: formData.city,
            zip: formData.zip,
            state: formData.state
          }
        })
      });

      if (response.ok) {
        const data = await response.json();

        const options = {
          key: data.key_id,
          amount: data.amount,
          currency: data.currency,
          name: "Pinobite",
          description: "Fuel Your Body",
          order_id: data.razorpay_order_id,
          handler: function (response: any) {
            handlePaymentSuccess(response, data.order_id);
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone
          },
          theme: {
            color: "#0f172a"
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          alert(response.error.description);
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        const errData = await response.json();
        alert(`Order creation failed: ${errData.error || 'Unknown error'}`);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Order Creation Error:", error);
      alert("Failed to initiate order. Please try again.");
      setIsProcessing(false);
    }
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
              <input
                required
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-primary outline-none font-semibold transition-all"
              />
              <input
                required
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-primary outline-none font-semibold transition-all"
              />
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm">2</span>
              <h3 className="text-2xl font-black uppercase tracking-tight">Shipping Address</h3>
            </div>
            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input required type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-primary outline-none font-semibold transition-all" />
                <input required type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-primary outline-none font-semibold transition-all" />
              </div>
              <input required type="text" name="address" placeholder="Address line 1" value={formData.address} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-primary outline-none font-semibold transition-all" />
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <input required type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-primary outline-none font-semibold transition-all" />
                <input required type="text" name="state" placeholder="State" value={formData.state} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-primary outline-none font-semibold transition-all" />
                <input required type="text" name="zip" placeholder="ZIP Code" value={formData.zip} onChange={handleInputChange} className="col-span-2 lg:col-span-1 w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-primary outline-none font-semibold transition-all" />
              </div>
            </div>
          </section>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isProcessing ? 'Processing...' : 'Complete Purchase'}
            {!isProcessing && <span className="material-symbols-outlined">arrow_forward</span>}
          </button>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-5 bg-slate-50 p-8 rounded-3xl space-y-8 sticky top-8">
          <h3 className="text-xl font-black uppercase tracking-tight">Order Summary</h3>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {items.map(item => (
              <div key={item.id} className="flex gap-4">
                <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold text-slate-900 text-sm">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-slate-200 border-dashed pt-6 space-y-3">
            <div className="flex justify-between text-slate-500 font-medium text-sm">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-500 font-medium text-sm">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
            </div>
            <div className="flex justify-between text-slate-500 font-medium text-sm">
              <span>Tax (5% GST)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-900 font-black text-xl pt-4 border-t border-slate-200">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
