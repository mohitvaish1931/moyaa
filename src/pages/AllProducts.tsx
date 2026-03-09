import React, { useState } from 'react';
import { Heart, ChevronDown, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const AllProducts = () => {
  const { state, dispatch } = useAppContext();
  const [selectedFilters, setSelectedFilters] = useState({
    collection: '',
    availability: '',
    priceRange: [0, 2000]
  });

  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  const products = state.products;

  const collections = [
    { name: 'Home', count: 0 },
    { name: 'Shop By', count: 19 },
    { name: 'All Products', count: 19 },
    { name: 'Track Order', count: 0 },
    { name: 'Contact', count: 0 }
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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex gap-8">
          {/* Sidebar Filters with luxury styling */}
          <div className="w-1/4 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gold-primary mb-4 luxury-serif tracking-widest">FILTER:</h3>
            </div>

            {/* Collection Filter */}
            <div className="border-b border-gold-primary/30 pb-6">
              <button
                onClick={() => setIsCollectionOpen(!isCollectionOpen)}
                className="flex items-center justify-between w-full text-left"
              >
                <h4 className="text-sm font-medium text-gray-900 luxury-serif">COLLECTION</h4>
                <ChevronDown className={`h-4 w-4 text-gold-primary transform transition-transform ${isCollectionOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCollectionOpen && (
                <div className="mt-4 space-y-3">
                  {collections.map((collection) => (
                    <div key={collection.name} className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="collection"
                          className="sr-only"
                        />
                        <span className="text-sm text-gray-700 hover:text-gold-primary cursor-pointer transition-colors duration-300">
                          {collection.name}
                        </span>
                      </label>
                      <span className="text-sm text-gray-500">({collection.count})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Availability Filter */}
            <div className="border-b border-gold-primary/30 pb-6">
              <button
                onClick={() => setIsAvailabilityOpen(!isAvailabilityOpen)}
                className="flex items-center justify-between w-full text-left"
              >
                <h4 className="text-sm font-medium text-gray-900 luxury-serif">AVAILABILITY</h4>
                <ChevronDown className={`h-4 w-4 text-gold-primary transform transition-transform ${isAvailabilityOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isAvailabilityOpen && (
                <div className="mt-4 space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3 accent-gold-primary" />
                    <span className="text-sm text-gray-700">In stock (18)</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3 accent-gold-primary" />
                    <span className="text-sm text-gray-700">Out of stock (1)</span>
                  </label>
                </div>
              )}
            </div>

            {/* Price Filter */}
            <div className="pb-6">
              <button
                onClick={() => setIsPriceOpen(!isPriceOpen)}
                className="flex items-center justify-between w-full text-left"
              >
                <h4 className="text-sm font-medium text-gray-900 luxury-serif">PRICE</h4>
                <ChevronDown className={`h-4 w-4 text-gold-primary transform transition-transform ${isPriceOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isPriceOpen && (
                <div className="mt-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-700 mr-2">₹</span>
                      <input
                        type="number"
                        placeholder="0"
                        className="w-20 px-2 py-1 bg-white border border-gold-primary/30 text-gray-900 rounded text-sm"
                      />
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-700 mr-2">₹</span>
                      <input
                        type="number"
                        placeholder="999.00"
                        className="w-24 px-2 py-1 bg-white border border-gold-primary/30 text-gray-900 rounded text-sm"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      className="w-full h-2 bg-gold-primary/30 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Products Grid with luxury styling */}
          <div className="w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, index) => {
                const isInWishlist = state.wishlist.find(item => item.id === product.id);
                
                return (
                  <Link to={`/product/${(product as any)._id || product.id}`} key={(product as any)._id || product.id || index} className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-lg bg-gray-50 aspect-square mb-4 border border-gold-primary/20 shadow-md hover:shadow-lg transition-all">
                      {product.sale && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-gold-primary to-gold-soft text-luxury-dark px-3 py-1 text-sm font-medium rounded z-10 shadow-md">
                          Sale
                        </div>
                      )}
                      {product.soldOut && (
                        <div className="absolute top-4 right-12 bg-primary-wine text-white px-3 py-1 text-sm font-medium rounded z-10 shadow-md">
                          Sold Out
                        </div>
                      )}
                      <button 
                        onClick={() => toggleWishlist(product)}
                        className="absolute top-4 right-4 p-2 bg-white/80 rounded-full shadow-md hover:shadow-lg transition-all z-10 border border-gold-primary/30"
                      >
                        <Heart className={`h-4 w-4 transition-colors ${
                          isInWishlist ? 'text-primary-wine fill-current' : 'text-gray-800 hover:text-primary-wine'
                        }`} />
                      </button>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {!product.soldOut && (
                        <button
                          onClick={() => addToCart(product)}
                          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 btn-premium-gold text-luxury-dark px-4 py-2 rounded-lg font-medium hover:shadow-glow opacity-0 group-hover:opacity-100 flex items-center space-x-2 transition-all duration-300"
                        >
                          <ShoppingBag className="h-4 w-4" />
                          <span>Add to Cart</span>
                        </button>
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-900 mb-2 luxury-serif">
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

            {/* Pagination with luxury styling */}
            <div className="flex items-center justify-center space-x-2 mt-12">
              <button className="px-4 py-2 bg-gold-primary text-luxury-dark rounded hover:shadow-glow transition-all duration-300 font-semibold">
                1
              </button>
              <button className="px-4 py-2 bg-white text-gray-900 rounded border border-gold-primary/30 hover:bg-gray-50 transition-colors duration-300">
                2
              </button>
              <button className="px-4 py-2 bg-white text-gray-900 rounded border border-gold-primary/30 hover:bg-gray-50 transition-colors duration-300">
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;