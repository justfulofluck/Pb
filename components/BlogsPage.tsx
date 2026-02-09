
import React, { useState } from 'react';
import { BLOG_DATA, BlogPost } from '../types';

interface BlogsPageProps {
  onBlogClick: (post: BlogPost) => void;
}

const BlogsPage: React.FC<BlogsPageProps> = ({ onBlogClick }) => {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = BLOG_DATA.filter(post => {
    const matchesCategory = filter === 'All' || post.type === filter;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const showFeatured = filter === 'All' && !searchQuery && BLOG_DATA.length > 0;
  const gridPosts = showFeatured ? filteredPosts.slice(1) : filteredPosts;

  return (
    <div className="bg-background-light min-h-screen animate-in fade-in duration-500">
      {/* Header Banner */}
      <div className="bg-[#e0f2f1] text-slate-900 py-20 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="font-handdrawn text-3xl text-primary transform -rotate-2 inline-block mb-4">Read, Cook, Eat, Repeat</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6">
            The Daily Crunch
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Your go-to source for healthy recipes, nutrition deep-dives, and behind-the-scenes stories from the Pinobite kitchen.
          </p>
        </div>
        
        {/* Decorative elements */}
        <span className="absolute top-10 left-10 text-9xl opacity-5 font-black text-primary select-none hidden md:block rotate-12">YUM</span>
        <span className="absolute bottom-10 right-10 text-9xl opacity-5 font-black text-secondary select-none hidden md:block -rotate-12">READ</span>
        
        <div className="absolute top-1/2 left-20 w-16 h-16 bg-secondary/20 rounded-full animate-bounce hidden lg:block"></div>
        <div className="absolute bottom-20 right-1/3 w-8 h-8 bg-primary/20 rotate-45 hidden lg:block"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative group">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
              <span className="material-symbols-outlined">search</span>
            </span>
            <input 
              type="text" 
              placeholder="Search articles, recipes, or authors..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-full border-2 border-slate-200 focus:border-primary focus:ring-0 outline-none text-lg font-bold text-slate-700 transition-all bg-white shadow-sm hover:shadow-md"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-4 mb-16 flex-wrap">
          {['All', 'Recipe', 'Lifestyle', 'News'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest transition-all ${
                filter === cat 
                  ? 'bg-slate-900 text-white shadow-xl -translate-y-1' 
                  : 'bg-white border-2 border-slate-100 text-slate-400 hover:border-slate-900 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Post (First item if All and no search) */}
        {showFeatured && (
          <div className="mb-20">
            <div 
              onClick={() => onBlogClick(BLOG_DATA[0])}
              className="group relative rounded-[40px] overflow-hidden doodle-border bg-white shadow-xl grid md:grid-cols-2 gap-0 cursor-pointer"
            >
              <div className="h-96 md:h-auto overflow-hidden">
                <img 
                  src={BLOG_DATA[0].image} 
                  alt={BLOG_DATA[0].title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-10 md:p-16 flex flex-col justify-center space-y-6">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                  <span className="bg-secondary text-slate-900 px-3 py-1 rounded-full">{BLOG_DATA[0].type}</span>
                  <span className="text-slate-400">{BLOG_DATA[0].date}</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black uppercase text-slate-900 leading-tight group-hover:text-primary transition-colors">
                  {BLOG_DATA[0].title}
                </h2>
                <p className="text-slate-600 text-lg font-medium leading-relaxed line-clamp-3">
                  {BLOG_DATA[0].excerpt}
                </p>
                <div className="flex items-center gap-4 pt-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                     <img src={`https://ui-avatars.com/api/?name=${BLOG_DATA[0].author}&background=random`} alt={BLOG_DATA[0].author} />
                  </div>
                  <div className="text-xs">
                    <p className="font-black text-slate-900 uppercase">{BLOG_DATA[0].author}</p>
                    <p className="text-slate-500 font-bold">{BLOG_DATA[0].readTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Grid */}
        {gridPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {gridPosts.map((post) => (
              <div 
                key={post.id} 
                onClick={() => onBlogClick(post)}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-slate-100 flex flex-col h-full cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <span className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                    {post.type}
                  </span>
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-8 flex flex-col flex-1 space-y-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex justify-between">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-black uppercase leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>
                  <button className="text-primary font-black text-xs uppercase tracking-widest hover:underline flex items-center gap-2 mt-4">
                    Read Article
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">menu_book</span>
            <p className="text-2xl font-handdrawn text-slate-400">No stories found matching your search.</p>
            <button 
              onClick={() => {setSearchQuery(''); setFilter('All');}}
              className="text-primary font-bold hover:underline mt-2"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-24 bg-slate-900 rounded-[40px] p-12 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-black uppercase text-white">Never Miss a Recipe</h2>
            <p className="text-slate-400 text-lg">Join 50,000+ foodies getting weekly health tips and exclusive discounts right in their inbox.</p>
            <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-primary text-slate-900 font-bold"
              />
              <button className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase hover:shadow-lg hover:bg-opacity-90 transition-all">
                Subscribe
              </button>
            </form>
          </div>
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
