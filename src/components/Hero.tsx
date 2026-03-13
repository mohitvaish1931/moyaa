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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
        {/* Left text block */}
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <div className="inline-block mb-6">
              <div className="text-platinum text-sm tracking-widest font-light">
                ✨ LUXURY COLLECTION
              </div>
            </div>
            <h1 className="luxury-serif text-6xl md:text-7xl text-platinum leading-tight mb-6">
              THE
              <br />
              <span className="text-platinum text-7xl md:text-8xl">GLIMMER</span>
            </h1>
            <p className="text-platinum/80 text-lg leading-relaxed max-w-md mb-8">
              Artfully designed jewelry with timeless elegance and uncompromising craftsmanship. Each piece tells a story of luxury and refinement.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-deep-teal to-wine-deep text-platinum px-8 py-4 rounded-full luxury-serif text-sm tracking-widest font-semibold hover:shadow-glow transition-all duration-300 w-fit group"
          >
            DISCOVER COLLECTION
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Center spotlight product */}
        <div className="flex justify-center lg:justify-center">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center max-w-full">
            {/* Outer glow (dark chocolate + teal depth) */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-dark-chocolate/40 via-deep-teal/10 to-transparent blur-3xl" />

            {/* Concentric rings */}
            <div className="absolute inset-0 rounded-full border border-gold-primary/30" />
            <div className="absolute inset-12 rounded-full border border-gold-primary/20" />
            <div className="absolute inset-24 rounded-full border border-gold-primary/10" />

            {/* Spotlight product image container */}
            <div className="relative z-10 w-56 h-56 sm:w-72 sm:h-72 rounded-full overflow-hidden border-2 border-gold-primary/40 shadow-glow bg-luxury-dark/40 backdrop-blur-sm flex items-center justify-center animate-float">
              <img
                src="https://images.pexels.com/photos/1449667/pexels-photo-1449667.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Featured Necklace"
                className="w-full h-full object-cover"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              {/* Badge */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-dark-chocolate/70 backdrop-blur-md border border-gold-primary/50 rounded-full px-6 py-3 z-20">
                <p className="text-platinum text-sm luxury-serif">Featured Piece</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right product cards */}
        <div className="space-y-8 flex flex-col">
          {/* Card 1 */}
          <Link
            to="/earrings"
            className="glass-card p-6 border-l-4 border-wine-deep/80 hover:border-wine-deep/100 transition-all duration-300 group"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src="/earrings.png"
                  alt="Earrings"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-platinum luxury-serif text-sm mb-2 group-hover:text-gold-primary transition-colors">
                  EARRINGS
                </h3>
                <p className="text-platinum text-lg font-semibold">From ₹299</p>
              </div>
            </div>
            <p className="text-platinum/80 text-xs leading-relaxed">
              Delicate elegance crafted to perfection
            </p>
          </Link>

          {/* Card 2 */}
          <Link
            to="/necklaces"
            className="glass-card p-6 border-l-4 border-rose-maroon/80 hover:border-rose-maroon/100 transition-all duration-300 group"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src="/nacklace.jpeg"
                  alt="Necklaces"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-platinum luxury-serif text-sm mb-2 group-hover:text-gold-primary transition-colors">
                  NECKLACES
                </h3>
                <p className="text-platinum text-lg font-semibold">From ₹399</p>
              </div>
            </div>
            <p className="text-platinum/80 text-xs leading-relaxed">
              Statement pieces that define elegance
            </p>
          </Link>

          {/* Card 3 */}
          <Link
            to="/bracelets"
            className="glass-card p-6 border-l-4 border-deep-teal/80 hover:border-deep-teal/100 transition-all duration-300 group"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src="/bracalate.png"
                  alt="Bracelets"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-platinum luxury-serif text-sm mb-2 group-hover:text-gold-primary transition-colors">
                  BRACELETS
                </h3>
                <p className="text-platinum text-lg font-semibold">From ₹199</p>
              </div>
            </div>
            <p className="text-platinum/80 text-xs leading-relaxed">
              Wrist adornments of refined taste
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
