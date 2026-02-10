
import React from 'react';
import Breadcrumbs from './Breadcrumbs';

interface PrivacyPolicyPageProps {
  onHomeClick: () => void;
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onHomeClick }) => {
  return (
    <div className="bg-background-light min-h-screen pb-24 animate-in fade-in duration-500">
      <div className="bg-primary/5 pt-10 pb-20 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto mb-6">
           <Breadcrumbs onHomeClick={onHomeClick} steps={[{ label: 'Privacy Policy' }]} />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="font-handdrawn text-3xl text-primary transform -rotate-2 inline-block mb-4">Your Trust Matters</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase text-slate-900 tracking-tight mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium italic">
            "Transparency is the main ingredient in every jar we pack."
          </p>
        </div>
        <span className="absolute top-10 left-10 font-handdrawn text-9xl opacity-5 rotate-12 select-none">SAFE</span>
        <span className="absolute bottom-10 right-10 font-handdrawn text-9xl opacity-5 -rotate-12 select-none">TRUST</span>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-[40px] shadow-xl border-2 border-slate-50 p-8 md:p-16 relative overflow-hidden prose prose-slate prose-lg max-w-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
          
          <p>
            Welcome to <span className="font-bold">www.pinobite.trioriginayurveda.com</span> (“pinobite.trioriginayurveda.com” or “Website” or “We”). Safeguarding your privacy and ensuring the security of any personal information you provide is paramount to us.
          </p>

          <p>
            Tri Origin Ayurveda prioritises the utmost security and privacy of your Personal Information during transactions. We value your trust and want to ensure that you understand how we gather and use your information. Kindly read the following statement to learn about our practices.
          </p>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 my-8">
            <p className="text-sm m-0">
              <span className="font-black uppercase tracking-widest text-primary block mb-2">Note:</span>
              Please note that our privacy policy may change without prior notice. We recommend reviewing this policy periodically to stay informed about any updates.
            </p>
          </div>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Terms of Use</h2>
          <p>
            The Privacy policy and terms of use form an agreement regulating our relationship concerning the use of our site by you. At Pinobite, we prioritise the confidentiality of our customers and strictly comply with the data protection laws in India.
          </p>
          <p>
            By accessing or using our website, you agree to be bound by the terms described in this privacy policy and all the terms incorporated by reference. If you disagree with these terms, please refrain from using the website.
          </p>
          <p>
            This privacy policy statement aims to explain the personal information we collect during your visit to our website and how we protect the information you provide when using our services. Rest assured that tri origin ayurveda handles such information meticulously, sensibly, carefully, and following this privacy statement. We maintain the highest standards of website privacy to ensure that our visitors/customers can securely place orders on our website without any dismay. Any information you provide to Pinobite is subject to our Privacy Policy.
          </p>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Information Collection</h2>
          <p>
            When you access the site, you may provide, or we may collect information that specifically identifies you or any other individual. The following are the types of information we may collect:
          </p>
          
          <h3 className="text-lg font-black uppercase text-slate-800">Personally Identifiable Information</h3>
          <p>
            Pinobite restricts the collection of information to ensure accurate service provision. The information we collect is typically basic and necessary for completing purchases or processing refunds. Examples include name, address, telephone number, date of birth, email address, item descriptions, language preference, IP address, computer operating system, and browser type and version.
          </p>
          <p className="font-bold text-primary">
            We guarantee that your personal information will not be sold, distributed, or leased to third parties.
          </p>

          <h3 className="text-lg font-black uppercase text-slate-800">Browsing Behaviour</h3>
          <p>
            Certain information about your browsing behaviour on our site may be automatically tracked. This data is used for internal research on user demographics, interests, and behavior, with the goal of better understanding, protecting, and serving our users. The information is analysed on an aggregated basis and may include the URL you accessed prior to visiting our site, the URL you navigate to next, your computer browser information, and your IP address.
          </p>
          <p>
            Credit card, debit card, and banking information are <span className="font-bold underline">not</span> collected or stored by Pinobite. Instead, this information is directly transmitted through the payment gateway provider to the payment network or bank.
          </p>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Account Registration</h2>
          <p>
            To access certain features on our site, you are required to register and create a member account, which is completely free of charge. During the online registration process, you may be asked to provide information such as your name, email address, and password.
          </p>
          <p>
            Your password is an integral part of our security system, and you are responsible for safeguarding it. Please refrain from sharing your password with any third parties. If, for any reason, you suspect that your password has been compromised, we strongly recommend changing it immediately.
          </p>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Personalised Experience Technologies</h2>
          <p>
            We utilise various technologies to collect information regarding your visit to our website. This includes the Uniform Resource Locator (URL) that directed you to our site, your Internet Protocol (IP) address, browser type, browser language, date and time of your request, and more.
          </p>
          
          <h3 className="text-lg font-black uppercase text-slate-800">Web Beacons and Tracking Links</h3>
          <p>
            Web Beacons (also known as clear gifs and pixel tags), tracking links, and similar technologies consist of a few lines of code embedded on our website pages. They are often used in conjunction with cookies and are typically not visible to website users. Web Beacons may transmit information to third parties, such as our service providers, and may be employed to track customer response to specific advertisements and improve targeting.
          </p>

          <h3 className="text-lg font-black uppercase text-slate-800">Cookies</h3>
          <p>
            We use data collection devices known as “cookies” on specific website pages to analyse the flow of our web pages, measure the effectiveness of promotions, and promote trust and safety. Cookies are small files that are placed on your hard drive to assist us in providing our services. Certain features are only accessible through the use of cookies.
          </p>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Use of Your Information</h2>
          <p>
            We utilise personal information to fulfil the services you request. If we use your personal information for marketing purposes, we will provide you with the opportunity to opt out of such communications. We also use your personal information to:
          </p>
          <ul>
            <li>Fulfill product requests and process orders.</li>
            <li>Operating and improving the platform for better user experience.</li>
            <li>Process and deliver orders efficiently.</li>
            <li>Analyze data, track trends, and conduct research.</li>
            <li>Respond to requests, customize orders, and communicate updates.</li>
            <li>Investigate and prevent illegal activities or fraud.</li>
            <li>Contact users for feedback or consultations.</li>
          </ul>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Information Sharing</h2>
          <p>
            We abide by your privacy, and we do not rent, sell or exchange any personal information to third parties or any resource. We engage in trusted online payment service partners. With the use of Tri origin ayurveda, you can transfer information to payment service partners and third-party service providers.
          </p>
          <p>
            Your information can be accessed when need to know by our internal team, who are designated to carry out the requested activity. We understand the confidential nature of the prescription provided to process your medication order and treat it as discreet and protected.
          </p>

          <div className="bg-primary/5 p-6 rounded-2xl border-l-4 border-primary my-8">
            <p className="m-0 font-bold">
              If you have questions about this policy, mail us at <a href="mailto:Tri-originayurveda@gmail.com" className="text-primary hover:underline">Tri-originayurveda@gmail.com</a>
            </p>
          </div>

          <div className="mt-20 pt-10 border-t-2 border-slate-100">
            <h2 className="text-3xl font-black uppercase text-slate-900 mb-8 tracking-tighter">Return Policy</h2>
            <p>
              To ensure customer satisfaction and provide excellent service, we have implemented a return policy that allows for refunds or exchanges within <span className="font-bold">10 days</span> of product purchase. Please ensure that the item is unused and in its original packaging when initiating a return.
            </p>

            <h3 className="text-xl font-black uppercase text-slate-800 mt-8 mb-4">Return Process:</h3>
            <ol className="list-decimal pl-6 space-y-4">
              <li>Log in to your account.</li>
              <li>Go to the order history tab.</li>
              <li>Select the order details with the reference number.</li>
              <li>Navigate to the return section and provide the necessary details.</li>
            </ol>

            <div className="bg-secondary/10 p-6 rounded-2xl border border-secondary/20 mt-8">
              <h4 className="font-black text-sm uppercase mb-2">Important Information:</h4>
              <ul className="text-sm space-y-2 m-0">
                <li>The customer is responsible for return shipping charges.</li>
                <li>Pickup services are not currently offered.</li>
                <li>Refund amounts will be adjusted for non-refundable shipping costs.</li>
                <li>Exempt items: Liquid items, gift cards, sale items, 1+1 offers, or free items.</li>
              </ul>
            </div>

            <h3 className="text-xl font-black uppercase text-slate-800 mt-12 mb-4">Eligibility for Refund:</h3>
            <p>Upon receiving your return, we will inspect the product for the following conditions:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Correct product</li>
              <li>Unused condition</li>
              <li>Intact seal</li>
              <li>No damages</li>
            </ul>
            <p>
              Once your return is received and inspected, we will notify you via email regarding the approval or rejection of your refund. If approved, the refund will be processed and applied to your original method of payment within a few days, as per the bank’s policy.
            </p>
            
            <p className="mt-8 font-bold italic text-slate-600">
              For exchange requests, your item will be eligible for exchange only if it is defective or damaged upon receipt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
