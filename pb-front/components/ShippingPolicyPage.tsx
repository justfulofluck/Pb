
import React from 'react';
import Breadcrumbs from './Breadcrumbs';

interface ShippingPolicyPageProps {
  onHomeClick: () => void;
}

const ShippingPolicyPage: React.FC<ShippingPolicyPageProps> = ({ onHomeClick }) => {
  return (
    <div className="bg-background-light min-h-screen pb-24 animate-in fade-in duration-500">
      <div className="bg-blue-50/50 pt-10 pb-20 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto mb-6">
           <Breadcrumbs onHomeClick={onHomeClick} steps={[{ label: 'Shipping Policy' }]} />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="font-handdrawn text-3xl text-primary transform -rotate-2 inline-block mb-4">Fast & Reliable</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase text-slate-900 tracking-tight mb-6">
            Shipping Policy
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium italic">
            "Delivering goodness to your doorstep, wherever you are."
          </p>
        </div>
        <span className="absolute top-10 left-10 font-handdrawn text-9xl opacity-5 rotate-12 select-none">FAST</span>
        <span className="absolute bottom-10 right-10 font-handdrawn text-9xl opacity-5 -rotate-12 select-none">SHIP</span>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-[40px] shadow-xl border-2 border-slate-50 p-8 md:p-16 relative overflow-hidden prose prose-slate prose-lg max-w-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
          
          <p className="lead font-bold text-slate-900">
            Welcome to Pinobite! We strive to ensure your shopping experience is smooth and satisfactory. Below, you’ll find our comprehensive shipping policy, which covers everything from shipping destinations to customer support.
          </p>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Shipping Destinations</h2>
          <p>
            Pinobite proudly ships worldwide. We aim to bring the best of Ayurvedic products to customers across the globe. Whether you are in North America, Europe, Asia, or any other continent, we have you covered.
          </p>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Shipping Rates</h2>
          <p>
            Shipping rates vary based on the destination, weight, and size of your order. The final shipping cost will be calculated at checkout, providing you with a clear view of the total cost before you complete your purchase.
          </p>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Shipping Methods and Carriers</h2>
          <p>
            We collaborate with reputable carriers such as DHL, FedEx, UPS, and national postal services to ensure timely and secure delivery of your orders. You can choose from standard, expedited, or express shipping options, depending on your needs and preferences.
          </p>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Order Processing Time</h2>
          <p>
            Orders are processed within <span className="font-bold">1-2 business days</span> after purchase. Processing time includes order verification, quality check, and packaging. Orders placed after 2 PM will be processed on the next business day.
          </p>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Delivery Time</h2>
          <p>Delivery times vary based on the selected shipping method and destination:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><span className="font-bold text-slate-900">Standard Shipping:</span> 7-14 business days</li>
            <li><span className="font-bold text-slate-900">Expedited Shipping:</span> 3-7 business days</li>
            <li><span className="font-bold text-slate-900">Express Shipping:</span> 1-3 business days</li>
          </ul>
          <p className="text-sm italic text-slate-500">Please note that these are estimated times and actual delivery may vary due to external factors.</p>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Order Tracking</h2>
          <p>
            Once your order has been shipped, you will receive a tracking number via email. You can use this number to track your order on the carrier’s website. This allows you to stay updated on the status of your delivery.
          </p>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Damaged or Lost Items</h2>
          <p>
            If your order arrives damaged or is lost during transit, please contact our customer support team immediately. We will work with the carrier to resolve the issue and ensure you receive a replacement or refund as soon as possible.
          </p>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Customs and Duties</h2>
          <p>
            International orders may be subject to customs duties and taxes, which are the responsibility of the customer. These charges vary by country and are not included in the shipping rates. Please check with your local customs office for more information.
          </p>

          <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 mt-12">
            <h2 className="text-2xl font-black uppercase text-secondary mb-6 tracking-tight m-0">Customer Support</h2>
            <p className="text-slate-300 mb-8">For any questions or concerns regarding your order, please contact our customer support team:</p>
            <div className="grid md:grid-cols-2 gap-8 not-prose">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <span className="material-symbols-outlined text-secondary">mail</span>
                     <a href="mailto:support@pinobite.com" className="font-bold hover:text-secondary transition-colors">support@pinobite.com</a>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <span className="material-symbols-outlined text-secondary">schedule</span>
                     <span className="font-bold text-sm">Mon - Fri: 9 AM – 6 PM IST</span>
                  </div>
               </div>
            </div>
            <p className="text-xs text-slate-500 mt-10 font-bold uppercase tracking-[0.2em]">Thank you for choosing Pinobite.</p>
          </div>

          <h2 className="text-xl font-black uppercase text-slate-900 mt-12 mb-4 tracking-tight">Policy Updates</h2>
          <p className="text-sm">
            Pinobite reserves the right to update this shipping policy at any time. Any changes will be posted on this page, and the revised policy will be effective immediately upon posting.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicyPage;
