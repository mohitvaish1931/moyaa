import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import AnnouncementBanner from './AnnouncementBanner';

const NewArrivals = () => {
  const { state, dispatch } = useAppContext();

  const products = state.products.slice(0, 5);

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
      <AnnouncementBanner />
      
      <section className="py-24 bg-luxury-dark border-t border-gold-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <div className="text-primary-red text-sm tracking-widest font-medium luxury-serif uppercase">
                ✨ LATEST RELEASES ✨
              </div>
            </div>
            <h2 className="luxury-serif text-5xl md:text-6xl text-text-primary mb-6">
              NEW ARRIVALS
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto text-lg font-light italic">
              Experience the passion of deep Rubies and the elegance of Antique Gold.
            </p>
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {products.map((product) => {
              const isInWishlist = state.wishlist.find(item => item.id === product.id);
              
              return (
                <div key={(product as any)._id || product.id} className="group cursor-pointer">
                  <Link to={`/product/${product.id}`}>
                    {/* Product card */}
                    <div className="relative overflow-hidden rounded-xl bg-white border border-gold-primary/20 aspect-square mb-6 hover:border-primary-red/50 transition-all duration-300 shadow-sm hover:shadow-xl">

                      {/* Sale badge */}
                      {product.sale && (
                        <div className="absolute top-4 left-4 bg-primary-red text-white px-3 py-1.5 text-xs font-semibold rounded-full z-10 luxury-serif shadow-sm">
                          SALE
                        </div>
                      )}

                      {/* Wishlist button */}
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(product);
                        }}
                        className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-md rounded-full hover:bg-primary-red hover:text-white transition-all duration-300 z-10 border border-gold-primary/20"
                      >
                        <Heart className={`h-4 w-4 transition-colors ${
                          isInWishlist ? 'text-primary-red fill-current' : 'text-text-muted hover:text-white'
                        }`} />
                      </button>

                      {/* Product image */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-red/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Add to cart button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product);
                        }}
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-text-primary text-white px-6 py-2.5 rounded-full font-semibold text-xs luxury-serif tracking-widest hover:bg-primary-red transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center gap-2"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        ADD TO CART
                      </button>
                    </div>
                  </Link>

                  {/* Product info */}
                  <div className="space-y-3 text-center">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-sm luxury-serif text-text-primary hover:text-primary-red transition-all duration-300 tracking-wide font-medium">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-lg font-semibold text-primary-red">
                        Rs. {product.price.toLocaleString()}.00
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-text-muted line-through">
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
              className="inline-flex items-center gap-3 bg-primary-red text-white px-8 py-4 rounded-full luxury-serif text-sm tracking-widest font-semibold hover:bg-gold-primary transition-all duration-300 shadow-lg hover:shadow-primary-red/20"
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
