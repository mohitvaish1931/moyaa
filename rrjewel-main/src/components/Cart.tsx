import React from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useAppContext();

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    } else {
      dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id, quantity } });
    }
  };

  const removeFromCart = (id: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const getTotalPrice = () => {
    return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-luxury-dark/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-card-emerald border border-emerald-luxury/40 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden shadow-glow-emerald">
        <div className="flex items-center justify-between p-6 border-b border-emerald-luxury/30">
          <h2 className="text-2xl font-bold text-gold-primary luxury-serif">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="text-platinum/60 hover:text-gold-primary transition-colors duration-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          {state.cart.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-platinum/70 text-lg">Your cart is empty</p>
              <button
                onClick={onClose}
                className="mt-4 btn-premium-gold text-luxury-dark px-6 py-2 rounded-lg hover:shadow-glow transition-all duration-300"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {state.cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 border-b border-sapphire-luxury/20 pb-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg border border-gold-primary/30"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-platinum">{item.name}</h3>
                    <p className="text-gold-primary font-bold">Rs. {item.price.toLocaleString()}.00</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-ruby-luxury/30 rounded text-platinum hover:text-ruby-luxury transition-colors duration-300"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-platinum">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-emerald-luxury/30 rounded text-platinum hover:text-emerald-luxury transition-colors duration-300"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-ruby-luxury hover:text-ruby-luxury/80 transition-colors hover-ruby-glow"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {state.cart.length > 0 && (
          <div className="border-t border-gold-primary/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold text-platinum">Total: <span className="text-gold-primary">Rs. {getTotalPrice().toLocaleString()}.00</span></span>
            </div>
            <button className="w-full btn-premium-gold text-luxury-dark py-3 px-6 rounded-lg font-medium hover:shadow-glow transition-all duration-300">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;