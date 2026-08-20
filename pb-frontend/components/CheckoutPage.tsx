import React, { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { API_BASE_URL } from '../config';
import { triggerRewardNotification } from './RewardNotification';
import { useToast } from './Toast';
import confetti from 'canvas-confetti';
import Header from './Header';
import Footer from './Footer';
import BorderGlow from './BorderGlow';

interface CheckoutPageProps {
  items: CartItem[];
  onBack: () => void;
  onOrderSuccess: () => void;
  onLoginRequired: () => void;
  checkAuth?: () => Promise<void>;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ items, onBack, onOrderSuccess, onLoginRequired, checkAuth }) => {
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [usePoints, setUsePoints] = useState(false);
  const [pointsDiscount, setPointDiscount] = useState(0);

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

  const [savedAddress, setSavedAddress] = useState<any>(null);
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod' | 'special_cod'>('online');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const res = await fetch(`${API_BASE_URL}/api/users/me/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.profile) {
              setUserPoints(data.profile.points || 0);
              if (data.profile.address) {
                setSavedAddress(data.profile);
                setUseSavedAddress(true);
              }
              setFormData(prev => ({
                ...prev,
                email: data.email || prev.email,
                firstName: data.first_name || prev.firstName,
                lastName: data.last_name || prev.lastName,
                phone: data.profile.phone || prev.phone,
                address: data.profile.address || prev.address,
                city: data.profile.city || prev.city,
                state: data.profile.state || prev.state,
                zip: data.profile.pin_code || prev.zip
              }));
            } else {
              // Pre-fill basic info even if no address
              setFormData(prev => ({
                ...prev,
                email: data.email || prev.email,
                firstName: data.first_name || prev.firstName,
                lastName: data.last_name || prev.lastName,
              }));
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  const toggleAddressMode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUseSavedAddress(!e.target.checked);
    if (e.target.checked) {
      // User wants to change address, maybe clear or keep?
      // Let's keep current values to allow editing
    } else {
      // Revert to saved
      if (savedAddress) {
        setFormData(prev => ({
          ...prev,
          phone: savedAddress.phone || prev.phone,
          address: savedAddress.address || prev.address,
          city: savedAddress.city || prev.city,
          state: savedAddress.state || prev.state,
          zip: savedAddress.pin_code || prev.zip
        }));
      }
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const mrpTotal = items.reduce((sum, item) => sum + ((item.originalPrice || item.price) * item.quantity), 0);
  const mrpDiscount = mrpTotal - subtotal;
  const shipping = 0;
  const specialCodFee = paymentMethod === 'special_cod' ? 5000 : 0;

  // 10 points = 1 Rupee discount
  const maxRedeemablePoints = Math.min(userPoints, Math.floor(subtotal * 10));
  const potentialDiscount = usePoints ? maxRedeemablePoints / 10 : 0;
  const total = subtotal + shipping + specialCodFee - potentialDiscount;

  const togglePoints = () => {
    setUsePoints(!usePoints);
  };

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
        let verifyData = {};
        try {
          const contentType = verifyResponse.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            verifyData = await verifyResponse.json();
          }
        } catch (parseErr) {
          console.error("Failed to parse verify response:", parseErr);
        }

        // Trigger notification using backend data if available, fallback to calculation
        const earnedPoints = verifyData.points_earned !== undefined ? verifyData.points_earned : Math.floor(subtotal / 10);
        if (earnedPoints > 0) {
          triggerRewardNotification(earnedPoints, `Order #${orderId} Verified!`);
        }

        // Refresh auth state to show new points in dashboard
        if (checkAuth) {
          await checkAuth();
        }

        setIsSuccess(true);
        setTimeout(() => {
          onOrderSuccess();
        }, 3000); // Wait 3 seconds to show success message
      } else {
        showToast("Payment verification failed. Please contact support.", 'error');
      }
    } catch (error) {
      console.error("Verification Error:", error);
      showToast("Payment verification failed. Please check your connection.", 'error');
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
        setShowLoginModal(true);
        setIsProcessing(false);
        return;
      }

      if (!formData.email || !formData.phone || !formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.zip || !formData.state) {
        throw new Error('Please fill in all required fields.');
      }

      const response = await fetch(`${API_BASE_URL}/api/orders/initiate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: items.map(item => ({ id: item.id, quantity: item.quantity })),
          email: formData.email,
          phone: formData.phone,
          first_name: formData.firstName,
          last_name: formData.lastName,
          shipping_address: {
            street: formData.address,
            city: formData.city,
            zip: formData.zip,
            state: formData.state
          },
          use_points: usePoints,
          points_to_redeem: usePoints ? maxRedeemablePoints : 0,
          payment_method: paymentMethod
        })
      });

      if (response.ok) {
        const data = await response.json();

        if (data.is_cod) {
          if (data.points_earned > 0) {
            triggerRewardNotification(data.points_earned, `Order #${data.order_id} Placed!`);
          }
          if (checkAuth) await checkAuth();
          
          if (paymentMethod === 'special_cod') {
            const duration = 3 * 1000;
            const end = Date.now() + duration;

            (function frame() {
              confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#0b3d2e', '#ffaa00', '#ffffff', '#8a2be2']
              });
              confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#0b3d2e', '#ffaa00', '#ffffff', '#8a2be2']
              });

              if (Date.now() < end) {
                requestAnimationFrame(frame);
              }
            }());
          }

          setIsSuccess(true);
          setTimeout(() => {
            onOrderSuccess();
          }, 3000);
          return;
        }

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
          },
          config: {
            display: {
              hide: [
                { method: "paylater" },
                { method: "wallet" },
                { method: "emi" },
                { method: "netbanking" }
              ],
              preferences: {
                show_default_blocks: true
              }
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          showToast(response.error.description, 'error');
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        let errData = {};
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            errData = await response.json();
          } else {
            errData = { error: 'Server returned an error. Please try again.' };
          }
        } catch (parseErr) {
          errData = { error: `Server error (${response.status}). Please try again.` };
        }
        showToast(`Order creation failed: ${errData.error || 'Unknown error'}`, 'error');
        setIsProcessing(false);
      }
    } catch (error: any) {
      console.error("Order Creation Error:", error);
      showToast(error.message || "Failed to initiate order. Please try again.", 'error');
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
          <p className="font-satoshi text-2xl text-primary italic">You're on your way to a healthier morning! 🚀</p>
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
          Back to Products
        </button>
        <div className="flex items-center gap-2 font-extrabold text-primary">
          <span className="material-symbols-outlined">lock</span>
          SECURE CHECKOUT
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Checkout Form */}
        <form id="checkout-form" onSubmit={handleSubmit} className="lg:col-span-7 space-y-10 w-full">
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm flex-shrink-0">1</span>
              <h3 className="text-xl sm:text-2xl font-normal uppercase tracking-wide [word-spacing:0.05em] relative top-[4px] leading-none">Contact Information</h3>
            </div>
            <div className="grid gap-4">
              <input
                required
                type="email"
                name="email"
                placeholder="Email Address *"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-primary outline-none font-semibold transition-all invalid:border-red-300"
              />
              <input
                required
                type="tel"
                name="phone"
                placeholder="Phone Number *"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-primary outline-none font-semibold transition-all invalid:border-red-300"
              />
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 items-start">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm flex-shrink-0">2</span>
                <h3 className="text-xl sm:text-2xl font-normal uppercase tracking-wide [word-spacing:0.05em] relative top-[4px] leading-none">Shipping Address</h3>
              </div>
              {savedAddress && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!useSavedAddress}
                    onChange={toggleAddressMode}
                    className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Change Address</span>
                </label>
              )}
            </div>

            {useSavedAddress && savedAddress ? (
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800">{formData.firstName} {formData.lastName}</p>
                <p className="text-slate-600 mt-1">{formData.address}</p>
                <p className="text-slate-600">{formData.city}, {formData.state} {formData.zip}</p>
                <p className="text-slate-600 mt-1">{formData.phone}</p>
              </div>
            ) : (
              <div className="grid gap-4 animate-in fade-in slide-in-from-top-2">
                <div className="grid md:grid-cols-2 gap-4">
                  <input required type="text" name="firstName" placeholder="First Name *" value={formData.firstName} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-primary outline-none font-semibold transition-all invalid:border-red-300" />
                  <input required type="text" name="lastName" placeholder="Last Name *" value={formData.lastName} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-primary outline-none font-semibold transition-all invalid:border-red-300" />
                </div>
                <input required type="text" name="address" placeholder="Address line 1 *" value={formData.address} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-primary outline-none font-semibold transition-all invalid:border-red-300" />
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <input required type="text" name="city" placeholder="City *" value={formData.city} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-primary outline-none font-semibold transition-all invalid:border-red-300" />
                  <input required type="text" name="state" placeholder="State *" value={formData.state} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-primary outline-none font-semibold transition-all invalid:border-red-300" />
                  <input required type="text" name="zip" placeholder="ZIP Code *" value={formData.zip} onChange={handleInputChange} className="col-span-2 lg:col-span-1 w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-primary outline-none font-semibold transition-all invalid:border-red-300" />
                </div>
              </div>
            )}
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm flex-shrink-0">3</span>
              <h3 className="text-xl sm:text-2xl font-normal uppercase tracking-wide [word-spacing:0.05em] relative top-[4px] leading-none">Payment Method</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-[#0b3d2e] bg-[#0b3d2e]/5' : 'border-slate-100 hover:border-slate-200'}`}>
                <input type="radio" name="paymentMethod" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="w-4 h-4 text-[#0b3d2e] focus:ring-[#0b3d2e] accent-[#0b3d2e]" />
                <div className="flex flex-col">
                  <span className="font-black uppercase text-slate-900">Pay Online</span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">UPI, Cards</span>
                </div>
              </label>
              <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[#0b3d2e] bg-[#0b3d2e]/5' : 'border-slate-100 hover:border-slate-200'}`}>
                <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-4 h-4 text-[#0b3d2e] focus:ring-[#0b3d2e] accent-[#0b3d2e]" />
                <div className="flex flex-col">
                  <span className="font-black uppercase text-slate-900">Cash on Delivery</span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pay when you receive</span>
                </div>
              </label>
              <div className="relative cursor-pointer rounded-2xl h-full shadow-sm">
                <BorderGlow
                  borderRadius={16}
                  glowRadius={80}
                  colors={['#c084fc', '#f472b6', '#38bdf8']}
                  backgroundColor={paymentMethod === 'special_cod' ? '#faf5ff' : '#ffffff'}
                  className={paymentMethod === 'special_cod' ? 'ring-2 ring-purple-600' : 'ring-2 ring-slate-100 hover:ring-slate-200'}
                >
                  <label className="flex items-center gap-3 p-4 rounded-2xl w-full h-full cursor-pointer transition-all">
                    <input type="radio" name="paymentMethod" value="special_cod" checked={paymentMethod === 'special_cod'} onChange={() => setPaymentMethod('special_cod')} className="w-4 h-4 text-purple-600 focus:ring-purple-600 accent-purple-600" />
                    <div className="flex flex-col">
                      <span className="font-black uppercase text-purple-900">Special COD</span>
                      <span className="text-[9px] sm:text-[10px] font-bold text-purple-600 uppercase tracking-widest">+₹5000 Premium</span>
                    </div>
                  </label>
                </BorderGlow>
              </div>
            </div>
          </section>

        </form >

        {/* Order Summary */}
        <div className="lg:col-span-5 bg-white sm:bg-slate-50 p-6 sm:p-8 rounded-3xl space-y-8 lg:sticky lg:top-8 w-full border border-slate-100 sm:border-none shadow-sm sm:shadow-none">
          <h3 className="text-xl font-normal uppercase tracking-wide [word-spacing:0.05em] relative top-[4px] leading-none">Order Summary</h3>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {items.map(item => (
              <div key={item.id} className="flex gap-6 items-center">
                <div className="w-24 h-24 bg-white rounded-2xl overflow-hidden shadow-sm flex-shrink-0 border border-slate-100 p-2">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 flex flex-col">
                  <h4 className="font-black text-slate-900 text-lg leading-tight mb-1 tracking-tight">{item.name}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                      Qty: {item.quantity}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-black text-slate-900 text-base">₹{item.price * item.quantity}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-slate-400 line-through text-xs font-bold">₹{item.originalPrice * item.quantity}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-slate-200 border-dashed pt-6 space-y-3">
            <div className="flex justify-between text-slate-500 font-medium text-sm">
              <span>MRP Total</span>
              <span>₹{mrpTotal.toFixed(2)}</span>
            </div>
            {mrpDiscount > 0 && (
              <div className="flex justify-between text-green-600 font-bold text-sm">
                <span>Discount on MRP</span>
                <span>- ₹{mrpDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500 font-medium text-sm border-t border-slate-100 pt-2">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500 font-medium text-sm">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
            </div>

            {paymentMethod === 'special_cod' && (
              <div className="flex justify-between text-purple-600 font-bold text-sm">
                <span>Special COD Fee</span>
                <span>₹5000.00</span>
              </div>
            )}

            {potentialDiscount > 0 && (
              <div className="flex justify-between text-green-600 font-bold text-sm">
                <span>Loyalty Discount ({maxRedeemablePoints} Pts)</span>
                <span>- ₹{potentialDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-900 font-black text-xl pt-4 border-t border-slate-200">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {userPoints > 0 && (
            <div className={`p-6 rounded-2xl border-2 transition-all ${usePoints ? 'bg-primary/5 border-primary/20' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined">workspace_premium</span>
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Redeem Points</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{userPoints} Available</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={togglePoints}
                  className={`w-12 h-6 rounded-full transition-all relative ${usePoints ? 'bg-primary' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${usePoints ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
              {usePoints && (
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-3 animate-in fade-in slide-in-from-top-1">
                  You are saving ₹{potentialDiscount.toFixed(2)} with your Pinopoints!
                </p>
              )}
            </div>
          )}

          <button
            form="checkout-form"
            type="submit"
            disabled={isProcessing}
            className="group w-full bg-slate-900 text-white hover:text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-md hover:shadow-lg mt-8"
          >
            <span className="text-white group-hover:text-white">{isProcessing ? 'Processing...' : 'Complete Purchase'}</span>
            {!isProcessing && <span className="material-symbols-outlined text-white group-hover:text-white">arrow_forward</span>}
          </button>
        </div >
      </div >

      {/* Login Required Modal */}
      {
        showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 relative">
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
              <div className="text-center space-y-4 pt-2">
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                  <span className="material-symbols-outlined text-3xl">lock</span>
                </div>
                <h3 className="text-xl font-black uppercase text-slate-900 tracking-tight">Login Required</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed px-2">
                  Please login to your account to complete your purchase securely and track your order.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button
                    onClick={() => setShowLoginModal(false)}
                    className="py-3 px-4 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { setShowLoginModal(false); onLoginRequired(); }}
                    className="py-3 px-4 rounded-xl font-black uppercase tracking-wider bg-primary text-white hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 text-xs flex items-center justify-center gap-2"
                  >
                    Login Now <span className="material-symbols-outlined text-sm">login</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default CheckoutPage;
