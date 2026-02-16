import React from 'react';
import { EDUCATION_ARTICLES } from '../constants';
import { Search, SlidersHorizontal, Bookmark, Clock, ChevronRight } from 'lucide-react';

export const Education: React.FC = () => {
  const images = [
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=300&fit=crop'
  ];

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 bg-white">
      <div className="space-y-1">
        <h2 className="text-3xl font-serif font-black text-brand-purple">Library</h2>
        <p className="text-[10px] font-sans font-black text-brand-pink uppercase tracking-widest">Expert Guidance & Insights</p>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 bg-brand-grey/50 border border-brand-purple/10 rounded-2xl p-4 flex items-center gap-3 focus-within:border-brand-purple focus-within:bg-white transition-all">
          <Search size={18} className="text-brand-purple/30" />
          <input 
            className="bg-transparent text-sm focus:outline-none w-full text-brand-black placeholder:text-brand-purple/20 font-bold" 
            placeholder="Search topics, symptoms..." 
          />
        </div>
        <button className="p-4 bg-brand-grey/50 border border-brand-purple/10 rounded-2xl text-brand-purple/40 hover:text-brand-purple transition-all">
          <SlidersHorizontal size={18} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-brand-purple uppercase tracking-widest">Featured Today</h3>
            <button className="text-[10px] font-black text-brand-pink uppercase tracking-widest hover:underline">View All</button>
        </div>
        <div className="relative group rounded-[2.5rem] overflow-hidden aspect-[16/10] bg-brand-grey shadow-xl border border-brand-purple/5">
            <img src={images[0]} className="w-full h-full object-cover opacity-90 transition-transform group-hover:scale-105" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-brand-purple/90 via-brand-purple/20 to-transparent">
                <span className="px-3 py-1 bg-white text-brand-black rounded-lg text-[10px] font-black uppercase mb-3 self-start shadow-lg">Daily Read</span>
                <h4 className="text-2xl font-serif font-black text-white leading-tight">Understanding Your Cycle Phase by Phase</h4>
                <p className="text-xs text-white/70 mt-2 flex items-center gap-2 font-medium">
                    <Clock size={12} /> 5 min read
                </p>
            </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black text-brand-purple uppercase tracking-widest">Picked for You</h3>
        <div className="space-y-4">
            {EDUCATION_ARTICLES.map((article, idx) => (
                <div key={article.id} className="bg-white shadow-sm border border-brand-purple/5 rounded-[2rem] p-4 flex gap-5 hover:bg-brand-pink/5 transition-all cursor-pointer group">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                        <img src={images[(idx % 3) + 1]} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                            <span className="text-[9px] font-black text-brand-pink uppercase tracking-[0.15em]">{article.category}</span>
                            <h4 className="font-serif font-black text-brand-purple text-base leading-tight mt-0.5 group-hover:text-brand-pink transition-colors">{article.title}</h4>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-brand-purple/40 font-black">
                            <span className="flex items-center gap-1"><Clock size={10} /> {article.readTime} read</span>
                            <Bookmark size={14} className="text-brand-purple/20 group-hover:text-brand-pink transition-colors" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
      
      <div className="pt-4">
        <button className="w-full py-5 bg-brand-pink text-brand-black font-sans font-black rounded-3xl shadow-lg flex items-center justify-center gap-2 transition-all hover:bg-brand-purple hover:text-white active:scale-95">
          Browse Full Library <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};