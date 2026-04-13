import React, { useState } from 'react';
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

    // Check if it's a mobile device and supports native sharing
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

    // Regular Clipboard Copy
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2500);
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch (err) {
      // Legacy Fallback
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
    <div className="bg-[#f2f2ec] min-h-screen pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="fixed top-20 left-0 w-full h-1 bg-slate-100 z-30">
        <div className="h-full bg-primary w-1/3 transition-all duration-1000" style={{ width: '100%' }}></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-12">


        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="bg-secondary text-slate-900 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
              {post.type}
            </span>
            <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              {post.date}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              {post.readTime} mins
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase text-slate-900 leading-tight mb-8">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden">
              <img
                src={`https://ui-avatars.com/api/?name=${post.author}&background=random`}
                alt={post.author}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <p className="text-xs font-black uppercase text-slate-900">By {post.author}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pinobite Contributor</p>
            </div>
          </div>
        </header>

        <div className="rounded-[40px] overflow-hidden shadow-2xl mb-16 aspect-video">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <article className="prose prose-lg prose-slate mx-auto max-w-3xl">
          <p className="lead text-xl font-medium text-slate-600 mb-8 border-l-4 border-primary pl-6 italic">
            {post.excerpt}
          </p>

          <div
            className="space-y-6 text-slate-800 leading-relaxed article-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <style>{`
            .article-content h1 { font-size: 2.25rem; font-weight: 900; margin-bottom: 1.5rem; text-transform: uppercase; }
            .article-content h2 { font-size: 1.875rem; font-weight: 900; margin-top: 2rem; margin-bottom: 1rem; text-transform: uppercase; }
            .article-content h3 { font-size: 1.5rem; font-weight: 800; margin-top: 1.5rem; margin-bottom: 0.75rem; }
            .article-content p { margin-bottom: 1.25rem; }
            .article-content a { color: #80c441; font-weight: 700; text-decoration: underline; }
            .article-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.25rem; }
            .article-content ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.25rem; }
            .article-content li { margin-bottom: 0.5rem; }
            .article-content strong { font-weight: 800; }
          `}</style>
        </article>

        <div className="max-w-3xl mx-auto mt-16 pt-8 border-t border-slate-100 flex justify-between items-center relative">
          <div className="flex gap-4">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${isLiked ? 'bg-red-50 border-red-200 text-red-500 shadow-sm' : 'border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <span className={`material-symbols-outlined text-xl ${isLiked ? 'fill-1' : ''}`}>favorite</span>
            </button>
            <button
              onClick={handleShare}
              className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-xl">share</span>
            </button>
          </div>

          <div className="flex flex-col items-end">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Share this story</p>
            <div className="flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/20"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
            </div>
          </div>

          {/* Copy Success Feedback */}
          {showCopied && (
            <div className="absolute -top-12 left-0 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
              Link Copied!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
