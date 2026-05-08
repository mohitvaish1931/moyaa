import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const PromoPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = ['/banner2.jpeg', '/moraa-promo-30.png'];

  useEffect(() => {
    // Check if the user has already dismissed the popup this session
    const isDismissed = sessionStorage.getItem('moraaPromoDismissed');
    
    if (!isDismissed) {
      // Show popup after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [isVisible, images.length]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('moraaPromoDismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-luxury-dark/80 backdrop-blur-md animate-fade-in"
        onClick={handleClose}
      />
      
      {/* Popup Content */}
      <div className="relative w-full max-w-4xl bg-luxury-dark rounded-3xl overflow-hidden shadow-2xl border border-gold-primary/30 animate-scale-up">
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-[110] p-2 bg-luxury-dark/40 hover:bg-luxury-dark/80 text-white rounded-full transition-all duration-300 border border-white/10"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex flex-col md:flex-row min-h-[400px]">
          {/* Dynamic Image Side */}
          <div className="w-full md:w-1/2 relative h-[250px] md:h-auto overflow-hidden">
            {images.map((img, index) => (
              <img 
                key={img}
                src={img} 
                alt={`Promotion ${index + 1}`} 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-luxury-dark/40 to-transparent" />
            
            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
              {images.map((_, index) => (
                <div 
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? 'w-6 bg-gold-primary' : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Text Side */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center text-center">
            <h2 className="text-gold-primary text-xs tracking-[0.6em] font-bold luxury-serif mb-4 uppercase">Special Invitation</h2>
            <div className="mb-8">
              <span className="block text-4xl md:text-5xl font-black text-white luxury-serif tracking-tighter mb-2">EXCLUSIVE EVENT</span>
              <div className="flex items-center justify-center space-x-2">
                <span className="h-px w-8 bg-gold-primary/40" />
                <span className="px-6 py-2 bg-gold-primary text-luxury-dark text-2xl font-black rounded-lg transform -rotate-2">30% OFF</span>
                <span className="h-px w-8 bg-gold-primary/40" />
              </div>
            </div>
            
            <p className="text-platinum/70 text-sm italic luxury-serif mb-8 max-w-xs leading-relaxed">
              Discover our signature gold collection with an exclusive limited-time celebration offer.
            </p>

            <Link
              to="/products"
              onClick={handleClose}
              className="inline-block bg-text-primary text-white border border-gold-primary/30 px-10 py-4 rounded-full luxury-serif text-[10px] tracking-[0.4em] font-black hover:bg-gold-primary hover:text-luxury-dark hover:shadow-glow-gold transition-all duration-500"
            >
              SHOP THE COLLECTION
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoPopup;

