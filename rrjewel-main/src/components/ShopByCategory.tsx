import React from 'react';
import { Link } from 'react-router-dom';

const ShopByCategory = () => {
  const categories = [
    {
      name: 'EARRINGS',
      image: 'https://images.pexels.com/photos/1191536/pexels-photo-1191536.jpeg?auto=compress&cs=tinysrgb&w=600',
      link: '/earrings',
      description: 'Delicate elegance for every moment'
    },
    {
      name: 'BRACELETS',
      image: 'https://images.pexels.com/photos/1617067/pexels-photo-1617067.jpeg?auto=compress&cs=tinysrgb&w=600',
      link: '/bracelets',
      description: 'Wrist adornments of refined taste'
    },
    {
      name: 'NECKLACES',
      image: 'https://images.pexels.com/photos/1449667/pexels-photo-1449667.jpeg?auto=compress&cs=tinysrgb&w=600',
      link: '/necklaces',
      description: 'Statement pieces that define elegance'
    }
  ];

  return (
    <section className="py-24 border-t border-gold-primary/20 bg-luxury-secondary shadow-[inset_0_1px_0_rgba(255,215,0,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <div className="text-gold-primary text-sm tracking-widest font-light luxury-serif">
              ✨ CURATED COLLECTIONS ✨
            </div>
          </div>
          <h2 className="luxury-serif text-5xl md:text-6xl text-platinum mb-6 leading-tight">
            Explore Our
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-rose-gold">Finest Collections</span>
          </h2>
          <p className="text-platinum/70 max-w-2xl mx-auto text-lg leading-relaxed">
            Discover exquisite jewelry pieces carefully curated for the modern luxury connoisseur
          </p>
        </div>

        {/* Category cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link 
              key={category.name}
              to={category.link}
              className="group relative overflow-hidden rounded-2xl cursor-pointer"
            >
              {/* Card container */}
              <div className="aspect-[4/5] relative glass-card-ruby border border-ruby-luxury/40 rounded-2xl overflow-hidden shadow-glow-ruby hover:shadow-glow transition-all duration-300">
                {/* Background image */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark/90 via-luxury-dark/30 to-transparent group-hover:from-luxury-dark/70 transition-all duration-300" />
                
                {/* Decorative corner accent */}
                <div className="absolute top-6 right-6 w-12 h-12 border border-gold-primary/40 rounded transition-all duration-300 group-hover:border-gold-primary/80 group-hover:w-16 group-hover:h-16 group-hover:shadow-glow-gold" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="luxury-serif text-4xl md:text-5xl text-platinum tracking-widest mb-4 text-center transition-all duration-300 group-hover:text-gold-primary group-hover:drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]">
                    {category.name}
                  </h3>
                  <p className="text-platinum/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-6">
                    {category.description}
                  </p>
                </div>

                {/* Soft glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 shadow-glow-sapphire rounded-2xl pointer-events-none" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;