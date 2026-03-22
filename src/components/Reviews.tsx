import React from 'react';
import { Star, Truck, ShieldCheck, RotateCcw, Clock } from 'lucide-react';

const Reviews = () => {
  const reviews = [
    {
      id: 1,
      rating: 5,
      author: 'Sarah M.',
      role: 'Fashion Designer',
      content: "The Bold Bloom Earrings are just gorgeous! They have the perfect balance of elegance and statement style. The craftsmanship is top-notch."
    },
    {
      id: 2,
      rating: 5,
      author: 'Priya K.',
      role: 'Art Collector',
      content: "The Classic Snake Necklace is just breathtaking! Its sleek and modern design adds the perfect touch of elegance to any outfit."
    },
    {
      id: 3,
      rating: 5,
      author: 'Amita D.',
      role: 'Business Executive',
      content: "The Nova Kada is stunning! Its sleek and contemporary design adds a bold yet elegant touch to my look. Truly a masterpiece."
    }
  ];

  return (
    <section className="py-24 bg-luxury-secondary relative overflow-hidden">
      {/* Background Decorative Text */}
      <div className="absolute top-20 left-0 w-full text-center opacity-[0.03] select-none pointer-events-none">
        <span className="text-[200px] font-bold luxury-serif">TESTIMONIALS</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="text-primary-red text-sm tracking-[0.4em] font-medium uppercase luxury-serif">Our Legacy</div>
          </div>
          <h2 className="luxury-serif text-4xl md:text-5xl text-text-primary mb-6">CLIENT REFLECTIONS</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-primary to-transparent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="group relative bg-white p-10 rounded-2xl shadow-sm border border-gold-primary/20 hover:border-primary-red/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary-red text-white rounded-full flex items-center justify-center shadow-lg transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <Star className="h-6 w-6 fill-current" />
              </div>

              <div className="flex mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-gold-primary fill-current" />
                ))}
              </div>

              <p className="text-text-secondary italic leading-relaxed mb-8 text-lg font-light">
                "{review.content}"
              </p>

              <div className="flex items-center gap-4 border-t border-gold-primary/10 pt-6">
                <div className="w-12 h-12 rounded-full bg-luxury-dark border border-gold-primary/20 flex items-center justify-center text-primary-red font-bold luxury-serif">
                  {review.author[0]}
                </div>
                <div>
                  <h4 className="text-text-primary font-semibold tracking-wider text-sm luxury-serif uppercase">
                    {review.author}
                  </h4>
                  <p className="text-gold-primary text-xs tracking-widest luxury-serif">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Luxury features section with red/gold accents */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-4 gap-8 px-8 py-12 rounded-3xl bg-luxury-dark border border-gold-primary/30 shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="flex flex-col items-center text-center space-y-4 relative z-10">
            <div className="w-16 h-16 rounded-full bg-white border border-gold-primary/20 flex items-center justify-center text-primary-red shadow-sm group-hover:shadow-primary-red/20 transition-all duration-300">
              <Truck className="h-8 w-8" />
            </div>
            <h5 className="text-text-primary font-bold luxury-serif tracking-widest text-sm uppercase">Global Shipping</h5>
            <p className="text-text-secondary text-xs font-light">Elegance delivered worldwide</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-4 relative z-10">
            <div className="w-16 h-16 rounded-full bg-white border border-gold-primary/20 flex items-center justify-center text-primary-red shadow-sm group-hover:shadow-primary-red/20 transition-all duration-300">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h5 className="text-text-primary font-bold luxury-serif tracking-widest text-sm uppercase">Secured Luxury</h5>
            <p className="text-text-secondary text-xs font-light">Verified authentic treasures</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-4 relative z-10">
            <div className="w-16 h-16 rounded-full bg-white border border-gold-primary/20 flex items-center justify-center text-primary-red shadow-sm group-hover:shadow-primary-red/20 transition-all duration-300">
              <RotateCcw className="h-8 w-8" />
            </div>
            <h5 className="text-text-primary font-bold luxury-serif tracking-widest text-sm uppercase">Refined Returns</h5>
            <p className="text-text-secondary text-xs font-light">30-day graceful exchanges</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-4 relative z-10">
            <div className="w-16 h-16 rounded-full bg-white border border-gold-primary/20 flex items-center justify-center text-primary-red shadow-sm group-hover:shadow-primary-red/20 transition-all duration-300">
              <Clock className="h-8 w-8" />
            </div>
            <h5 className="text-text-primary font-bold luxury-serif tracking-widest text-sm uppercase">Artisan Support</h5>
            <p className="text-text-secondary text-xs font-light">24/7 dedicated concierge</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
