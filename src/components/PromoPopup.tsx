import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const PromoPopup = () => {
  const [currentStep, setCurrentStep] = useState(0); // 0: First Popup, 1: Second Popup, 2: All Closed
  const [isVisible, setIsVisible] = useState(false);

  const popups = [
    {
      image: '/banner2.jpeg',
      title: 'NEW COLLECTION',
      subtitle: 'DISCOVER THE UNSEEN',
      description: 'Experience the latest addition to our luxury catalog. Handcrafted elegance for the modern soul.',
      cta: 'EXPLORE NOW'
    },
    {
      image: '/moraa-promo-30.png',
      title: 'EXCLUSIVE EVENT',
      subtitle: 'SPECIAL INVITATION',
      description: 'Discover our signature gold collection with an exclusive limited-time celebration offer.',
      cta: 'SHOP THE COLLECTION'
    }
  ];

  useEffect(() => {
    // Check if the user has already seen both popups this session
    const seenStep = sessionStorage.getItem('moraaPromoStep');
    const startStep = seenStep ? parseInt(seenStep) : 0;
    
    if (startStep < 2) {
      setCurrentStep(startStep);
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    sessionStorage.setItem('moraaPromoStep', nextStep.toString());
    
    // If there's another popup, show it after a short delay
    if (nextStep < 2) {
      setTimeout(() => {
        setIsVisible(true);
      }, 800);
    }
  };

  if (!isVisible || currentStep >= 2) return null;

  const activePopup = popups[currentStep];

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
          {/* Image Side */}
          <div className="w-full md:w-1/2 relative h-[250px] md:h-auto overflow-hidden">
            <img 
              src={activePopup.image} 
              alt={activePopup.title} 
              className="w-full h-full object-cover animate-fade-in"
              key={activePopup.image}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-luxury-dark/40 to-transparent" />
            
            {/* Step Indicators */}
            <div className="absolute bottom-4 left-6 flex space-x-2 z-20">
              <div className={`h-1 rounded-full transition-all duration-300 ${currentStep === 0 ? 'w-8 bg-gold-primary' : 'w-4 bg-white/20'}`} />
              <div className={`h-1 rounded-full transition-all duration-300 ${currentStep === 1 ? 'w-8 bg-gold-primary' : 'w-4 bg-white/20'}`} />
            </div>
          </div>

          {/* Text Side */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center text-center">
            <h2 className="text-gold-primary text-xs tracking-[0.6em] font-bold luxury-serif mb-4 uppercase">
              {activePopup.subtitle}
            </h2>
            <div className="mb-8">
              <span className="block text-4xl md:text-5xl font-black text-white luxury-serif tracking-tighter mb-2 uppercase">
                {activePopup.title}
              </span>
              {currentStep === 1 && (
                <div className="flex items-center justify-center space-x-2">
                  <span className="h-px w-8 bg-gold-primary/40" />
                  <span className="px-6 py-2 bg-gold-primary text-luxury-dark text-2xl font-black rounded-lg transform -rotate-2">30% OFF</span>
                  <span className="h-px w-8 bg-gold-primary/40" />
                </div>
              )}
            </div>
            
            <p className="text-platinum/70 text-sm italic luxury-serif mb-8 max-w-xs leading-relaxed">
              {activePopup.description}
            </p>

            <Link
              to="/products"
              onClick={handleClose}
              className="inline-block bg-text-primary text-white border border-gold-primary/30 px-10 py-4 rounded-full luxury-serif text-[10px] tracking-[0.4em] font-black hover:bg-gold-primary hover:text-luxury-dark hover:shadow-glow-gold transition-all duration-500"
            >
              {activePopup.cta}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoPopup;


