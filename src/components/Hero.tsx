import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = ['/banner2.jpeg', '/main-banner.jpeg'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="relative min-h-[60vh] md:min-h-screen flex items-center justify-center overflow-hidden py-0">
      {/* Dynamic Banner Background Images */}
      <div className="absolute inset-0 z-0">
        {images.map((img, index) => (
          <img 
            key={img}
            src={img} 
            alt={`Luxury Jewelry Banner ${index + 1}`} 
            className={`absolute inset-0 w-full h-full object-fill transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          />
        ))}
        {/* Subtle overlay for contrast */}
        <div className="absolute inset-0 bg-black/10 z-20" />
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
        className="absolute left-4 z-30 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-all duration-300"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
        className="absolute right-4 z-30 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-all duration-300"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main hero content overlay */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <div className="mb-12 animate-fade-in">
          <h2 className="text-primary-red text-sm tracking-[0.5em] font-bold luxury-serif mb-4 uppercase">Exquisite Craftsmanship</h2>
          <h1 className="text-5xl md:text-8xl font-black text-text-primary mb-6 tracking-tight luxury-serif">
            MORAA <span className="text-gold-primary italic font-light drop-shadow-sm">JEWELS</span>
          </h1>
          <p className="text-primary-red text-xl md:text-2xl max-w-2xl mx-auto font-bold italic luxury-serif leading-relaxed drop-shadow-sm">
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
        
        {/* Slider Indicators */}
        <div className="absolute bottom-8 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? 'bg-gold-primary w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;

