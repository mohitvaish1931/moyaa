import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const RakhiBanner = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative overflow-hidden rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gold-primary/20 bg-white flex flex-col md:flex-row items-stretch group transition-transform duration-500 hover:shadow-[0_8px_40px_rgb(212,175,55,0.12)] hover:-translate-y-1">
        
        {/* Text Section */}
        <div className="flex-1 p-12 md:p-16 flex flex-col justify-center items-center md:items-start text-center md:text-left z-10">
          <div className="text-gold-primary text-xs tracking-[0.3em] font-bold mb-4 uppercase flex items-center gap-2">
            <span className="w-8 h-px bg-gold-primary"></span>
            Special Collection
            <span className="w-8 h-px bg-gold-primary md:hidden"></span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary luxury-serif mb-8 leading-tight drop-shadow-sm">
            It's time to gift <span className="text-gold-primary italic">happiness</span><br/>to your happiness one
          </h2>
          <Link to="/products" className="inline-flex items-center space-x-3 btn-premium-gold shadow-glow-gold">
            <span className="tracking-[0.2em] font-bold text-xs">SHOP RAKHI</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-[45%] h-[400px] md:h-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent z-10 hidden md:block"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent z-10 md:hidden"></div>
          <img 
            src="/WhatsApp%20Image%202026-07-20%20at%2014.34.24.jpeg" 
            alt="Rakhi Gift" 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>

      </div>
    </div>
  );
};

export default RakhiBanner;
