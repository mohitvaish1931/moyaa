import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Hero = () => {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; top: number; delay: number }>>([]);

  useEffect(() => {
    // Generate random sparkle particles
    const newParticles = Array.from({ length: 12 }, (_, index) => ({
      id: index,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 0.5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <section className="relative min-h-[55vh] md:min-h-screen flex items-center justify-center overflow-hidden py-0">
      {/* Main Banner Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/main-banner.jpeg" 
          alt="Luxury Jewelry Banner" 
          className="w-full h-full object-cover opacity-100 block"
        />
        {/* Stronger gradient overlay for better text readability on mobile */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40 md:bg-black/20" />
      </div>

      {/* Main hero content overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <div className="mb-8 md:mb-12 animate-fade-in">
          <h2 className="text-gold-primary text-[10px] md:text-sm tracking-[0.5em] font-bold luxury-serif mb-4 uppercase drop-shadow-md">Exquisite Craftsmanship</h2>
          <h1 className="text-4xl md:text-8xl font-black text-white mb-4 md:mb-6 tracking-tight luxury-serif drop-shadow-2xl">
            MORAA <span className="text-gold-primary italic font-light">JEWELS</span>
          </h1>
          <p className="text-platinum text-sm md:text-2xl max-w-lg md:max-w-2xl mx-auto font-bold italic luxury-serif leading-relaxed drop-shadow-lg">
            Where every piece tells a story of elegance and passion.
          </p>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-3 md:gap-4 bg-text-primary text-white px-8 md:px-12 py-4 md:py-5 rounded-full luxury-serif text-[10px] md:text-sm tracking-[0.3em] md:tracking-[0.4em] font-bold hover:bg-primary-red hover:shadow-[0_0_50px_rgba(139,0,0,0.3)] transition-all duration-500 group border border-gold-primary/40 shadow-xl"
        >
          DISCOVER COLLECTION
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>
    </section>
  );
};

export default Hero;
