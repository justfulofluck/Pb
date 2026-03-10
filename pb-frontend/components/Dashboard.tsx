
import React, { useState, useEffect } from 'react';
import Breadcrumbs from './Breadcrumbs';
import { Order } from '../types';
import { API_BASE_URL } from '../config';

interface DashboardProps {
  onLogout: () => void;
  onHomeClick: () => void;
}

import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC<DashboardProps> = ({ onLogout, onHomeClick }) => {
  const { user: authUser } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
          // Sort by date desc
          const sortedData = data.sort((a: Order, b: Order) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          setOrders(sortedData);
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setIsLoadingOrders(false);
      }
    };
    if (authUser) {
      fetchOrders();
    }
  }, [authUser]);

  const user = {
    name: authUser?.first_name ? `${authUser.first_name} ${authUser.last_name}` : authUser?.username || "Guest",
    points: authUser?.profile?.points || 0,
    tier: authUser?.profile?.tier || "Bronze",
    savings: authUser?.profile?.savings || 0,
    ordersCount: orders.length
  };

  const rewards = [
    { title: 'Free Shipping Voucher', cost: 500, icon: 'local_shipping' },
    { title: 'Rs. 200 Off Any Order', cost: 1000, icon: 'payments' },
    { title: 'Early Access: New Flavor', cost: 1500, icon: 'stars' },
  ];

  if (!authUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-8">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="material-symbols-outlined text-5xl text-slate-300">account_circle</span>
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900">Login Required</h2>
        <p className="text-slate-500 max-w-md mx-auto font-medium">
          Please sign in to view your points, track orders, and redeem exclusive rewards.
        </p>
        <button
          onClick={onHomeClick}
          className="px-8 py-4 rounded-xl border-2 border-slate-200 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors mx-auto block"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Breadcrumbs onHomeClick={onHomeClick} steps={[{ label: 'My Account' }]} className="mb-6" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black uppercase text-slate-900 tracking-tighter">
            Welcome back, <span className="text-primary italic">{user.name.split(' ')[0]}</span>!
          </h1>
          <p className="font-handdrawn text-2xl text-slate-500 mt-2">Fueling your ambition since 2024 ✨</p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-slate-400 hover:text-red-500 font-bold text-xs tracking-widest uppercase transition-colors"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Logout
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="space-y-8">
          <div className="bg-white doodle-border p-8 space-y-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-black">
                {user.name[0]}
              </div>
              <div>
                <h3 className="font-black text-xl uppercase tracking-tight">{user.name}</h3>
                <span className="bg-secondary text-slate-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  {user.tier}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="p-4 bg-slate-50 rounded-2xl text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Orders</p>
                <p className="text-2xl font-black text-slate-900">{user.ordersCount}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Savings</p>
                <p className="text-2xl font-black text-primary">Rs. {user.savings}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-[40px] relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-black uppercase tracking-widest text-secondary text-sm">PinoPoints Balance</h3>
                <span className="material-symbols-outlined text-secondary">workspace_premium</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black leading-none">{user.points}</span>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Points</span>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary" style={{ width: '70%' }}></div>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                  260 points away from <span className="text-white">Legend Tier</span>
                </p>
              </div>
              <button className="w-full bg-secondary text-slate-900 py-4 rounded-2xl font-black text-sm uppercase hover:scale-105 transition-transform">
                Redeem Rewards
              </button>
            </div>
            <span className="absolute -bottom-10 -right-10 font-handdrawn text-9xl opacity-5 rotate-12 select-none">GOLD</span>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-3xl p-8 border-2 border-slate-50 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black uppercase tracking-tight">Recent Orders</h3>
              <button className="text-primary font-black text-xs uppercase tracking-widest hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {isLoadingOrders ? (
                <div className="text-center py-8 text-slate-400">Loading orders...</div>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100 cursor-pointer group"
                  >
                    <div className="flex items-center gap-6 mb-4 md:mb-0">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">package_2</span>
                      </div>
                      <div>
                        <h4 className="font-black text-sm uppercase">Order #{order.id}</h4>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-8 md:gap-12">
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Items</p>
                        <p className="font-black text-sm">{order.items.length}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-secondary/20 text-accent-brown'
                          }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total</p>
                        <p className="font-black text-sm">Rs. {order.total_amount}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400">No orders found.</div>
              )}
            </div>
          </section>

          <section className="bg-white rounded-3xl p-8 border-2 border-slate-50 shadow-sm">
            <h3 className="text-2xl font-black uppercase tracking-tight mb-8">Available Rewards</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {rewards.map((reward, i) => (
                <div key={i} className="group p-6 bg-white border-2 border-slate-50 rounded-2xl text-center space-y-4 hover:border-secondary hover:shadow-xl transition-all cursor-pointer">
                  <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto group-hover:bg-secondary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-3xl">{reward.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-tight leading-tight h-8 flex items-center justify-center">{reward.title}</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{reward.cost} Points</p>
                  </div>
                  <button className="w-full py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest group-hover:bg-primary transition-colors">
                    Claim
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="bg-white w-full max-w-2xl rounded-[32px] md:rounded-[48px] overflow-hidden relative doodle-border animate-in zoom-in duration-300 shadow-2xl p-6 md:p-12 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 md:top-8 md:right-8 z-10 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="space-y-6 md:space-y-8">
              <div>
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Order #{selectedOrder.id}
                  </span>
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-secondary text-slate-900'
                    }`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight leading-none">Order Details</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] md:text-xs mt-2">Placed on {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-tight">Total Amount</p>
                  <p className="text-lg md:text-2xl font-black text-slate-900">Rs. {selectedOrder.total_amount}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-tight">Total Items</p>
                  <p className="text-lg md:text-2xl font-black text-slate-900">{selectedOrder.items.length}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-100 col-span-2 md:col-span-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-tight">Delivery Point</p>
                  <p className="text-sm font-black text-slate-900 truncate">{selectedOrder.city || 'Standard Delivery'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">shopping_bag</span>
                  Your Purchase
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-4 md:p-5 bg-white border-2 border-slate-50 rounded-2xl md:rounded-3xl items-center hover:border-primary/20 transition-colors group/item">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-xl md:rounded-2xl overflow-hidden flex-shrink-0 shadow-sm group-hover/item:scale-105 transition-transform">
                        {item.product_image ? (
                          <img
                            src={item.product_image.startsWith('http') ? item.product_image : `${API_BASE_URL}${item.product_image}`}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-200">
                            <span className="material-symbols-outlined text-3xl md:text-4xl">image</span>
                          </div>
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-black text-xs md:text-sm uppercase leading-tight truncate">{item.product_name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full">QTY: {item.quantity}</span>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rs. {item.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-dashed border-slate-100">
                <p className="text-center text-slate-400 font-handdrawn text-xl">
                  Fueling your ambition, one bite at a time! 🚀
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
