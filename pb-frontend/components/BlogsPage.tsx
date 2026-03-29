
import React, { useState } from 'react';
import { BlogPost } from '../types';

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
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#f2f2ec] min-h-screen animate-in fade-in duration-500">
      <div className="bg-[#e0f2f1] text-slate-900 pt-10 pb-20 px-4 relative overflow-hidden">

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="font-handdrawn text-3xl text-primary transform -rotate-2 inline-block mb-4">Read, Cook, Eat, Repeat</span>
          <h1 className="text-5xl md:text-8xl font-normal !normal-case tracking-tight mb-6 font-anton leading-[0.9]">
            The daily crunch
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Your go-to source for healthy recipes, nutrition deep-dives, and behind-the-scenes stories from the Pinobite kitchen.
          </p>
        </div>
        <span className="absolute top-10 left-10 text-9xl opacity-5 font-black text-primary select-none hidden md:block rotate-12">YUM</span>
        <span className="absolute bottom-10 right-10 text-9xl opacity-5 font-black text-secondary select-none hidden md:block -rotate-12">READ</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative group">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
              <span className="material-symbols-outlined">search</span>
            </span>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0 outline-none text-lg font-bold text-slate-700 transition-all bg-white"
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-16 flex-wrap">
          {['All', 'Recipe', 'Lifestyle', 'News'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all font-satoshi ${filter === cat
                ? 'bg-slate-900 text-white shadow-xl -translate-y-1'
                : 'bg-white border-2 border-slate-100 text-slate-400 hover:border-slate-900 hover:text-slate-900'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => onBlogClick(post)}
                className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 p-6 cursor-pointer"
              >
                <div className="flex justify-between items-center mb-5">
                  <span className="text-slate-400 font-bold text-[13px]">
                    {post.type === 'Recipe' ? 'Article' : post.type}
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[13px]">
                    <span className="material-symbols-outlined text-[18px]">hourglass_empty</span>
                    {post.readTime}
                  </div>
                </div>

                <h3 className="text-xl font-normal text-primary leading-snug mb-5 transition-colors min-h-[3.5rem] font-anton !normal-case tracking-tight">
                  {post.title}
                </h3>

                <div className="flex flex-wrap gap-2 mb-8">
                  {(post.tags || ["Health", "Nutrition"]).map((tag, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-[11px] font-bold">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto aspect-[16/9] rounded-xl overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">menu_book</span>
            <p className="text-2xl font-satoshi text-slate-400">No stories found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
