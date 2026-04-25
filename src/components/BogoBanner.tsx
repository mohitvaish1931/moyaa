import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Sparkles, ArrowRight } from 'lucide-react';

const BogoBanner = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link 
        to="/bogo"
        className="relative block w-full overflow-hidden rounded-[40px] shadow-2xl group transition-all duration-700 hover:shadow-glow-ruby"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-dark via-primary-red/80 to-luxury-dark bg-[length:200%_auto] animate-gradient-slow"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
          <Gift className="w-32 h-32 text-white rotate-12" />
        </div>
        <div className="absolute bottom-0 left-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity">
          <Sparkles className="w-40 h-40 text-gold-primary -rotate-12" />
        </div>
        
        <div className="relative px-8 py-16 md:py-20 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
          <div className="space-y-4 md:max-w-2xl">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black tracking-[0.4em] uppercase rounded-full">
                LIMITED TIME OFFER
              </span>
              <Sparkles className="w-4 h-4 text-gold-primary animate-pulse" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white luxury-serif tracking-[0.1em] leading-tight uppercase">
              BUY 1 GET 1 <span className="text-gold-primary italic">FREE</span>
            </h2>
            <p className="text-white/80 font-medium tracking-widest text-xs md:text-sm uppercase max-w-lg">
              Double the elegance, half the price. Shop our exclusive Buy 1 Get 1 Free collection and elevate your jewelry game today.
            </p>
          </div>
          
          <div className="mt-10 md:mt-0">
            <div className="inline-flex items-center space-x-4 bg-white text-luxury-dark px-10 py-5 rounded-full font-black text-[10px] tracking-[0.4em] uppercase transition-all duration-500 group-hover:bg-gold-primary group-hover:text-luxury-dark group-hover:scale-110 shadow-2xl">
              <span>EXPLORE NOW</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </div>
        </div>
        
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </Link>
    </div>
  );
};

export default BogoBanner;
