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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-luxury-dark via-luxury-secondary to-luxury-tertiary py-20">
      {/* Animated background gradient with jewel tones */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-primary/10 via-ruby-luxury/5 to-emerald-luxury/5" />
        <div className="absolute inset-0 bg-gradient-to-r from-sapphire-luxury/5 via-transparent to-gold-primary/10" />
      </div>

      {/* Premium decorative gold swirls with enhanced glow */}
      <div className="absolute top-20 left-10 w-32 h-32 opacity-30 drop-shadow-[0_0_30px_rgba(255,215,0,0.3)]">
        <svg viewBox="0 0 200 200" className="w-full h-full text-gold-primary">
          <path
            d="M50,150 Q100,50 150,150"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
          />
          <path
            d="M50,100 Q100,20 150,100"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />
        </svg>
      </div>

      <div className="absolute bottom-20 right-10 w-40 h-40 opacity-30 drop-shadow-[0_0_30px_rgba(255,215,0,0.3)]">
        <svg viewBox="0 0 200 200" className="w-full h-full text-ruby-luxury">
          <path
            d="M150,50 Q100,150 50,50"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
          />
          <path
            d="M150,100 Q100,180 50,100"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Sparkle particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="sparkle absolute w-1 h-1"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animation: `sparkle 2s ease-in-out ${particle.delay}s infinite`,
          }}
        />
      ))}

      {/* Main hero content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Text section */}
        <div className="mb-16 text-center lg:text-left max-w-2xl">
          <div className="inline-block mb-6">
            <div className="text-platinum text-sm tracking-widest font-light">
              LUXURY COLLECTION
            </div>
          </div>
          <h1 className="luxury-serif text-6xl md:text-7xl text-platinum leading-tight mb-6">
            THE
            <br />
            <span className="text-platinum text-7xl md:text-8xl">GLIMMER</span>
          </h1>
          <p className="text-platinum/80 text-lg leading-relaxed max-w-md mb-8">
            Explore our most finest collection of artfully designed jewelry with timeless elegance and uncompromising craftsmanship. Each piece tells a story of luxury and refinement.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-deep-teal to-wine-deep text-platinum px-8 py-4 rounded-full luxury-serif text-sm tracking-widest font-semibold hover:shadow-glow transition-all duration-300 w-fit group"
          >
            DISCOVER COLLECTION
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Three collection showcase photos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-16">
          {/* Collection 1 - Earrings */}
          <Link
            to="/earrings"
            className="group relative overflow-hidden rounded-2xl aspect-square border-2 border-gold-primary/30 hover:border-gold-primary/60 transition-all duration-500"
          >
            <img
              src="/earrings.png"
              alt="Earrings Collection"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="text-platinum luxury-serif text-2xl mb-2">
                EARRINGS
              </h3>
              <p className="text-platinum/90 text-sm mb-3">
                Delicate elegance crafted to perfection
              </p>
              <p className="text-gold-primary font-semibold text-sm">
                From ₹299
              </p>
            </div>
          </Link>

          {/* Collection 2 - Necklaces (Featured) */}
          <Link
            to="/necklaces"
            className="group relative overflow-hidden rounded-2xl aspect-square border-2 border-gold-primary/60 hover:border-gold-primary/80 transition-all duration-500 md:scale-105 md:col-span-1"
          >
            <img
              src="/nacklace.jpeg"
              alt="Necklaces Collection"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Featured badge */}
            <div className="absolute top-4 right-4 bg-gold-primary/90 backdrop-blur-md rounded-full px-4 py-2 z-10">
              <p className="text-dark-chocolate luxury-serif text-xs font-semibold tracking-wider">
                FEATURED
              </p>
            </div>

            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="text-platinum luxury-serif text-2xl mb-2">
                NECKLACES
              </h3>
              <p className="text-platinum/90 text-sm mb-3">
                Statement pieces that define elegance
              </p>
              <p className="text-gold-primary font-semibold text-sm">
                From ₹399
              </p>
            </div>
          </Link>

          {/* Collection 3 - Bracelets */}
          <Link
            to="/bracelets"
            className="group relative overflow-hidden rounded-2xl aspect-square border-2 border-gold-primary/30 hover:border-gold-primary/60 transition-all duration-500"
          >
            <img
              src="/bracalate.png"
              alt="Bracelets Collection"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="text-platinum luxury-serif text-2xl mb-2">
                BRACELETS
              </h3>
              <p className="text-platinum/90 text-sm mb-3">
                Wrist adornments of refined taste
              </p>
              <p className="text-gold-primary font-semibold text-sm">
                From ₹199
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
