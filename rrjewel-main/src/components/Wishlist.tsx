import React from 'react';
import { X, Heart, ShoppingBag } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface WishlistProps {
  isOpen: boolean;
  onClose: () => void;
}

const Wishlist: React.FC<WishlistProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useAppContext();

  const removeFromWishlist = (id: number) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: id });
  };

  const addToCart = (product: any) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-luxury-dark/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-card-ruby border border-ruby-luxury/40 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden shadow-glow-ruby">
        <div className="flex items-center justify-between p-6 border-b border-ruby-luxury/30">
          <h2 className="text-2xl font-bold text-gold-primary luxury-serif">Wishlist</h2>
          <button
            onClick={onClose}
            className="text-platinum/60 hover:text-gold-primary transition-colors duration-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          {state.wishlist.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="h-16 w-16 text-ruby-luxury/30 mx-auto mb-4" />
              <p className="text-platinum/70 text-lg">Your wishlist is empty</p>
              <button
                onClick={onClose}
                className="mt-4 btn-premium-gold text-luxury-dark px-6 py-2 rounded-lg hover:shadow-glow transition-all duration-300"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {state.wishlist.map((item) => (
                <div key={item.id} className="glass-card-sapphire border border-sapphire-luxury/30 rounded-lg p-4 shadow-glow-sapphire">
                  <div className="relative mb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-32 object-cover rounded-lg border border-gold-primary/30"
                    />
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-2 right-2 p-1 bg-luxury-dark/50 rounded-full shadow-md hover:shadow-lg hover-ruby-glow transition-all"
                    >
                      <Heart className="h-4 w-4 text-ruby-luxury fill-current" />
                    </button>
                  </div>
                  <h3 className="font-medium text-platinum mb-2 luxury-serif">{item.name}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gold-primary font-bold">
                      Rs. {item.price.toLocaleString()}.00
                    </span>
                    {item.originalPrice && (
                      <span className="text-sm text-platinum/50 line-through">
                        Rs. {item.originalPrice.toLocaleString()}.00
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(item)}
                    className="w-full btn-premium-gold text-luxury-dark py-2 px-4 rounded-lg font-medium hover:shadow-glow transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;