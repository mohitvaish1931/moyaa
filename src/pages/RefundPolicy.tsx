import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-luxury-dark py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="luxury-serif text-5xl md:text-6xl text-platinum mb-6">
            Refund Policy
          </h1>
          <p className="text-platinum/70 text-lg">
            Understand our returns, refunds, and exchange process.
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none text-platinum/80 space-y-8">
          {/* Returns section */}
          <section>
            <h2 className="luxury-serif text-3xl text-gold-primary mb-4">Returns</h2>
            <p>
              We accept returns only if you've received a damaged product or we have sent a different 
              product accidentally, provided that you must have a proof of unboxing video from the start 
              clearly showing the damage in the product. In this case, we shall arrange a pickup from your 
              location and issue a credit note for the same which can be used for your future orders.
            </p>
          </section>

          {/* Refund section */}
          <section>
            <h2 className="luxury-serif text-3xl text-gold-primary mb-4">Refund</h2>
            <p>
              We do not provide refunds at any cost. In some cases, you might be eligible for a credit note.
            </p>
          </section>

          {/* Missing item section */}
          <section>
            <h2 className="luxury-serif text-3xl text-gold-primary mb-4">Missing Item</h2>
            <p className="mb-4">
              Incase a product is missing from your package, you can raise an issue for the same & we will 
              ship it to you at the earliest. You must have a proof of unboxing video from the start clearly 
              showing all the products in the package.
            </p>
            <p>
              Please note, we don't provide refund for the missing item. You may be eligible for a credit 
              note if the missing item is out of stock.
            </p>
          </section>

          {/* Exchange section */}
          <section>
            <h2 className="luxury-serif text-3xl text-gold-primary mb-4">Exchange</h2>
            <p className="mb-4">
              We provide size exchange only for finger rings. Shipping charges of ₹200 (to & fro) will be 
              borne by the customer. Exchange will be picked up and delivered at the same address as the 
              original delivery address.
            </p>
            <p>
              Please note that the exchange process takes around 12-15 days.
            </p>
          </section>

          {/* Time limit section */}
          <section>
            <h2 className="luxury-serif text-3xl text-gold-primary mb-4">Time Limit</h2>
            <p>
              You need to raise a return/exchange request within a period of 3 days from the delivery date. 
              Post this period of 3 days, your order shall become final sale, and would not be eligible for 
              any return request.
            </p>
          </section>

          {/* Contact section */}
          <section className="pt-8 border-t border-gold-primary/20">
            <h2 className="luxury-serif text-3xl text-gold-primary mb-4">Raise a Request</h2>
            <p className="mb-6">
              You can raise a return/exchange request through the following channels:
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

export default RefundPolicy;
