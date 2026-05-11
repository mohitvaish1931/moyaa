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
    <section className="relative min-h-[55vh] md:min-h-screen flex items-center justify-center overflow-hidden py-0 bg-luxury-dark">
      {/* Sparkle Particles for Luxury Feel */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-1 h-1 bg-gold-primary rounded-full animate-sparkle z-20 pointer-events-none opacity-40"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Main Banner Background Image with Ken Burns Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="/main-banner.jpeg" 
          alt="Luxury Jewelry Banner" 
          className="w-full h-full object-cover object-[center_20%] md:object-center opacity-100 block animate-ken-burns"
        />
        {/* Sophisticated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50 md:bg-black/20" />
      </div>

      {/* Main hero content overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <div className="mb-8 md:mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-gold-primary/50" />
            <h2 className="text-gold-primary text-[10px] md:text-sm tracking-[0.5em] font-bold luxury-serif uppercase drop-shadow-md">Exquisite Craftsmanship</h2>
            <div className="h-px w-8 bg-gold-primary/50" />
          </div>
          
          <h1 className="text-4xl md:text-8xl font-black text-white mb-4 md:mb-6 tracking-tight luxury-serif drop-shadow-2xl">
            MORAA <span className="text-gold-primary italic font-light">JEWELS</span>
          </h1>
          
          <p className="text-platinum/90 text-sm md:text-2xl max-w-lg md:max-w-2xl mx-auto font-bold italic luxury-serif leading-relaxed drop-shadow-lg">
            Where every piece tells a story of elegance and passion.
          </p>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-3 md:gap-4 bg-white/10 backdrop-blur-md text-white px-8 md:px-12 py-4 md:py-5 rounded-full luxury-serif text-[10px] md:text-sm tracking-[0.3em] md:tracking-[0.4em] font-bold hover:bg-gold-primary hover:text-luxury-dark hover:shadow-glow-gold transition-all duration-700 group border border-white/20 shadow-2xl relative overflow-hidden"
        >
          <span className="relative z-10">DISCOVER COLLECTION</span>
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform relative z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </Link>
      </div>
    </section>
  );
};

export default Hero;
