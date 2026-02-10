
import React from 'react';

// Fix for standard JSX elements being unrecognized: 
// Instead of using 'declare global' on the JSX namespace, which shadows the entire 
// intrinsic element library (breaking div, section, etc.), we define a local 
// constant that represents the custom element tag.
const ModelViewerTag = 'model-viewer' as any;

// Fix for standard JSX elements being unrecognized: 
// The previous 'declare global' block was removed to prevent shadowing standard HTML types.

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
      {/* 3D Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 space-y-2">
          <p className="font-handdrawn text-3xl text-secondary">Our New Flavor</p>
          <div className="relative inline-block">
             <h2 className="text-5xl font-black text-primary uppercase tracking-tighter">latest Product</h2>
             <span className="absolute -top-4 -right-12 bg-slate-900 text-white text-[10px] px-2 py-1 rounded font-black uppercase tracking-widest rotate-12 shadow-lg">
                3D Interactive
             </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-center">
          {/* Left Column */}
          <div className="space-y-12 text-center lg:text-right order-2 lg:order-1">
            {benefitsLeft.map((item, idx) => (
              <div key={idx} className="group transition-all duration-300 hover:translate-x-[-8px]">
                <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">{item.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm mx-auto lg:ml-auto">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Central 3D Model Viewer */}
          <div className="order-1 lg:order-2 flex justify-center relative min-h-[500px]">
            <div className="w-full max-w-[450px]">
              {/* Fix: Using the locally defined ModelViewerTag constant avoids JSX errors and namespace shadowing */}
              <ModelViewerTag
                src="https://modelviewer.dev/shared-assets/models/Astronaut.glb" // Placeholder GLB
                ios-src=""
                alt="3D Interactive Jar"
                shadow-intensity="1.5"
                camera-controls
                disable-zoom
                auto-rotate
                rotation-per-second="30deg"
                interaction-prompt="auto"
                ar
                ar-modes="webxr scene-viewer quick-look"
                touch-action="pan-y"
                style={{ width: '100%', height: '500px' }}
              >
                {/* Custom loading poster */}
                <div slot="poster" className="w-full h-full flex flex-col items-center justify-center bg-transparent">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="font-black text-primary uppercase text-xs tracking-widest">Loading 3D View...</p>
                </div>
              </ModelViewerTag>
              
              {/* Interaction Hint */}
              <div className="mt-4 flex justify-center items-center gap-3 text-slate-400">
                 <span className="material-symbols-outlined text-sm">3d_rotation</span>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em]">Drag to rotate</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-12 text-center lg:text-left order-3">
            {benefitsRight.map((item, idx) => (
              <div key={idx} className="group transition-all duration-300 hover:translate-x-[8px]">
                <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">{item.title}</h3>
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
