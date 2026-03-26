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
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
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
      description: product.description || `Premium ${product.category} from MORAA JEWELS`,
      image: product.images || [productImage],
      price: product.price || product.originalPrice || 0,
      priceCurrency: 'INR',
      availability: product.soldOut ? 'OutOfStock' : 'InStock',
      category: product.category,
      url: `https://moraajewles.com/product/${id}`,
      brand: 'MORAA JEWELS'
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: 'Home', url: 'https://moraajewles.com' },
      { name: 'Products', url: 'https://moraajewles.com/products' },
      { name: product.category, url: `https://moraajewles.com/${product.category.toLowerCase()}` },
      { name: product.name, url: `https://moraajewles.com/product/${id}` }
    ]);

    useSEO({
      title: `${product.name} - Premium ${product.category} | MORAA JEWELS`,
      description: product.description || `Buy ${product.name} from MORAA JEWELS. Premium ${product.category} with finest craftsmanship. Original price: ${product.originalPrice ? `₹${product.originalPrice}` : 'Contact for price'}`,
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
    if (product.category.toLowerCase() === 'rings' && (product as any).sizes?.length > 0 && !selectedSize) {
      alert('Please select a ring size first');
      return;
    }
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: 'ADD_TO_CART', payload: { ...product, selectedSize } });
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9]">
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
            <div className="relative aspect-square bg-luxury-secondary/10 border border-gold-primary/20 rounded-2xl overflow-hidden shadow-sm">
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
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      currentImageIndex === index ? 'border-gold-primary shadow-sm' : 'border-gold-primary/10'
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
                {['Waterproof & Sweatproof', 'Hypoallergenic & Skin-safe', 'Anti-tarnish & Long-lasting', '18k Gold PVD Finish', '1 Year Warranty'].map((feature: string, index: number) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="text-gold-primary">✨</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Materials and Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Dimensions Card */}
              {(product.dimensions || product.weight) && (
                <div className="bg-luxury-secondary/10 border border-gold-primary/10 p-5 rounded-2xl shadow-sm">
                  <h4 className="font-bold text-text-primary luxury-serif tracking-widest text-xs mb-4 uppercase">Product Dimensions</h4>
                  <div className="text-sm text-text-secondary space-y-2 font-medium">
                    {product.dimensions && (
                      <div className="border-b border-gold-primary/5 pb-2">
                        {(!product.dimensions.toLowerCase().includes('dimensions:')) && (
                          <span className="opacity-60 block mb-1">Dimensions:</span>
                        )}
                        <div className="space-y-1">
                          {product.dimensions.split('*').map((dim: string, i: number) => {
                            let trimmed = dim.trim();
                            // Strip outer quotes from individual dimension parts
                            if (trimmed.startsWith('"')) trimmed = trimmed.substring(1);
                            if (trimmed.endsWith('"')) trimmed = trimmed.substring(0, trimmed.length - 1);
                            trimmed = trimmed.trim();

                            if (!trimmed || trimmed === '"') return null;
                            if (trimmed.toLowerCase() === 'dimensions:') return null;
                            return <p key={i} className="text-xs">{trimmed}</p>;
                          })}
                        </div>
                      </div>
                    )}
                    {product.weight && (
                      <div className="flex justify-between border-b border-gold-primary/5 pb-2">
                        <span className="opacity-60">Weight:</span>
                        <span>{product.weight}</span>
                      </div>
                    )}
                    {(() => {
                      const parseJSONItems = (input: any): string[] => {
                        if (!input) return [];
                        let result = input;
                        try {
                          // Aggressively parse recursively if it's a string that looks like JSON
                          while (typeof result === 'string' && (result.trim().startsWith('[') || result.trim().startsWith('{'))) {
                            result = JSON.parse(result);
                          }
                          
                          // If it's an array with one element that is also a JSON string, parse that too
                          if (Array.isArray(result) && result.length === 1 && typeof result[0] === 'string' && result[0].trim().startsWith('[')) {
                            return parseJSONItems(result[0]);
                          }
                          
                          if (Array.isArray(result)) {
                            // Flatten and filter non-empty strings, and strip unwanted outer quotes
                            return result.map(i => {
                              let s = String(i).trim();
                              // Strip leading/trailing quotes that might be left over
                              if (s.startsWith('"') && s.endsWith('"')) s = s.substring(1, s.length - 1);
                              return s.trim();
                            }).filter(i => i.length > 0);
                          }
                          
                          if (typeof result === 'string' && result.length > 0) {
                            let s = result.trim();
                            if (s.startsWith('"') && s.endsWith('"')) s = s.substring(1, s.length - 1);
                            return [s.trim()];
                          }
                        } catch (e) {
                          if (typeof result === 'string') {
                            let s = result.trim();
                            if (s.startsWith('"') && s.endsWith('"')) s = s.substring(1, s.length - 1);
                            return [s.trim()];
                          }
                        }
                        return Array.isArray(result) ? result : [];
                      };

                      const mats = parseJSONItems(product.materials);
                      
                      // Handle cases where materials might be a single string with * separators
                      const finalMats: string[] = [];
                      mats.forEach(m => {
                        if (m.includes('*')) {
                          finalMats.push(...m.split('*').map(s => {
                            let res = s.trim();
                            // Clean up quotes from individual split items
                            if (res.startsWith('"')) res = res.substring(1);
                            if (res.endsWith('"')) res = res.substring(0, res.length - 1);
                            return res.trim();
                          }).filter(s => s.length > 0));
                        } else {
                          finalMats.push(m);
                        }
                      });

                      if (finalMats.length > 0) {
                        return (
                          <div className="pt-2">
                            <span className="opacity-60 block mb-2 font-semibold text-[10px] uppercase tracking-wider">Materials & Details:</span>
                            <div className="space-y-1.5 ml-1">
                              {finalMats.map((m: string, i: number) => (
                                <p key={i} className="text-xs text-text-primary flex items-start gap-2">
                                  <span className="text-gold-primary mt-0.5">•</span>
                                  <span>{m.replace(/^\*/, '').trim()}</span>
                                </p>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </div>
              )}

              {/* Specifications Card */}
              {(() => {
                const parseJSONItems = (input: any): string[] => {
                  if (!input) return [];
                  let result = input;
                  try {
                    while (typeof result === 'string' && (result.trim().startsWith('[') || result.trim().startsWith('{'))) {
                      result = JSON.parse(result);
                    }
                    if (Array.isArray(result) && result.length === 1 && typeof result[0] === 'string' && result[0].trim().startsWith('[')) {
                      return parseJSONItems(result[0]);
                    }
                    return Array.isArray(result) ? result.map(i => String(i).trim()) : (typeof result === 'string' ? [result] : []);
                  } catch (e) {
                    return typeof result === 'string' ? [result] : [];
                  }
                };

                const specs = parseJSONItems(product.specifications);
                if (specs.length > 0 && specs[0]) {
                  return (
                    <div className="bg-luxury-secondary/10 border border-gold-primary/10 p-5 rounded-2xl shadow-sm">
                      <h4 className="font-bold text-text-primary luxury-serif tracking-widest text-xs mb-4 uppercase">Specifications</h4>
                      <div className="text-sm text-text-secondary space-y-2 font-medium">
                        {specs.map((spec: string, i: number) => (
                          <p key={i} className="flex items-start gap-2">
                            <span className="text-gold-primary text-[10px] mt-1">✦</span>
                            <span className="text-xs">{spec.replace(/^\*/, '').trim()}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              {/* Ring Size Selection */}
              {product.category.toLowerCase() === 'rings' && (product as any).sizes && (
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-900">Choose Ring Size:</label>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      const parseSizesList = (raw: any): string[] => {
                        if (!raw) return [];
                        
                        // Handle potential double-encoded JSON or weird stringified arrays
                        let items: any[] = [];
                        if (Array.isArray(raw)) {
                          items = raw;
                        } else if (typeof raw === 'string') {
                          const trimmed = raw.trim();
                          if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                            try {
                              items = JSON.parse(trimmed);
                            } catch (e) {
                              items = trimmed.split(',');
                            }
                          } else {
                            items = trimmed.split(',');
                          }
                        } else {
                          items = [raw];
                        }
                        
                        // Deeply parse each item and flatMap
                        return items.flatMap(item => {
                          if (!item) return [];
                          if (typeof item === 'string') {
                            const trimmedItem = item.trim();
                            // If item itself looks like a JSON array, parse it
                            if (trimmedItem.startsWith('[') && trimmedItem.endsWith(']')) {
                              try {
                                return parseSizesList(JSON.parse(trimmedItem));
                              } catch (e) {
                                // fall through to comma split
                              }
                            }
                            return trimmedItem.split(',').map(s => s.trim()).filter(s => s && s !== 'null' && s !== 'undefined');
                          }
                          return [String(item)];
                        });
                      };

                      const allSizes = [...new Set(parseSizesList((product as any).sizes))];
                      
                      // Auto-select first size if none selected
                      useEffect(() => {
                        if (allSizes.length > 0 && !selectedSize) {
                          setSelectedSize(allSizes[0]);
                        }
                      }, [allSizes, selectedSize]);

                      if (allSizes.length > 0) {
                        return (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {allSizes.map((size: string, idx: number) => (
                              <button
                                key={idx}
                                onClick={() => setSelectedSize(size)}
                                className={`min-w-[45px] px-4 py-2.5 border rounded-xl transition-all text-xs font-bold tracking-widest ${
                                  selectedSize === size
                                    ? 'bg-gold-primary text-luxury-dark border-gold-primary shadow-glow-gold scale-105'
                                    : 'bg-white/50 border-gold-primary/20 text-text-primary hover:border-gold-primary'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        );
                      }
                      return (
                         <p className="text-[10px] text-text-muted italic">Standard Ring Size</p>
                      );
                    })()}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
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
                
                {/* Stock Info removed from customer view as per request */}
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
            <div className="border-t border-gold-primary/10 pt-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Free Shipping */}
                <div className="flex items-center space-x-3 bg-luxury-secondary/20 border border-gold-primary/10 p-4 rounded-xl">
                  <div className="p-2 bg-gold-primary/10 rounded-full">
                    <Truck className="h-5 w-5 text-gold-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-primary tracking-widest">FREE SHIPPING</p>
                    <p className="text-[10px] text-text-secondary uppercase font-medium">On orders over ₹1000</p>
                  </div>
                </div>
                {/* Secure Payment */}
                <div className="flex items-center space-x-3 bg-luxury-secondary/20 border border-gold-primary/10 p-4 rounded-xl">
                  <div className="p-2 bg-gold-primary/10 rounded-full">
                    <Shield className="h-5 w-5 text-gold-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-primary tracking-widest">SECURE PAYMENT</p>
                    <p className="text-[10px] text-text-secondary uppercase font-medium">100% secure checkout</p>
                  </div>
                </div>
                {/* Easy Returns */}
                <div className="flex items-center space-x-3 bg-luxury-secondary/20 border border-gold-primary/10 p-4 rounded-xl">
                  <div className="p-2 bg-ruby-luxury/10 rounded-full">
                    <RotateCcw className="h-5 w-5 text-primary-red" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-primary tracking-widest">EASY RETURNS</p>
                    <p className="text-[10px] text-text-secondary uppercase font-medium">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Care Instructions */}
            <div className="border-t border-gold-primary/10 pt-8">
              <h3 className="text-sm font-bold text-text-primary luxury-serif tracking-[0.2em] mb-4 uppercase">Care Instructions</h3>
              <div className="bg-luxury-secondary/10 border border-gold-primary/10 p-6 rounded-2xl">
                <ul className="space-y-3">
                  {['Waterproof and Sweatproof', 'Chlorine and Sea water safe', 'Store in a cool, dry place', 'Avoid harsh chemical contact'].map((instruction: string, index: number) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="text-gold-primary mt-1 text-xs">✦</span>
                      <span className="text-text-secondary text-sm font-medium">{instruction}</span>
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
