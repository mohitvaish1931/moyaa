import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, ChevronLeft, ChevronRight, Star, Truck, Shield, RotateCcw, PlayCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { API_BASE_URL, API_ENDPOINTS } from '../utils/api';
import { useSEO } from '../utils/useSEO';
import { parseList } from '../utils/dataHelper';
import { generateProductSchema, generateBreadcrumbSchema } from '../utils/schemaGenerator';
import ProductReviews from '../components/ProductReviews';
import { getImageUrl, handleImageError, handleVideoError } from '../utils/mediaHelper';

interface Product {
  id: string | number;
  _id?: string;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  category: string;
  image: string;
  images: string[];
  materials: string[];
  specifications: string[];
  dimensions?: string;
  weight?: string;
  stock: number;
  soldOut?: boolean;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedShape, setSelectedShape] = useState<string>('');



  const allSizes = product ? parseList((product as any).sizes) : [];
  const allShapes = product ? parseList((product as any).shapes) : [];

  // Hook for SEO - must be top level
  useSEO({
    title: product ? `${product.name} - Premium ${product.category} | MORAA JEWELS` : 'Product Detail - MORAA JEWELS',
    description: product ? (product.description || `Buy ${product.name} from MORAA JEWELS.`) : 'Discover our exquisite luxury jewelry collection.',
    keywords: product ? `${product.name}, ${product.category}, luxury jewelry` : 'luxury jewelry, premium pieces',
    image: product ? ((product.images && product.images.length > 0 ? product.images[0] : product.image) || 'https://moraajewles.com/logo.png') : 'https://moraajewles.com/logo.png',
    url: product ? `https://moraajewles.com/product/${id}` : 'https://moraajewles.com',
    type: 'product',
  });

  // Hook for size selection - must be top level
  useEffect(() => {
    if (allSizes.length > 0 && !selectedSize) {
      setSelectedSize(allSizes[0]);
    }
  }, [allSizes, selectedSize]);

  useEffect(() => {
    if (allShapes.length > 0 && !selectedShape) {
      setSelectedShape(allShapes[0]);
    }
  }, [allShapes, selectedShape]);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${API_ENDPOINTS.PRODUCTS}/${id}`);
          if (!response.ok) throw new Error('Product not found');
          const data = await response.json();
          setProduct(data);
        } catch (err) {
          console.error('Fetch error:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    dispatch({
      type: 'ADD_TO_CART',
      payload: { 
        ...product, 
        quantity, 
        selectedSize: product.category.toLowerCase() === 'rings' ? selectedSize : undefined,
        selectedShape: selectedShape || undefined
      }
    });
    // Visual feedback could be added here
  };

  const toggleWishlist = () => {
    if (!product) return;
    const isInWishlist = state.wishlist.some((item: any) => (item._id || item.id) === (product._id || product.id));
    if (isInWishlist) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product._id || product.id });
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
    }
  };

  const handleVideoError = (e: any) => {
    console.warn('Video failed to load:', e);
    e.target.style.display = 'none';
  };

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
          <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 text-gold-primary hover:text-gold-dark font-medium"
          >
            ← Back to Categories
          </button>
        </div>
      </div>
    );
  }

  const isInWishlist = state.wishlist.some((item: any) => (item._id || item.id) === (product._id || product.id));
  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-screen bg-luxury-cream/30 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-text-muted hover:text-gold-primary transition-colors font-medium tracking-widest text-xs"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            BACK
          </button>
          <div className="hidden sm:flex items-center space-x-2 text-xs font-bold tracking-[0.2em] text-text-muted">
            <span className="hover:text-gold-primary cursor-pointer" onClick={() => navigate('/')}>HOME</span>
            <span>/</span>
            <span className="hover:text-gold-primary cursor-pointer uppercase" onClick={() => navigate('/products')}>{product.category}</span>
            <span>/</span>
            <span className="text-gold-primary truncate max-w-[150px] uppercase">{product.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-[4/5] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gold-primary/10 group">
              <img
                src={getImageUrl(productImages[selectedImage])}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {product.soldOut && (
                <div className="absolute inset-0 bg-luxury-dark/40 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="bg-ruby-luxury text-white px-8 py-3 rounded-full font-bold tracking-[0.3em] shadow-2xl animate-pulse">
                    SOLD OUT
                  </span>
                </div>
              )}
            </div>
            
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-gold-primary shadow-glow-gold' : 'border-transparent hover:border-gold-primary/30'
                    }`}
                  >
                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              <span className="inline-block text-[10px] font-bold tracking-[0.3em] text-gold-primary uppercase mb-3 px-3 py-1 bg-gold-primary/5 rounded-full border border-gold-primary/10">
                {product.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-text-primary luxury-serif tracking-tight leading-tight mb-4 uppercase">
                {product.name}
              </h1>
              
              <div className="flex items-baseline space-x-4 mb-6">
                <span className="text-3xl font-bold text-ruby-luxury luxury-serif">₹{product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-lg text-text-muted line-through">₹{product.originalPrice}</span>
                )}
                {product.originalPrice > product.price && (
                  <span className="text-xs font-bold text-teal-600 tracking-widest bg-teal-50 px-2 py-1 rounded">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Product Information Sequence */}
            <div className="mb-10 space-y-10">
              
              {/* Description */}
              {product.description && (
                <div>
                   <h3 className="text-[11px] font-bold text-text-primary luxury-serif tracking-[0.2em] mb-4 uppercase">Description</h3>
                   <div className="prose prose-sm max-w-none text-text-secondary leading-relaxed">
                     <p className="whitespace-pre-line font-medium leading-loose">{product.description}</p>
                   </div>
                </div>
              )}
              
              {/* Details (Dimensions & Weight) */}
              {(product.dimensions || product.weight) && (
                <div>
                   <h3 className="text-[11px] font-bold text-text-primary luxury-serif tracking-[0.2em] mb-4 uppercase">Details</h3>
                  <div className="space-y-4">
                    {product.dimensions && (
                      <div className="flex flex-col mb-4">
                         <span className="font-bold tracking-widest uppercase text-[10px] text-text-muted mb-2">Dimensions</span>
                         <ul className="space-y-3">
                           {product.dimensions.split('*').map(s => s.trim()).filter(Boolean).map((dim, idx) => (
                             <li key={idx} className="flex items-start">
                               <span className="text-gold-primary mr-3 mt-1 text-xs">✦</span>
                               <span className="font-bold tracking-widest uppercase text-[11px] text-text-primary leading-tight">{dim}</span>
                             </li>
                           ))}
                         </ul>
                      </div>
                    )}
                    {product.weight && (
                      <div className="flex flex-col">
                         <span className="font-bold tracking-widest uppercase text-[10px] text-text-muted mb-2">Weight</span>
                         <ul className="space-y-3">
                           {product.weight.split('*').map(s => s.trim()).filter(Boolean).map((w, idx) => (
                             <li key={idx} className="flex items-start">
                               <span className="text-gold-primary mr-3 mt-1 text-xs">✦</span>
                               <span className="font-bold tracking-widest uppercase text-[11px] text-text-primary leading-tight">{w}</span>
                             </li>
                           ))}
                         </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Specifications */}
              {(product as any).specifications?.length > 0 && (
                <div>
                   <h3 className="text-[11px] font-bold text-text-primary luxury-serif tracking-[0.2em] mb-4 uppercase">Specifications</h3>
                  <ul className="space-y-3">
                    {((product as any).specifications as string[])
                      .flatMap(s => s.split('*'))
                      .map(s => s.trim())
                      .filter(Boolean)
                      .map((spec: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-gold-primary mr-3 mt-1 text-xs">✦</span>
                        <span className="font-bold tracking-widest uppercase text-[11px] text-text-primary leading-tight">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Materials */}
              {(product as any).materials?.length > 0 && (
                <div>
                   <h3 className="text-[11px] font-bold text-text-primary luxury-serif tracking-[0.2em] mb-4 uppercase">Materials</h3>
                  <ul className="space-y-3">
                    {((product as any).materials as string[])
                      .flatMap(s => s.split('*'))
                      .map(s => s.trim())
                      .filter(Boolean)
                      .map((material: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-gold-primary mr-3 mt-1 text-xs">✦</span>
                        <span className="font-bold tracking-widest uppercase text-[11px] text-text-primary leading-tight">{material}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              {/* Shape Selection */}
              {allShapes.length > 0 && (
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-900">Choose Shape:</label>
                  <div className="flex flex-wrap gap-2">
                      <div className="flex flex-wrap gap-2 pt-1">
                        {allShapes.map((shape: string, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedShape(shape)}
                            className={`min-w-[45px] px-4 py-2.5 border rounded-xl transition-all text-xs font-bold tracking-widest ${
                              selectedShape === shape
                                ? 'bg-gold-primary text-luxury-dark border-gold-primary shadow-glow-gold scale-105'
                                : 'bg-white/50 border-gold-primary/20 text-text-primary hover:border-gold-primary'
                            }`}
                          >
                            {shape}
                          </button>
                        ))}
                      </div>
                  </div>
                </div>
              )}

              {/* Ring Size Selection */}
              {product.category.toLowerCase() === 'rings' && (
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-900">Choose Ring Size:</label>
                  <div className="flex flex-wrap gap-2">
                    {allSizes.length > 0 ? (
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
                    ) : (
                      <p className="text-[10px] text-text-muted italic">Standard Ring Size</p>
                    )}
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
              </div>

              {/* Add to Cart & Wishlist */}
              <div className="flex space-x-4">
                <button
                  onClick={addToCart}
                  disabled={product.soldOut}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-medium transition-all ${
                    product.soldOut 
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                      : 'btn-premium-gold text-luxury-dark hover:shadow-glow-gold'
                  }`}
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>{product.soldOut ? 'Sold Out' : 'Add to Cart'}</span>
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
            <div className="border-t border-gold-primary/10 pt-8 mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 bg-luxury-secondary/20 border border-gold-primary/10 p-4 rounded-xl">
                  <Truck className="h-5 w-5 text-gold-primary" />
                  <div>
                    <p className="text-[9px] font-bold text-text-primary tracking-widest uppercase">FREE SHIPPING</p>
                    <p className="text-[8px] text-text-secondary uppercase">Orders over ₹1000</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-luxury-secondary/20 border border-gold-primary/10 p-4 rounded-xl">
                  <Shield className="h-5 w-5 text-gold-primary" />
                  <div>
                    <p className="text-[9px] font-bold text-text-primary tracking-widest uppercase">SECURE PAYMENT</p>
                    <p className="text-[8px] text-text-secondary uppercase">100% encryption</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-luxury-secondary/20 border border-gold-primary/10 p-4 rounded-xl">
                  <RotateCcw className="h-5 w-5 text-primary-red" />
                  <div>
                    <p className="text-[9px] font-bold text-text-primary tracking-widest uppercase">EASY RETURNS</p>
                    <p className="text-[8px] text-text-secondary uppercase">30-day policy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Care Instructions */}
            <div className="border-t border-gold-primary/10 pt-8 mt-8">
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
              <div className="border-t border-gray-200 pt-8 mt-8">
                <h3 className="text-[11px] font-bold text-text-primary luxury-serif tracking-[0.2em] mb-4 uppercase">Product Videos</h3>
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
