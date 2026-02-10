
import React, { useState } from 'react';
import Breadcrumbs from './Breadcrumbs';

interface DistributorPageProps {
  onHomeClick: () => void;
}

const DistributorPage: React.FC<DistributorPageProps> = ({ onHomeClick }) => {
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
    setTimeout(() => {
      setStatus('success');
      setFormData({ companyName: '', contactPerson: '', email: '', phone: '', region: '', message: '' });
    }, 1500);
  };

  return (
    <div className="bg-background-light min-h-screen animate-in fade-in duration-500">
      <div className="bg-slate-900 text-white pt-10 pb-20 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto mb-6">
           <Breadcrumbs onHomeClick={onHomeClick} steps={[{ label: 'Partner' }]} className="text-white/60 !py-0" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="font-handdrawn text-3xl text-secondary transform -rotate-2 inline-block mb-4">Join the Revolution</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6">
            Become a Distributor
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            Bring the crunch of Pinobite to your city. We offer great margins, marketing support, and a product that sells itself.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-black uppercase text-slate-900 mb-6">Why Partner With Us?</h2>
              <p className="text-lg text-slate-600 font-medium leading-relaxed">
                The health food market is exploding, and Pinobite is leading the charge with clean ingredients and unmatched taste.
              </p>
            </div>
            <div className="grid gap-6">
              {[
                { title: "Premium Margins", desc: "Industry-leading margins to ensure your business grows with ours.", icon: "trending_up" },
                { title: "Marketing Support", desc: "Access to high-quality assets, displays, and social media collabs.", icon: "campaign" }
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border-2 border-slate-100 flex gap-6 hover:border-primary/30 transition-colors group">
                  <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary flex-shrink-0 group-hover:bg-secondary transition-colors">
                    <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-black uppercase text-lg mb-2 text-slate-800">{item.title}</h3>
                    <p className="text-slate-500 font-medium text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributorPage;
