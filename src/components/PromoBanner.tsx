import React from 'react';
import { Link } from 'react-router-dom';

const PromoBanner = () => {
  return (
    <section className="py-12 bg-luxury-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl group shadow-2xl border border-gold-primary/20">
          <div className="aspect-[21/9] relative overflow-hidden">
            <img 
              src="/moraa-promo-30.png" 
              alt="Exclusive 30% Off Offer" 
              className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-1000"
            />
            {/* Elegant overlay for better transition */}
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark/60 to-transparent" />
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center sm:justify-end sm:pr-12 md:pr-24">
            <div className="text-center sm:text-right p-8 animate-fade-in-up">
              <h2 className="text-gold-primary text-xs sm:text-sm tracking-[0.6em] font-bold luxury-serif mb-2 sm:mb-4 uppercase drop-shadow-md">Limited Time Offer</h2>
              <div className="mb-4 sm:mb-6">
                <span className="block text-3xl sm:text-4xl md:text-6xl font-black text-white luxury-serif tracking-tighter shadow-sm mb-1 sm:mb-2">EXCLUSIVE EVENT</span>
                <span className="inline-block px-4 sm:px-6 py-2 bg-gold-primary text-luxury-dark text-xl sm:text-2xl md:text-3xl font-black rounded-lg transform -rotate-2 hover:rotate-0 transition-transform duration-300">30% OFF</span>
              </div>
              <Link
                to="/products"
                className="inline-block bg-white text-luxury-dark px-6 sm:px-10 py-3 sm:py-4 rounded-full luxury-serif text-[10px] sm:text-xs tracking-[0.4em] font-black hover:bg-gold-primary hover:text-luxury-dark hover:shadow-glow transition-all duration-300 transform hover:-translate-y-1"
              >
                SHOP THE COLLECTION
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
