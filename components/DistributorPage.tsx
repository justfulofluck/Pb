
import React, { useState } from 'react';

const DistributorPage: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    region: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setFormData({ companyName: '', contactPerson: '', email: '', phone: '', region: '', message: '' });
    }, 1500);
  };

  return (
    <div className="bg-background-light min-h-screen animate-in fade-in duration-500">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="font-handdrawn text-3xl text-secondary transform -rotate-2 inline-block mb-4">Join the Revolution</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6">
            Become a Distributor
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            Bring the crunch of Pinobite to your city. We offer great margins, marketing support, and a product that sells itself.
          </p>
        </div>
        <span className="absolute top-10 left-10 text-8xl opacity-10 font-black text-white select-none hidden md:block">PARTNER</span>
        <span className="absolute bottom-10 right-10 text-8xl opacity-10 font-black text-white select-none hidden md:block">GROW</span>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-20 w-32 h-32 border-4 border-secondary/20 rounded-full -translate-y-1/2 hidden lg:block"></div>
        <div className="absolute top-1/2 right-20 w-20 h-20 bg-primary/20 rounded-full -translate-y-1/2 hidden lg:block"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Benefits / Info Side */}
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-black uppercase text-slate-900 mb-6">Why Partner With Us?</h2>
              <p className="text-lg text-slate-600 font-medium leading-relaxed">
                The health food market is exploding, and Pinobite is leading the charge with clean ingredients and unmatched taste. As a distributor, you're not just moving boxes; you're fueling a movement.
              </p>
            </div>

            <div className="grid gap-6">
              {[
                { title: "Premium Margins", desc: "Industry-leading margins to ensure your business grows with ours.", icon: "trending_up" },
                { title: "Marketing Support", desc: "Access to high-quality assets, displays, and social media collabs.", icon: "campaign" },
                { title: "Exclusive Territories", desc: "Secure your region and become the go-to source for Pinobite.", icon: "map" },
                { title: "Fast Logistics", desc: "Streamlined supply chain ensuring fresh stock, always.", icon: "local_shipping" }
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border-2 border-slate-100 flex gap-6 hover:border-primary/30 transition-colors group">
                  <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary flex-shrink-0 group-hover:bg-secondary group-hover:text-slate-900 transition-colors">
                    <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-black uppercase text-lg mb-2 text-slate-800">{item.title}</h3>
                    <p className="text-slate-500 font-medium text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#fff9c4] p-8 rounded-3xl doodle-border relative transform rotate-1 hover:rotate-0 transition-transform">
              <span className="font-handdrawn text-2xl text-slate-900 block mb-2">"Pinobite flies off our shelves!"</span>
              <p className="font-bold text-slate-600">- Retail Partner, Bangalore</p>
              <span className="absolute -top-4 -right-4 text-6xl text-secondary opacity-50 font-serif">"</span>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white p-8 md:p-12 rounded-[40px] doodle-border shadow-xl relative">
             {status === 'success' ? (
                <div className="text-center py-20 space-y-6 animate-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-5xl">handshake</span>
                  </div>
                  <h3 className="text-3xl font-black uppercase text-slate-900">Application Received!</h3>
                  <p className="font-handdrawn text-xl text-slate-500">Welcome to the club! Our partnership team will review your details and get in touch within 48 hours.</p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="text-primary font-bold hover:underline uppercase tracking-widest text-xs"
                  >
                    Submit another application
                  </button>
                </div>
              ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                <span className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined">storefront</span>
                </span>
                <div>
                  <h3 className="text-2xl font-black uppercase text-slate-900 leading-none">Partnership Form</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Join our network</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Company Name</label>
                  <input 
                    required
                    value={formData.companyName}
                    onChange={e => setFormData({...formData, companyName: e.target.value})}
                    type="text" 
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none transition-all font-bold text-slate-800 bg-slate-50 focus:bg-white"
                    placeholder="Healthy Foods Pvt Ltd"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Contact Person</label>
                  <input 
                    required
                    value={formData.contactPerson}
                    onChange={e => setFormData({...formData, contactPerson: e.target.value})}
                    type="text" 
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none transition-all font-bold text-slate-800 bg-slate-50 focus:bg-white"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none transition-all font-bold text-slate-800 bg-slate-50 focus:bg-white"
                    placeholder="partner@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                  <input 
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none transition-all font-bold text-slate-800 bg-slate-50 focus:bg-white"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Region / City of Operation</label>
                <input 
                  required
                  type="text"
                  value={formData.region}
                  onChange={e => setFormData({...formData, region: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none transition-all font-bold text-slate-800 bg-slate-50 focus:bg-white"
                  placeholder="e.g. South Mumbai, Bangalore Indiranagar"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Tell us about your distribution network</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none transition-all font-bold text-slate-800 bg-slate-50 focus:bg-white resize-none"
                  placeholder="Current brands, number of retailers, logistics capability..."
                ></textarea>
              </div>

              <button 
                disabled={status === 'submitting'}
                className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    PROCESSING...
                  </>
                ) : (
                  <>
                    SUBMIT APPLICATION
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DistributorPage;
