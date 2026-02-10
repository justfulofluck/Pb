
import React from 'react';
import Breadcrumbs from './Breadcrumbs';

interface TermsAndConditionsPageProps {
  onHomeClick: () => void;
}

const TermsAndConditionsPage: React.FC<TermsAndConditionsPageProps> = ({ onHomeClick }) => {
  return (
    <div className="bg-background-light min-h-screen pb-24 animate-in fade-in duration-500">
      <div className="bg-secondary/5 pt-10 pb-20 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto mb-6">
           <Breadcrumbs onHomeClick={onHomeClick} steps={[{ label: 'Terms & Conditions' }]} />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="font-handdrawn text-3xl text-primary transform -rotate-2 inline-block mb-4">The Fine Print</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase text-slate-900 tracking-tight mb-6">
            Terms & Conditions
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium italic">
            "Simple rules for a smoother crunch."
          </p>
        </div>
        <span className="absolute top-10 left-10 font-handdrawn text-9xl opacity-5 rotate-12 select-none">RULES</span>
        <span className="absolute bottom-10 right-10 font-handdrawn text-9xl opacity-5 -rotate-12 select-none">LEGAL</span>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-[40px] shadow-xl border-2 border-slate-50 p-8 md:p-16 relative overflow-hidden prose prose-slate prose-lg max-w-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full pointer-events-none"></div>
          
          <p className="lead font-bold text-slate-900">Welcome to Pinobite!</p>
          <p>
            The terms and conditions define the rules and regulations for the use of Pinobite website, address <span className="text-primary font-black">pinobite.trioriginayurveda.com</span>
          </p>

          <p>
            By accessing and using the Pinobite website, it is assumed that you agree to abide by the terms and conditions outlined on this page. If you do not agree to these terms and conditions, please refrain from using the website.
          </p>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Definitions</h2>
          <p>
            The following terms and phrases pertain to these terms and conditions, the privacy statement, and the disclaimer notice, as well as any agreements: “Client,” “You,” and “Your” refer to the individual accessing the website, the user, and complying with the company’s terms and conditions. “The Company,” “Ourselves,” “We,” “Our,” and “Us” refer to our company. “Party,” “Parties,” or “Us” refer to both the client and ourselves. All terms are inclusive of the offer, acceptance, and consideration of payment required to provide assistance to the client in the most appropriate manner, with the goal of meeting the client’s needs and in accordance with the prevailing laws.
          </p>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Cookies</h2>
          <p>
            We utilize cookies on the Pinobite website. By accessing the website, you consent to the use of cookies in accordance with the Pinobite’s privacy policy. Cookies are commonly used by interactive websites to retrieve user details for each visit, and they enable certain areas of our website to function smoothly. Some of our affiliate and advertising partners may also use cookies.
          </p>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Intellectual Property Rights</h2>
          <p>
            Unless otherwise specified, Pinobite and/or its licensors hold the intellectual property rights for all content on the website. All intellectual property rights are reserved. You may access the website for personal use, subject to the restrictions set forth in these terms and conditions.
          </p>
          <p className="font-bold">You are prohibited from:</p>
          <ul>
            <li>Republishing material from the website</li>
            <li>Selling, renting, or sub-licensing material from the website</li>
            <li>Reproducing, duplicating, or copying material from the website</li>
            <li>Redistributing any material from the website</li>
          </ul>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">User Comments</h2>
          <p>
            This agreement begins on the date stated. Parts of the website allow users to post and exchange opinions and information in certain areas. Pinobite does not filter, edit, publish, or review comments prior to their presence on the website. Comments reflect the views and opinions of the individuals who post them and do not necessarily represent the views and opinions of Pinobite, its agents, or affiliates.
          </p>
          <p>
            Pinobite reserves the right to monitor all comments and remove any that are deemed inappropriate, offensive, or in violation of these terms and conditions.
          </p>
          <p>
            By posting comments on our website, you warrant and represent that you have the right to do so and possess all necessary licenses and consents. Your comments must not infringe upon any intellectual property rights of third parties, contain defamatory or offensive material, invade privacy, or be used for solicitation, promotion, or unlawful activities. By posting comments, you grant Pinobite a non-exclusive license to use, reproduce, edit, and authorize others to use and reproduce your comments in any form or media.
          </p>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Hyperlinking to Our Content</h2>
          <p>The following organizations may link to our website without prior written approval:</p>
          <ul>
            <li>Government agencies</li>
            <li>Search engines</li>
            <li>News organizations</li>
            <li>Online directory distributors</li>
            <li>System-wide Accredited Businesses</li>
          </ul>
          <p>
            These organizations may link to our home page, publications, or other website information as long as the link: (a) is not misleading; (b) does not falsely imply sponsorship, endorsement, or approval; and (c) is contextually relevant.
          </p>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Content Liability</h2>
          <p>
            We are not responsible for any content that appears on your website. You agree to defend and protect us against any claims arising from your website. Links should not be displayed on any website if they could be considered libelous, obscene, criminal, or if they infringe upon, violate, or advocate the infringement of any third-party rights.
          </p>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Reservation of Rights</h2>
          <p>
            We reserve the right to request the removal of any or all links to our website. You agree to promptly remove any links to our website upon request. We also reserve the right to amend these terms and conditions and our linking policy at any time. By continuing to link to our website, you are bound by and agree to follow these linking terms and conditions.
          </p>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Removal of Links</h2>
          <p>
            If you find any offensive links on our website, please feel free to contact us and inform us at any time. While we will consider requests to remove links, we are not obligated to do so or to respond directly to you.
          </p>

          <h2 className="text-2xl font-black uppercase text-slate-900 mt-12 mb-6 tracking-tight">Disclaimer</h2>
          <p>
            To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our website and its use. This disclaimer does not limit or exclude our or your liability for:
          </p>
          <ul>
            <li>death or personal injury;</li>
            <li>fraud or fraudulent misrepresentation;</li>
            <li>any liability that cannot be limited or excluded under applicable law.</li>
          </ul>
          <p>
            As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
