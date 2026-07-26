import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative h-[45vh] sm:h-[70vh] lg:h-screen flex items-center justify-center overflow-hidden py-0 bg-luxury-dark">
      {/* Main Banner Background Image with Ken Burns Effect */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero.png" 
          alt="Rakhi Collection Banner" 
          className="w-full h-full object-cover object-center animate-ken-burns"
        />
        {/* Minimalist gradient overlay - significantly reduced opacity */}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark/20 via-transparent to-transparent" />
      </div>

      {/* Main hero content overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <div className="mb-10 md:mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-6 sm:w-8 bg-gold-primary/50" />
            <h2 className="text-gold-primary text-[10px] md:text-sm tracking-[0.5em] font-bold luxury-serif uppercase drop-shadow-md">Rakhi Collection</h2>
            <div className="h-px w-6 sm:w-8 bg-gold-primary/50" />
          </div>
          
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 tracking-tight luxury-serif drop-shadow-2xl max-w-3xl mx-auto">
            Celebrate The Bond That Lasts Forever
          </h1>
          
          <p className="text-platinum/90 text-xs sm:text-base md:text-lg max-w-sm sm:max-w-xl mx-auto font-normal luxury-serif leading-relaxed drop-shadow-lg px-4">
            Handcrafted Rakhi & Jewellery that celebrate the purest bond.
          </p>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-3 md:gap-4 bg-gold-primary text-text-primary px-10 md:px-12 py-4 md:py-5 rounded-full text-[11px] md:text-sm tracking-[0.3em] md:tracking-[0.4em] font-bold hover:scale-105 transition-all duration-700 group shadow-2xl relative overflow-hidden"
        >
          <span className="relative z-10">EXPLORE RAKHI COLLECTION</span>
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform relative z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </Link>
      </div>
    </section>
  );
};

export default Hero;
