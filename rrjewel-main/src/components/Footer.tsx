import React from 'react';
import { Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-luxury-dark pt-24 pb-8 border-t border-gold-primary/40 shadow-[inset_0_1px_0_rgba(255,215,0,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="mb-8">
              <div className="text-2xl luxury-serif text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-rose-gold tracking-widest mb-2">
                  ✨ MYRA ✨
                </div>
                <p className="text-platinum/70 text-sm leading-relaxed">
                  Luxury jewelry for the modern connoisseur. Timeless elegance, modern craftsmanship.
                </p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-emerald-luxury text-lg">✓</span>
                <span className="text-platinum/70 text-sm">Certified Authentic</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sapphire-luxury text-lg">✓</span>
                <span className="text-platinum/70 text-sm">Lifetime Warranty</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-ruby-luxury text-lg">✓</span>
                <span className="text-platinum/70 text-sm">White-Glove Service</span>
              </div>
            </div>
          </div>

          {/* Collections */}
          <div className="col-span-1">
            <h4 className="luxury-serif text-gold-primary text-sm tracking-widest mb-8">COLLECTIONS</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-platinum/70 text-sm hover:text-gold-primary transition-all duration-300">Earrings</a></li>
              <li><a href="#" className="text-platinum/70 text-sm hover:text-gold-primary transition-all duration-300">Necklaces</a></li>
              <li><a href="#" className="text-platinum/70 text-sm hover:text-gold-primary transition-all duration-300">Bracelets</a></li>
              <li><a href="#" className="text-platinum/70 text-sm hover:text-gold-primary transition-all duration-300">New Arrivals</a></li>
              <li><a href="#" className="text-platinum/70 text-sm hover:text-gold-primary transition-all duration-300">Limited Edition</a></li>
            </ul>
          </div>

          {/* Information */}
          <div className="col-span-1">
            <h4 className="luxury-serif text-gold-primary text-sm tracking-widest mb-8">INFORMATION</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-platinum/70 text-sm hover:text-gold-primary transition-all duration-300">About Us</a></li>
              <li><a href="#" className="text-platinum/70 text-sm hover:text-gold-primary transition-all duration-300">Privacy Policy</a></li>
              <li><a href="#" className="text-platinum/70 text-sm hover:text-gold-primary transition-all duration-300">Shipping Policy</a></li>
              <li><a href="#" className="text-platinum/70 text-sm hover:text-gold-primary transition-all duration-300">Terms & Conditions</a></li>
              <li><a href="#" className="text-platinum/70 text-sm hover:text-gold-primary transition-all duration-300">Returns & Exchanges</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h4 className="luxury-serif text-gold-primary text-sm tracking-widest mb-6">JOIN OUR CIRCLE</h4>
            <p className="text-platinum/70 text-sm mb-6 leading-relaxed">
              Subscribe for exclusive previews, private sales, and curated collection updates.
            </p>
            
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-3 bg-luxury-secondary border border-gold-primary/30 rounded-lg text-platinum placeholder-platinum/40 focus:border-gold-primary/60 focus:outline-none transition-all duration-300 focus:shadow-glow"
              />
              <button className="w-full bg-gradient-to-r from-gold-primary to-rose-gold text-luxury-dark py-3 px-6 rounded-lg font-semibold text-xs luxury-serif tracking-widest hover:shadow-glow transition-all duration-300">
                SUBSCRIBE
              </button>
            </form>

            {/* Social icons */}
            <div className="mt-6">
              <a href="#" className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gold-primary/30 hover:border-gold-primary/60 hover:shadow-glow-gold text-platinum hover:text-gold-primary transition-all duration-300">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Contact section */}
        <div className="border-y border-gold-primary/20 py-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <Mail className="h-5 w-5 text-gold-primary flex-shrink-0 mt-1" />
              <div>
                <p className="text-platinum/50 text-xs tracking-widest luxury-serif mb-2">EMAIL</p>
                <p className="text-platinum text-sm">hello@myrajewelry.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="h-5 w-5 text-gold-primary flex-shrink-0 mt-1" />
              <div>
                <p className="text-platinum/50 text-xs tracking-widest luxury-serif mb-2">PHONE</p>
                <p className="text-platinum text-sm">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 text-gold-primary flex-shrink-0 mt-1" />
              <div>
                <p className="text-platinum/50 text-xs tracking-widest luxury-serif mb-2">LOCATION</p>
                <p className="text-platinum text-sm">New York, NY 10001</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="pt-8">
          <p className="text-platinum/50 text-xs tracking-widest luxury-serif mb-6 text-center">ACCEPTED PAYMENT METHODS</p>
          <div className="flex flex-wrap items-center justify-center gap-6 opacity-70 hover:opacity-100 transition-opacity">
            {/* Visa */}
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" 
              alt="Visa" 
              className="h-6 object-contain filter brightness-0 invert"
            />
            
            {/* Mastercard */}
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" 
              alt="Mastercard" 
              className="h-6 object-contain filter brightness-0 invert"
            />
            
            {/* PayPal */}
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/200px-PayPal.svg.png" 
              alt="PayPal" 
              className="h-6 object-contain filter brightness-0 invert"
            />
            
            {/* Google Pay */}
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/200px-Google_Pay_Logo.svg.png" 
              alt="Google Pay" 
              className="h-6 object-contain filter brightness-0 invert"
            />
            
            {/* Razorpay */}
            <img 
              src="https://razorpay.com/assets/razorpay-logo.svg" 
              alt="Razorpay" 
              className="h-6 object-contain filter brightness-0 invert"
            />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gold-primary/20 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-platinum/50 text-xs">
            © 2024 MYRA Luxury Jewelry. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-platinum/50 text-xs hover:text-gold-primary transition-all duration-300">Privacy</a>
            <a href="#" className="text-platinum/50 text-xs hover:text-gold-primary transition-all duration-300">Terms</a>
            <a href="#" className="text-platinum/50 text-xs hover:text-gold-primary transition-all duration-300">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;