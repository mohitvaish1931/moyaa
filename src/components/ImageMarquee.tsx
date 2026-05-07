import React from 'react';
import { useAppContext } from '../context/AppContext';

const ImageMarquee = () => {
  const { state } = useAppContext();
  
  // Filter for image banners only
  const imageBanners = state.banners?.filter(b => b.type === 'image-banner') || [];

  if (imageBanners.length === 0) return null;

  return (
    <section className="bg-luxury-dark py-16 overflow-hidden relative border-y border-gold-primary/10">
      <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
        <h2 className="luxury-serif text-3xl md:text-4xl text-text-primary mb-4 tracking-widest">CURATED COLLECTIONS</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-primary to-transparent mx-auto"></div>
      </div>

      <div className="relative group">
        <div className="flex whitespace-nowrap animate-scroll-slow will-change-transform">
          {/* Repeat the images multiple times for a continuous loop */}
          {[...Array(4)].map((_, loopIdx) => (
            <React.Fragment key={loopIdx}>
              {imageBanners.map((banner, idx) => (
                <div key={`${loopIdx}-${idx}`} className="inline-block px-4">
                  <div className="relative group/item overflow-hidden rounded-2xl shadow-xl border border-gold-primary/20 aspect-[4/5] h-[400px] w-auto">
                    <img 
                      src={banner.image} 
                      alt={banner.text || 'Collection'} 
                      className="h-full w-full object-cover transform scale-100 group-hover/item:scale-110 transition-transform duration-[2000ms]"
                    />
                    {banner.text && banner.text !== 'Image Banner' && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-end pb-8">
                        <span className="text-white font-bold tracking-[0.4em] uppercase text-xs text-center px-4 transform translate-y-4 group-hover/item:translate-y-0 transition-transform duration-500">
                          {banner.text}
                        </span>
                        <div className="w-12 h-0.5 bg-gold-primary mt-4 transform scale-x-0 group-hover/item:scale-x-100 transition-transform duration-700"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageMarquee;
