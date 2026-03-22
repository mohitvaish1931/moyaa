import React from 'react';
import { Link } from 'react-router-dom';

const ShopByCategory = () => {
  const categories = [
    {
      name: 'EARRINGS',
      image: '/earrings.png',
      link: '/earrings',
      description: 'Delicate elegance for every moment'
    },
    {
      name: 'BRACELETS',
      image: '/bracalate.png',
      link: '/bracelets',
      description: 'Wrist adornments of refined taste'
    },
    {
      name: 'NECKLACES',
      image: '/nacklace.jpeg',
      link: '/necklaces',
      description: 'Statement pieces that define elegance'
    },
    {
      name: 'RINGS',
      image: 'https://images.pexels.com/photos/265758/pexels-photo-265758.jpeg?auto=compress&cs=tinysrgb&w=600',
      link: '/rings',
      description: 'Timeless symbols of elegance'
    },
    {
      name: 'HAND CHAINS',
      image: 'https://images.pexels.com/photos/1035655/pexels-photo-1035655.jpeg?auto=compress&cs=tinysrgb&w=600',
      link: '/hand-chains',
      description: 'Sophisticated chains for your hands'
    },
    {
      name: 'SETS',
      image: 'https://images.pexels.com/photos/2850438/pexels-photo-2850438.jpeg?auto=compress&cs=tinysrgb&w=600',
      link: '/sets',
      description: 'Complete luxury jewelry sets'
    }
  ];

  return (
    <section className="py-24 bg-luxury-secondary relative overflow-hidden border-y border-gold-primary/20">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(139,0,0,0.05),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 px-4">
          <div className="text-primary-red text-sm tracking-[0.4em] font-bold mb-4 luxury-serif uppercase">Discover Our Artistry</div>
          <h2 className="luxury-serif text-5xl md:text-6xl text-text-primary mb-6">OUR COLLECTIONS</h2>
          <div className="w-48 h-1 px-10 bg-gradient-to-r from-transparent via-gold-primary to-transparent mx-auto"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 justify-items-center">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.link}
              className="group cursor-pointer relative w-full"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white border border-gold-primary/30 shadow-sm group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Overlay with red tint on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-red/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Soft glow */}
                <div className="absolute -inset-2 bg-gold-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
              </div>

              <div className="mt-6 text-center">
                <h3 className="text-text-primary group-hover:text-primary-red transition-all duration-300 text-sm sm:text-base tracking-[0.2em] luxury-serif font-black uppercase">
                  {category.name}
                </h3>
                <p className="text-[10px] text-text-secondary mt-1 tracking-widest font-medium opacity-80 group-hover:opacity-100 transition-all">
                  {category.description}
                </p>
                <div className="w-8 group-hover:w-16 h-0.5 bg-primary-red/30 group-hover:bg-primary-red mx-auto mt-2 transition-all duration-300"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
