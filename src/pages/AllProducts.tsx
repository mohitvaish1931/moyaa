import React, { useState } from 'react';
import { Heart, ChevronDown, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useSEO } from '../utils/useSEO';
import { generateBreadcrumbSchema } from '../utils/schemaGenerator';

const AllProducts = () => {
  const { state, dispatch } = useAppContext();
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://moraajewles.com' },
    { name: 'Products', url: 'https://moraajewles.com/products' }
  ]);

  useSEO({
    title: 'All Products - MORAA JEWELS Premium Jewelry Collection',
    description: 'Browse our complete collection of premium luxury jewelry. Find the perfect earrings, necklaces, bracelets and more from MORAA JEWELS.',
    keywords: 'all products, jewelry collection, earrings, necklaces, bracelets, luxury jewelry, premium accessories',
    url: 'https://moraajewles.com/products',
    type: 'product.group',
    structuredData: breadcrumbSchema
  });
  
  const [selectedFilters, setSelectedFilters] = useState({
    collection: '',
    availability: '',
    priceRange: [0, 2000]
  });

  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  const products = state.products;

  const collections = [
    { name: 'All Products', count: state.products.length, path: '/products' },
    { name: 'Earrings', count: state.products.filter(p => p.category?.toLowerCase() === 'earrings').length, path: '/earrings' },
    { name: 'Bracelets', count: state.products.filter(p => p.category?.toLowerCase() === 'bracelets').length, path: '/bracelets' },
    { name: 'Necklaces', count: state.products.filter(p => p.category?.toLowerCase() === 'necklaces').length, path: '/necklaces' },
    { name: 'Rings', count: state.products.filter(p => p.category?.toLowerCase() === 'rings').length, path: '/rings' },
    { name: 'Hand Chains', count: state.products.filter(p => p.category?.toLowerCase() === 'hand-chains').length, path: '/hand-chains' },
    { name: 'Jewelry Sets', count: state.products.filter(p => p.category?.toLowerCase() === 'sets').length, path: '/sets' }
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
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-1/4 space-y-8">
            <div className="border-b border-gold-primary/20 pb-4">
              <h3 className="text-xl font-bold text-text-primary luxury-serif tracking-widest">FILTERS</h3>
            </div>

            {/* Collection Filter */}
            <div className="space-y-4">
              <button
                onClick={() => setIsCollectionOpen(!isCollectionOpen)}
                className="flex items-center justify-between w-full text-left group"
              >
                <h4 className="text-sm font-bold text-text-primary luxury-serif tracking-widest group-hover:text-gold-primary transition-colors">COLLECTIONS</h4>
                <ChevronDown className={`h-4 w-4 text-gold-primary transform transition-transform duration-300 ${isCollectionOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCollectionOpen && (
                <div className="space-y-2 pl-2 border-l border-gold-primary/10">
                  {collections.map((collection) => (
                    <Link
                      key={collection.name}
                      to={collection.path}
                      className="flex items-center justify-between group py-1"
                    >
                      <span className="text-sm text-text-secondary group-hover:text-gold-primary transition-colors cursor-pointer font-light">
                        {collection.name}
                      </span>
                      <span className="text-[10px] text-text-muted font-bold tracking-tighter">[{collection.count}]</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Price Filter styling */}
            <div className="pt-4 border-t border-gold-primary/10">
              <button
                onClick={() => setIsPriceOpen(!isPriceOpen)}
                className="flex items-center justify-between w-full text-left group"
              >
                <h4 className="text-sm font-bold text-text-primary luxury-serif tracking-widest group-hover:text-gold-primary transition-colors">PRICE RANGE</h4>
                <ChevronDown className={`h-4 w-4 text-gold-primary transform transition-transform duration-300 ${isPriceOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isPriceOpen && (
                <div className="mt-6 space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 bg-gray-50 border border-gold-primary/20 rounded-lg p-2 flex items-center">
                      <span className="text-xs text-text-muted mr-1">₹</span>
                      <input type="number" placeholder="Min" className="bg-transparent w-full outline-none text-sm text-text-primary" />
                    </div>
                    <div className="flex-1 bg-gray-50 border border-gold-primary/20 rounded-lg p-2 flex items-center">
                      <span className="text-xs text-text-muted mr-1">₹</span>
                      <input type="number" placeholder="Max" className="bg-transparent w-full outline-none text-sm text-text-primary" />
                    </div>
                  </div>
                  <input type="range" min="0" max="5000" className="w-full h-1 bg-gold-primary/20 rounded-lg appearance-none cursor-pointer accent-gold-primary" />
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-3/4">
            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map((product, index) => {
                  const isInWishlist = state.wishlist.find(item => item.id === product.id);
                  
                  return (
                    <Link to={`/product/${(product as any)._id || product.id}`} key={(product as any)._id || product.id || index} className="group">
                      <div className="relative overflow-hidden rounded-2xl bg-gray-50 border border-gold-primary/20 aspect-square mb-5 shadow-sm group-hover:shadow-xl transition-all duration-500">
                        {product.sale && (
                          <div className="absolute top-4 left-4 bg-primary-red text-white px-3 py-1 text-[10px] font-bold rounded z-10 shadow-lg tracking-widest">
                            SALE
                          </div>
                        )}
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            toggleWishlist(product);
                          }}
                          className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-md hover:bg-gold-primary hover:text-white transition-all z-10 border border-gold-primary/10"
                        >
                          <Heart className={`h-4 w-4 transition-colors ${
                            isInWishlist ? 'text-primary-red fill-current' : 'text-gray-400'
                          }`} />
                        </button>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        {!product.soldOut && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart(product);
                            }}
                            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-text-primary text-white px-6 py-2.5 rounded-full font-bold text-[10px] luxury-serif tracking-[0.2em] hover:bg-primary-red transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-2xl"
                          >
                            ADD TO CART
                          </button>
                        )}
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-sm luxury-serif text-text-primary group-hover:text-primary-red transition-colors duration-300 tracking-wide font-medium">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-center space-x-3">
                          <span className="text-lg font-bold text-primary-red">
                            Rs. {product.price.toLocaleString()}.00
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-text-muted line-through opacity-60 italic">
                              Rs. {product.originalPrice.toLocaleString()}.00
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              {/* Pagination */}
              <div className="flex items-center justify-center space-x-2 mt-12">
                  <button className="px-4 py-2 bg-gold-primary text-luxury-dark rounded-full hover:shadow-glow transition-all duration-300 font-bold text-xs luxury-serif tracking-widest h-10 w-10 flex items-center justify-center">
                    1
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-32 border-2 border-dashed border-gold-primary/10 rounded-3xl">
                <ShoppingBag className="w-16 h-16 text-gold-primary/20 mx-auto mb-6" />
                <h3 className="text-2xl luxury-serif text-text-primary mb-2">NO PRODUCTS FOUND</h3>
                <p className="text-text-secondary font-light">Try adjusting your filters to find what you're looking for.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
