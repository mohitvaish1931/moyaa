import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-luxury-dark py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="luxury-serif text-5xl md:text-6xl text-platinum mb-6">
            Shipping Policy
          </h1>
          <p className="text-platinum/70 text-lg">
            Learn about our delivery times, shipping costs, and order tracking.
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none text-platinum/80 space-y-8">
          {/* Delivery Time section */}
          <section>
            <h2 className="luxury-serif text-3xl text-gold-primary mb-4">Delivery Time</h2>
            <p className="mb-4">
              All orders are usually dispatched within 2-3 working days unless stated otherwise. Once 
              dispatched, it takes 4-8 working days to deliver depending upon the location.
            </p>
            <p>
              However, the delivery time is subject to change based on shortage of an item, bad weather, 
              transit time of your carrier, destination address, or COVID related restrictions, etc.
            </p>
          </section>

          {/* Shipping Cost section */}
          <section>
            <h2 className="luxury-serif text-3xl text-gold-primary mb-4">Shipping Cost</h2>
            <p>
              We charge <span className="text-gold-primary font-semibold">₹70 per order</span> and also offer 
              <span className="text-gold-primary font-semibold"> free shipping on all orders above ₹1499</span>.
            </p>
          </section>

          {/* RTO/Un-delivered section */}
          <section>
            <h2 className="luxury-serif text-3xl text-gold-primary mb-4">RTO/Un-delivered Shipment</h2>
            <p className="mb-4">
              We are not liable for undelivered shipment or RTO (Return to Origin) due to wrong address / 
              misinformation provided while placing an order.
            </p>
            <p>
              In this case, customer has to pay the shipping charges again so we can re-ship the order.
            </p>
          </section>

          {/* Tracking Order section */}
          <section>
            <h2 className="luxury-serif text-3xl text-gold-primary mb-4">Tracking Your Order</h2>
            <p>
              Once your order is shipped from our warehouse, you will receive an email including a tracking 
              number to check the status.
            </p>
          </section>

          {/* Lost Shipment section */}
          <section>
            <h2 className="luxury-serif text-3xl text-gold-primary mb-4">Lost Shipment</h2>
            <p className="mb-4">
              Incase your package gets lost during the transit, we shall re-ship your order.
            </p>
            <p>
              If any item of your order is out of stock, you can either wait for a restock or we will issue 
              a credit note which can be used for future orders.
            </p>
          </section>

          {/* Contact section */}
          <section className="pt-8 border-t border-gold-primary/20">
            <h2 className="luxury-serif text-3xl text-gold-primary mb-4">Need Help with Your Order?</h2>
            <p className="mb-6">
              Feel free to reach us out on:
            </p>
            <div className="space-y-4 text-platinum/70">
              <div>
                <p className="text-gold-primary font-semibold mb-2">Email:</p>
                <p><a href="mailto:moraajewel@gmail.com" className="hover:text-gold-primary transition-colors">moraajewel@gmail.com</a></p>
              </div>
              <div>
                <p className="text-gold-primary font-semibold mb-2">WhatsApp:</p>
                <p><a href="https://wa.me/917877937350" className="hover:text-gold-primary transition-colors">+91 78779 37350</a></p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
