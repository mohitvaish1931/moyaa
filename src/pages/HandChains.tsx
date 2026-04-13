import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useSEO } from '../utils/useSEO';
import { generateAggregateOfferSchema, generateBreadcrumbSchema } from '../utils/schemaGenerator';
import { getImageUrl, handleImageError } from '../utils/mediaHelper';

const HandChains = () => {
  const { state, dispatch } = useAppContext();

  const products = state.products.filter(p => {
    const isMatched = p.category?.toLowerCase() === 'hand-chains' || 
                      p.category?.toLowerCase() === 'hand chain' || 
                      p.category?.toLowerCase() === 'hand chains';
    const isPublished = p.status !== 'pre-upload';
    return isMatched && isPublished;
  });

  // Calculate price range for aggregate offer schema
  const prices = products.map(p => p.price || p.originalPrice || 0).filter(p => p > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  // Generate schemas
  const aggregateSchema = generateAggregateOfferSchema(
    'Premium Hand Chains Collection - MORAA JEWELS',
    'Shop our exclusive collection of premium hand chains. Elegant and sophisticated designs to elevate your style.',
    'https://moraajewles.com/logo.png',
    minPrice,
    maxPrice,
    products.length,
    'INR',
    'https://moraajewles.com/hand-chains'
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://moraajewles.com' },
    { name: 'Products', url: 'https://moraajewles.com/products' },
    { name: 'Hand Chains', url: 'https://moraajewles.com/hand-chains' }
  ]);

  useSEO({
    title: 'Premium Hand Chains Collection - MORAA JEWELS',
    description: 'Shop our exclusive collection of premium hand chains. Elegant and sophisticated designs to elevate your style.',
    keywords: 'hand chains, luxury hand chains, gold hand chains, premium jewelry, moraa jewels',
    url: 'https://moraajewles.com/hand-chains',
    type: 'product.group',
    structuredData: {
      '@context': 'https://schema.org',
      '@graph': [aggregateSchema, breadcrumbSchema]
    }
  });

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
        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-gold-soft mb-4 luxury-serif">
            HAND CHAINS
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-primary to-transparent mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto italic font-light">
            Discover our stunning collection of hand chains, designed with elegance and sophistication.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => {
              const isInWishlist = state.wishlist.find(item => item.id === product.id);
              
              return (
                <Link to={`/product/${(product as any)._id || product.id}`} key={(product as any)._id || product.id} className="group cursor-pointer">
                  {/* Product Image */}
                  <div className="relative overflow-hidden rounded-2xl bg-gray-50 border border-gold-primary/20 aspect-square mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500">
                    {/* Sale Badge */}
                    {product.sale && (
                      <div className="absolute top-4 left-4 bg-primary-red text-white px-3 py-1 text-xs font-bold rounded z-10 shadow-lg">
                        SALE
                      </div>
                    )}
                    {/* Sold Out Badge */}
                    {product.soldOut && (
                      <div className="absolute top-4 right-12 bg-gray-900 text-white px-3 py-1 text-xs font-medium rounded z-10 opacity-80">
                        Sold Out
                      </div>
                    )}
                    {/* Wishlist Button */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product);
                      }}
                      className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-md border border-gold-primary/20 rounded-full hover:bg-gold-primary hover:text-white shadow-md transition-all z-10"
                    >
                      <Heart className={`h-4 w-4 transition-colors ${
                        isInWishlist ? 'text-primary-red fill-current' : 'text-gray-400'
                      }`} />
                    </button>
                    {/* Product Image */}
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={handleImageError}
                    />
                    {/* Add to Cart Button */}
                    {!product.soldOut && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product);
                        }}
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-text-primary text-white px-6 py-2.5 rounded-full font-semibold text-xs luxury-serif tracking-widest hover:bg-primary-red transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center space-x-2 shadow-2xl"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        <span>ADD TO CART</span>
                      </button>
                    )}
                  </div>
                  {/* Product Info */}
                  <div className="text-center space-y-2">
                    <h3 className="text-sm luxury-serif text-text-primary group-hover:text-primary-red transition-all duration-300 tracking-wide font-medium">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-center space-x-3">
                      <span className="text-lg font-bold text-primary-red">
                        Rs. {product.price.toLocaleString()}.00
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-text-muted line-through">
                          Rs. {product.originalPrice.toLocaleString()}.00
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full text-center py-32">
              <div className="mb-6 inline-block p-4 rounded-full bg-gold-primary/10">
                <ShoppingBag className="w-12 h-12 text-gold-primary opacity-30" />
              </div>
              <h3 className="text-2xl luxury-serif text-text-primary mb-2">COLLECTION COMING SOON</h3>
              <p className="text-text-secondary font-light">We are curating the finest hand chains for you.</p>
              <Link to="/products" className="inline-block mt-8 text-gold-primary hover:text-primary-red transition-colors border-b border-gold-primary/30 pb-1">
                Explore Other Collections
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HandChains;
