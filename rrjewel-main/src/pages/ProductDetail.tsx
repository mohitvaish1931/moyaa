import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, ChevronLeft, ChevronRight, Truck, Shield, RotateCcw } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useAppContext();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = state.products.find(p => p.id === Number(id));

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

  const isInWishlist = state.wishlist.find(item => item.id === product.id);
  const images = product.images || [product.image];

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
    <div className="min-h-screen bg-luxury-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-platinum/60">
            <li><Link to="/" className="hover:text-gold-primary transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link to="/products" className="hover:text-gold-primary transition-colors">Products</Link></li>
            <li>/</li>
            <li><Link to={`/${product.category}`} className="hover:text-gold-primary transition-colors capitalize">{product.category}</Link></li>
            <li>/</li>
            <li className="text-platinum">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-luxury-secondary border border-sapphire-luxury/20 rounded-lg overflow-hidden">
              <img
                src={images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 glass-card-sapphire border border-sapphire-luxury/40 hover:shadow-glow-sapphire rounded-full p-2 shadow-glow-sapphire transition-all"
                  >
                    <ChevronLeft className="h-5 w-5 text-platinum" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 glass-card-sapphire border border-sapphire-luxury/40 hover:shadow-glow-sapphire rounded-full p-2 shadow-glow-sapphire transition-all"
                  >
                    <ChevronRight className="h-5 w-5 text-platinum" />
                  </button>
                </>
              )}
              {/* Sale Badge */}
              {product.sale && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-gold-primary to-rose-gold text-luxury-dark px-3 py-1 text-sm font-medium rounded shadow-glow-gold">
                  Sale
                </div>
              )}
              {/* Sold Out Badge */}
              {product.soldOut && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-ruby-luxury to-amethyst-luxury text-platinum px-3 py-1 text-sm font-medium rounded shadow-glow-ruby">
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
                      currentImageIndex === index ? 'border-gold-primary shadow-glow-gold' : 'border-sapphire-luxury/30'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
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
              <h1 className="text-3xl font-bold text-platinum mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold-primary text-gold-primary" />
                  ))}
                </div>
                <span className="text-sm text-platinum/60">(24 reviews)</span>
              </div>
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-gold-primary">
                  Rs. {product.price.toLocaleString()}.00
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-platinum/50 line-through">
                    Rs. {product.originalPrice.toLocaleString()}.00
                  </span>
                )}
                {product.sale && (
                  <span className="bg-gradient-to-r from-emerald-luxury to-sapphire-luxury text-platinum px-2 py-1 rounded text-sm font-medium">
                    Save {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-medium text-platinum mb-3">Description</h3>
              <p className="text-platinum/70 leading-relaxed">{product.description}</p>
            </div>

            {/* Key Features */}
            <div>
              <h3 className="text-lg font-medium text-platinum mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="text-gold-primary">✨</span>
                    <span className="text-platinum/70">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Materials and Specifications */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card-emerald border border-emerald-luxury/40 p-4 rounded-lg">
                <h4 className="font-medium text-platinum mb-2">Materials</h4>
                <ul className="text-sm text-platinum/70 space-y-1">
                  {product.materials.map((material, index) => (
                    <li key={index}>• {material}</li>
                  ))}
                </ul>
              </div>
              <div className="glass-card-sapphire border border-sapphire-luxury/40 p-4 rounded-lg">
                <h4 className="font-medium text-platinum mb-2">Specifications</h4>
                <div className="text-sm text-platinum/70 space-y-1">
                  {product.dimensions && <p>📏 {product.dimensions}</p>}
                  {product.weight && <p>⚖️ {product.weight}</p>}
                </div>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-platinum">Quantity:</label>
                <div className="flex items-center border border-sapphire-luxury/40 bg-luxury-secondary rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-platinum hover:text-gold-primary transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-sapphire-luxury/40 text-platinum">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-platinum hover:text-gold-primary transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart & Wishlist */}
              <div className="flex space-x-4">
                <button
                  onClick={addToCart}
                  disabled={product.soldOut}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-medium transition-all ${
                    product.soldOut
                      ? 'bg-luxury-secondary text-platinum/50 cursor-not-allowed border border-platinum/20'
                      : 'btn-premium-gold text-luxury-dark hover:shadow-glow-gold'
                  }`}
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>{product.soldOut ? 'Sold Out' : 'Add to Cart'}</span>
                </button>
                <button
                  onClick={toggleWishlist}
                  className="p-3 glass-card-ruby border border-ruby-luxury/40 rounded-lg hover:shadow-glow-ruby transition-all"
                >
                  <Heart className={`h-5 w-5 ${
                    isInWishlist ? 'text-gold-primary fill-current' : 'text-platinum'
                  }`} />
                </button>
              </div>
            </div>

            {/* Service Features */}
            <div className="border-t border-sapphire-luxury/20 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Free Shipping */}
                <div className="flex items-center space-x-3 glass-card-emerald border border-emerald-luxury/30 p-3 rounded-lg">
                  <div className="p-2 bg-gradient-to-r from-emerald-luxury to-sapphire-luxury rounded-full">
                    <Truck className="h-5 w-5 text-platinum" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-platinum">Free Shipping</p>
                    <p className="text-xs text-platinum/60">On orders over ₹1000</p>
                  </div>
                </div>
                {/* Secure Payment */}
                <div className="flex items-center space-x-3 glass-card-sapphire border border-sapphire-luxury/30 p-3 rounded-lg">
                  <div className="p-2 bg-gradient-to-r from-sapphire-luxury to-gold-primary rounded-full">
                    <Shield className="h-5 w-5 text-platinum" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-platinum">Secure Payment</p>
                    <p className="text-xs text-platinum/60">100% secure checkout</p>
                  </div>
                </div>
                {/* Easy Returns */}
                <div className="flex items-center space-x-3 glass-card-ruby border border-ruby-luxury/30 p-3 rounded-lg">
                  <div className="p-2 bg-gradient-to-r from-ruby-luxury to-rose-gold rounded-full">
                    <RotateCcw className="h-5 w-5 text-platinum" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-platinum">Easy Returns</p>
                    <p className="text-xs text-platinum/60">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Care Instructions */}
            <div className="border-t border-sapphire-luxury/20 pt-6">
              <h3 className="text-lg font-medium text-platinum mb-3">Care Instructions</h3>
              <div className="glass-card-emerald border border-emerald-luxury/40 p-4 rounded-lg">
                <ul className="space-y-2">
                  {product.careInstructions.map((instruction, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-gold-primary mt-1">✓</span>
                      <span className="text-platinum/70 text-sm">{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;