import React, { useState } from 'react';
import { BlogPost } from '../types';
import { getMediaUrl } from '../utils/mediaHelper';

interface BlogsPageProps {
  posts: BlogPost[];
  onBlogClick: (post: BlogPost) => void;
  onHomeClick: () => void;
}

const BlogsPage: React.FC<BlogsPageProps> = ({ posts, onBlogClick, onHomeClick }) => {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = posts.filter(post => {
    const matchesCategory = filter === 'All' || post.type === filter;
    const matchesSearch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.author && post.author.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#f2f2ec] min-h-screen font-satoshi animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-[#e0f2f1] text-slate-900 pt-10 sm:pt-14 pb-14 sm:pb-20 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="font-handdrawn text-2xl sm:text-3xl text-primary transform -rotate-2 inline-block mb-3 sm:mb-4">
            Read, Cook, Eat, Repeat
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-normal uppercase tracking-wide mb-3 sm:mb-5 !font-anton leading-tight">
            The Wellness Journal
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed px-2">
            Your go-to source for healthy recipes, nutrition deep-dives, and behind-the-scenes stories from the Pinobite kitchen.
          </p>
        </div>
        <span className="absolute top-10 left-10 text-8xl md:text-9xl opacity-5 font-handdrawn text-primary select-none hidden md:block rotate-12">YUM</span>
        <span className="absolute bottom-10 right-10 text-8xl md:text-9xl opacity-5 font-handdrawn text-secondary select-none hidden md:block -rotate-12">READ</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        
        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8 sm:mb-12">
          <div className="relative group">
            <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
              <span className="material-symbols-outlined text-xl sm:text-2xl">search</span>
            </span>
            <input
              type="text"
              placeholder="Search articles, recipes, tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-3.5 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0 outline-none text-sm sm:text-base font-bold text-slate-700 transition-all bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex justify-center gap-2 sm:gap-3 mb-10 sm:mb-14 flex-wrap">
          {['All', 'Recipe', 'Lifestyle', 'News'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 sm:px-7 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer ${filter === cat
                ? 'bg-slate-900 text-white shadow-md -translate-y-0.5'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-900'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Post Cards Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => onBlogClick(post)}
                className="group bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 p-5 sm:p-6 cursor-pointer hover:-translate-y-1"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary font-bold text-[11px] uppercase tracking-wider">
                    {post.type === 'Recipe' ? 'Recipe' : post.type}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 font-bold text-[11px]">
                    <span className="uppercase tracking-widest text-[9px]">Read:</span>
                    <span>{post.read_time || post.readTime || '5 min'}</span>
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-normal text-slate-900 group-hover:text-primary leading-snug mb-3 transition-colors min-h-[3rem] !font-anton uppercase tracking-wide">
                  {post.title}
                </h3>

                {post.excerpt && (
                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mb-4 font-medium leading-relaxed">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
                  {(post.tags || ["Health", "Nutrition"]).slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={getMediaUrl(post.image)}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">menu_book</span>
            <p className="text-lg sm:text-xl font-satoshi text-slate-400 font-medium">No stories found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
