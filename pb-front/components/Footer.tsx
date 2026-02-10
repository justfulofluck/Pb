
import React from 'react';

interface FooterProps {
  onShopClick: () => void;
  onHomeClick: () => void;
  onContactClick: () => void;
  onFAQClick?: () => void;
  onDistributorClick?: () => void;
  onBlogsClick?: () => void;
  onEventBlogsClick?: () => void;
  onAdminClick?: () => void;
  onJourneyClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ 
  onShopClick, 
  onHomeClick, 
  onContactClick, 
  onFAQClick, 
  onDistributorClick, 
  onBlogsClick,
  onEventBlogsClick,
  onAdminClick,
  onJourneyClick
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
              <li><button onClick={onContactClick} className="hover:text-white transition-colors uppercase font-bold tracking-widest">CONTACT US</button></li>
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
              <li><a className="hover:text-white transition-colors uppercase font-bold tracking-widest" href="#">TERMS & CONDITIONS</a></li>
              <li><button onClick={onFAQClick} className="hover:text-white transition-colors uppercase font-bold tracking-widest">FAQ'S</button></li>
              <li><a className="hover:text-white transition-colors uppercase font-bold tracking-widest" href="#">SHIPPING</a></li>
              <li><a className="hover:text-white transition-colors uppercase font-bold tracking-widest" href="#">PRIVACY POLICY</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Join The Club</h3>
            <p className="text-sm mb-4">Stay updated with the latest from the Pinobite world.</p>
            <p className="text-primary font-black text-lg tracking-tighter">@PINOBITEHEALTHFOODS</p>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2024 Pinobite Health Foods. All Rights Reserved.</p>
          <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
             <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center text-[8px] font-bold">VISA</div>
             <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center text-[8px] font-bold">MASTER</div>
             <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center text-[8px] font-bold">PAYPAL</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
