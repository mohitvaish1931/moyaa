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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-0 bg-luxury-dark">
      {/* Main Banner Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/main-banner.jpeg" 
          alt="Luxury Jewelry Banner" 
          className="w-full h-full object-cover opacity-92"
        />
        {/* Very subtle tint for text readability */}
        <div className="absolute inset-0 bg-white/10" />
      </div>

      {/* Main hero content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <div className="mb-12 animate-fade-in">
          <h2 className="text-primary-red text-sm tracking-[0.5em] font-bold luxury-serif mb-4 uppercase">Exquisite Craftsmanship</h2>
          <h1 className="text-5xl md:text-8xl font-black text-text-primary mb-6 tracking-tight luxury-serif">
            MORAA <span className="text-gold-primary italic font-light drop-shadow-sm">JEWELS</span>
          </h1>
          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto font-light italic luxury-serif leading-relaxed">
            Where every piece tells a story of elegance and passion.
          </p>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-4 bg-text-primary text-white px-12 py-5 rounded-full luxury-serif text-sm tracking-[0.4em] font-bold hover:bg-primary-red hover:shadow-[0_0_50px_rgba(139,0,0,0.3)] transition-all duration-500 group border border-gold-primary/40 shadow-xl"
        >
          DISCOVER COLLECTION
          <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>
    </section>
  );
};

export default Hero;
