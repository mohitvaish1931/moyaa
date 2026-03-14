import React from 'react';

const JewelleryCareGuide = () => {
  return (
    <div className="min-h-screen bg-luxury-dark py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="luxury-serif text-5xl md:text-6xl text-platinum mb-6">
            Jewellery Care Guide
          </h1>
          <p className="text-platinum/70 text-lg">
            Keep your precious accessories beautiful and timeless with proper care.
          </p>
        </div>

        {/* Intro */}
        <div className="mb-12 p-6 border border-gold-primary/30 rounded-lg bg-luxury-secondary/40">
          <p className="text-platinum/80 text-center text-lg leading-relaxed">
            As much as we love flaunting our accessories, we often come across jewellery storing or caring 
            roadblocks that don't get answered. We are here to help you with the same. If you follow these 
            tips & guidelines, it will ensure the longevity of the accessories.
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none text-platinum/80 space-y-8">
          {/* Keep Away from Moisture */}
          <section>
            <h2 className="luxury-serif text-3xl text-gold-primary mb-4">Keep It Away from Moisture</h2>
            <p className="mb-4">
              Picture this, you are all set to step out for the party & in last minute you feel your hair 
              needs a tinge more of that hair spray. While you spray it, spritz of it deposits on your 
              gorgeous earrings. We all know what happens next!
            </p>
            <p className="mb-4">
              To avoid this, your jewellery needs to be kept away from any source of moisture be it mists, 
              perfumes, moisturizers, etc.
            </p>
            <p className="mb-4">
              You should also not wear your jewellery while bathing or gymming because water & sweat can 
              both ruin your jewellery.
            </p>
            <p>
              <span className="text-gold-primary font-semibold">Important:</span> Do not use any chemicals 
              to clean your jewellery as it may cause tarnishing.
            </p>
          </section>

          {/* Store Carefully */}
          <section>
            <h2 className="luxury-serif text-3xl text-gold-primary mb-4">Store Them Carefully</h2>
            <p className="mb-4">
              Always store your jewellery in separate zip locks so that they do not rub against each other. 
              This prevents scratching and maintains the shine.
            </p>
            <p className="mb-4">
              <span className="text-gold-primary font-semibold">Special care for delicate pieces:</span> 
              Layered pendants, earrings with tassels, and pom pom jewellery should not be folded and kept 
              so that they retain their shape.
            </p>
            <p>
              If needed you can wipe your jewellery gently with a soft cloth or cotton after every use to 
              ensure their longevity.
            </p>
          </section>

          {/* Keep Chains from Entangling */}
          <section>
            <h2 className="luxury-serif text-3xl text-gold-primary mb-4">Keep Chains from Entangling</h2>
            <p className="mb-4">
              Apart from being difficult to detangle, entangling of chains also results in tarnishing and 
              potential damage to the metal.
            </p>
            <p>
              <span className="text-gold-primary font-semibold">Best practice:</span> Drop the pendant in 
              the ziplock bag first, then let the chain go in with only the lock and extensions out, zipping 
              close the bag. This way when you need to wear the chain, it will be easy to remove without any 
              knots.
            </p>
          </section>

          {/* Don't Leave Out */}
          <section>
            <h2 className="luxury-serif text-3xl text-gold-primary mb-4">Don't Leave Them Out for Long Hours</h2>
            <p className="mb-4">
              Often it happens that you have left jewellery out on dressing table after reaching home tired 
              from a party. While it's okay if it rests there for a while, it's absolutely not advisable to 
              leave it there for long hours.
            </p>
            <p>
              Prolonged exposure can cause blackening of the metal and make stones or crystals falter. Always 
              store your jewellery properly after use.
            </p>
          </section>

          {/* Avoid Continuous Usage */}
          <section>
            <h2 className="luxury-serif text-3xl text-gold-primary mb-4">Avoid Continuous Usage</h2>
            <p className="mb-4">
              No matter how much we love our accessories, we need to give them a break. Continuous usage of 
              your favourite jewellery also leads to earlier wear and tear of either the metal or stones.
            </p>
            <p>
              Rotate your collection and give each piece rest days between wearings. This extends the life 
              of your jewellery and keeps it looking beautiful for years to come.
            </p>
          </section>

          {/* Contact section */}
          <section className="pt-8 border-t border-gold-primary/20">
            <h2 className="luxury-serif text-3xl text-gold-primary mb-4">Questions About Care?</h2>
            <p className="mb-6">
              If you have any specific questions about caring for your jewellery, feel free to reach out:
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

export default JewelleryCareGuide;
