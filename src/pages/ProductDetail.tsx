import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, ChevronLeft, ChevronRight, Truck, Shield, RotateCcw } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useSEO } from '../utils/useSEO';
import { generateProductSchema, generateBreadcrumbSchema } from '../utils/schemaGenerator';
import { getImageUrl, handleImageError, handleVideoError } from '../utils/mediaHelper';
import { API_ENDPOINTS } from '../utils/api';
import ProductReviews from '../components/ProductReviews';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useAppContext();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [apiProduct, setApiProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // First try to find in state
  let product = state.products.find(p => (p as any)._id === id || String(p.id) === id);

  // If not in state and we have an API product, use that
  if (!product && apiProduct) {
    product = apiProduct;
  }

  // Fetch product from API if not found in state
  useEffect(() => {
    if (!product && id) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`${API_ENDPOINTS.PRODUCTS}/${id}`);
          if (response.ok) {
            const data = await response.json();
            setApiProduct(data);
          }
        } catch (err) {
          console.error('Failed to fetch product:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [id, product]);

  // Update SEO after product is loaded
  if (product) {
    const productImage = (product.images && product.images.length > 0) ? product.images[0] : product.image || 'https://moraajewles.com/logo.png';
    const productSchema = generateProductSchema({
      name: product.name,
      description: product.description || `Premium ${product.category} from MORAA REFLECTION`,
      image: product.images || [productImage],
      price: product.price || product.originalPrice || 0,
      priceCurrency: 'INR',
      availability: product.soldOut ? 'OutOfStock' : 'InStock',
      category: product.category,
      url: `https://moraajewles.com/product/${id}`,
      brand: 'MORAA REFLECTION'
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: 'Home', url: 'https://moraajewles.com' },
      { name: 'Products', url: 'https://moraajewles.com/products' },
      { name: product.category, url: `https://moraajewles.com/${product.category.toLowerCase()}` },
      { name: product.name, url: `https://moraajewles.com/product/${id}` }
    ]);

    useSEO({
      title: `${product.name} - Premium ${product.category} | MORAA REFLECTION`,
      description: product.description || `Buy ${product.name} from MORAA REFLECTION. Premium ${product.category} with finest craftsmanship. Original price: ${product.originalPrice ? `₹${product.originalPrice}` : 'Contact for price'}`,
      keywords: `${product.name}, ${product.category}, luxury jewelry, premium jewelry, buy ${product.category.toLowerCase()}`,
      image: productImage,
      url: `https://moraajewles.com/product/${id}`,
      type: 'product',
      structuredData: {
        '@context': 'https://schema.org',
        '@graph': [productSchema, breadcrumbSchema]
      }
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold-primary"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link to="/products" className="text-brand hover:text-brand-hover">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const isInWishlist = state.wishlist.find(item => item.id === product.id || (item as any)._id === (product as any)._id);
  const images = (product.images && product.images.length > 0) ? product.images : (product.image ? [product.image] : ['https://images.pexels.com/photos/1191536/pexels-photo-1191536.jpeg?auto=compress&cs=tinysrgb&w=600']);

  const toggleWishlist = () => {
    if (isInWishlist) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id });
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
    }
  };

  const addToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: 'ADD_TO_CART', payload: product });
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-700">
            <li><Link to="/" className="hover:text-gold-primary transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link to="/products" className="hover:text-gold-primary transition-colors">Products</Link></li>
            <li>/</li>
            <li><Link to={`/${product.category}`} className="hover:text-gold-primary transition-colors capitalize">{product.category}</Link></li>
            <li>/</li>
            <li className="text-gray-600">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 border border-gold-primary/20 rounded-lg overflow-hidden shadow-md">
              <img
                src={getImageUrl(images[currentImageIndex])}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 border border-gold-primary/30 hover:shadow-lg rounded-full p-2 shadow-md transition-all"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-900" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 border border-gold-primary/30 hover:shadow-lg rounded-full p-2 shadow-md transition-all"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-900" />
                  </button>
                </>
              )}
              {/* Sale Badge */}
              {product.sale && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-gold-primary to-gold-soft text-luxury-dark px-3 py-1 text-sm font-medium rounded shadow-md">
                  Sale
                </div>
              )}
              {/* Sold Out Badge */}
              {product.soldOut && (
                <div className="absolute top-4 right-4 bg-primary-wine text-white px-3 py-1 text-sm font-medium rounded shadow-md">
                  Sold Out
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex space-x-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index ? 'border-gold-primary shadow-md' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.round(product.averageRating || 0) ? 'fill-gold-primary text-gold-primary' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.averageRating ? `${product.averageRating}` : 'No ratings'} ({product.reviewCount || 0} review{product.reviewCount !== 1 ? 's' : ''})
                </span>
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-gold-primary">
                  Rs. {product.price.toLocaleString()}.00
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    Rs. {product.originalPrice.toLocaleString()}.00
                  </span>
                )}
                {product.sale && (
                  <span className="bg-primary-wine text-white px-2 py-1 rounded text-sm font-medium">
                    Save {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description || 'This exquisite piece from our collection showcases premium craftsmanship and elegant design. Perfect for everyday wear or special occasions.'}</p>
            </div>

            {/* Key Features */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {(product.features && product.features.length > 0 ? product.features : ['Premium quality materials', 'Handcrafted with precision', 'Hypoallergenic and skin-safe', 'Elegant luxury finish']).map((feature: string, index: number) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="text-gold-primary">✨</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Materials and Specifications */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gold-primary/20 p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">Materials</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {(product.materials && product.materials.length > 0 ? product.materials : ['High-grade alloy', 'Gold/Silver plating', 'Anti-tarnish coating']).map((material: string, index: number) => (
                    <li key={index}>• {material}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 border border-gold-primary/20 p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">Specifications</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  {product.dimensions && <p>📏 {product.dimensions}</p>}
                  {product.weight && <p>⚖️ {product.weight}</p>}
                </div>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-900">Quantity:</label>
                <div className="flex items-center border border-gray-300 bg-white rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-900 hover:text-gold-primary transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-900 hover:text-gold-primary transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart & Wishlist */}
              <div className="flex space-x-4">
                <button
                  onClick={addToCart}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-medium transition-all btn-premium-gold text-luxury-dark hover:shadow-glow-gold"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={toggleWishlist}
                  className="p-3 bg-gray-50 border border-gray-300 rounded-lg hover:border-gold-primary/50 transition-all"
                >
                  <Heart className={`h-5 w-5 ${
                    isInWishlist ? 'text-gold-primary fill-current' : 'text-gray-400'
                  }`} />
                </button>
              </div>
            </div>

            {/* Service Features */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Free Shipping */}
                <div className="flex items-center space-x-3 bg-gray-50 border border-gold-primary/20 p-3 rounded-lg">
                  <div className="p-2 bg-gradient-to-r from-emerald-luxury to-sapphire-luxury rounded-full">
                    <Truck className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                    <p className="text-xs text-gray-600">On orders over ₹1000</p>
                  </div>
                </div>
                {/* Secure Payment */}
                <div className="flex items-center space-x-3 bg-gray-50 border border-gold-primary/20 p-3 rounded-lg">
                  <div className="p-2 bg-gradient-to-r from-sapphire-luxury to-gold-primary rounded-full">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Secure Payment</p>
                    <p className="text-xs text-gray-600">100% secure checkout</p>
                  </div>
                </div>
                {/* Easy Returns */}
                <div className="flex items-center space-x-3 bg-gray-50 border border-gold-primary/20 p-3 rounded-lg">
                  <div className="p-2 bg-gradient-to-r from-ruby-luxury to-rose-gold rounded-full">
                    <RotateCcw className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Easy Returns</p>
                    <p className="text-xs text-gray-600">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Care Instructions */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Care Instructions</h3>
              <div className="bg-gray-50 border border-gold-primary/20 p-4 rounded-lg">
                <ul className="space-y-2">
                  {(product.careInstructions && product.careInstructions.length > 0 ? product.careInstructions : ['Keep away from water and chemicals', 'Store in a dry, cool place', 'Clean gently with a soft cloth', 'Avoid perfume and body spray contact']).map((instruction: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-gold-primary mt-1">✓</span>
                      <span className="text-gray-700 text-sm">{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Product Videos */}
            {(product as any).videos && (product as any).videos.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Videos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(product as any).videos.map((video: string, idx: number) => {
                    if (!video) return null;
                    const isEmbedUrl = video.includes('youtube.com') || video.includes('youtu.be') || video.includes('vimeo.com') || video.includes('player.vimeo');
                    return (
                      <div key={idx} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gold-primary/20 shadow-md">
                        {isEmbedUrl ? (
                          <iframe
                            src={video}
                            className="w-full h-full"
                            allowFullScreen
                            allow="autoplay; fullscreen; picture-in-picture"
                            title={`Product Video ${idx + 1}`}
                          />
                        ) : (
                          <video
                            src={getImageUrl(video)}
                            className="w-full h-full object-cover"
                            controls
                            controlsList="nodownload"
                            onError={handleVideoError}
                            poster="https://via.placeholder.com/400?text=Video"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        {id && <ProductReviews productId={id} />}
      </div>
    </div>
  );
};

export default ProductDetail;
