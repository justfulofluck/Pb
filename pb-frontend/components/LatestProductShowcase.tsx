import React from 'react';

const ModelViewerTag = 'model-viewer' as any;

const LatestProductShowcase: React.FC = () => {
  const benefitsLeft = [
    {
      title: "Naturally Sweetened",
      desc: "Contains only 1.6g natural sugar and just 2.24g added brown sugar per serving — a better sweet choice!"
    },
    {
      title: "Good Source of Fiber",
      desc: "Each serving offers 2.56g of dietary fiber for better digestion and fullness."
    },
    {
      title: "Energy Dense",
      desc: "Each serving packs 184.64 Kcal of clean energy — great for active lifestyles and fitness goals."
    }
  ];

  const benefitsRight = [
    {
      title: "High Protein Power",
      desc: "Delivers 8.64g protein per serving, supporting muscle growth and energy."
    },
    {
      title: "Healthy Fats Only",
      desc: "Rich in monounsaturated and polyunsaturated fats, promoting heart health — with zero trans fat & cholesterol."
    },
    {
      title: "Low Sodium",
      desc: "Contains just 49.6mg of sodium per serving, making it suitable for low-salt diets."
    }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <p className="font-handdrawn text-3xl text-secondary">Our New Flavor</p>
          <div className="relative inline-block">
            <h2 className="text-6xl font-extrabold text-primary uppercase tracking-tight">Latest Product</h2>
            <span className="absolute -top-4 -right-12 bg-slate-900 text-white text-[10px] px-2 py-1 rounded font-black uppercase tracking-widest rotate-12 shadow-lg">
              3D Interactive
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-center">
          {/* Left Column */}
          <div className="space-y-8 md:space-y-12 text-center lg:text-right order-2 lg:order-1">
            {benefitsLeft.map((item, idx) => (
              <div key={idx} className="group transition-all duration-300 hover:translate-x-[-4px]">
                <h3 className="text-xl font-extrabold text-slate-900 mb-2 uppercase tracking-tight">{item.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm mx-auto lg:ml-auto">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Central 3D Model Viewer */}
          <div className="order-1 lg:order-2 flex justify-center relative min-h-[550px]">
            <div className="w-full max-w-[500px]">
              <ModelViewerTag
                src="/3D-assets/AmericanNuts-v1.glb"
                alt="3D Interactive Jar"
                shadow-intensity="1.5"
                camera-controls
                auto-rotate
                rotation-per-second="15deg"
                disable-zoom
                disable-tap
                interaction-prompt="auto"
                ar
                ar-modes="webxr scene-viewer quick-look"
                touch-action="pan-y"
                style={{ width: '100%', height: '550px' }}
              >
                {/* Loading Poster */}
                <div slot="poster" className="flex flex-col items-center justify-center h-full">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-primary font-bold uppercase text-xs">Loading...</p>
                </div>
              </ModelViewerTag>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8 text-center lg:text-left order-3">
            {benefitsRight.map((item, idx) => (
              <div key={idx} className="group transition-all duration-300 hover:translate-x-[4px]">
                <h3 className="text-xl font-extrabold text-slate-900 mb-2 uppercase tracking-tight">{item.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm mx-auto lg:mr-auto">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestProductShowcase;

