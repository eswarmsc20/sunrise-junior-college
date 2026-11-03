import React, { useState } from 'react';
import { Image, X, ZoomIn, Eye, Sparkles } from 'lucide-react';
import { galleryData } from '../data/collegeData';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeImage, setActiveImage] = useState(null);

  const categories = ['All', 'Campus', 'Classrooms', 'Hostels', 'Administration'];

  const filteredItems = selectedCategory === 'All'
    ? galleryData
    : galleryData.filter(item => item.category === selectedCategory);

  return (
    <section id="gallery" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <Image className="w-3.5 h-3.5 text-amber-700" />
            <span>Campus Visuals</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Sunrise College Photo Gallery
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            A glimpse into life at Sunrise Junior College, Srikakulam — where discipline meets learning.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
              onClick={() => setActiveImage(item)}
            >
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition">
                    <ZoomIn className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                  {item.category}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-700 transition">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[75vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activeImage.src}
                alt={activeImage.title}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                  {activeImage.category}
                </span>
                <h3 className="text-lg font-bold mt-0.5">{activeImage.title}</h3>
                <p className="text-xs text-slate-300 mt-1">{activeImage.desc}</p>
              </div>
              <button
                onClick={() => setActiveImage(null)}
                className="bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl hover:bg-amber-400 transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
