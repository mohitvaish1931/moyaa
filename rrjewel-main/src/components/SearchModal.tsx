import React, { useEffect } from 'react';
import { X, Search, Heart, ShoppingBag } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useAppContext();

  // All products data for search
  const allProducts = [
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
    },
    {
      id: 6,
      name: 'CLASSIC SNAKE NECKLACE',
      price: 1299,
      originalPrice: 1599,
      image: 'https://images.pexels.com/photos/1449667/pexels-photo-1449667.jpeg?auto=compress&cs=tinysrgb&w=400',
      sale: true,
      category: 'necklaces'
    },
    {
      id: 7,
      name: 'AURORA EDGE EARRING',
      price: 599,
      originalPrice: 1200,
      image: 'https://images.pexels.com/photos/1191536/pexels-photo-1191536.jpeg?auto=compress&cs=tinysrgb&w=400',
      sale: true,
      soldOut: true,
      category: 'earrings'
    },
    {
      id: 8,
      name: 'BOLD BLOOM EARRING',
      price: 599,
      originalPrice: 1100,
      image: 'https://images.pexels.com/photos/1191536/pexels-photo-1191536.jpeg?auto=compress&cs=tinysrgb&w=400',
      sale: true,
      category: 'earrings'
    },
    {
      id: 9,
      name: 'NOVA KADA',
      price: 999,
      originalPrice: 1200,
      image: 'https://images.pexels.com/photos/1617067/pexels-photo-1617067.jpeg?auto=compress&cs=tinysrgb&w=400',
      sale: true,
      category: 'bracelets'
    },
    {
      id: 10,
      name: 'ELEGANT CHAIN NECKLACE',
      price: 999,
      originalPrice: 1299,
      image: 'https://images.pexels.com/photos/1449667/pexels-photo-1449667.jpeg?auto=compress&cs=tinysrgb&w=400',
      sale: true,
      category: 'necklaces'
    }
  ];

  const handleSearch = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    
    if (query.trim() === '') {
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] });
      return;
    }

    const filteredProducts = allProducts.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    dispatch({ type: 'SET_SEARCH_RESULTS', payload: filteredProducts });
  };

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

  useEffect(() => {
    if (!isOpen) {
      dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] });
    }
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-luxury-dark/70 backdrop-blur-sm flex items-start justify-center z-50 pt-20">
      <div className="glass-card-sapphire border border-sapphire-luxury/40 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden shadow-glow-sapphire">
        <div className="flex items-center justify-between p-6 border-b border-gold-primary/30">
          <h2 className="text-2xl font-bold text-gold-primary luxury-serif">Search Products</h2>
          <button
            onClick={onClose}
            className="text-platinum/60 hover:text-gold-primary transition-all duration-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gold-primary/60" />
            <input
              type="text"
              value={state.searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search for jewelry by name or category..."
              className="w-full pl-10 pr-4 py-3 bg-luxury-secondary border border-gold-primary/30 rounded-lg text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-gold-primary/60 focus:border-transparent outline-none transition-all duration-300"
              autoFocus
            />
          </div>

          <div className="overflow-y-auto max-h-96">
            {state.searchQuery === '' ? (
              <div className="text-center py-8">
                <Search className="h-16 w-16 text-platinum/20 mx-auto mb-4" />
                <p className="text-platinum/70 text-lg">Start typing to search for products</p>
              </div>
            ) : state.searchResults.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-platinum/70 text-lg">No products found for "{state.searchQuery}"</p>
                <Link
                  to="/products"
                  onClick={onClose}
                  className="mt-4 inline-block btn-premium-gold text-luxury-dark px-6 py-2 rounded-lg hover:shadow-glow transition-all duration-300"
                >
                  View All Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {state.searchResults.map((product) => {
                  const isInWishlist = state.wishlist.find(item => item.id === product.id);
                  
                  return (
                    <div key={product.id} className="glass-card-sapphire border border-sapphire-luxury/30 rounded-lg p-4 hover:shadow-glow-sapphire transition-all duration-300">
                      <div className="relative mb-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded-lg border border-gold-primary/20"
                        />
                        {product.sale && (
                          <div className="absolute top-2 left-2 bg-gradient-to-r from-gold-primary to-rose-gold text-luxury-dark px-2 py-1 text-xs font-medium rounded shadow-glow-gold">
                            Sale
                          </div>
                        )}
                        {product.soldOut && (
                          <div className="absolute top-2 right-2 bg-ruby-luxury text-platinum px-2 py-1 text-xs font-medium rounded shadow-glow-ruby">
                            Sold Out
                          </div>
                        )}
                        <button
                          onClick={() => toggleWishlist(product)}
                          className="absolute top-2 right-2 p-1 bg-luxury-dark/50 rounded-full shadow-md hover:shadow-lg hover-ruby-glow transition-all"
                        >
                          <Heart className={`h-4 w-4 transition-colors ${
                            isInWishlist ? 'text-ruby-luxury fill-current' : 'text-platinum hover:text-ruby-luxury'
                          }`} />
                        </button>
                      </div>
                      <h3 className="font-medium text-platinum mb-2 luxury-serif">{product.name}</h3>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-gold-primary font-bold">
                            Rs. {product.price.toLocaleString()}.00
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-platinum/50 line-through">
                              Rs. {product.originalPrice.toLocaleString()}.00
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-platinum/60 capitalize">{product.category}</span>
                      </div>
                      {!product.soldOut && (
                        <button
                          onClick={() => addToCart(product)}
                          className="w-full btn-premium-gold text-luxury-dark py-2 px-4 rounded-lg font-medium hover:shadow-glow transition-all duration-300 flex items-center justify-center space-x-2"
                        >
                          <ShoppingBag className="h-4 w-4" />
                          <span>Add to Cart</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;