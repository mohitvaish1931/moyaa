import React, { useState } from 'react';
import { Heart, ShoppingBag, Sparkles, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useSEO } from '../utils/useSEO';
import { getImageUrl } from '../utils/mediaHelper';

const BogoProducts = () => {
  const { state, dispatch } = useAppContext();
  
  useSEO({
    title: 'BUY 1 GET 1 FREE - Exclusive MORAA JEWELS Offer',
    description: 'Shop our exclusive Buy 1 Get 1 Free collection. Premium luxury jewelry at an unbeatable value. Limited time offer on earrings, necklaces, and more.',
    keywords: 'bogo jewelry, buy 1 get 1 free, jewelry offer, luxury jewelry sale, moraa jewels deals',
    url: 'https://moraajewles.com/bogo',
    type: 'product.group'
  });

  const bogoProducts = state.products.filter(p => p.isBOGO && p.status !== 'pre-upload');

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
    <div className="min-h-screen bg-luxury-dark">
      {/* Hero Header for BOGO */}
      <div className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-red/20 to-gold-primary/20 animate-gradient-slow"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 animate-pulse"><Sparkles className="text-gold-primary h-8 w-8" /></div>
          <div className="absolute bottom-20 right-20 animate-bounce"><Gift className="text-primary-red h-10 w-10" /></div>
          <div className="absolute top-1/2 left-1/4 animate-pulse delay-700"><Sparkles className="text-gold-primary h-6 w-6" /></div>
        </div>
        <div className="relative text-center px-4 z-10">
          <span className="inline-block px-4 py-1.5 bg-primary-red text-white text-[10px] font-bold tracking-[0.4em] uppercase rounded-full mb-6 shadow-glow-ruby animate-fade-in">EXCLUSIVE OFFER</span>
          <h1 className="text-5xl md:text-7xl font-black text-text-primary luxury-serif tracking-widest uppercase mb-4 animate-scale-up">
            BUY 1 GET 1 <span className="text-primary-red">FREE</span>
          </h1>
          <p className="text-text-secondary max-w-lg mx-auto font-medium tracking-wide uppercase text-xs md:text-sm animate-fade-in delay-300">
            Add any two items from this collection to your cart and get the second one absolutely free.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {bogoProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {bogoProducts.map((product, index) => {
              const isInWishlist = state.wishlist.find(item => item.id === product.id);
              
              return (
                <Link 
                  to={`/product/${(product as any)._id || product.id}`} 
                  key={(product as any)._id || product.id || `p-${index}`} 
                  className="group relative"
                >
                  <div className="relative overflow-hidden rounded-3xl bg-white border border-gold-primary/10 aspect-[4/5] mb-5 shadow-sm group-hover:shadow-2xl transition-all duration-700">
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                      <div className="bg-primary-red text-white px-3 py-1.5 text-[9px] font-black rounded-lg shadow-lg tracking-widest uppercase animate-pulse">
                        BOGO
                      </div>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product);
                      }}
                      className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-md hover:bg-primary-red hover:text-white transition-all z-10 border border-gold-primary/5"
                    >
                      <Heart className={`h-4 w-4 transition-colors ${
                        isInWishlist ? 'text-primary-red fill-current' : 'text-gray-400'
                      }`} />
                    </button>
                    
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    
                    {!product.soldOut && (
                      <div className="absolute inset-0 bg-luxury-dark/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                          }}
                          className="w-full bg-white text-luxury-dark py-4 rounded-2xl font-black text-[10px] tracking-[0.3em] hover:bg-primary-red hover:text-white transition-all duration-300 shadow-2xl uppercase"
                        >
                          QUICK ADD
                        </button>
                      </div>
                    )}
                    
                    {product.soldOut && (
                      <div className="absolute inset-0 bg-luxury-dark/40 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-luxury-dark text-white px-6 py-2 rounded-full font-bold tracking-[0.2em] text-[10px] uppercase">
                          SOLD OUT
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center space-y-2">
                    <p className="text-[9px] font-bold text-gold-primary uppercase tracking-[0.3em]">{product.category}</p>
                    <h3 className="text-sm font-bold text-text-primary group-hover:text-primary-red transition-colors duration-300 tracking-wide uppercase">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-center space-x-3">
                      <span className="text-base font-bold text-primary-red">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-text-muted line-through opacity-50">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-32 bg-white/50 border border-gold-primary/10 rounded-[40px] shadow-sm">
            <div className="w-24 h-24 bg-gold-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="w-10 h-10 text-gold-primary/40" />
            </div>
            <h3 className="text-3xl font-black text-text-primary luxury-serif tracking-widest uppercase mb-4">No BOGO Products Found</h3>
            <p className="text-text-secondary max-w-md mx-auto font-medium tracking-wide">
              We're currently updating our Buy 1 Get 1 Free collection. Please check back soon for exclusive deals!
            </p>
            <Link 
              to="/products"
              className="inline-block mt-10 px-10 py-4 btn-premium-gold text-luxury-dark rounded-full font-black text-[10px] tracking-[0.3em] uppercase hover:shadow-glow-gold transition-all"
            >
              SHOP ALL PRODUCTS
            </Link>
          </div>
        )}
      </div>
      
      {/* Promotion Detail Section */}
      <div className="bg-white/30 backdrop-blur-md border-y border-gold-primary/10 py-20 mt-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="h-px w-12 bg-gold-primary/30"></div>
            <Gift className="h-8 w-8 text-primary-red" />
            <div className="h-px w-12 bg-gold-primary/30"></div>
          </div>
          <h2 className="text-3xl font-black text-text-primary luxury-serif tracking-widest uppercase mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gold-primary text-luxury-dark rounded-full flex items-center justify-center font-black mx-auto shadow-lg">1</div>
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest">Select Items</h4>
              <p className="text-xs text-text-secondary leading-relaxed">Choose any two items from this exclusive BOGO collection.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gold-primary text-luxury-dark rounded-full flex items-center justify-center font-black mx-auto shadow-lg">2</div>
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest">Add to Cart</h4>
              <p className="text-xs text-text-secondary leading-relaxed">Add both items to your shopping cart to activate the offer.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gold-primary text-luxury-dark rounded-full flex items-center justify-center font-black mx-auto shadow-lg">3</div>
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest">Instant Discount</h4>
              <p className="text-xs text-text-secondary leading-relaxed">The lower priced item will be automatically discounted at checkout.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BogoProducts;
