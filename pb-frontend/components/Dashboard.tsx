import React, { useState, useEffect } from 'react';
import { Order, RewardRule } from '../types';
import { API_BASE_URL } from '../config';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './Toast';

interface DashboardProps {
  onLogout: () => void;
  onHomeClick: () => void;
  onAddToCart?: (product: any) => void;
  onProductClick?: (product: any) => void;
}

type TabType = 'overview' | 'orders' | 'rewards' | 'profile' | 'wishlist';

const Dashboard: React.FC<DashboardProps> = ({ onLogout, onHomeClick, onAddToCart, onProductClick }) => {
  const { user: authUser, checkAuth } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [ordersCurrentPage, setOrdersCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [rewardTransactions, setRewardTransactions] = useState<any[]>([]);
  const [rewardRules, setRewardRules] = useState<RewardRule[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(true);

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
          }
        }
      } catch (err) {
        console.error('Failed to fetch reward transactions:', err);
      }
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
      } catch (err) {
        console.error('Failed to fetch reward rules:', err);
      }
    };

    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        const res = await fetch(`${API_BASE_URL}/api/wishlist/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setWishlistItems(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch wishlist", err);
      } finally {
        setIsLoadingWishlist(false);
      }
    };

    if (authUser) {
      fetchOrders();
      fetchRewardTransactions();
      fetchRewardRules();
      fetchWishlist();
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
    { id: 'wishlist', label: 'Wishlist', icon: 'favorite' },
    { id: 'rewards', label: 'Rewards & Tiers', icon: 'workspace_premium' },
    { id: 'profile', label: 'Edit Profile', icon: 'person_edit' },
  ];

  // Hero banner now uses the global chalkboard texture for better contrast

  return (
    <div className="customer-dashboard min-h-screen bg-[#f2f2ec] relative overflow-x-hidden pb-24 lg:pb-0">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6 sm:py-8 relative z-10">

        <div className="lg:grid lg:grid-cols-[280px_1fr] gap-8 items-start">
          {/* Desktop Sidebar - hidden on mobile */}
          <aside className="hidden lg:block bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-8 space-y-6">
            <div className="flex items-center pb-6 border-b border-slate-100">
              <div className="w-12 h-12 bg-[#0b3d2e] text-white rounded-full flex items-center justify-center font-black text-lg shadow-md -ml-6 flex-shrink-0 z-10 relative">
                {(userData.name || ' ')[0]}
              </div>
              <div className="min-w-0 pl-4">
                <h3 className="font-black text-lg uppercase truncate leading-tight text-slate-900">{userData.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{userData.tier}</p>
              </div>
            </div>

            <nav className="space-y-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center gap-3 py-4 font-bold text-xs uppercase tracking-widest transition-all ${activeTab === item.id
                    ? 'bg-[#0b3d2e] !text-white shadow-lg rounded-r-full -ml-6 pl-10 -mr-8 pr-8 relative z-10'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 px-4 rounded-xl'
                    }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold text-xs uppercase tracking-widest text-red-400 hover:text-red-600 hover:bg-red-50 transition-all mt-4 border-t border-slate-100 pt-6"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Sign Out
            </button>
          </aside>

          {/* Main Content */}
          <main className="min-h-[400px] lg:min-h-[600px] w-full min-w-0 space-y-4 sm:space-y-6">
            {/* Mobile Top Tabs */}
            <div className="lg:hidden flex overflow-x-auto hide-scrollbar gap-2 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`flex-shrink-0 flex items-center gap-2 py-2.5 px-4 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all border ${
                    activeTab === item.id
                      ? 'bg-[#0b3d2e] text-white border-[#0b3d2e] shadow-md'
                      : 'bg-white text-slate-500 border-slate-200 shadow-sm'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                  {item.label}
                </button>
              ))}
              <button
                onClick={onLogout}
                className="flex-shrink-0 flex items-center gap-2 py-2.5 px-4 rounded-full font-bold text-[10px] uppercase tracking-widest bg-red-50 text-red-500 border border-red-100 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Logout
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Compact Hero Card */}
                  <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0b3d2e] to-[#145a3e] p-5 sm:p-7 text-white shadow-xl">
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                          {userData.tier}
                        </span>
                        <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">since {new Date(authUser.date_joined || Date.now()).getFullYear()}</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-anton uppercase tracking-wide leading-tight mb-1">
                        Welcome back, {authUser.first_name || authUser.username}
                      </h2>
                      <p className="text-sm text-white/60 font-medium">Your health journey at a glance</p>
                    </div>
                    <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3">
                    {[
                      { label: 'PinoPoints', val: userData.points, icon: 'workspace_premium', bg: 'bg-amber-50', iconColor: 'text-amber-500' },
                      { label: 'Orders', val: orders.length, icon: 'shopping_bag', bg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
                      { label: 'Savings', val: `₹${userData.savings}`, icon: 'savings', bg: 'bg-sky-50', iconColor: 'text-sky-500' },
                      { label: 'Spent', val: `₹${userData.totalSpent}`, icon: 'wallet', bg: 'bg-violet-50', iconColor: 'text-violet-500' }
                    ].map((stat, i) => (
                      <div key={i} className={`flex-1 min-w-0 ${stat.bg} rounded-2xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 border border-white`}>
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white flex items-center justify-center ${stat.iconColor} shadow-sm flex-shrink-0`}>
                          <span className="material-symbols-outlined text-[16px] sm:text-[18px]">{stat.icon}</span>
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">{stat.label}</p>
                          <p className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight truncate">{stat.val}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Point Activity */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base font-black uppercase tracking-tight text-slate-900">Points</h3>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Recent</span>
                      </div>
                      <div className="space-y-0 divide-y divide-slate-50">
                        {rewardTransactions.length > 0 ? rewardTransactions.slice(0, 5).map((tx: any) => (
                          <div key={tx.id} className="flex items-center justify-between py-3">
                            <div className="min-w-0 mr-3">
                              <p className="text-xs font-bold text-slate-700 truncate">{tx.reason}</p>
                              <p className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">{new Date(tx.timestamp).toLocaleDateString()}</p>
                            </div>
                            <span className={`text-sm font-black flex-shrink-0 ${tx.points_change > 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                              {tx.points_change > 0 ? '+' : ''}{tx.points_change}
                            </span>
                          </div>
                        )) : (
                          <div className="text-center py-8 text-slate-300">
                            <span className="material-symbols-outlined text-3xl block mb-1">history</span>
                            <p className="text-[10px] font-bold uppercase tracking-widest">No activity</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Last Order */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base font-black uppercase tracking-tight text-slate-900">Last Order</h3>
                        <button onClick={() => setActiveTab('orders')} className="text-[9px] text-[#0b3d2e] font-black uppercase tracking-widest hover:underline">All →</button>
                      </div>
                      {orders.length > 0 ? (
                        <div
                          onClick={() => setSelectedOrder(orders[0])}
                          className="p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">#{orders[0].id}</p>
                              <p className="text-lg font-black text-slate-900">₹{orders[0].total_amount}</p>
                            </div>
                            <span className="bg-emerald-100 text-emerald-600 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase">
                              {orders[0].status}
                            </span>
                          </div>
                          <div className="flex gap-1.5">
                            {orders[0].items.slice(0, 4).map((item, i) => (
                              <div key={i} className="w-10 h-10 bg-white rounded-lg overflow-hidden shadow-sm border border-slate-100">
                                <img src={item.product_image?.startsWith('http') ? item.product_image : `${API_BASE_URL}${item.product_image}`} className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-slate-300">
                          <span className="material-symbols-outlined text-3xl block mb-1">shopping_basket</span>
                          <p className="text-[10px] font-bold uppercase tracking-widest">No orders yet</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Frequently Ordered / Purchased Products */}
                  {orders.length > 0 && (
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                      <h3 className="text-base font-black uppercase tracking-tight mb-4 text-slate-900">Your Collection</h3>
                      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 hide-scrollbar">
                        {Array.from(new Set((orders || []).flatMap(o => o.items || []).map(item => JSON.stringify({ id: item.product, name: item.product_name, img: item.product_image }))))
                          .map((pStr: any) => {
                            try { return JSON.parse(pStr); } catch { return null; }
                          })
                          .filter(Boolean)
                          .map((product: any, i) => (
                            <div key={i} className="flex-shrink-0 w-28 sm:w-32 md:w-40 space-y-2 sm:space-y-3 group cursor-pointer" onClick={() => setActiveTab('orders')}>
                              <div className="aspect-square bg-slate-50 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-transparent group-hover:border-primary/20 transition-all p-2 sm:p-4">
                                <img src={product.img?.startsWith('http') ? product.img : `${API_BASE_URL}${product.img}`} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                              </div>
                              <p className="text-[8px] sm:text-[10px] font-black uppercase text-center leading-tight truncate px-1">{product.name}</p>
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
                  <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">Orders</h2>
                    <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">{orders.length}</span>
                  </div>

                  {isLoadingOrders ? (
                    <div className="text-center py-24">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Fetching your history...</p>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.slice((ordersCurrentPage - 1) * 7, ordersCurrentPage * 7).map(order => (
                        <div
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer group flex items-center gap-4"
                        >
                          <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-4xl">package_2</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-black text-lg uppercase tracking-tight text-[#008a45]">Order #{order.id}</h3>
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
                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mt-1 ${
                              order.status === 'DELIVERED' ? 'bg-green-100 text-green-600' :
                              order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-600' :
                              order.status === 'PAID' ? 'bg-emerald-100 text-emerald-600' :
                              order.status === 'CANCELLED' ? 'bg-red-100 text-red-500' :
                              'bg-orange-100 text-accent-brown'
                            }`}>
                              {order.status === 'PAID' ? 'Processing' : order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                      
                      {/* Pagination Controls */}
                      {orders.length > 7 && (
                        <div className="flex justify-center items-center gap-4 pt-6">
                          <button
                            onClick={() => setOrdersCurrentPage(p => Math.max(1, p - 1))}
                            disabled={ordersCurrentPage === 1}
                            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#0b3d2e] hover:border-[#0b3d2e] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
                          >
                            <span className="material-symbols-outlined text-lg">chevron_left</span>
                          </button>
                          <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                            Page {ordersCurrentPage} of {Math.ceil(orders.length / 7)}
                          </span>
                          <button
                            onClick={() => setOrdersCurrentPage(p => Math.min(Math.ceil(orders.length / 7), p + 1))}
                            disabled={ordersCurrentPage === Math.ceil(orders.length / 7)}
                            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#0b3d2e] hover:border-[#0b3d2e] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
                          >
                            <span className="material-symbols-outlined text-lg">chevron_right</span>
                          </button>
                        </div>
                      )}
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
                  className="bg-white rounded-2xl p-5 sm:p-8 border border-slate-100 shadow-sm"
                >
                  <div className="mb-8 pb-5 border-b border-slate-100">
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">Profile</h2>
                    <p className="text-sm text-slate-400 mt-1">Manage your personal information</p>
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
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none font-bold transition-all !text-[#008a45]"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                              <input
                                type="text"
                                value={profileForm.lastName}
                                onChange={e => setProfileForm(p => ({ ...p, lastName: e.target.value }))}
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none font-bold transition-all !text-[#008a45]"
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                            <input
                              type="tel"
                              value={profileForm.phone}
                              onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                              className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none font-bold transition-all !text-[#008a45]"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Birth Date</label>
                            <input
                              type="date"
                              value={profileForm.birthDate}
                              onChange={e => setProfileForm(p => ({ ...p, birthDate: e.target.value }))}
                              className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none font-bold transition-all !text-[#008a45]"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 opacity-50">Email (Cannot be changed)</label>
                            <input
                              type="email"
                              value={userData.email}
                              disabled
                              className="w-full px-5 py-4 bg-slate-100 border-2 border-transparent rounded-2xl cursor-not-allowed font-bold !text-[#008a45]/60"
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
                              className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none font-bold transition-all !text-[#008a45]"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                              <input
                                type="text"
                                value={profileForm.city}
                                onChange={e => setProfileForm(p => ({ ...p, city: e.target.value }))}
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none font-bold transition-all !text-[#008a45]"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ZIP Code</label>
                              <input
                                type="text"
                                value={profileForm.pin_code}
                                onChange={e => setProfileForm(p => ({ ...p, pin_code: e.target.value }))}
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none font-bold transition-all !text-[#008a45]"
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">State</label>
                            <input
                              type="text"
                              value={profileForm.state}
                              onChange={e => setProfileForm(p => ({ ...p, state: e.target.value }))}
                              className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none font-bold transition-all !text-[#008a45]"
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
                        className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-primary hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 !text-white"
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
                  <div className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative">
                    <div className="relative z-10 max-w-xl">
                      <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">Rewards</h2>
                      <p className="text-sm text-slate-400 mt-1">The more you fuel, the more you save!</p>

                      <div className="mt-6 sm:mt-8 space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between items-end">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Balance: <span className="text-slate-900">{userData.points} Pts</span></p>
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">Next: {userData.tier === "Legend Tier" ? "Max Tier" : userData.tier === "Pro Elite" ? "Legend Tier" : userData.tier === "Pro Member" ? "Pro Elite" : "Pro Member"}</p>
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

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                      <h3 className="text-base font-black uppercase tracking-tight mb-4 text-slate-900">How to earn</h3>
                      <div className="space-y-3">
                        {rewardRules.length > 0 ? rewardRules.map((rule, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl group hover:bg-emerald-50 transition-colors">
                            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-[#0b3d2e] shadow-sm flex-shrink-0">
                              <span className="material-symbols-outlined text-[16px]">
                                {rule.event_name === 'purchase' ? 'shopping_cart' :
                                  rule.event_name === 'signup' ? 'person_add' :
                                    rule.event_name === 'review' ? 'rate_review' : 'stars'}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-black uppercase text-slate-700 truncate">{rule.event_name.replace('_', ' ')}</p>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider truncate">{rule.description}</p>
                            </div>
                            <span className="font-black text-sm text-emerald-500 flex-shrink-0">+{rule.points}</span>
                          </div>
                        )) : (
                          <div className="text-center py-6 text-slate-300">
                            <p className="text-[10px] font-bold uppercase">No rules configured</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                      <h3 className="text-base font-black uppercase tracking-tight mb-4 text-slate-900">Tier Benefits</h3>
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <span className="material-symbols-outlined text-4xl text-slate-200 mb-3">lock</span>
                        <p className="text-sm font-black uppercase text-slate-400">Coming Soon</p>
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mt-1">Tier benefits launching soon</p>
                      </div>
                    </div>
                  </div>

                  {/* Redemption */}
                  <div className="bg-[#0b3d2e] p-5 sm:p-8 rounded-2xl text-white overflow-hidden relative">
                    <div className="relative z-10">
                      <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight mb-1">Redeem Points</h3>
                      <p className="text-white/50 font-bold uppercase tracking-wider text-[10px] mb-5">Convert points into instant discounts</p>

                      <div className="flex flex-col md:flex-row gap-5 items-start md:items-center">
                        <div className="flex-1 space-y-4">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Redeemable Value</p>
                            <div className="flex items-baseline gap-2 mt-1">
                              <span className="text-4xl sm:text-5xl font-black tracking-tighter">₹{(Number(userData.points || 0) / 10).toFixed(2)}</span>
                              <span className="text-white/60 font-bold uppercase tracking-widest text-[10px]">OFF next order</span>
                            </div>
                          </div>
                          <p className="text-[11px] sm:text-xs text-white/70 flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                            <span className="material-symbols-outlined text-emerald-400 text-sm">info</span>
                            <span>Points are redeemed directly on the checkout page for an instant discount. No codes required!</span>
                          </p>
                        </div>
                        <div className="w-full md:w-auto mt-2 md:mt-0">
                          <button
                            onClick={onHomeClick}
                            className="w-full bg-white text-[#0b3d2e] px-6 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl active:scale-95"
                          >
                            Shop Now
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Abstract Background bits */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full" />
                  </div>
                </motion.div>
              )}

              {activeTab === 'wishlist' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                      <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">Wishlist</h2>
                      {wishlistItems.length > 0 && (
                        <div className="flex w-full sm:w-auto gap-3">
                          <button
                            onClick={async () => {
                              try {
                                const token = localStorage.getItem('access_token');
                                const res = await fetch(`${API_BASE_URL}/api/wishlist/`, {
                                  headers: { 'Authorization': `Bearer ${token}` }
                                });
                                const items = await res.json();

                                // Add items to cart instead of creating orders
                                if (onAddToCart) {
                                  for (const item of items) {
                                    const product = {
                                      id: String(item.product),
                                      name: item.product_details?.name || '',
                                      price: parseFloat(item.product_details?.price) || 0,
                                      originalPrice: item.product_details?.original_price ? parseFloat(item.product_details.original_price) : undefined,
                                      image: item.product_details?.image || '',
                                      category: item.product_details?.category_name || '',
                                    };
                                    onAddToCart(product);
                                  }
                                  showToast('All items added to cart!', 'success');
                                } else {
                                  showToast('Cart function not available', 'error');
                                }
                              } catch (err) {
                                showToast('Failed to add items to cart', 'error');
                              }
                            }}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0b3d2e] text-white rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-md active:scale-95"
                          >
                            <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                            <span>Add All to Cart</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {isLoadingWishlist ? (
                      <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
                      </div>
                    ) : wishlistItems.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlistItems.map((item: any) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              if (onProductClick) {
                                onProductClick({
                                  ...item.product_details,
                                  id: String(item.product),
                                  price: parseFloat(item.product_details.price),
                                  originalPrice: item.product_details.original_price ? parseFloat(item.product_details.original_price) : undefined,
                                });
                              }
                            }}
                            className="group relative bg-white border-2 !border-slate-900 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-[320px] sm:h-[360px] cursor-pointer"
                          >
                            {/* Remove Button */}
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  const token = localStorage.getItem('access_token');
                                  const res = await fetch(`${API_BASE_URL}/api/wishlist/toggle/`, {
                                    method: 'POST',
                                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ product_id: item.product })
                                  });
                                  if (res.ok) {
                                    setWishlistItems(prev => prev.filter(w => w.id !== item.id));
                                  }
                                } catch (err) { }
                              }}
                              className="absolute top-4 right-4 z-20 w-10 h-10 bg-white text-slate-900 rounded-full flex items-center justify-center transition-all hover:bg-slate-900 hover:text-white shadow-sm"
                            >
                              <span className="material-symbols-outlined text-[20px] fill-1">favorite</span>
                            </button>

                            {/* Share Button */}
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  const url = `${window.location.origin}/product/${item.product}`;
                                  await navigator.clipboard.writeText(url);
                                  showToast('Product link copied!', 'success');
                                } catch (err) { }
                              }}
                              className="absolute top-4 right-16 z-20 w-10 h-10 bg-white text-slate-900 rounded-full flex items-center justify-center transition-all hover:bg-slate-900 hover:text-white shadow-sm"
                            >
                              <span className="material-symbols-outlined text-[18px]">share</span>
                            </button>

                            {/* Image Section */}
                            <div className="relative h-56 bg-transparent p-6 flex-shrink-0">
                              {item.product_details?.image ? (
                                <img
                                  src={item.product_details.image.startsWith('http') ? item.product_details.image : `${API_BASE_URL}${item.product_details.image}`}
                                  alt={item.product_details.name}
                                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-200">
                                  <span className="material-symbols-outlined text-5xl">inventory_2</span>
                                </div>
                              )}
                            </div>

                            {/* Content Section */}
                            <div className="p-4 pt-0 flex flex-col flex-1">
                              <div className="mb-auto">
                                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1 truncate">
                                  {item.product_details?.category_name}
                                </p>
                                <h3 className="font-anton text-lg uppercase leading-tight tracking-wide text-slate-900 line-clamp-2">
                                  {item.product_details?.name}
                                </h3>
                              </div>

                              <div className="flex items-center justify-between mt-3 gap-3">
                                <div className="flex flex-col">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Price</span>
                                  <span className="font-black text-xl text-slate-900">
                                    ₹{item.product_details?.price}
                                  </span>
                                </div>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onAddToCart) {
                                      onAddToCart({
                                        id: String(item.product),
                                        name: item.product_details?.name || '',
                                        price: parseFloat(item.product_details?.price) || 0,
                                        originalPrice: item.product_details?.original_price ? parseFloat(item.product_details.original_price) : undefined,
                                        image: item.product_details?.image || '',
                                        category: item.product_details?.category_name || '',
                                      });
                                      showToast('Added to cart!', 'success');
                                    }
                                  }}
                                  className="w-10 h-10 bg-[#0b3d2e] text-white rounded-full flex items-center justify-center transition-all active:scale-95 shadow-sm hover:opacity-90 flex-shrink-0"
                                >
                                  <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-20 px-4">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                          <span className="material-symbols-outlined text-4xl text-slate-300">favorite_border</span>
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-2">Your wishlist is empty</h3>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Save items you love to view them later.</p>

                      </div>
                    )}
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
              className="bg-white w-full max-w-xl rounded-3xl overflow-hidden relative shadow-2xl p-6 sm:p-8 md:p-10 max-h-[90vh] overflow-y-auto z-10"
            >
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-8 right-8 z-10 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="space-y-6 sm:space-y-8">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="bg-[#0b3d2e]/10 text-[#0b3d2e] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Order #{selectedOrder.id}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                      selectedOrder.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-600' :
                      selectedOrder.status === 'SHIPPED' ? 'bg-blue-100 text-blue-600' :
                      selectedOrder.status === 'PAID' ? 'bg-emerald-100 text-emerald-600' :
                      selectedOrder.status === 'CANCELLED' ? 'bg-red-100 text-red-500' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {selectedOrder.status === 'PAID' ? 'Processing' : selectedOrder.status}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight leading-none">Order Details</h2>
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mt-2">Placed on {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total</p>
                    <p className="text-xl font-black text-slate-900">₹{selectedOrder.total_amount}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Items</p>
                    <p className="text-xl font-black text-slate-900">{selectedOrder.items.length}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 col-span-2 md:col-span-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Delivery</p>
                    <p className="text-sm font-black text-slate-900 truncate">{selectedOrder.city || 'Standard Delivery'}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-black uppercase tracking-tight text-slate-900 mb-2">
                    Purchased Items
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex gap-3 p-3 bg-white border border-slate-100 rounded-2xl items-center shadow-sm">
                        <div className="w-14 h-14 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0">
                          {item.product_image ? (
                            <img
                              src={item.product_image.startsWith('http') ? item.product_image : `${API_BASE_URL}${item.product_image}`}
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-200">
                              <span className="material-symbols-outlined text-2xl">image</span>
                            </div>
                          )}
                        </div>
                        <div className="overflow-hidden min-w-0">
                          <h4 className="font-black text-xs uppercase leading-tight truncate text-slate-900">{item.product_name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">QTY: {item.quantity}</span>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">₹{item.price}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col items-center">
                  <p className="text-center text-slate-400 font-satoshi text-sm sm:text-base">
                    Fueling your ambition, one bite at a time! 🚀
                  </p>
                  <button onClick={() => setSelectedOrder(null)} className="mt-4 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Close Details</button>
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
