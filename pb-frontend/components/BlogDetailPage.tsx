import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { BlogPost } from '../types';
import { useToast } from './Toast';


interface BlogDetailPageProps {
  post: BlogPost;
  onBack: () => void;
  onHomeClick: () => void;
}

const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ post, onBack, onHomeClick }) => {
  const { showToast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: url,
        });
        return;
      } catch (err) {
        console.log('Native share failed or cancelled');
      }
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2500);
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2500);
      } catch (fallbackErr) {
        showToast("Please copy the URL from your browser's address bar.", 'info');
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-surface-container-low z-50">
        <div className="h-full bg-primary w-full origin-left transition-transform duration-1000"></div>
      </div>

      <main className="max-w-4xl mx-auto px-6 lg:px-0 pb-24 pt-20">
        {/* Hero Section */}
        <header className="mb-24 text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold uppercase tracking-widest mb-6">
            {post.type} Feature
          </span>
          <h1 className="text-6xl md:text-8xl font-black text-on-background tracking-tighter leading-[0.9] mb-8 font-headline uppercase">
            {post.title}
          </h1>
          {post.subtitle && (
            <p className="text-xl md:text-2xl text-on-surface-variant font-medium leading-relaxed max-w-3xl mx-auto mb-10">
              {post.subtitle}
            </p>
          )}
          
          <div className="mt-10 flex items-center justify-center gap-4">
             <div className="w-14 h-14 rounded-full bg-surface-container-high overflow-hidden border-2 border-primary ring-4 ring-primary/10 shadow-lg">
               <img
                 src={post.author_image || `https://ui-avatars.com/api/?name=${post.author}&background=008a45&color=fff`}
                 alt={post.author}
                 className="w-full h-full object-cover"
               />
             </div>
             <div className="text-left">
               <p className="text-sm font-black uppercase text-on-background tracking-tight">{post.author}</p>
               <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-70">
                 {post.author_role || 'Pinobite Expert'} • {post.date}
               </p>
             </div>
          </div>
        </header>

        {/* Image Bleed */}
        <div className="mb-24 -mx-4 md:-mx-20 relative group">
          <img 
            className="w-full h-[400px] md:h-[600px] object-cover rounded-3xl shadow-2xl transition-transform duration-700 group-hover:scale-[1.01]" 
            src={post.image} 
            alt={post.title}
          />
          <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/10"></div>
        </div>

        {/* Intro Section & Key Points Grid */}
        <div className="mb-24">
          {post.intro_heading && (
            <h2 className="text-4xl md:text-5xl font-black text-on-background mb-10 leading-tight">
              {post.intro_heading}
            </h2>
          )}
          
          {post.key_points && post.key_points.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {post.key_points.map((point, idx) => (
                <div key={idx} className="p-8 bg-surface-container-low rounded-3xl border border-surface-variant/20 hover:border-primary/30 transition-colors">
                  <h3 className="text-xl font-black text-primary uppercase mb-4 tracking-tight">{point.title}</h3>
                  <p className="text-on-surface-variant leading-relaxed font-medium">
                    {point.desc}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Secondary Image & History/Intro Content */}
        {post.secondary_image && (
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div className="order-2 md:order-1">
              <img src={post.secondary_image} alt="Process" className="w-full rounded-3xl shadow-xl aspect-[4/5] object-cover" />
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">The Heritage</span>
              <h2 className="text-3xl font-black text-on-background uppercase leading-none">Rooted in Tradition</h2>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          </div>
        )}

        {/* Featured Quote Section */}
        {post.featured_quote && (
          <div className="mb-24 p-12 md:p-20 bg-primary-container/30 rounded-[3rem] border border-primary/10 relative overflow-hidden text-center">
            <span className="material-symbols-outlined text-8xl text-primary/10 absolute -top-4 -left-4 rotate-12 select-none">format_quote</span>
            <blockquote className="relative z-10">
              <p className="text-3xl md:text-4xl font-black text-on-primary-container italic leading-tight tracking-tight">
                "{post.featured_quote}"
              </p>
            </blockquote>
          </div>
        )}

        {/* Rich Text Content */}
      <article className="prose prose-lg max-w-none mb-24 font-body">
        <div
          className="space-y-8 text-on-surface-variant text-xl leading-[1.8] article-content"
          dangerouslySetInnerHTML={{ 
            __html: DOMPurify.sanitize(post.content) 
          }}
        />
      </article>

        {/* Health Benefits & Tertiary Image */}
        {(post.health_benefits?.length || 0) > 0 && (
          <div className="grid md:grid-cols-2 gap-16 mb-24 items-start">
            <div className="space-y-10">
              <h2 className="text-4xl font-black text-on-background uppercase tracking-tighter">Nutrition & Benefits</h2>
              <div className="space-y-8">
                {post.health_benefits?.map((benefit, idx) => (
                  <div key={idx} className="flex gap-6 items-start">
                    <span className="text-4xl font-black text-primary/20 leading-none">{(idx + 1).toString().padStart(2, '0')}</span>
                    <div>
                      <h4 className="text-lg font-black text-on-background uppercase mb-2">{benefit.title}</h4>
                      <p className="text-on-surface-variant font-medium leading-relaxed">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {post.tertiary_image && (
              <div className="relative group">
                <img src={post.tertiary_image} alt="Benefits" className="w-full rounded-[2.5rem] shadow-2xl grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary rounded-full flex items-center justify-center text-white p-6 text-center text-[10px] font-black uppercase tracking-widest shadow-xl rotate-12 group-hover:rotate-0 transition-transform">
                  Power Packed
                </div>
              </div>
            )}
          </div>
        )}

        {/* Fun Facts Section */}
        {post.facts_list && post.facts_list.length > 0 && (
          <div className="mb-24 p-10 bg-surface-container-high rounded-3xl border-2 border-primary/5">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-8 flex items-center gap-3">
              <span className="w-12 h-[1px] bg-primary/20"></span>
              Fascinating Facts
            </h3>
            <ul className="grid md:grid-cols-2 gap-6">
              {post.facts_list.map((fact, idx) => (
                <li key={idx} className="flex gap-4 items-start text-on-surface">
                  <span className="material-symbols-outlined text-primary text-xl">verified</span>
                  <span className="font-bold text-lg leading-snug">{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Usage / Recipes Footer Section */}
        {post.usage_recipes && post.usage_recipes.length > 0 && (
          <div className="mb-24 pt-16 border-t border-surface-variant/30">
            <h2 className="text-4xl font-black text-on-background uppercase text-center mb-16 tracking-tighter">Delicious Ways to Enjoy</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              {post.usage_recipes.map((recipe, idx) => (
                <div key={idx} className="flex flex-col items-center text-center group cursor-pointer">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-surface-container shadow-xl mb-6 group-hover:border-primary transition-colors duration-500 ring-8 ring-transparent group-hover:ring-primary/10">
                    <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">{recipe.title}</h4>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60 leading-relaxed px-4">
                    {recipe.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Share & Like Section */}
        <div className="max-w-3xl mx-auto mt-16 pt-12 border-t border-surface-variant flex justify-between items-center relative">
          <div className="flex gap-4">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isLiked ? 'bg-error-container text-error shadow-md scale-110' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              <span className={`material-symbols-outlined text-2xl ${isLiked ? 'fill-1' : ''}`}>favorite</span>
            </button>
            <button
              onClick={handleShare}
              className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-all active:scale-95 shadow-sm"
            >
              <span className="material-symbols-outlined text-2xl">share</span>
            </button>
          </div>

          <div className="flex flex-col items-end">
            <p className="text-xs font-black uppercase text-on-surface-variant tracking-[0.2em] mb-2">Share this story</p>
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-fixed-dim"></span>
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="w-2 h-2 rounded-full bg-primary-container"></span>
            </div>
          </div>

          {/* Copy Success Feedback */}
          {showCopied && (
            <div className="absolute -top-12 left-0 bg-inverse-surface text-inverse-on-surface text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
              Link Copied!
            </div>
          )}
        </div>
      </main>

      <style>{`
        .article-content h2 { 
          font-family: 'Epilogue', sans-serif;
          font-size: 2.5rem; 
          font-weight: 800; 
          color: var(--color-on-background);
          margin-top: 4rem;
          margin-bottom: 2rem;
          letter-spacing: -0.02em;
        }
        .article-content h3 { 
          font-family: 'Epilogue', sans-serif;
          font-size: 1.875rem; 
          font-weight: 700; 
          color: var(--color-on-background);
          margin-top: 3rem;
          margin-bottom: 1.5rem;
        }
        .article-content p { 
          margin-bottom: 1.5rem; 
          line-height: 1.8;
          color: var(--color-on-surface-variant);
        }
        .article-content strong {
          color: var(--color-on-background);
          font-weight: 700;
        }
        .article-content blockquote {
          border-left: 8px solid var(--color-primary);
          background-color: var(--color-surface-container-low);
          padding: 2.5rem;
          border-radius: 0.75rem;
          font-style: italic;
          font-size: 1.25rem;
          color: var(--color-on-surface);
          margin: 3rem 0;
        }
        .article-content ul, .article-content ol {
          margin-bottom: 2rem;
          padding-left: 1.5rem;
        }
        .article-content li {
          margin-bottom: 0.75rem;
          padding-left: 0.5rem;
        }
        .article-content img {
          border-radius: 1rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          margin: 3rem 0;
        }
      `}</style>
    </div>
  );
};

export default BlogDetailPage;
