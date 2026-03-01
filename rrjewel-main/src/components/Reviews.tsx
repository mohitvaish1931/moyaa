import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const Reviews = () => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const reviews = [
    {
      id: 1,
      rating: 5,
      author: 'Sarah M.',
      text: "The Bold Bloom Earrings are just gorgeous! They have the perfect balance of elegance and statement style. The craftsmanship is top-notch, and they add a touch of sophistication to any outfit. I loved them so much that I ordered another pair!"
    },
    {
      id: 2,
      rating: 5,
      author: 'Priya K.',
      text: "The Classic Snake Necklace is just breathtaking! Its sleek and modern design adds the perfect touch of elegance to any outfit. The quality is exceptional, and it feels so luxurious to wear. A must-have for anyone who loves fine jewelry!"
    },
    {
      id: 3,
      rating: 5,
      author: 'Amita D.',
      text: "The Nova Kada is stunning! Its sleek and contemporary design adds a bold yet elegant touch to my look. The quality is amazing, and it's so comfortable to wear. Perfect for any occasion—definitely a must-have piece for jewelry lovers!"
    }
  ];

  const features = [
    {
      icon: '👥',
      title: 'CONCIERGE SUPPORT',
      description: 'Personal assistance for your journey'
    },
    {
      icon: '✓',
      title: 'LUXURY CERTIFIED',
      description: 'Premium quality guaranteed'
    },
    {
      icon: '🚚',
      title: 'DISCREET DELIVERY',
      description: 'Secure & timely shipping'
    },
    {
      icon: '🔒',
      title: 'SECURE TRANSACTION',
      description: 'Protected with premium security'
    }
  ];

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <>
      {/* Features Section */}
      <section className="py-16 bg-luxury-secondary border-y border-gold-primary/20 shadow-[inset_0_1px_0_rgba(255,215,0,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-4">
                <div className="text-4xl">{feature.icon}</div>
                <div>
                  <h3 className="luxury-serif text-gold-primary text-sm tracking-widest mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-platinum/60 text-xs leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-luxury-dark border-b border-gold-primary/20 shadow-[inset_0_1px_0_rgba(255,215,0,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <div className="text-gold-primary text-sm tracking-widest font-light luxury-serif">
                ✨ CLIENT TESTIMONIALS ✨
              </div>
            </div>
            <h2 className="luxury-serif text-5xl md:text-6xl text-platinum mb-6">
              Trusted by
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-rose-gold">Connoisseurs</span>
            </h2>
            <p className="text-platinum/70 max-w-2xl mx-auto text-lg">
              Discover what our valued clients say about their experience with MYRA
            </p>
          </div>

          {/* Testimonials carousel */}
          <div className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className={`glass-card-sapphire p-8 rounded-2xl backdrop-blur-xl border border-sapphire-luxury/40 transition-all duration-300 shadow-glow-sapphire ${
                    index === currentReviewIndex ? 'lg:col-span-2 lg:row-span-1 shadow-glow' : 'opacity-50 lg:opacity-100'
                  }`}
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="h-4 w-4 fill-gold-primary text-gold-primary" 
                      />
                    ))}
                  </div>

                  {/* Review text */}
                  <p className="text-platinum text-lg leading-relaxed mb-6 italic">
                    "{review.text}"
                  </p>

                  {/* Author */}
                  <div className="border-t border-gold-primary/20 pt-4">
                    <p className="text-rose-gold luxury-serif text-sm tracking-wider">
                      — {review.author}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                onClick={prevReview}
                className="p-3 rounded-full border border-gold-primary/30 hover:border-gold-primary/60 hover:shadow-glow transition-all duration-300"
                aria-label="Previous review"
              >
                <ChevronLeft className="h-5 w-5 text-gold-primary hover:text-gold-highlight transition-colors" />
              </button>

              <div className="flex gap-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentReviewIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentReviewIndex
                        ? 'w-8 bg-gold-primary shadow-glow'
                        : 'w-2 bg-ruby-luxury/40 hover:bg-ruby-luxury/70'
                    }`}
                    aria-label={`Go to review ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextReview}
                className="p-3 rounded-full border border-gold-primary/30 hover:border-gold-primary/60 hover:shadow-glow transition-all duration-300"
                aria-label="Next review"
              >
                <ChevronRight className="h-5 w-5 text-gold-primary hover:text-gold-highlight transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Reviews;