
import React from 'react';
import Breadcrumbs from './Breadcrumbs';

interface RefundPolicyPageProps {
  onHomeClick: () => void;
}

const RefundPolicyPage: React.FC<RefundPolicyPageProps> = ({ onHomeClick }) => {
  return (
    <div className="bg-background-light min-h-screen pb-24 animate-in fade-in duration-500">
      <div className="bg-emerald-50/50 pt-10 pb-20 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto mb-6">
           <Breadcrumbs onHomeClick={onHomeClick} steps={[{ label: 'Refund & Return Policy' }]} />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="font-handdrawn text-3xl text-primary transform -rotate-2 inline-block mb-4">Hassle-Free Returns</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase text-slate-900 tracking-tight mb-6">
            Refunds & Returns
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium italic">
            "Your satisfaction is our primary ingredient."
          </p>
        </div>
        <span className="absolute top-10 left-10 font-handdrawn text-9xl opacity-5 rotate-12 select-none">SMILE</span>
        <span className="absolute bottom-10 right-10 font-handdrawn text-9xl opacity-5 -rotate-12 select-none">REFUND</span>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-[40px] shadow-xl border-2 border-slate-50 p-8 md:p-16 relative overflow-hidden prose prose-slate prose-lg max-w-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
          
          <p className="lead font-bold text-slate-900">
            At Pinobite, your satisfaction is our highest priority. If for any reason you are not completely satisfied with your purchase, we are committed to making the return and refund process as smooth as possible.
          </p>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Satisfaction Guarantee</h2>
          <p>
            We stand by the quality of our products and strive to ensure that you are fully satisfied with your purchase. If you are not happy with your order, we offer a hassle-free return and refund process to ensure your complete satisfaction.
          </p>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Return Window</h2>
          <p>
            You have <span className="font-bold text-primary">30 days</span> from the date you receive your order to initiate a return. If more than 30 days have passed since the delivery of your purchase, we, unfortunately, cannot offer a refund or exchange.
          </p>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Eligibility Criteria</h2>
          <p>
            To qualify for a return, your item must be unused, in the same condition that you received it, and in its original packaging. Additionally, we require a receipt or proof of purchase to process your return.
          </p>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Non-Returnable Items</h2>
          <p>Certain items are non-returnable due to hygiene and safety reasons. These include:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Perishable goods such as food and flowers.</li>
            <li>Intimate or sanitary products.</li>
            <li>Hazardous materials or flammable liquids and gases.</li>
            <li>Gift cards.</li>
            <li>Downloadable software products.</li>
            <li>Certain health and personal care items.</li>
          </ul>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Return Process</h2>
          <p>
            To initiate a return, please contact our customer support team at <a href="mailto:returns@pinobite.com" className="text-primary font-bold">returns@pinobite.com</a>. Provide your order number and the reason for the return. Our team will respond with return authorization and detailed instructions on how to send your item back to us.
          </p>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Shipping Costs</h2>
          <p>
            You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
          </p>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Processing Time</h2>
          <p>
            Once we receive your returned item, we will inspect it and notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within <span className="font-bold">10-15 business days</span>.
          </p>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Damaged or Defective Products</h2>
          <p>
            If you receive a damaged or defective product, please contact us immediately at <a href="mailto:returns@pinobite.com" className="text-primary font-bold">returns@pinobite.com</a>. Provide your order number and photos of the damaged or defective item. We will arrange for a replacement or refund, including covering the cost of return shipping for the defective product.
          </p>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Refund Method</h2>
          <p>
            Refunds will be credited back to the original method of payment used for the purchase. If you paid with a credit card, the refund will be issued to that card. If you paid with PayPal, the refund will be sent to your PayPal account. Please note that it may take some time for the refund to appear on your account, depending on your bank or payment provider.
          </p>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Exchanges</h2>
          <p>
            If you would like to exchange an item, please follow the return process and indicate that you would like an exchange. Once we receive the original item and approve its condition, we will send out the replacement item. The time it takes for the exchanged product to reach you may vary depending on your location.
          </p>

          <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 mt-12">
            <h2 className="text-2xl font-black uppercase text-secondary mb-6 tracking-tight m-0">Contact Information</h2>
            <p className="text-slate-300 mb-8">For any questions or concerns regarding our refund and return policy, please contact our customer support team:</p>
            <div className="grid md:grid-cols-2 gap-8 not-prose">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <span className="material-symbols-outlined text-secondary">mail</span>
                     <a href="mailto:returns@pinobite.com" className="font-bold hover:text-secondary transition-colors">returns@pinobite.com</a>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="material-symbols-outlined text-secondary">call</span>
                     <span className="font-bold">+1 (123) 456-7890</span>
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
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
