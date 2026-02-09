
import React from 'react';
import { BlogPost } from '../types';

interface BlogSectionProps {
  posts: BlogPost[];
  onPostClick: (post: BlogPost) => void;
  onViewAllClick: () => void;
}

const BlogSection: React.FC<BlogSectionProps> = ({ posts, onPostClick, onViewAllClick }) => {
  // Display only the first 3 posts
  const displayPosts = posts.slice(0, 3);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="font-handdrawn text-2xl text-secondary transform -rotate-1 inline-block mb-2">Read, Cook, Eat</span>
            <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tight leading-none">
              The Daily Crunch
            </h2>
            <p className="text-lg text-slate-600 mt-4 font-medium">
              Nutrition tips, chef-curated recipes, and stories from our kitchen to yours.
            </p>
          </div>
          
          <button 
            onClick={onViewAllClick}
            className="group flex items-center gap-2 font-black uppercase tracking-widest text-sm hover:text-primary transition-colors"
          >
            View All Articles
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {displayPosts.map((post) => (
            <div 
              key={post.id} 
              className="group cursor-pointer flex flex-col h-full"
              onClick={() => onPostClick(post)}
            >
              <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-6 relative">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900">
                  {post.type}
                </span>
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>{post.readTime}</span>
                </div>
                
                <h3 className="text-xl font-black uppercase text-slate-900 leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-slate-500 font-medium text-sm leading-relaxed line-clamp-2 mb-4">
                  {post.excerpt}
                </p>
                
                <span className="text-primary font-bold text-xs uppercase tracking-widest mt-auto group-hover:underline">
                  Read Article
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
