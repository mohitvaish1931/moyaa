import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Heart, ShoppingBag, Package, Mail } from 'lucide-react';
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
    image: 'https://moraajewles.com/logo.jpeg',
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
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-luxury-dark min-h-screen">
      {/* Profile Header */}
      <div className="mb-12">
        <div className="bg-white/50 backdrop-blur-sm border border-gold-primary/10 p-8 rounded-2xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-luxury-secondary/30 rounded-full flex items-center justify-center border border-gold-primary/20">
                <User className="w-8 h-8 text-text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-text-primary luxury-serif tracking-widest uppercase">
                  {state.user.name}
                </h1>
                <p className="text-neutral-500 text-sm mt-1">Member since {new Date().getFullYear()}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg transition-all duration-300 font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 border-b border-neutral-200">
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
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-300 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-neutral-900 text-neutral-900'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
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
        <div className="bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-neutral-50 rounded-lg border border-neutral-200">
              <label className="text-neutral-500 text-xs font-semibold uppercase tracking-wide mb-2 block">Full Name</label>
              <p className="text-neutral-900 text-lg font-semibold">{state.user.name}</p>
            </div>
            <div className="p-6 bg-neutral-50 rounded-lg border border-neutral-200 flex items-start gap-3">
              <Mail className="w-4 h-4 text-neutral-500 mt-4" />
              <div className="flex-1">
                <label className="text-neutral-500 text-xs font-semibold uppercase tracking-wide mb-2 block">Email Address</label>
                <p className="text-neutral-900 text-lg font-semibold break-all">{state.user.email}</p>
              </div>
            </div>
            <div className="p-6 bg-neutral-50 rounded-lg border border-neutral-200">
              <label className="text-neutral-500 text-xs font-semibold uppercase tracking-wide mb-2 block">Total Orders</label>
              <p className="text-neutral-900 text-lg font-semibold">{orders.length}</p>
            </div>
            <div className="p-6 bg-neutral-50 rounded-lg border border-neutral-200">
              <label className="text-neutral-500 text-xs font-semibold uppercase tracking-wide mb-2 block">Account Status</label>
              <p className="text-green-600 text-lg font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                Active
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white">
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-neutral-50 rounded-lg border border-neutral-200">
                <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-500">No orders yet. Start shopping now!</p>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="border border-neutral-200 rounded-lg p-6 hover:border-neutral-300 hover:shadow-sm transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-neutral-500 text-xs font-semibold uppercase tracking-wide mb-1 block">Order ID</label>
                      <p className="text-neutral-900 font-mono text-sm">{order.id}</p>
                    </div>
                    <div>
                      <label className="text-neutral-500 text-xs font-semibold uppercase tracking-wide mb-1 block">Date</label>
                      <p className="text-neutral-900">{order.date}</p>
                    </div>
                    <div>
                      <label className="text-neutral-500 text-xs font-semibold uppercase tracking-wide mb-1 block">Total</label>
                      <p className="text-neutral-900 font-semibold">₹{order.total.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-neutral-500 text-xs font-semibold uppercase tracking-wide mb-1 block">Status</label>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Cart Tab */}
      {activeTab === 'cart' && (
        <div className="bg-white">
          {state.cart.length === 0 ? (
            <div className="text-center py-16 bg-neutral-50 rounded-lg border border-neutral-200">
              <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500 mb-6">Your cart is empty</p>
              <button
                onClick={() => navigate('/products')}
                className="px-6 py-2.5 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                {state.cart.map(item => (
                  <div key={item.id} className="border border-neutral-200 rounded-lg p-5 flex gap-5 hover:border-neutral-300 hover:shadow-sm transition-all">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg bg-neutral-100"
                    />
                    <div className="flex-1">
                      <h3 className="text-neutral-900 font-semibold text-base mb-2">{item.name}</h3>
                      <p className="text-neutral-600 mb-3">₹{item.price.toLocaleString()}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-neutral-600">Qty: {item.quantity}</span>
                        <span className="text-neutral-900 font-semibold">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg transition-all font-medium text-sm h-fit"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-neutral-600 text-lg">Subtotal:</span>
                  <span className="text-neutral-900 text-2xl font-bold">₹{cartTotal.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-3 bg-neutral-900 text-white rounded-lg font-semibold hover:bg-neutral-800 transition-all"
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
        <div className="bg-white">
          {state.wishlist.length === 0 ? (
            <div className="text-center py-16 bg-neutral-50 rounded-lg border border-neutral-200">
              <Heart className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500">Your wishlist is empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.wishlist.map(item => (
                <div key={item.id} className="bg-white border border-neutral-200 rounded-lg overflow-hidden hover:border-neutral-300 hover:shadow-md transition-all">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover bg-neutral-100"
                    />
                    <button
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      className="absolute top-3 right-3 p-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg transition-all"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                  <div className="p-5">
                    <h3 className="text-neutral-900 font-semibold mb-2 line-clamp-2">{item.name}</h3>
                    <p className="text-neutral-900 font-bold mb-4">₹{item.price.toLocaleString()}</p>
                    <button
                      onClick={() => {
                        handleAddToCart(item);
                        handleRemoveFromWishlist(item.id);
                      }}
                      className="w-full py-2 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-all text-sm"
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
