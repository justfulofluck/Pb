import React, { useState, useEffect } from 'react';
import { Order, RewardRule } from '../types';
import { API_BASE_URL } from '../config';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardProps {
  onLogout: () => void;
  onHomeClick: () => void;
}

type TabType = 'overview' | 'orders' | 'rewards' | 'profile';

const Dashboard: React.FC<DashboardProps> = ({ onLogout, onHomeClick }) => {
  const { user: authUser, checkAuth } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [rewardTransactions, setRewardTransactions] = useState<any[]>([]);
  const [rewardRules, setRewardRules] = useState<RewardRule[]>([]);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pin_code: '',
    birthDate: ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (authUser) {
      setProfileForm({
        firstName: authUser.first_name || '',
        lastName: authUser.last_name || '',
        phone: authUser.profile?.phone || '',
        address: authUser.profile?.address || '',
        city: authUser.profile?.city || '',
        state: authUser.profile?.state || '',
        pin_code: authUser.profile?.pin_code || '',
        birthDate: authUser.profile?.birth_date || ''
      });
    }
  }, [authUser]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        const response = await fetch(`${API_BASE_URL}/api/orders/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setOrders(data.sort((a: Order, b: Order) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
          } else {
            console.error("Orders data is not an array:", data);
            setOrders([]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    const fetchRewardTransactions = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        const res = await fetch(`${API_BASE_URL}/api/reward-transactions/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setRewardTransactions(data);
          } else {
            console.error("Reward transactions data is not an array:", data);
            setRewardTransactions([]);
          }
        }
      } catch (err) { }
    };

    const fetchRewardRules = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/reward-rules/`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setRewardRules(data.filter((r: RewardRule) => r.is_enabled));
          }
        }
      } catch (err) { }
    };

    if (authUser) {
      fetchOrders();
      fetchRewardTransactions();
      fetchRewardRules();
    }
  }, [authUser]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMsg({ type: '', text: '' });

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/api/users/update_profile/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name: profileForm.firstName,
          last_name: profileForm.lastName,
          phone: profileForm.phone,
          address: profileForm.address,
          city: profileForm.city,
          state: profileForm.state,
          pin_code: profileForm.pin_code,
          birth_date: profileForm.birthDate || null
        })
      });

      if (response.ok) {
        setProfileMsg({ type: 'success', text: 'Profile updated successfully! ✨' });
        await checkAuth(); // Refresh user data
      } else {
        setProfileMsg({ type: 'error', text: 'Failed to update profile. Please try again.' });
      }
    } catch (err) {
      setProfileMsg({ type: 'error', text: 'Something went wrong.' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  if (!authUser) return null; // Or show login required view

  const userData = {
    name: authUser.first_name ? `${authUser.first_name} ${authUser.last_name}` : authUser.username,
    email: authUser.email,
    points: authUser.profile?.points || 0,
    tier: authUser.profile?.tier || "Member",
    savings: authUser.profile?.savings || 0,
    totalSpent: Number((Array.isArray(orders) ? orders : []).reduce((acc, o) => acc + Number(o.total_amount || 0), 0) || 0).toFixed(2)
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'orders', label: 'My Orders', icon: 'shopping_bag' },
    { id: 'rewards', label: 'Rewards & Tiers', icon: 'workspace_premium' },
    { id: 'profile', label: 'Edit Profile', icon: 'person_edit' },
  ];

  // Hero banner now uses the global chalkboard texture for better contrast

  return (
    <div className="min-h-screen bg-whiteboard texture-overlay texture-speckles relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">


        <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
          {/* Sidebar */}
          <aside className="bg-white doodle-border p-4 lg:p-6 flex flex-col lg:block gap-4 lg:space-y-8 sticky top-4 lg:top-8 shadow-sm z-20 overflow-hidden">
            {/* User Profile - desktop only */}
            <div className="hidden lg:flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-black text-xl">
                {(userData.name || ' ')[0]}
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-sm uppercase truncate leading-tight">{userData.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{userData.tier}</p>
              </div>
            </div>

            <nav className="flex overflow-x-auto hide-scrollbar lg:flex-col lg:space-y-1 gap-2 pb-2 lg:pb-0">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`flex-shrink-0 flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-5 py-3 rounded-xl font-bold text-[10px] lg:text-xs uppercase tracking-widest transition-all ${activeTab === item.id
                    ? 'bg-slate-900 text-white shadow-lg lg:scale-[1.02]'
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600 border border-slate-100 lg:border-transparent'
                    }`}
                >
                  <span className="material-symbols-outlined text-sm lg:text-sm">{item.icon}</span>
                  {item.label}
                </button>
              ))}

              {/* Sign out inline for mobile */}
              <button
                onClick={onLogout}
                className="lg:hidden flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all border border-red-100"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                Sign Out
              </button>
            </nav>

            {/* Sign out for desktop */}
            <button
              onClick={onLogout}
              className="hidden lg:flex w-full items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all mt-12 lg:mt-12"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Sign Out
            </button>
          </aside>

          {/* Main Content */}
          <main className="min-h-[600px]">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Hero Banner */}
                  <div className="p-8 rounded-[40px] bg-slate-900 texture-chalkboard-strong text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 space-y-4">
                      <span className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {userData.tier} Status
                      </span>
                      <h2 className="text-4xl md:text-5xl font-anton uppercase tracking-normal leading-none" style={{ letterSpacing: '0.05em' }}>
                        Welcome back,<br /> {authUser.first_name || authUser.username}
                      </h2>
                      <p className="font-satoshi text-2xl text-white/70">Fueling your ambition since {new Date(authUser.date_joined || Date.now()).getFullYear()} ✨</p>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -left-12 -top-12 w-48 h-48 bg-primary/20 rounded-full blur-2xl" />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'PinoPoints', val: userData.points, icon: 'workspace_premium', color: 'text-orange-500' },
                      { label: 'Total Orders', val: orders.length, icon: 'shopping_bag', color: 'text-primary' },
                      { label: 'Total Savings', val: `₹${userData.savings}`, icon: 'savings', color: 'text-green-500' },
                      { label: 'Total Spent', val: `₹${userData.totalSpent}`, icon: 'wallet', color: 'text-slate-900' }
                    ].map((stat, i) => (
                      <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                        <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
                        <div className="mt-4">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                          <p className="text-2xl font-black text-slate-900">{stat.val}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Point Activity */}
                    <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
                      <h3 className="text-xl font-black uppercase tracking-tight mb-6 flex justify-between items-center">
                        Point Activity
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Recent 10</span>
                      </h3>
                      <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scroll pr-2">
                        {rewardTransactions.length > 0 ? rewardTransactions.slice(0, 10).map((tx: any) => (
                          <div key={tx.id} className="flex items-center justify-between py-4 border-b border-dashed border-slate-100 last:border-0">
                            <div>
                              <p className="text-sm font-bold text-slate-900">{tx.reason}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(tx.timestamp).toLocaleDateString()}</p>
                            </div>
                            <div className={`font-black text-lg ${tx.points_change > 0 ? 'text-green-600' : 'text-red-500'}`}>
                              {tx.points_change > 0 ? '+' : ''}{tx.points_change}
                            </div>
                          </div>
                        )) : (
                          <div className="text-center py-12 text-slate-300">
                            <span className="material-symbols-outlined text-4xl block mb-2">history</span>
                            <p className="text-xs font-bold uppercase tracking-widest">No transactions yet</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recent Orders Overview */}
                    <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
                      <h3 className="text-xl font-black uppercase tracking-tight mb-6 flex justify-between items-center">
                        Last Order
                        <button onClick={() => setActiveTab('orders')} className="text-[10px] text-primary font-black uppercase tracking-widest hover:underline">View All</button>
                      </h3>
                      {orders.length > 0 ? (
                        <div
                          onClick={() => setSelectedOrder(orders[0])}
                          className="p-6 bg-slate-50 rounded-3xl border-2 border-transparent hover:border-primary/20 cursor-pointer transition-all group"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order #{orders[0].id}</p>
                              <p className="font-black text-lg text-slate-900 tracking-tighter">₹{orders[0].total_amount}</p>
                            </div>
                            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                              {orders[0].status}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {orders[0].items.slice(0, 3).map((item, i) => (
                              <div key={i} className="w-12 h-12 bg-white rounded-xl overflow-hidden shadow-sm">
                                <img src={item.product_image?.startsWith('http') ? item.product_image : `${API_BASE_URL}${item.product_image}`} className="w-full h-full object-cover" />
                              </div>
                            ))}
                            {orders[0].items.length > 3 && (
                              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[10px] font-black text-slate-400">
                                +{orders[0].items.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-slate-300">
                          <span className="material-symbols-outlined text-4xl block mb-2">shopping_basket</span>
                          <p className="text-xs font-bold uppercase tracking-widest">No orders yet</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Frequently Ordered / Purchased Products */}
                  {orders.length > 0 && (
                    <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
                      <h3 className="text-xl font-black uppercase tracking-tight mb-8">Your Health Collection</h3>
                      <div className="flex gap-6 overflow-x-auto pb-4 custom-scroll">
                        {Array.from(new Set((orders || []).flatMap(o => o.items || []).map(item => JSON.stringify({ id: item.product, name: item.product_name, img: item.product_image }))))
                          .map((pStr: any) => {
                            try { return JSON.parse(pStr); } catch { return null; }
                          })
                          .filter(Boolean)
                          .map((product: any, i) => (
                            <div key={i} className="flex-shrink-0 w-40 space-y-3 group cursor-pointer" onClick={() => setActiveTab('orders')}>
                              <div className="aspect-square bg-slate-50 rounded-3xl overflow-hidden border-2 border-transparent group-hover:border-primary/20 transition-all p-4">
                                <img src={product.img?.startsWith('http') ? product.img : `${API_BASE_URL}${product.img}`} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                              </div>
                              <p className="text-[10px] font-black uppercase text-center leading-tight truncate px-1">{product.name}</p>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                    <h2 className="text-3xl font-black uppercase tracking-tighter">My Order History</h2>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{orders.length} total orders</span>
                  </div>

                  {isLoadingOrders ? (
                    <div className="text-center py-24">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Fetching your history...</p>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer group flex flex-col md:flex-row gap-6 items-center"
                        >
                          <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-4xl">package_2</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-black text-lg uppercase tracking-tight">Order #{order.id}</h3>
                              <div className="flex -space-x-3">
                                {order.items.slice(0, 4).map((item, i) => (
                                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-white overflow-hidden shadow-sm">
                                    <img src={item.product_image?.startsWith('http') ? item.product_image : `${API_BASE_URL}${item.product_image}`} className="w-full h-full object-cover" />
                                  </div>
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                              {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-black text-slate-900 tracking-tighter">₹{order.total_amount}</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mt-1 ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-accent-brown'
                              }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white p-24 rounded-[40px] text-center border-2 border-dashed border-slate-100 flex flex-col items-center">
                      <span className="material-symbols-outlined text-8xl text-slate-200 mb-6 block leading-none">shopping_cart_off</span>
                      <h3 className="text-2xl font-black text-slate-400 uppercase tracking-tight">No orders yet!</h3>
                      <p className="text-slate-400 mt-2 mb-8 uppercase tracking-widest font-bold text-xs">Start your health journey today</p>
                      <button onClick={onHomeClick} className="bg-primary text-white px-8 py-3 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform">Shop Now</button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-[40px] p-8 md:p-12 border border-slate-100 shadow-xl"
                >
                  <div className="mb-12 border-b border-slate-100 pb-8">
                    <h2 className="text-4xl font-black uppercase tracking-tighter">Profile Settings</h2>
                    <p className="font-satoshi text-2xl text-slate-400 mt-2">Personalize your Pinobite experience</p>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-12">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          Personal Details
                        </h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                              <input
                                type="text"
                                value={profileForm.firstName}
                                onChange={e => setProfileForm(p => ({ ...p, firstName: e.target.value }))}
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none font-bold transition-all"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                              <input
                                type="text"
                                value={profileForm.lastName}
                                onChange={e => setProfileForm(p => ({ ...p, lastName: e.target.value }))}
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none font-bold transition-all"
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                            <input
                              type="tel"
                              value={profileForm.phone}
                              onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                              className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none font-bold transition-all"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Birth Date</label>
                            <input
                              type="date"
                              value={profileForm.birthDate}
                              onChange={e => setProfileForm(p => ({ ...p, birthDate: e.target.value }))}
                              className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none font-bold transition-all text-slate-500"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 opacity-50">Email (Cannot be changed)</label>
                            <input
                              type="email"
                              value={userData.email}
                              disabled
                              className="w-full px-5 py-4 bg-slate-100 border-2 border-transparent rounded-2xl cursor-not-allowed font-bold text-slate-400"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          Shipping Defaults
                        </h3>
                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Street Address</label>
                            <input
                              type="text"
                              value={profileForm.address}
                              onChange={e => setProfileForm(p => ({ ...p, address: e.target.value }))}
                              className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none font-bold transition-all"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                              <input
                                type="text"
                                value={profileForm.city}
                                onChange={e => setProfileForm(p => ({ ...p, city: e.target.value }))}
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none font-bold transition-all"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ZIP Code</label>
                              <input
                                type="text"
                                value={profileForm.pin_code}
                                onChange={e => setProfileForm(p => ({ ...p, pin_code: e.target.value }))}
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none font-bold transition-all"
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">State</label>
                            <input
                              type="text"
                              value={profileForm.state}
                              onChange={e => setProfileForm(p => ({ ...p, state: e.target.value }))}
                              className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none font-bold transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-6 pt-6 border-t border-slate-100">
                      {profileMsg.text && (
                        <p className={`text-xs font-black uppercase tracking-widest ${profileMsg.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                          {profileMsg.text}
                        </p>
                      )}
                      <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-primary hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50"
                      >
                        {isSavingProfile ? 'Saving Changes...' : 'Save Profile'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === 'rewards' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-sm overflow-hidden relative">
                    <div className="relative z-10 max-w-xl">
                      <h2 className="text-4xl font-black uppercase tracking-tighter">Pinopoints Loyalty</h2>
                      <p className="font-satoshi text-2xl text-primary mt-2">The more you fuel, the more you save!</p>

                      <div className="mt-12 space-y-8">
                        <div className="space-y-2">
                          <div className="flex justify-between items-end">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Balance: <span className="text-slate-900">{userData.points} Pts</span></p>
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">Next: Legend Tier</p>
                          </div>
                          <div className="h-6 bg-slate-100 rounded-full border-4 border-white shadow-inner p-1">
                            <div className={`h-full bg-primary rounded-full transition-all duration-1000`} style={{ width: `${Math.min((userData.points / 3000) * 100, 100)}%` }} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-orange-50 rounded-3xl border border-orange-100">
                            <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1">Conversion Rate</p>
                            <p className="text-xl font-black text-orange-900">10 Pts = ₹1</p>
                          </div>
                          <div className="p-4 bg-primary/5 rounded-3xl border border-primary/10">
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Reward Multiplier</p>
                            <p className="text-xl font-black text-slate-900">1x Base</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className="absolute -right-20 -bottom-20 material-symbols-outlined text-[300px] text-primary/5 select-none -rotate-12">loyalty</span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                      <h3 className="text-xl font-black uppercase tracking-tight mb-8">How to earn</h3>
                      <div className="space-y-4">
                        {rewardRules.length > 0 ? rewardRules.map((rule, i) => (
                          <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl group hover:bg-primary/5 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                              <span className="material-symbols-outlined text-sm">
                                {rule.event_name === 'purchase' ? 'shopping_cart' :
                                  rule.event_name === 'signup' ? 'person_add' :
                                    rule.event_name === 'review' ? 'rate_review' : 'stars'}
                              </span>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-black uppercase">{rule.event_name.replace('_', ' ')}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-tight">{rule.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-primary">+{rule.points}</p>
                              <p className="text-[8px] font-bold text-slate-300 uppercase">Points</p>
                            </div>
                          </div>
                        )) : (
                          <div className="text-center py-8 opacity-20">
                            <p className="text-xs font-bold uppercase">No rules configured</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                      <h3 className="text-xl font-black uppercase tracking-tight mb-8">Tier Benefits</h3>
                      <div className="space-y-4">
                        {[
                          { name: 'Starter', range: '0 - 500', benefits: 'Base rewards only' },
                          { name: 'Pro Member', range: '500 - 1000', benefits: '5% extra points on orders' },
                          { name: 'Pro Elite', range: '1000 - 3000', benefits: 'Early access + 10% extra points' },
                          { name: 'Legend', range: '3000+', benefits: 'Free shipping + Birthday gifts' },
                        ].map((t, i) => (
                          <div key={i} className={`p-4 rounded-2xl border-2 transition-all ${userData.tier === t.name ? 'border-primary bg-primary/5' : 'border-slate-50 bg-white opacity-60'}`}>
                            <div className="flex justify-between items-center mb-1">
                              <p className="font-black text-sm uppercase">{t.name}</p>
                              <p className="text-[10px] font-bold uppercase tracking-widest">{t.range} Pts</p>
                            </div>
                            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">{t.benefits}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* REDEMPTION SECTION */}
                  <div className="bg-slate-900 p-8 md:p-12 rounded-[40px] text-white overflow-hidden relative shadow-2xl">
                    <div className="relative z-10">
                      <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Redeem your Pinopoints</h3>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-8">Convert your hard-earned points into instant discounts</p>

                      <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-6">
                          <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Redeemable Value</p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-5xl font-black tracking-tighter">₹{(Number(userData.points || 0) / 10).toFixed(2)}</span>
                              <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">OFF your next order</span>
                            </div>
                          </div>
                          <p className="text-sm text-slate-400 flex items-start gap-2">
                            <span className="material-symbols-outlined text-primary text-sm mt-0.5">info</span>
                            <span>Points can be redeemed directly on the checkout page for an instant discount on your total. No coupon codes required!</span>
                          </p>
                        </div>
                        <div className="w-full md:w-auto">
                          <button
                            onClick={onHomeClick}
                            className="w-full bg-white text-slate-900 px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl hover:scale-105"
                          >
                            Start Shopping
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Abstract Background bits */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[120px] rounded-full" />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Order Details Modal (Existing but updated with product list) */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setSelectedOrder(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[48px] overflow-hidden relative doodle-border shadow-2xl p-8 md:p-12 max-h-[90vh] overflow-y-auto z-10"
            >
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-8 right-8 z-10 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="space-y-8">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Order #{selectedOrder.id}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-secondary text-slate-900'
                      }`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight leading-none">Order Details</h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Placed on {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-tight">Total Amount</p>
                    <p className="text-2xl font-black text-slate-900">₹{selectedOrder.total_amount}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-tight">Total Items</p>
                    <p className="text-2xl font-black text-slate-900">{selectedOrder.items.length}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 col-span-2 md:col-span-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-tight">Delivery Point</p>
                    <p className="text-sm font-black text-slate-900 truncate">{selectedOrder.city || 'Standard Delivery'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">shopping_bag</span>
                    Purchased Products
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 p-5 bg-white border-2 border-slate-50 rounded-3xl items-center hover:border-primary/20 transition-colors group/item">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm group-hover/item:scale-105 transition-transform">
                          {item.product_image ? (
                            <img
                              src={item.product_image.startsWith('http') ? item.product_image : `${API_BASE_URL}${item.product_image}`}
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-200">
                              <span className="material-symbols-outlined text-4xl">image</span>
                            </div>
                          )}
                        </div>
                        <div className="overflow-hidden min-w-0">
                          <h4 className="font-black text-xs md:text-sm uppercase leading-tight truncate">{item.product_name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full">QTY: {item.quantity}</span>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">₹{item.price}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-dashed border-slate-100 flex flex-col items-center">
                  <p className="text-center text-slate-400 font-satoshi text-2xl">
                    Fueling your ambition, one bite at a time! 🚀
                  </p>
                  <button onClick={() => setSelectedOrder(null)} className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-slate-900 transition-colors">Close Details</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
