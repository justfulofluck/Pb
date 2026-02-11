
import React from 'react';

const Newsletter: React.FC = () => {
  return (
    <section className="py-24 bg-primary text-white overflow-hidden relative">
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase">NUTS ABOUT HEALTH? JOIN OUR NEWSLETTER</h2>
        <p className="text-xl mb-12 opacity-90">Get exclusive recipes, health tips and 10% off your first order!</p>
        <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input 
            className="flex-1 px-6 py-4 rounded-full text-slate-900 focus:outline-none focus:ring-4 focus:ring-secondary/50 transition-all border-none" 
            placeholder="Enter your email" 
            type="email" 
          />
          <button className="bg-secondary text-slate-900 px-8 py-4 rounded-full font-black hover:scale-105 transition-transform">SUBSCRIBE</button>
        </form>
        <div className="flex justify-center gap-6 mt-12">
          <a className="hover:scale-110 transition-transform" href="#"><span className="material-symbols-outlined text-3xl">facebook</span></a>
          <a className="hover:scale-110 transition-transform font-bold text-3xl" href="#">𝕏</a>
          <a className="hover:scale-110 transition-transform" href="#"><span className="material-symbols-outlined text-3xl">photo_camera</span></a>
          <a className="hover:scale-110 transition-transform" href="#"><span className="material-symbols-outlined text-3xl">play_circle</span></a>
        </div>
      </div>
      <span className="absolute top-10 left-10 font-handdrawn text-9xl opacity-10 rotate-12 select-none">YUM!</span>
      <span className="absolute bottom-10 right-10 font-handdrawn text-9xl opacity-10 -rotate-12 select-none">FREE!</span>
    </section>
  );
};

export default Newsletter;
