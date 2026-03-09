import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Necklaces = () => {
  const { state, dispatch } = useAppContext();

  const necklaces = state.products.filter(p => p.category?.toLowerCase() === 'necklaces' || p.category?.toLowerCase() === 'necklace');

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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-rose-gold mb-4">
            NECKLACES
          </h1>
          <p className="text-gray-600">
            Discover our beautiful collection of necklaces, from delicate chains to bold statement pieces.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {necklaces.map((product) => {
            const isInWishlist = state.wishlist.find(item => item.id === product.id);
            
            return (
              <Link to={`/product/${(product as any)._id || product.id}`} key={(product as any)._id || product.id} className="group cursor-pointer">
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-lg bg-gray-50 border border-gold-primary/20 aspect-square mb-4\">
                  {/* Sale Badge */}
                  {product.sale && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-gold-primary to-rose-gold text-luxury-dark px-3 py-1 text-sm font-medium rounded z-10 shadow-glow-gold">
                      Sale
                    </div>
                  )}
                  {/* Wishlist Button */}
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-4 right-4 p-2 bg-white/80 border border-gold-primary/30 rounded-full hover:shadow-lg transition-shadow z-10"
                  >
                    <Heart className={`h-4 w-4 transition-colors ${
                      isInWishlist ? 'text-primary-wine fill-current' : 'text-gray-400 hover:text-primary-wine'
                    }`} />
                  </button>
                  {/* Product Image */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(product)}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 btn-premium-gold text-luxury-dark px-4 py-2 rounded-lg font-medium hover:shadow-glow-gold transition-all opacity-0 group-hover:opacity-100 flex items-center space-x-2"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
                {/* Product Info */}
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-900 mb-2 hover:text-gold-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-lg font-bold text-gold-primary">
                      Rs. {product.price.toLocaleString()}.00
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        Rs. {product.originalPrice.toLocaleString()}.00
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Necklaces;