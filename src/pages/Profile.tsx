import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Heart, ShoppingBag, Package } from 'lucide-react';
import { useSEO } from '../utils/useSEO';

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: any[];
}

const Profile = () => {
  useSEO({
    title: 'My Profile - MORAA Jewelry',
    description: 'Manage your profile, view orders, cart and wishlist',
    keywords: 'profile, orders, wishlist, cart',
    image: 'https://moraajewles.com/logo.png',
    url: 'https://moraajewles.com/profile',
    type: 'website'
  });

  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!state.user) {
      navigate('/');
    } else {
      // Load orders from localStorage
      const savedOrders = localStorage.getItem(`orders_${state.user.id}`);
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    }
  }, [state.user, navigate]);

  const handleLogout = () => {
    const shouldLogout = window.confirm('Are you sure you want to sign out?');
    if (shouldLogout) {
      dispatch({ type: 'LOGOUT' });
      navigate('/');
    }
  };

  const handleRemoveFromCart = (productId: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const handleRemoveFromWishlist = (productId: number) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
  };

  const handleAddToCart = (product: any) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const cartTotal = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  if (!state.user) {
    return null;
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Profile Header */}
      <div className="mb-12">
        <div className="bg-gradient-to-r from-luxury-secondary to-luxury-tertiary border border-gold-primary/40 rounded-lg p-8 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-gold-primary to-rose-gold rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-luxury-dark" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl luxury-serif text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-rose-gold mb-2">
                Welcome, {state.user.name}!
              </h1>
              <p className="text-platinum/70 text-sm">Member since {new Date().getFullYear()}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 rounded-lg transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4 border-b border-gold-primary/20 pb-4">
          {[
            { id: 'details', label: 'Account Details', icon: User },
            { id: 'orders', label: 'Orders', icon: Package },
            { id: 'cart', label: 'Cart', icon: ShoppingBag },
            { id: 'wishlist', label: 'Wishlist', icon: Heart }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 luxury-serif text-sm tracking-widest ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-gold-primary to-rose-gold text-luxury-dark'
                    : 'text-platinum/70 hover:text-gold-primary border border-gold-primary/20 hover:border-gold-primary/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Account Details Tab */}
      {activeTab === 'details' && (
        <div className="bg-luxury-secondary border border-gold-primary/40 rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl luxury-serif text-gold-primary tracking-widest mb-8">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-luxury-tertiary/50 p-6 rounded-lg border border-gold-primary/20">
              <label className="text-platinum/50 text-xs luxury-serif tracking-widest mb-2 block">Full Name</label>
              <p className="text-platinum text-lg font-semibold">{state.user.name}</p>
            </div>
            <div className="bg-luxury-tertiary/50 p-6 rounded-lg border border-gold-primary/20">
              <label className="text-platinum/50 text-xs luxury-serif tracking-widest mb-2 block">Email Address</label>
              <p className="text-platinum text-lg font-semibold">{state.user.email}</p>
            </div>
            <div className="bg-luxury-tertiary/50 p-6 rounded-lg border border-gold-primary/20">
              <label className="text-platinum/50 text-xs luxury-serif tracking-widest mb-2 block">Total Orders</label>
              <p className="text-platinum text-lg font-semibold">{orders.length}</p>
            </div>
            <div className="bg-luxury-tertiary/50 p-6 rounded-lg border border-gold-primary/20">
              <label className="text-platinum/50 text-xs luxury-serif tracking-widest mb-2 block">Member Status</label>
              <p className="text-emerald-luxury text-lg font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-luxury rounded-full"></span>
                Active
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-luxury-secondary border border-gold-primary/40 rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl luxury-serif text-gold-primary tracking-widest mb-8">Your Orders</h2>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-platinum/30 mx-auto mb-4" />
              <p className="text-platinum/70">No orders yet. Start shopping now!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="border border-gold-primary/20 rounded-lg p-6 hover:border-gold-primary/40 transition-all duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-platinum/50 text-xs luxury-serif tracking-widest mb-1 block">Order ID</label>
                      <p className="text-platinum font-mono">{order.id}</p>
                    </div>
                    <div>
                      <label className="text-platinum/50 text-xs luxury-serif tracking-widest mb-1 block">Date</label>
                      <p className="text-platinum">{order.date}</p>
                    </div>
                    <div>
                      <label className="text-platinum/50 text-xs luxury-serif tracking-widest mb-1 block">Total</label>
                      <p className="text-gold-primary font-semibold">₹{order.total.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-platinum/50 text-xs luxury-serif tracking-widest mb-1 block">Status</label>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'Delivered' ? 'bg-emerald-luxury/20 text-emerald-luxury' :
                        order.status === 'Processing' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cart Tab */}
      {activeTab === 'cart' && (
        <div className="bg-luxury-secondary border border-gold-primary/40 rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl luxury-serif text-gold-primary tracking-widest mb-8">Shopping Cart</h2>
          {state.cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-platinum/30 mx-auto mb-4" />
              <p className="text-platinum/70 mb-6">Your cart is empty</p>
              <button
                onClick={() => navigate('/products')}
                className="px-6 py-3 bg-gradient-to-r from-gold-primary to-rose-gold text-luxury-dark rounded-lg font-semibold hover:shadow-glow transition-all duration-300"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-6 mb-8">
                {state.cart.map(item => (
                  <div key={item.id} className="border border-gold-primary/20 rounded-lg p-6 hover:border-gold-primary/40 transition-all duration-300">
                    <div className="flex gap-6">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-platinum font-semibold text-lg mb-2">{item.name}</h3>
                        <p className="text-gold-primary mb-4">₹{item.price.toLocaleString()}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-platinum/70">Qty: {item.quantity}</span>
                          <span className="text-rose-gold font-semibold">₹{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 rounded-lg transition-all duration-300 h-fit"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-luxury-tertiary/50 border border-gold-primary/20 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-platinum/70 text-lg">Subtotal:</span>
                  <span className="text-gold-primary text-2xl font-semibold">₹{cartTotal.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 bg-gradient-to-r from-gold-primary to-rose-gold text-luxury-dark rounded-lg font-semibold hover:shadow-glow transition-all duration-300"
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Wishlist Tab */}
      {activeTab === 'wishlist' && (
        <div className="bg-luxury-secondary border border-gold-primary/40 rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl luxury-serif text-gold-primary tracking-widest mb-8">Wishlist</h2>
          {state.wishlist.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-platinum/30 mx-auto mb-4" />
              <p className="text-platinum/70">Your wishlist is empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.wishlist.map(item => (
                <div key={item.id} className="bg-luxury-tertiary border border-gold-primary/20 rounded-lg overflow-hidden hover:border-gold-primary/40 transition-all duration-300">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      className="absolute top-3 right-3 p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 rounded-lg transition-all duration-300"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                  <div className="p-6">
                    <h3 className="text-platinum font-semibold mb-2 line-clamp-2">{item.name}</h3>
                    <p className="text-gold-primary font-semibold mb-4">₹{item.price.toLocaleString()}</p>
                    <button
                      onClick={() => {
                        handleAddToCart(item);
                        handleRemoveFromWishlist(item.id);
                      }}
                      className="w-full py-2 bg-gradient-to-r from-gold-primary to-rose-gold text-luxury-dark rounded-lg font-semibold hover:shadow-glow transition-all duration-300"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
