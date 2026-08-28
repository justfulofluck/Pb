import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { BlogPost } from '../types';
import { getMediaUrl } from '../utils/mediaHelper';
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

  const formattedContent = Array.isArray(post.content)
    ? post.content.map((p, i) => `<p key="${i}">${p}</p>`).join('')
    : (typeof post.content === 'string' ? post.content : '');

  return (
    <div className="bg-[#f2f2ec] text-slate-900 font-satoshi min-h-screen animate-in fade-in duration-300">
      
      {/* Top Header / Breadcrumb Bar */}
      <div className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-3.5 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600 hover:text-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base sm:text-lg">arrow_back</span>
            <span>Back to Articles</span>
          </button>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-1.5 sm:p-2 rounded-full transition-all cursor-pointer ${isLiked ? 'bg-red-50 text-red-500' : 'text-slate-400 hover:text-red-500 hover:bg-slate-100'}`}
              title="Like this article"
            >
              <span className={`material-symbols-outlined text-lg sm:text-xl ${isLiked ? 'fill-1 text-red-500' : ''}`}>favorite</span>
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-primary hover:bg-slate-100 transition-all cursor-pointer relative"
              title="Share article"
            >
              <span className="material-symbols-outlined text-lg sm:text-xl">share</span>
              {showCopied && (
                <div className="absolute right-0 top-9 sm:top-10 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg shadow-xl whitespace-nowrap z-50">
                  Copied!
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        
        {/* Article Header */}
        <header className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3.5 sm:mb-5">
            {post.type || 'Lifestyle'} Feature
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal uppercase text-slate-900 tracking-wide leading-[1.18] sm:leading-[1.15] !font-anton mb-4 sm:mb-6">
            {post.title}
          </h1>

          {post.subtitle && (
            <p className="text-sm sm:text-base md:text-lg text-slate-600 font-medium leading-relaxed mb-6 sm:mb-8 px-2 sm:px-0">
              {post.subtitle}
            </p>
          )}

          {/* Author & Date Bar - Responsive pill on mobile & desktop */}
          <div className="inline-flex items-center gap-3 sm:gap-4 p-1.5 sm:p-2 pr-4 sm:pr-5 rounded-2xl sm:rounded-full bg-white border border-slate-200/80 shadow-sm max-w-full">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 overflow-hidden shrink-0">
              <img
                src={post.author_image ? getMediaUrl(post.author_image) : `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author || 'Pinobite')}&background=008a45&color=fff`}
                alt={post.author}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <p className="text-[11px] sm:text-xs font-black uppercase text-slate-900 tracking-tight leading-tight">{post.author || 'Pinobite Team'}</p>
              <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 leading-tight">
                {post.author_role || 'Nutrition Specialist'} • {post.date} • {post.read_time || '5 min read'}
              </p>
            </div>
          </div>
        </header>

        {/* Hero Cover Image */}
        {post.image && (
          <div className="mb-8 sm:mb-12 md:mb-16 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl border border-slate-200/60 bg-white">
            <img 
              className="w-full aspect-[16/10] sm:aspect-[16/9] md:max-h-[480px] object-cover" 
              src={getMediaUrl(post.image)} 
              alt={post.title}
            />
          </div>
        )}

        {/* Intro Heading & Key Takeaways Grid */}
        {(post.intro_heading || (post.key_points && post.key_points.length > 0)) && (
          <div className="mb-8 sm:mb-12 md:mb-16">
            {post.intro_heading && (
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal uppercase text-slate-900 tracking-wide !font-anton mb-4 sm:mb-6">
                {post.intro_heading}
              </h2>
            )}

            {post.key_points && post.key_points.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4 md:gap-5">
                {post.key_points.map((point: any, idx: number) => {
                  const title = typeof point === 'object' && point !== null ? (point.title || '') : '';
                  const desc = typeof point === 'object' && point !== null ? (point.desc || point.description || '') : String(point);
                  return (
                    <div key={idx} className="p-4 sm:p-5 bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-start">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-[11px] sm:text-xs shrink-0 mb-2.5">
                        {idx + 1}
                      </div>
                      {title && <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-tight mb-1">{title}</h3>}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                        {desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Featured Pull Quote */}
        {post.featured_quote && (
          <div className="mb-8 sm:mb-12 md:mb-16 p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-white border-l-4 border-primary shadow-sm text-center">
            <p className="font-handdrawn text-xl sm:text-2xl md:text-3xl text-primary font-bold leading-snug">
              "{post.featured_quote}"
            </p>
          </div>
        )}

        {/* Main Article Prose Content */}
        <article className="prose prose-slate prose-sm sm:prose-base md:prose-lg max-w-none mb-10 sm:mb-14 text-slate-700 leading-relaxed font-medium font-satoshi article-body">
          <div
            className="space-y-4 sm:space-y-6"
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(formattedContent) 
            }}
          />
        </article>

        {/* Health Benefits Section */}
        {post.health_benefits && post.health_benefits.length > 0 && (
          <div className="mb-10 sm:mb-14 p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 shadow-sm">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-normal uppercase text-slate-900 tracking-wide !font-anton mb-6 sm:mb-8">
              Nutrition & Health Benefits
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {post.health_benefits.map((benefit: any, idx: number) => (
                <div key={idx} className="flex gap-3 sm:gap-4 items-start">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5 shadow-sm">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-tight mb-1">{benefit.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fascinating Facts List */}
        {post.facts_list && post.facts_list.length > 0 && (
          <div className="mb-10 sm:mb-14 p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <h4 className="text-xs font-black uppercase tracking-widest text-amber-800 mb-3 sm:mb-4 flex items-center gap-2">
              <span>💡</span> Did You Know?
            </h4>
            <ul className="space-y-2.5 sm:space-y-3">
              {post.facts_list.map((fact: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-amber-900 font-medium leading-relaxed">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags & Bottom Footer Navigation */}
        <div className="pt-6 sm:pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Tags:</span>
              {post.tags.map((tag: string, idx: number) => (
                <span key={idx} className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg bg-white border border-slate-200 text-[11px] sm:text-xs font-semibold text-slate-600">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <button
            onClick={onBack}
            className="w-full sm:w-auto text-center px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all cursor-pointer shadow-md"
          >
            ← Back to Blog
          </button>
        </div>

      </main>

      <style>{`
        .article-body h2 {
          font-family: 'Anton', sans-serif;
          font-size: 1.5rem;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.025em;
          color: #0f172a;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        @media (min-width: 640px) {
          .article-body h2 {
            font-size: 1.875rem;
            margin-top: 2.5rem;
            margin-bottom: 1rem;
          }
        }
        .article-body h3 {
          font-family: 'Anton', sans-serif;
          font-size: 1.25rem;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.025em;
          color: #0f172a;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        @media (min-width: 640px) {
          .article-body h3 {
            font-size: 1.5rem;
            margin-top: 2rem;
            margin-bottom: 0.75rem;
          }
        }
        .article-body p {
          margin-bottom: 1rem;
          line-height: 1.7;
          color: #334155;
        }
        @media (min-width: 640px) {
          .article-body p {
            margin-bottom: 1.25rem;
            line-height: 1.75;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogDetailPage;
