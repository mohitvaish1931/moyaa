import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import AnnouncementBanner from './AnnouncementBanner';

const NewArrivals = () => {
  const { state, dispatch } = useAppContext();

  const products = [
    {
      id: 1,
      name: 'CHERISH EARRING',
      price: 799,
      originalPrice: 1200,
      image: 'https://images.pexels.com/photos/1191536/pexels-photo-1191536.jpeg?auto=compress&cs=tinysrgb&w=400',
      sale: true,
      category: 'earrings'
    },
    {
      id: 2,
      name: 'SERENITY KADA',
      price: 999,
      originalPrice: 1200,
      image: 'https://images.pexels.com/photos/1617067/pexels-photo-1617067.jpeg?auto=compress&cs=tinysrgb&w=400',
      sale: true,
      category: 'bracelets'
    },
    {
      id: 3,
      name: 'DUO LOVE EARRING',
      price: 999,
      originalPrice: 1200,
      image: 'https://images.pexels.com/photos/1191536/pexels-photo-1191536.jpeg?auto=compress&cs=tinysrgb&w=400',
      sale: true,
      category: 'earrings'
    },
    {
      id: 4,
      name: 'ETERNA DUO KADA',
      price: 899,
      originalPrice: 999,
      image: 'https://images.pexels.com/photos/1617067/pexels-photo-1617067.jpeg?auto=compress&cs=tinysrgb&w=400',
      sale: true,
      category: 'bracelets'
    },
    {
      id: 5,
      name: 'ECHO DROP EARRING',
      price: 999,
      originalPrice: 1200,
      image: 'https://images.pexels.com/photos/1191536/pexels-photo-1191536.jpeg?auto=compress&cs=tinysrgb&w=400',
      sale: true,
      category: 'earrings'
    }
  ];

  const toggleWishlist = (product: any) => {
    const isInWishlist = state.wishlist.find(item => item.id === product.id);
    if (isInWishlist) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id });
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
    }
  };

  const addToCart = (product: any) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  return (
    <>
      {/* Announcement Banner */}
      <AnnouncementBanner />
      
      <section className="py-24 bg-luxury-dark border-t border-gold-primary/20 shadow-[inset_0_1px_0_rgba(255,215,0,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <div className="text-gold-primary text-sm tracking-widest font-light luxury-serif">
                ✨ LATEST RELEASES ✨
              </div>
            </div>
            <h2 className="luxury-serif text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-rose-gold mb-6">
              NEW ARRIVALS
            </h2>
            <p className="text-platinum/70 max-w-2xl mx-auto text-lg">
              Proudly Supporting Ethical Sourcing – Every Design Has a Story
            </p>
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {products.map((product) => {
              const isInWishlist = state.wishlist.find(item => item.id === product.id);
              
              return (
                <div key={product.id} className="group cursor-pointer">
                  <Link to={`/product/${product.id}`}>
                    {/* Product card */}
                    <div className="relative overflow-hidden rounded-xl glass-card-emerald border border-emerald-luxury/40 aspect-square mb-6 hover:border-gold-primary/60 transition-all duration-300 shadow-glow-emerald hover:shadow-glow">
                      {/* Sale badge */}
                      {product.sale && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-gold-primary to-rose-gold text-luxury-dark px-3 py-1.5 text-xs font-semibold rounded-full z-10 luxury-serif shadow-glow-gold">
                          SALE
                        </div>
                      )}

                      {/* Wishlist button */}
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(product);
                        }}
                        className="absolute top-4 right-4 p-2.5 bg-luxury-dark/50 backdrop-blur-md rounded-full hover:bg-ruby-luxury/30 transition-all duration-300 z-10 border border-ruby-luxury/40 hover-ruby-glow"
                      >
                        <Heart className={`h-4 w-4 transition-colors ${
                          isInWishlist ? 'text-ruby-luxury fill-current' : 'text-platinum/80 hover:text-ruby-luxury'
                        }`} />
                      </button>

                      {/* Product image */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Add to cart button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product);
                        }}
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 btn-premium-gold text-luxury-dark px-6 py-2.5 rounded-full font-semibold text-xs luxury-serif tracking-widest hover:shadow-glow transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center gap-2"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        ADD TO CART
                      </button>
                    </div>
                  </Link>

                  {/* Product info */}
                  <div className="space-y-3">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-sm luxury-serif text-platinum hover:text-gold-primary transition-all duration-300 tracking-wide">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-lg font-semibold text-gold-primary">
                        Rs. {product.price.toLocaleString()}.00
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-platinum/50 line-through">
                          Rs. {product.originalPrice.toLocaleString()}.00
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View all button */}
          <div className="flex justify-center mt-16">
            <Link
              to="/products"
              className="inline-flex items-center gap-3 btn-premium-gold text-luxury-dark px-8 py-4 rounded-full luxury-serif text-sm tracking-widest font-semibold hover:shadow-glow transition-all duration-300"
            >
              VIEW ALL COLLECTIONS
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewArrivals;