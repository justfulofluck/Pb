
import React from 'react';

interface FooterProps {
  onShopClick: () => void;
  onHomeClick: () => void;
  onFAQClick?: () => void;
  onDistributorClick?: () => void;
  onBlogsClick?: () => void;
  onEventBlogsClick?: () => void;
  onAdminClick?: () => void;
  onJourneyClick: () => void;
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
  onRefundClick?: () => void;
  onShippingClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ 
  onShopClick, 
  onHomeClick, 
  onFAQClick, 
  onDistributorClick, 
  onBlogsClick, 
  onEventBlogsClick, 
  onAdminClick, 
  onJourneyClick, 
  onPrivacyClick, 
  onTermsClick,
  onRefundClick,
  onShippingClick
}) => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div>
            <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Quick Links</h3>
            <ul className="space-y-4 text-xs">
              <li><button onClick={onShopClick} className="hover:text-white transition-colors uppercase font-bold tracking-widest">ALL PRODUCTS</button></li>
              <li><button onClick={onJourneyClick} className="hover:text-white transition-colors uppercase font-bold tracking-widest">OUR STORY</button></li>
              <li><button onClick={onBlogsClick} className="hover:text-white transition-colors uppercase font-bold tracking-widest">RECIPES & LIFESTYLE</button></li>
              <li><button onClick={onEventBlogsClick} className="hover:text-white transition-colors uppercase font-bold tracking-widest">EVENT BLOGS</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Partner With Us</h3>
            <ul className="space-y-4 text-xs">
              <li><button onClick={onDistributorClick} className="hover:text-white transition-colors uppercase font-bold tracking-widest">BECOME A DISTRIBUTOR</button></li>
              <li><button onClick={onAdminClick} className="hover:text-white transition-colors uppercase font-bold tracking-widest">PINOBITE GLOBAL</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Policies</h3>
            <ul className="space-y-4 text-xs">
              <li><button onClick={onTermsClick} className="hover:text-white transition-colors uppercase font-bold tracking-widest">TERMS & CONDITIONS</button></li>
              <li><button onClick={onFAQClick} className="hover:text-white transition-colors uppercase font-bold tracking-widest">FAQ'S</button></li>
              <li><button onClick={onShippingClick} className="hover:text-white transition-colors uppercase font-bold tracking-widest">SHIPPING</button></li>
              <li><button onClick={onRefundClick} className="hover:text-white transition-colors uppercase font-bold tracking-widest">RETURNS & REFUNDS</button></li>
              <li><button onClick={onPrivacyClick} className="hover:text-white transition-colors uppercase font-bold tracking-widest">PRIVACY POLICY</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Contact</h3>
            <div className="space-y-4 text-sm">
              <p className="leading-relaxed">
                <span className="text-white font-bold block mb-1">Address:</span>
                Fairyland School Dabhoi – Sinor Chowkdi, Sathod – Dist. Dabhoi Dabhoi, India 391110 Gujarat
              </p>
              <p>
                <span className="text-white font-bold block mb-1">Phone:</span>
                <a href="tel:+919328173747" className="hover:text-white transition-colors">+91 9328173747</a>
              </p>
              <p>
                <span className="text-white font-bold block mb-1">E-mail:</span>
                <a href="mailto:pinobites@gmail.com" className="hover:text-white transition-colors underline underline-offset-4 decoration-primary/50">pinobites@gmail.com</a>
              </p>
              
              <div className="flex flex-wrap gap-2 pt-4">
                <div className="bg-white px-2 py-1.5 rounded flex items-center justify-center w-[70px] h-8 shadow-sm">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="w-full h-auto object-contain" />
                </div>
                <div className="bg-white px-2 py-1.5 rounded flex items-center justify-center w-[70px] h-8 shadow-sm">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Meesho_Logo.svg" alt="Meesho" className="w-full h-auto object-contain" />
                </div>
                <div className="bg-white px-2 py-1.5 rounded flex items-center justify-center w-[70px] h-8 shadow-sm">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Flipkart_logo.svg" alt="Flipkart" className="w-full h-auto object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2025 Pinobite. All Rights Reserved.</p>
          <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
             <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center text-[8px] font-bold text-white">VISA</div>
             <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center text-[8px] font-bold text-white">MASTER</div>
             <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center text-[8px] font-bold text-white">PAYPAL</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
