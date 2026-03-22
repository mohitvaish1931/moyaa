import React from 'react';

const AnnouncementBanner = () => {
  return (
    <div className="bg-gradient-to-r from-luxury-dark via-luxury-secondary to-luxury-dark border-b border-gold-primary/20 py-2.5 overflow-hidden relative z-10">
      <div className="flex whitespace-nowrap animate-scroll will-change-transform">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="flex items-center px-12 group">
            <span className="text-[10px] tracking-[0.4em] text-text-primary luxury-serif uppercase flex items-center gap-4">
              <span className="text-primary-red">✦</span> COMPLIMENTARY PAN-INDIA SHIPPING <span className="text-primary-red">✦</span>
              <span className="text-gold-primary">✦</span> BESPOKE DESIGN SERVICE <span className="text-gold-primary">✦</span>
              <span className="text-primary-red">✦</span> AUTHENTIC PRECIOUS STONES <span className="text-primary-red">✦</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBanner;
