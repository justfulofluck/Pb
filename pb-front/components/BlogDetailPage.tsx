
import React from 'react';
import { BlogPost } from '../types';
import Breadcrumbs from './Breadcrumbs';

interface BlogDetailPageProps {
  post: BlogPost;
  onBack: () => void;
  onHomeClick: () => void;
}

const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ post, onBack, onHomeClick }) => {
  return (
    <div className="bg-white min-h-screen pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="fixed top-20 left-0 w-full h-1 bg-slate-100 z-30">
        <div className="h-full bg-primary w-1/3"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-12">
        <Breadcrumbs 
          onHomeClick={onHomeClick} 
          steps={[
            { label: 'Articles', onClick: onBack },
            { label: post.title }
          ]} 
          className="mb-8"
        />

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
               {post.readTime}
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
          
          <div className="space-y-6 text-slate-800 leading-relaxed">
            {post.content && post.content.length > 0 ? (
              post.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))
            ) : (
              <p>Content loading...</p>
            )}
          </div>
        </article>
        
        <div className="max-w-3xl mx-auto mt-16 pt-8 border-t border-slate-100 flex justify-between items-center">
           <div className="flex gap-4">
             <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-colors">
               <span className="material-symbols-outlined text-lg">favorite</span>
             </button>
             <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-colors">
               <span className="material-symbols-outlined text-lg">share</span>
             </button>
           </div>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Share this story</p>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
