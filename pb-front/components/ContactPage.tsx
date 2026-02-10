
import React, { useState } from 'react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="bg-background-light min-h-screen">
      {/* Header */}
      <div className="bg-secondary/10 py-20 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="font-handdrawn text-3xl text-primary transform -rotate-2 inline-block mb-4">We don't bite! (Unless it's muesli)</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase text-slate-900 tracking-tight mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Have a question about our ingredients? Want to partner with us? Or just want to say hi? We're all ears.
          </p>
        </div>
        <span className="absolute top-10 right-10 font-handdrawn text-8xl opacity-5 rotate-12 select-none">HELLO!</span>
        <span className="absolute bottom-10 left-10 font-handdrawn text-8xl opacity-5 -rotate-12 select-none">HOLA!</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Contact Form */}
          <div className="order-2 lg:order-1">
            <div className="bg-white p-8 md:p-12 rounded-[40px] doodle-border shadow-xl relative">
              <div className="absolute -top-6 -left-6 bg-secondary text-slate-900 w-20 h-20 rounded-full flex items-center justify-center transform -rotate-12 shadow-lg z-10 hidden md:flex">
                <span className="material-symbols-outlined text-4xl">mail</span>
              </div>
              
              {status === 'success' ? (
                <div className="text-center py-12 space-y-6 animate-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-5xl">mark_email_read</span>
                  </div>
                  <h3 className="text-3xl font-black uppercase text-slate-900">Message Sent!</h3>
                  <p className="font-handdrawn text-xl text-slate-500">Thanks for reaching out. We'll get back to you faster than you can finish a bowl of oats! 🥣</p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="text-primary font-bold hover:underline uppercase tracking-widest text-xs"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-2xl font-black uppercase text-slate-900 mb-8">Drop us a line</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Your Name</label>
                      <input 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        type="text" 
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none transition-all font-bold text-slate-800 bg-slate-50 focus:bg-white"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                      <input 
                        required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        type="email" 
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none transition-all font-bold text-slate-800 bg-slate-50 focus:bg-white"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                    <select 
                      value={formData.subject}
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none transition-all font-bold text-slate-800 bg-slate-50 focus:bg-white appearance-none"
                    >
                      <option value="">Choose a topic...</option>
                      <option value="order">Order Inquiry</option>
                      <option value="wholesale">Wholesale / Distribution</option>
                      <option value="feedback">Product Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Message</label>
                    <textarea 
                      required
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      rows={5}
                      className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none transition-all font-bold text-slate-800 bg-slate-50 focus:bg-white resize-none"
                      placeholder="Tell us what's on your mind..."
                    ></textarea>
                  </div>

                  <button 
                    disabled={status === 'submitting'}
                    className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === 'submitting' ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        SENDING...
                      </>
                    ) : (
                      <>
                        SEND MESSAGE
                        <span className="material-symbols-outlined">send</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="order-1 lg:order-2 space-y-10">
            <div className="relative rounded-3xl overflow-hidden aspect-video shadow-lg group">
              <img 
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1000" 
                alt="Pinobite HQ" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div>
                  <h3 className="text-white font-black text-2xl uppercase">Pinobite HQ</h3>
                  <p className="text-white/80 font-medium">Mumbai, India</p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border-2 border-slate-50 hover:border-secondary transition-colors group">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary mb-4 group-hover:bg-secondary group-hover:text-slate-900 transition-colors">
                  <span className="material-symbols-outlined text-2xl">location_on</span>
                </div>
                <h4 className="font-black uppercase text-sm mb-2">Visit Us</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  102, Innovation Tower,<br/>
                  Lower Parel, Mumbai,<br/>
                  Maharashtra - 400013
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border-2 border-slate-50 hover:border-secondary transition-colors group">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary mb-4 group-hover:bg-secondary group-hover:text-slate-900 transition-colors">
                  <span className="material-symbols-outlined text-2xl">call</span>
                </div>
                <h4 className="font-black uppercase text-sm mb-2">Call Us</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Mon-Fri from 9am to 6pm
                </p>
                <a href="tel:+919876543210" className="text-primary font-bold text-lg hover:underline">+91 98765 43210</a>
              </div>

              <div className="bg-white p-6 rounded-3xl border-2 border-slate-50 hover:border-secondary transition-colors group sm:col-span-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary mb-4 group-hover:bg-secondary group-hover:text-slate-900 transition-colors">
                      <span className="material-symbols-outlined text-2xl">mail</span>
                    </div>
                    <h4 className="font-black uppercase text-sm mb-1">Email Us</h4>
                    <a href="mailto:hello@pinobite.com" className="text-primary font-bold text-lg hover:underline">hello@pinobite.com</a>
                  </div>
                  <div className="text-right hidden sm:block">
                    <span className="font-handdrawn text-slate-400 transform rotate-6 inline-block">We reply fast! ⚡️</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="bg-primary text-white p-8 rounded-3xl relative overflow-hidden">
               <div className="relative z-10 flex items-center justify-between gap-4">
                 <div>
                   <h4 className="font-black uppercase text-xl mb-1">Join the Community</h4>
                   <p className="text-white/80 text-sm">Follow us for recipes & fitness tips!</p>
                 </div>
                 <div className="flex -space-x-3">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-slate-200 overflow-hidden">
                       <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-full h-full object-cover" />
                     </div>
                   ))}
                   <div className="w-10 h-10 rounded-full border-2 border-primary bg-secondary text-slate-900 flex items-center justify-center font-bold text-xs">
                     +2k
                   </div>
                 </div>
               </div>
               <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80"></div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
