import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, ChevronLeft, ChevronRight, Truck, Shield, RotateCcw, Share2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { API_ENDPOINTS } from '../utils/api';
import { useSEO } from '../utils/useSEO';
import { parseList } from '../utils/dataHelper';
import ProductReviews from '../components/ProductReviews';
import { getImageUrl, handleVideoError as mediaHandleVideoError } from '../utils/mediaHelper';
import { Product } from '../context/AppContext';

// Local interface for any additional frontend-only fields if needed, 
// though we've added most to the global interface now.
// interface LocalProduct extends Product { ... }

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
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isQualityInfoOpen, setIsQualityInfoOpen] = useState(false);

  const isSizeOutOfStock = (sizeStr: string) => {
    if (!product || product.category.toLowerCase() !== 'rings' || !product.sizeStock) return false;
    const val = product.sizeStock[sizeStr];
    return val !== undefined ? val <= 0 : false;
  };

  const isCurrentSizeOutOfStock = useMemo(() => {
    if (!product || product.category.toLowerCase() !== 'rings' || !product.sizeStock) return false;
    if (!selectedSize) return false;
    const val = product.sizeStock[selectedSize];
    return val !== undefined ? val <= 0 : false;
  }, [product, selectedSize]);

  const isCurrentShapeOutOfStock = useMemo(() => {
    if (!product || !(product as any).shapeStock) return false;
    if (!selectedShape) return false;
    const val = (product as any).shapeStock[selectedShape];
    return val !== undefined ? val <= 0 : false;
  }, [product, selectedShape]);

  const isCurrentColorOutOfStock = useMemo(() => {
    if (!product || !(product as any).colorStock) return false;
    if (!selectedColor) return false;
    const val = (product as any).colorStock[selectedColor];
    return val !== undefined ? val <= 0 : false;
  }, [product, selectedColor]);



  const allSizes = useMemo(() => product ? parseList((product as any).sizes) : [], [product]);
  const allShapes = useMemo(() => product ? parseList((product as any).shapes) : [], [product]);
  const allColors = useMemo(() => product ? parseList((product as any).colors) : [], [product]);

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
    if (allColors.length > 0 && !selectedColor) {
      setSelectedColor(allColors[0]);
    }
  }, [allColors, selectedColor]);

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
        selectedShape: selectedShape || undefined,
        selectedColor: selectedColor || undefined
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
    mediaHandleVideoError(e);
    e.currentTarget.style.display = 'none';
  };

  const handleShare = async () => {
    const shareData = {
      title: product?.name || 'Moraa Jewels',
      text: product?.description || 'Check out this beautiful jewelry!',
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
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
            className="flex items-center text-text-primary hover:text-gold-primary transition-colors font-bold tracking-widest text-sm"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            BACK
          </button>
          <div className="hidden sm:flex items-center space-x-2 text-sm font-bold tracking-[0.2em] text-text-primary/70">
            <span className="hover:text-gold-primary cursor-pointer" onClick={() => navigate('/')}>HOME</span>
            <span>/</span>
            <span className="hover:text-gold-primary cursor-pointer uppercase" onClick={() => navigate('/products')}>{product.category}</span>
            <span>/</span>
            <span className="text-gold-primary truncate max-w-[200px] uppercase">{product.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-square w-full max-w-[500px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gold-primary/10 group mx-auto">
              <img
                src={getImageUrl(productImages[selectedImage])}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Navigation Arrows */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-md text-luxury-dark shadow-xl hover:bg-gold-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-md text-luxury-dark shadow-xl hover:bg-gold-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Dot Indicators */}
              {productImages.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                  {productImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        selectedImage === idx ? 'w-6 bg-gold-primary' : 'w-1.5 bg-luxury-dark/30 hover:bg-gold-primary/50'
                      }`}
                    />
                  ))}
                </div>
              )}

              {product.soldOut && (
                <div className="absolute inset-0 bg-luxury-dark/40 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="bg-ruby-luxury text-white px-8 py-3 rounded-full font-bold tracking-[0.3em] shadow-2xl animate-pulse">
                    SOLD OUT
                  </span>
                </div>
              )}
            </div>
            
            {productImages.length > 1 && (
              <div className="flex flex-wrap justify-center gap-4 max-w-[500px] mx-auto">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-gold-primary shadow-glow-gold scale-105' : 'border-gold-primary/10 hover:border-gold-primary/40'
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
              <span className="inline-block text-xs font-bold tracking-[0.3em] text-text-primary uppercase mb-3 px-4 py-1.5 bg-gold-primary/10 rounded-full border border-gold-primary/30">
                {product.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-text-primary luxury-serif tracking-tight leading-tight mb-4 uppercase">
                {product.name}
              </h1>
              
              <div className="flex items-baseline space-x-4 mb-6">
                <span className="text-3xl font-bold text-ruby-luxury luxury-serif">₹{product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-text-muted line-through">₹{product.originalPrice}</span>
                )}
                {product.originalPrice && product.originalPrice > product.price && (
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
                        {allShapes.map((shape: string, idx: number) => {
                          const isOutOfStock = (product as any).shapeStock?.[shape] !== undefined && (product as any).shapeStock[shape] <= 0;
                          return (
                            <button
                              key={idx}
                              onClick={() => setSelectedShape(shape)}
                              className={`min-w-[45px] px-4 py-2.5 border rounded-xl transition-all text-xs font-bold tracking-widest relative overflow-hidden ${
                                selectedShape === shape
                                  ? (isOutOfStock
                                      ? 'bg-gray-200 text-gray-500 border-gray-300 line-through cursor-not-allowed'
                                      : 'bg-gold-primary text-luxury-dark border-gold-primary shadow-glow-gold scale-105')
                                  : (isOutOfStock
                                      ? 'bg-gray-100/50 border-gray-200 text-gray-400 line-through cursor-not-allowed opacity-60'
                                      : 'bg-white/50 border-gold-primary/20 text-text-primary hover:border-gold-primary')
                              }`}
                            >
                              {shape}
                              {isOutOfStock && (
                                <span className="absolute bottom-0 right-0 w-2 h-2 bg-ruby-luxury rounded-full" title="Out of Stock"></span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {allColors.length > 0 && (
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-900">Choose Color:</label>
                  <div className="flex flex-wrap gap-2">
                      <div className="flex flex-wrap gap-2 pt-1">
                        {allColors.map((color: string, idx: number) => {
                          const isOutOfStock = (product as any).colorStock?.[color] !== undefined && (product as any).colorStock[color] <= 0;
                          return (
                            <button
                              key={idx}
                              onClick={() => setSelectedColor(color)}
                              className={`min-w-[45px] px-4 py-2.5 border rounded-xl transition-all text-xs font-bold tracking-widest relative overflow-hidden ${
                                selectedColor === color
                                  ? (isOutOfStock
                                      ? 'bg-gray-200 text-gray-500 border-gray-300 line-through cursor-not-allowed'
                                      : 'bg-gold-primary text-luxury-dark border-gold-primary shadow-glow-gold scale-105')
                                  : (isOutOfStock
                                      ? 'bg-gray-100/50 border-gray-200 text-gray-400 line-through cursor-not-allowed opacity-60'
                                      : 'bg-white/50 border-gold-primary/20 text-text-primary hover:border-gold-primary')
                              }`}
                            >
                              {color}
                              {isOutOfStock && (
                                <span className="absolute bottom-0 right-0 w-2 h-2 bg-ruby-luxury rounded-full" title="Out of Stock"></span>
                              )}
                            </button>
                          );
                        })}
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
                        {allSizes.map((size: string, idx: number) => {
                          const isOutOfStock = isSizeOutOfStock(size);
                          return (
                            <button
                              key={idx}
                              onClick={() => setSelectedSize(size)}
                              className={`min-w-[45px] px-4 py-2.5 border rounded-xl transition-all text-xs font-bold tracking-widest relative overflow-hidden ${
                                selectedSize === size
                                  ? (isOutOfStock 
                                      ? 'bg-gray-200 text-gray-500 border-gray-300 line-through cursor-not-allowed' 
                                      : 'bg-gold-primary text-luxury-dark border-gold-primary shadow-glow-gold scale-105')
                                  : (isOutOfStock
                                      ? 'bg-gray-100/50 border-gray-200 text-gray-400 line-through cursor-not-allowed opacity-60'
                                      : 'bg-white/50 border-gold-primary/20 text-text-primary hover:border-gold-primary')
                              }`}
                            >
                              {size}
                              {isOutOfStock && (
                                <span className="absolute bottom-0 right-0 w-2 h-2 bg-ruby-luxury rounded-full" title="Out of Stock"></span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-[10px] text-text-muted italic">Standard Ring Size</p>
                    )}
                  </div>
                  
                  {/* Helpful Links Section */}
                  <div className="flex flex-col space-y-3 pt-4 border-t border-gold-primary/5 mt-4">
                    <button 
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="flex items-center space-x-3 text-text-secondary hover:text-gold-primary transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gold-primary/10 flex items-center justify-center group-hover:bg-gold-primary group-hover:text-white transition-all">
                        <img src="/ring-size-guide.png" alt="" className="w-5 h-5 object-cover rounded-[2px]" />
                      </div>
                      <span className="text-[11px] font-bold tracking-[0.1em] uppercase underline underline-offset-4">Ring size help</span>
                    </button>
                    
                    <button 
                      onClick={() => setIsQualityInfoOpen(true)}
                      className="flex items-center space-x-3 text-text-secondary hover:text-gold-primary transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gold-primary/10 flex items-center justify-center group-hover:bg-gold-primary group-hover:text-white transition-all">
                        <Shield className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold tracking-[0.1em] uppercase underline underline-offset-4">Why Choose MORAA? Click here to know!</span>
                    </button>
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
                      onClick={() => {
                        let maxStock = product?.stock ?? Infinity;
                        if (product?.category.toLowerCase() === 'rings' && product?.sizeStock && selectedSize) {
                           maxStock = product.sizeStock[selectedSize] ?? 0;
                        } else if ((product as any)?.colorStock && selectedColor) {
                           maxStock = (product as any).colorStock[selectedColor] ?? 0;
                        } else if ((product as any)?.shapeStock && selectedShape) {
                           maxStock = (product as any).shapeStock[selectedShape] ?? 0;
                        }
                        setQuantity(Math.min(quantity + 1, maxStock));
                      }}
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
                  disabled={product.soldOut || isCurrentSizeOutOfStock || isCurrentShapeOutOfStock || isCurrentColorOutOfStock}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-medium transition-all ${
                    (product.soldOut || isCurrentSizeOutOfStock || isCurrentShapeOutOfStock || isCurrentColorOutOfStock) 
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                      : 'btn-premium-gold text-luxury-dark hover:shadow-glow-gold'
                  }`}
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>{(product.soldOut || isCurrentSizeOutOfStock || isCurrentShapeOutOfStock || isCurrentColorOutOfStock) ? 'Sold Out' : 'Add to Cart'}</span>
                </button>
                <button
                  onClick={toggleWishlist}
                  className="p-3 bg-gray-50 border border-gray-300 rounded-lg hover:border-gold-primary/50 transition-all"
                  title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart className={`h-5 w-5 ${
                    isInWishlist ? 'text-gold-primary fill-current' : 'text-gray-400'
                  }`} />
                </button>
                <div className="relative">
                  <button
                    onClick={handleShare}
                    className="p-3 bg-gray-50 border border-gray-300 rounded-lg hover:border-gold-primary/50 transition-all"
                    title="Share Product"
                  >
                    <Share2 className="h-5 w-5 text-gray-400 hover:text-gold-primary transition-colors" />
                  </button>
                  {copied && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-luxury-dark text-white text-[10px] px-3 py-1.5 rounded-full shadow-glow-gold animate-fade-in-down font-bold tracking-widest whitespace-nowrap z-20">
                      LINK COPIED!
                    </div>
                  )}
                </div>
              </div>

              {/* External Product Link */}
              {product.productLink && (
                <div className="pt-2">
                  <a
                    href={product.productLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-medium border border-gold-primary text-gold-primary hover:bg-gold-primary hover:text-white transition-all w-full"
                  >
                    <span>View More Details / Visit Store</span>
                  </a>
                </div>
              )}

              {/* Guaranteed Checkout Section */}
              <div className="pt-6 mt-6 border-t border-gold-primary/10">
                <div className="flex flex-col items-center">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="h-px w-8 bg-gold-primary/20"></div>
                    <span className="text-[9px] font-bold tracking-[0.3em] text-text-muted uppercase">Guaranteed Checkout</span>
                    <div className="h-px w-8 bg-gold-primary/20"></div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 opacity-80 grayscale hover:grayscale-0 transition-all">
                    <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="h-6" />
                    <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" className="h-6" />
                    <img src="https://img.icons8.com/color/48/000000/google-pay.png" alt="GPay" className="h-6" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo.png/640px-UPI-Logo.png" alt="UPI" className="h-4 mt-1" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/1200px-Paytm_Logo_%28standalone%29.svg.png" alt="Paytm" className="h-3 mt-1.5" />
                  </div>
                </div>
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

      {/* Ring Size Guide Modal */}
      {isSizeGuideOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-luxury-dark/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsSizeGuideOpen(false)}
        >
          <div 
            className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-gold-primary hover:text-white transition-all z-10"
            >
              <ChevronLeft className="h-5 w-5 rotate-180" />
            </button>
            <div className="p-8">
              <h2 className="text-2xl font-bold luxury-serif text-luxury-dark mb-6 text-center uppercase tracking-wider">Ring Size Guide</h2>
              <div className="rounded-2xl overflow-hidden border border-gold-primary/10">
                <img src="/ring-size-guide.png" alt="Moraa Ring Size Guide" className="w-full h-auto" />
              </div>
              <div className="mt-8 text-center">
                <button 
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="btn-premium-gold px-8 py-3 rounded-full text-xs font-bold tracking-widest text-luxury-dark"
                >
                  GOT IT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quality Info Modal */}
      {isQualityInfoOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-luxury-dark/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsQualityInfoOpen(false)}
        >
          <div 
            className="relative bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsQualityInfoOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-gold-primary hover:text-white transition-all z-10"
            >
              <ChevronLeft className="h-5 w-5 rotate-180" />
            </button>
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-gold-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-gold-primary" />
              </div>
              <h2 className="text-3xl font-bold luxury-serif text-luxury-dark mb-4 uppercase tracking-wider">The MORAA Quality</h2>
              <div className="space-y-6 text-left mt-8">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 rounded-full bg-gold-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-gold-primary text-[10px]">✦</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-luxury-dark text-sm uppercase tracking-wide">Premium Materials</h4>
                    <p className="text-text-secondary text-sm leading-relaxed">We use only high-grade materials, including 18K Gold Paving and 925 Sterling Silver base, ensuring longevity and a brilliant finish.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 rounded-full bg-gold-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-gold-primary text-[10px]">✦</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-luxury-dark text-sm uppercase tracking-wide">Waterproof & Durable</h4>
                    <p className="text-text-secondary text-sm leading-relaxed">Our pieces are designed for everyday wear—sweatproof, waterproof, and tarnish-resistant for up to 2 years.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 rounded-full bg-gold-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-gold-primary text-[10px]">✦</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-luxury-dark text-sm uppercase tracking-wide">Ethically Sourced</h4>
                    <p className="text-text-secondary text-sm leading-relaxed">Every MORAA piece is crafted with ethical standards, supporting sustainable practices in the jewelry industry.</p>
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <button 
                  onClick={() => setIsQualityInfoOpen(false)}
                  className="btn-premium-gold px-12 py-4 rounded-full text-xs font-bold tracking-widest text-luxury-dark hover:shadow-glow-gold transition-all"
                >
                  DISCOVER MORE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
