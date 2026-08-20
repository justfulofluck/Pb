import React from 'react';

interface NotFoundPageProps {
  onHomeClick: () => void;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ onHomeClick }) => {
  return (
    <div className="bg-[#f2f2ec] min-h-screen flex items-center justify-center px-4 py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-[0.03] z-0">
        <div className="font-anton text-9xl absolute top-20 left-10 rotate-12">404</div>
        <div className="font-anton text-9xl absolute top-1/2 right-20 -rotate-12">LOST</div>
        <div className="font-anton text-9xl absolute bottom-20 left-1/3 rotate-45">GONE</div>
      </div>

      <div className="max-w-lg mx-auto text-center relative z-10">
        <div className="relative inline-block mb-8">
          <span className="text-[12rem] md:text-[16rem] font-anton text-[#0b3d2e] opacity-10 leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full shadow-2xl border-4 border-slate-100 flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform duration-500">
              <span className="text-6xl md:text-7xl">🥜</span>
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-anton uppercase text-slate-900 tracking-wide leading-[1.1] mb-4">
          Page got<br />
          <span className="text-accent-brown">roasted!</span>
        </h1>

        <p className="text-lg text-slate-500 font-medium mb-2 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved to a new shelf.
        </p>
        <p className="text-sm text-slate-400 font-medium mb-10">
          Let's get you back to something crunchy.
        </p>

        <button
          onClick={onHomeClick}
          className="inline-flex items-center gap-3 bg-[#0b3d2e] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary transition-all shadow-xl hover:shadow-[0_10px_30px_-10px_rgba(0,138,69,0.5)] active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">home</span>
          Back to Home
        </button>

        <div className="mt-16 pt-12 border-t border-slate-200/60">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
            Try these instead
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={onHomeClick}
              className="px-6 py-3 bg-white rounded-xl border-2 border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest hover:border-[#0b3d2e] hover:text-[#0b3d2e] transition-all"
            >
              🛒 Shop All
            </button>
            <button
              onClick={onHomeClick}
              className="px-6 py-3 bg-white rounded-xl border-2 border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest hover:border-[#0b3d2e] hover:text-[#0b3d2e] transition-all"
            >
              📖 Our Blog
            </button>
            <button
              onClick={onHomeClick}
              className="px-6 py-3 bg-white rounded-xl border-2 border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest hover:border-[#0b3d2e] hover:text-[#0b3d2e] transition-all"
            >
              ❓ FAQ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
