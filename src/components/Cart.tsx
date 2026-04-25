import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ArrowLeft, CreditCard, Truck } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { API_ENDPOINTS } from '../utils/api';
import { parseList } from '../utils/dataHelper';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useAppContext();
  const [view, setView] = useState<'cart' | 'checkout'>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Prepaid' | 'COD'>('Prepaid');
  
  const [shippingInfo, setShippingInfo] = useState({
    name: state.user?.name || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });

  const hasSameNameProduct = (name: string) => {
    return state.cart.filter(i => i.name === name).length > 1;
  };

  const updateQuantity = (id: string | number, quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    } else {
      dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id, quantity } });
    }
  };

  const removeFromCart = (id: string | number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const getTotalPrice = () => {
    return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (!state.user) {
      dispatch({ type: 'TOGGLE_SIGNIN', payload: true });
      return;
    }
    setView('checkout');
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.user) return;

    try {
      setIsProcessing(true);

      // 1. Create Order in Backend
      const orderRes = await fetch(API_ENDPOINTS.ORDERS.CREATE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: state.user.id,
          items: state.cart.map(item => ({
            product: item._id || item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            selectedSize: item.selectedSize,
            selectedShape: item.selectedShape,
            image: item.image
          })),
          totalAmount: getTotalPrice(),
          shippingAddress: shippingInfo,
          paymentMethod: paymentMethod
        })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || 'Failed to create order');

      if (paymentMethod === 'COD') {
        alert('✅ Order Placed Successfully! You have selected Cash on Delivery.');
        dispatch({ type: 'CLEAR_CART' });
        onClose();
        setView('cart');
        return;
      }

      // 2. Open Razorpay Modal
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "MORAA JEWELS",
        description: "Order Payment",
        order_id: orderData.razorpayOrderId,
        handler: async (response: any) => {
          try {
            // 3. Verify Payment in Backend
            const verifyRes = await fetch(API_ENDPOINTS.ORDERS.VERIFY, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData.orderId
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              alert('✅ Payment Successful! Your order has been placed.');
              dispatch({ type: 'CLEAR_CART' });
              onClose();
              setView('cart');
            } else {
              throw new Error(verifyData.error || 'Payment verification failed');
            }
          } catch (err: any) {
            alert('❌ Error: ' + err.message);
          }
        },
        prefill: {
          name: shippingInfo.name,
          email: state.user?.email || "",
          contact: shippingInfo.phone
        },
        theme: {
          color: "#2F6F4E"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      alert('❌ Error: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-luxury-dark/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-card-emerald border border-teal-luxury/40 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden shadow-glow-emerald flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-emerald-luxury/30">
          <div className="flex items-center space-x-4">
            {view === 'checkout' && (
              <button onClick={() => setView('cart')} className="text-platinum/60 hover:text-gold-primary transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <h2 className="text-2xl font-bold text-gold-primary luxury-serif">
              {view === 'cart' ? 'Shopping Cart' : 'Checkout Details'}
            </h2>
          </div>
          <button onClick={onClose} className="text-platinum/60 hover:text-gold-primary transition-colors duration-300">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {view === 'cart' ? (
            state.cart.length === 0 ? (
              <div className="text-center py-12">
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
                      <div className="flex flex-col space-y-1">
                        {item.selectedSize && (
                          <p className="text-xs text-gold-primary italic">Size: {item.selectedSize}</p>
                        )}
                        {item.shapes && item.shapes.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] text-text-muted uppercase tracking-widest">Shape:</span>
                            <select
                              value={item.selectedShape || ''}
                              onChange={(e) => dispatch({ type: 'UPDATE_CART_SHAPE', payload: { id: item.id, shape: e.target.value } })}
                              className="bg-luxury-dark/30 border border-gold-primary/20 rounded px-2 py-0.5 text-[10px] text-platinum outline-none focus:border-gold-primary/50"
                            >
                              <option value="">Select Shape</option>
                              {parseList(item.shapes).map((shape, idx) => (
                                <option key={idx} value={shape}>{shape}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
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
            )
          ) : (
            <form onSubmit={handlePayment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Full Name"
                  className="bg-luxury-dark/30 border border-gold-primary/20 rounded-lg p-3 text-platinum outline-none focus:border-gold-primary/50"
                  value={shippingInfo.name}
                  onChange={e => setShippingInfo({...shippingInfo, name: e.target.value})}
                />
                <input
                  required
                  placeholder="Phone Number"
                  className="bg-luxury-dark/30 border border-gold-primary/20 rounded-lg p-3 text-platinum outline-none focus:border-gold-primary/50"
                  value={shippingInfo.phone}
                  onChange={e => setShippingInfo({...shippingInfo, phone: e.target.value})}
                />
              </div>
              <textarea
                required
                placeholder="Full Address"
                rows={3}
                className="w-full bg-luxury-dark/30 border border-gold-primary/20 rounded-lg p-3 text-platinum outline-none focus:border-gold-primary/50"
                value={shippingInfo.address}
                onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  required
                  placeholder="City"
                  className="bg-luxury-dark/30 border border-gold-primary/20 rounded-lg p-3 text-platinum outline-none focus:border-gold-primary/50"
                  value={shippingInfo.city}
                  onChange={e => setShippingInfo({...shippingInfo, city: e.target.value})}
                />
                <input
                  required
                  placeholder="State"
                  className="bg-luxury-dark/30 border border-gold-primary/20 rounded-lg p-3 text-platinum outline-none focus:border-gold-primary/50"
                  value={shippingInfo.state}
                  onChange={e => setShippingInfo({...shippingInfo, state: e.target.value})}
                />
                <input
                  required
                  placeholder="Pincode"
                  className="bg-luxury-dark/30 border border-gold-primary/20 rounded-lg p-3 text-platinum outline-none focus:border-gold-primary/50"
                  value={shippingInfo.pincode}
                  onChange={e => setShippingInfo({...shippingInfo, pincode: e.target.value})}
                />
              </div>
              <div className="p-4 bg-emerald-luxury/10 border border-emerald-luxury/20 rounded-lg">
                <div className="flex items-center space-x-2 text-gold-primary mb-2">
                  <Truck className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Shipping Method</span>
                </div>
                <p className="text-[10px] text-platinum/70">Standard Shipping (Shiprocket Integrated)</p>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Select Payment Method</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Prepaid')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 transition-all duration-300 ${paymentMethod === 'Prepaid' ? 'border-gold-primary bg-gold-primary/20 shadow-glow-gold' : 'border-platinum/20 bg-black/40 hover:border-gold-primary/50'}`}
                  >
                    <CreditCard className={`h-6 w-6 ${paymentMethod === 'Prepaid' ? 'text-gold-primary' : 'text-platinum/60'}`} />
                    <span className={`text-xs font-black tracking-widest ${paymentMethod === 'Prepaid' ? 'text-text-primary' : 'text-platinum/60'}`}>ONLINE PAYMENT</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 transition-all duration-300 ${paymentMethod === 'COD' ? 'border-gold-primary bg-gold-primary/20 shadow-glow-gold' : 'border-platinum/20 bg-black/40 hover:border-gold-primary/50'}`}
                  >
                    <Truck className={`h-6 w-6 ${paymentMethod === 'COD' ? 'text-gold-primary' : 'text-platinum/60'}`} />
                    <span className={`text-xs font-black tracking-widest ${paymentMethod === 'COD' ? 'text-text-primary' : 'text-platinum/60'}`}>CASH ON DELIVERY</span>
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full btn-premium-gold text-luxury-dark py-4 rounded-lg font-black uppercase tracking-widest flex items-center justify-center space-x-2 hover:shadow-glow-gold transition-all"
              >
                {isProcessing ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    {paymentMethod === 'Prepaid' ? <CreditCard className="h-5 w-5" /> : <Truck className="h-5 w-5" />}
                    <span>{paymentMethod === 'Prepaid' ? 'Pay Now (Razorpay)' : 'Place Order (COD)'}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        {state.cart.length > 0 && view === 'cart' && (
          <div className="border-t border-gold-primary/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold text-platinum">Total: <span className="text-gold-primary">Rs. {getTotalPrice().toLocaleString()}.00</span></span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full btn-premium-gold text-luxury-dark py-3 px-6 rounded-lg font-medium hover:shadow-glow transition-all duration-300 uppercase tracking-widest text-sm font-bold"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
