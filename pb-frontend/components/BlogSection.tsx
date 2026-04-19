
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

  if (!displayPosts || displayPosts.length === 0) {
    return (
      <section className="py-24 bg-whiteboard texture-overlay texture-speckles overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-slate-500">No blog posts available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-whiteboard texture-overlay texture-speckles overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="font-handdrawn text-2xl text-primary transform -rotate-1 inline-block mb-2">Knowledge Base</span>
            <h2 className="text-textured-green-big">
              The Wellness Journal
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 mt-6 font-medium max-w-xl">
              Nutrition tips, chef-curated recipes, and stories from our kitchen to yours.
            </p>
          </div>

          <button
            onClick={onViewAllClick}
            className="btn-greenboard group flex items-center gap-3 font-black uppercase tracking-widest text-sm px-10 py-5 rounded-full transition-all"
          >
            View All Articles
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {displayPosts.map((post) => (
            <div
              key={post.id}
              className="group cursor-pointer bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 p-6"
              onClick={() => onPostClick(post)}
            >
              {/* Header: Type and Read Time */}
              <div className="flex justify-between items-center mb-5">
                <span className="text-slate-400 font-bold text-[13px]">
                  {post.type === 'Recipe' ? 'Article' : post.type}
                </span>
                <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[13px]">
                  <span className="uppercase tracking-widest text-[10px]">reading time:</span>
                  {post.readTime} mins
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-slate-900 leading-snug mb-5 group-hover:text-primary transition-colors min-h-[3.5rem]">
                {post.title}
              </h3>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {(post.tags || ["Health", "Nutrition"]).map((tag, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-[11px] font-bold">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Image at the Bottom */}
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
      </div>
    </section>
  );
};

export default BlogSection;
