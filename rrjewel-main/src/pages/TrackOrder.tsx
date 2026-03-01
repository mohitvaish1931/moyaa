import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle } from 'lucide-react';

const TrackOrder = () => {
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
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-rose-gold mb-4">
            TRACK YOUR ORDER
          </h1>
          <p className="text-platinum/70">
            Enter your order details below to track your jewelry shipment
          </p>
        </div>

        {/* Track Order Form */}
        <div className="glass-card-sapphire border border-sapphire-luxury/40 shadow-glow-sapphire p-8 mb-8">
          <form onSubmit={handleTrackOrder} className="space-y-6">
            <div>
              <label htmlFor="orderNumber" className="block text-sm font-medium text-platinum mb-2">
                Order Number
              </label>
              <input
                type="text"
                id="orderNumber"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Enter your order number"
                className="w-full px-4 py-3 bg-luxury-secondary border border-sapphire-luxury/30 rounded-lg text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-platinum mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 bg-luxury-secondary border border-sapphire-luxury/30 rounded-lg text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 focus:border-transparent outline-none transition-all"
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
        <div className="glass-card-emerald border border-emerald-luxury/40 shadow-glow-emerald p-8">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-luxury to-sapphire-luxury mb-6">
            Order Status
          </h2>
          
          <div className="space-y-6">
            {/* Order Confirmed */}
            <div className="flex items-center space-x-4 pb-6 border-b border-emerald-luxury/20">
              <div className="flex-shrink-0">
                <div className="p-2 bg-gradient-to-r from-emerald-luxury to-sapphire-luxury rounded-full shadow-glow-emerald">
                  <CheckCircle className="h-8 w-8 text-gold-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-platinum">Order Confirmed</h3>
                <p className="text-sm text-platinum/70">Your order has been confirmed and is being prepared</p>
                <p className="text-xs text-platinum/50 mt-1">Dec 10, 2024 - 2:30 PM</p>
              </div>
            </div>

            {/* Processing */}
            <div className="flex items-center space-x-4 pb-6 border-b border-emerald-luxury/20">
              <div className="flex-shrink-0">
                <div className="p-2 bg-gradient-to-r from-ruby-luxury to-rose-gold rounded-full shadow-glow-ruby">
                  <Package className="h-8 w-8 text-gold-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-platinum">Processing</h3>
                <p className="text-sm text-platinum/70">Your jewelry is being carefully packaged</p>
                <p className="text-xs text-platinum/50 mt-1">Dec 11, 2024 - 10:15 AM</p>
              </div>
            </div>

            {/* Shipped */}
            <div className="flex items-center space-x-4 pb-6 border-b border-emerald-luxury/20">
              <div className="flex-shrink-0">
                <div className="p-2 bg-gradient-to-r from-sapphire-luxury to-gold-primary rounded-full shadow-glow-sapphire">
                  <Truck className="h-8 w-8 text-platinum" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-platinum/80">Shipped</h3>
                <p className="text-sm text-platinum/60">Your order is on its way</p>
                <p className="text-xs text-platinum/40 mt-1">Estimated: Dec 12, 2024</p>
              </div>
            </div>

            {/* Delivered */}
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="p-2 bg-gradient-to-r from-gold-primary to-platinum rounded-full">
                  <CheckCircle className="h-8 w-8 text-luxury-dark" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-platinum/60">Delivered</h3>
                <p className="text-sm text-platinum/50">Your order has been delivered</p>
                <p className="text-xs text-platinum/40 mt-1">Estimated: Dec 14, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;