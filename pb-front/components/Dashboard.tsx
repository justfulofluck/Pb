
import React from 'react';
import Breadcrumbs from './Breadcrumbs';

interface DashboardProps {
  onLogout: () => void;
  onHomeClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, onHomeClick }) => {
  const user = {
    name: "Alex Fueler",
    points: 1240,
    tier: "Pro Elite",
    savings: 850,
    ordersCount: 12
  };

  const recentOrders = [
    { id: '#PB-9821', date: 'Oct 12, 2023', status: 'Delivered', total: 1240, items: 3 },
    { id: '#PB-9744', date: 'Sep 28, 2023', status: 'Delivered', total: 680, items: 1 },
    { id: '#PB-9612', date: 'Sep 15, 2023', status: 'Processing', total: 2150, items: 5 },
  ];

  const rewards = [
    { title: 'Free Shipping Voucher', cost: 500, icon: 'local_shipping' },
    { title: 'Rs. 200 Off Any Order', cost: 1000, icon: 'payments' },
    { title: 'Early Access: New Flavor', cost: 1500, icon: 'stars' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Breadcrumbs onHomeClick={onHomeClick} steps={[{ label: 'My Account' }]} className="mb-6" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black uppercase text-slate-900 tracking-tighter">
            Welcome back, <span className="text-primary italic">{user.name.split(' ')[0]}</span>!
          </h1>
          <p className="font-handdrawn text-2xl text-slate-500 mt-2">Fueling your ambition since 2022 ✨</p>
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
              {recentOrders.map((order) => (
                <div key={order.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-6 mb-4 md:mb-0">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">package_2</span>
                    </div>
                    <div>
                      <h4 className="font-black text-sm uppercase">{order.id}</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{order.date}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-8 md:gap-12">
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Items</p>
                      <p className="font-black text-sm">{order.items}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-secondary/20 text-accent-brown'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total</p>
                      <p className="font-black text-sm">Rs. {order.total}</p>
                    </div>
                  </div>
                </div>
              ))}
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
    </div>
  );
};

export default Dashboard;
