
import React from 'react';

interface FooterProps {
  onShopClick: () => void;
  onHomeClick: () => void;
  onFAQClick?: () => void;
  onBlogsClick?: () => void;
  onEventBlogsClick?: () => void;
  onAdminClick?: () => void;
  onJourneyClick: () => void;
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
  onRefundClick?: () => void;
  onShippingClick?: () => void;
  onDistributorClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({
  onShopClick,
  onHomeClick,
  onFAQClick,
  onBlogsClick,
  onEventBlogsClick,
  onAdminClick,
  onJourneyClick,
  onPrivacyClick,
  onTermsClick,
  onRefundClick,
  onShippingClick,
  onDistributorClick
}) => {
  return (
    <footer className="bg-[#228b44] text-white pt-20 pb-10 texture-chalkboard-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Brand Column */}
          <div className="lg:col-span-4 max-w-sm">
            <button onClick={onHomeClick} className="block mb-6 h-12">
              <img
                src="/logos/Pinobite-logo.png"
                alt="Pinobite Logo"
                className="h-full w-auto object-contain brightness-0 invert"
              />
            </button>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 font-satoshi">
              Pinobite is a group of modern healthy snack specialists transforming your daily energy intake with handcrafted, nutritious muesli and peanut butter. Founded with a passion for goodness.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/profile.php?id=61574254086582" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-all">
                <i className="fa-brands fa-facebook-f text-sm"></i>
              </a>
              <a href="https://www.instagram.com/pino.bite/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-all">
                <i className="fa-brands fa-instagram text-sm"></i>
              </a>
            </div>
          </div>

          {/* Collections Column */}
          <div className="lg:col-span-2">
            <h4 className="font-normal text-xl mb-6 font-anton !normal-case tracking-tight leading-none">Collections</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><button onClick={onShopClick} className="hover:text-white transition-colors">Shop All</button></li>
              <li><button onClick={() => onDistributorClick?.()} className="hover:text-white transition-colors">Peanut Butter</button></li>
              <li><button onClick={onShopClick} className="hover:text-white transition-colors">Healthy Muesli</button></li>
              <li><button onClick={onShopClick} className="hover:text-white transition-colors">Combo Packs</button></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="lg:col-span-2">
            <h4 className="font-normal text-xl mb-6 font-anton !normal-case tracking-tight leading-none">Resources</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><button onClick={onBlogsClick} className="hover:text-white transition-colors">Healthy Blog</button></li>
              <li><button onClick={onEventBlogsClick} className="hover:text-white transition-colors">Events & News</button></li>
              <li><button onClick={onFAQClick} className="hover:text-white transition-colors">FAQ's</button></li>
              <li><button onClick={onShippingClick} className="hover:text-white transition-colors">Shipping Info</button></li>
              <li><button onClick={onRefundClick} className="hover:text-white transition-colors">Refund Policy</button></li>
            </ul>
          </div>

          {/* Partners Column */}
          <div className="lg:col-span-2">
            <h4 className="font-normal text-xl mb-6 font-anton !normal-case tracking-tight leading-none">Partners</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><button onClick={onDistributorClick} className="hover:text-white transition-colors">Become a Distributor</button></li>
              <li><button onClick={onAdminClick} className="hover:text-white transition-colors">Global Partners</button></li>
              <li><button onClick={onAdminClick} className="hover:text-white transition-colors">Wholesale Inquiry</button></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="lg:col-span-2">
            <h4 className="font-normal text-xl mb-6 font-anton !normal-case tracking-tight leading-none">Company</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><button onClick={onJourneyClick} className="hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={onJourneyClick} className="hover:text-white transition-colors">Our Values</button></li>
              <li><button onClick={onJourneyClick} className="hover:text-white transition-colors">Our Story</button></li>
              <li><button href="mailto:pinobites@gmail.com" className="hover:text-white transition-colors">Contact Us</button></li>
            </ul>
          </div>
        </div>

        {/* Divider and Contact Row */}
        <div className="border-t border-white/10 pt-10 pb-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors text-sm">
              <i className="fa-solid fa-phone text-[#f9bc15]"></i>
              <a href="tel:+919328173747">+91 9328173747</a>
            </div>
            <div className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors text-sm text-center md:text-left">
              <i className="fa-solid fa-location-dot text-[#f9bc15]"></i>
              <a href="https://maps.app.goo.gl/m21Carqf53eYqKaVA" target="_blank" rel="noopener noreferrer" className="hover:underline">Fairyland School Dabhoi – Sinor Chowkdi, Sathod, India 391110</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2025 Pinobite Plan Consultants, Inc. All Rights Reserved.</p>
          <div className="flex gap-6">
            <button onClick={onTermsClick} className="hover:text-white transition-colors">Terms</button>
            <button onClick={onPrivacyClick} className="hover:text-white transition-colors">Privacy</button>
            <button className="hover:text-white transition-colors">Cookies</button>
            <button className="hover:text-white transition-colors">Sitemap</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
