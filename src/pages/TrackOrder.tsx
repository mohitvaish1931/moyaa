import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle } from 'lucide-react';
import { useSEO } from '../utils/useSEO';

const TrackOrder = () => {
  useSEO({
    title: 'Track Your Order - MORAA JEWELS Jewelry Delivery Status',
    description: 'Track your MORAA JEWELS jewelry order in real-time. Get live updates on your shipment status, delivery date and package location.',
    keywords: 'track order, order tracking, jewelry delivery, shipment status, order status',
    url: 'https://moraajewles.com/track-order',
    type: 'website'
  });

  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle order tracking logic here
    console.log('Tracking order:', orderNumber, email);
  };

  return (
    <div className="min-h-screen bg-luxury-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-gold-soft mb-4">

            TRACK YOUR ORDER
          </h1>
          <p className="text-text-secondary text-lg">
            Enter your order details below to track your jewelry shipment
          </p>
        </div>

        {/* Track Order Form */}
        <div className="glass-card-sapphire border border-teal-luxury/40 shadow-glow-emerald p-8 mb-8">

          <form onSubmit={handleTrackOrder} className="space-y-6">
            <div>
              <label htmlFor="orderNumber" className="block text-sm font-medium text-text-primary mb-2 luxury-serif">
                Order Number
              </label>
              <input
                type="text"
                id="orderNumber"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Enter your order number"
                className="w-full px-4 py-3 bg-white/50 border border-gold-primary/30 rounded-lg text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary-red/50 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2 luxury-serif">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 bg-white/50 border border-gold-primary/30 rounded-lg text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary-red/50 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full btn-premium-gold text-luxury-dark py-3 px-6 rounded-lg font-medium hover:shadow-glow-gold transition-all flex items-center justify-center space-x-2"
            >
              <Search className="h-5 w-5" />
              <span>TRACK ORDER</span>
            </button>
          </form>
        </div>

        {/* Sample Order Status */}
        <div className="glass-card-emerald border border-teal-luxury/40 shadow-glow-emerald p-8">

          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-luxury to-gold-primary mb-6">

            Order Status
          </h2>
          
          <div className="space-y-6">
            {/* Order Confirmed */}
            <div className="flex items-center space-x-4 pb-6 border-b border-gold-primary/20">
              <div className="flex-shrink-0">
                <div className="p-2 bg-gradient-to-r from-gold-primary to-gold-soft rounded-full shadow-glow-gold">
                  <CheckCircle className="h-8 w-8 text-luxury-dark" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-text-primary luxury-serif uppercase">Order Confirmed</h3>
                <p className="text-sm text-text-secondary">Your order has been confirmed and is being prepared</p>
                <p className="text-xs text-text-muted mt-1">Dec 10, 2024 - 2:30 PM</p>
              </div>
            </div>

            {/* Processing */}
            <div className="flex items-center space-x-4 pb-6 border-b border-gold-primary/20">
              <div className="flex-shrink-0">
                <div className="p-2 bg-gradient-to-r from-primary-red to-gold-primary rounded-full shadow-glow-ruby">
                  <Package className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-text-primary luxury-serif uppercase">Processing</h3>
                <p className="text-sm text-text-secondary">Your jewelry is being carefully packaged</p>
                <p className="text-xs text-text-muted mt-1">Dec 11, 2024 - 10:15 AM</p>
              </div>
            </div>

            {/* Shipped */}
            <div className="flex items-center space-x-4 pb-6 border-b border-gold-primary/20">
              <div className="flex-shrink-0">
                <div className="p-2 bg-gradient-to-r from-teal-luxury to-gold-primary rounded-full shadow-glow-emerald">
                  <Truck className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-text-primary luxury-serif uppercase">Shipped</h3>
                <p className="text-sm text-text-secondary">Your order is on its way</p>
                <p className="text-xs text-text-muted mt-1">Estimated: Dec 12, 2024</p>
              </div>
            </div>

            {/* Delivered */}
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="p-2 bg-gradient-to-r from-gold-primary to-gold-soft rounded-full shadow-glow-gold">
                  <CheckCircle className="h-8 w-8 text-luxury-dark" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-text-primary luxury-serif uppercase">Delivered</h3>
                <p className="text-sm text-text-secondary">Your order has been delivered successfully</p>
                <p className="text-xs text-text-muted mt-1">Estimated: Dec 14, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
