import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0E2822] border-t-2 border-gold-primary/20 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20 px-4">
          {/* Brand section */}
          <div className="md:col-span-1 space-y-8">
            <Link to="/" className="inline-block transform hover:scale-105 transition-transform duration-300">
              <img src="/logo.png" alt="Logo" className="h-20 w-auto filter drop-shadow-md" />
            </Link>
            <p className="text-bg-primary text-sm leading-relaxed font-bold italic">
              Crafting timeless legacies since 2026. Our masterpieces are a celebration of deep passion and enduring gold.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Instagram, url: 'https://www.instagram.com/moraajewels?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
                { Icon: Facebook, url: 'https://www.facebook.com/share/1PXzQcQH1R/' },
                { Icon: Twitter, url: '#' }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-gold-primary/20 flex items-center justify-center text-bg-primary hover:bg-primary-red hover:text-white hover:border-primary-red transition-all duration-300 shadow-sm"
                >
                  <social.Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-8">
            <h4 className="luxury-serif text-bg-primary font-bold tracking-[0.2em] text-sm uppercase">Collections</h4>
            <ul className="space-y-4">
              {['Earrings', 'Bracelets', 'Necklaces', 'Hand Chains', 'Sets'].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase().replace(' ', '-')}`} className="text-bg-primary font-bold text-sm hover:text-primary-red transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-4 h-px bg-gold-primary transition-all duration-300"></span>
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="luxury-serif text-bg-primary font-bold tracking-[0.2em] text-sm uppercase">Concierge</h4>
            <ul className="space-y-4">
              {[
                { name: 'About Us', path: '/about-us' },
                { name: 'Contact Us', path: '/contact' },
                { name: 'Track Order', path: '/track-order' },
                { name: 'FAQ', path: '/faq' },
                { name: 'Jewellery Care', path: '/jewellery-care-guide' },
                { name: 'Accessibility', path: '/accessibility' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-bg-primary font-bold text-sm hover:text-primary-red transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-4 h-px bg-gold-primary transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="luxury-serif text-bg-primary font-bold tracking-[0.2em] text-sm uppercase">Legal</h4>
            <ul className="space-y-4">
              {[
                { name: 'Shipping Policy', path: '/shipping-policy' },
                { name: 'Refund Policy', path: '/refund-policy' },
                { name: 'Privacy Policy', path: '/privacy-policy' },
                { name: 'Terms & Conditions', path: '/terms-conditions' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-bg-primary font-bold text-sm hover:text-primary-red transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-4 h-px bg-gold-primary transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter section */}
          <div className="md:col-span-1 space-y-8">
            <h4 className="luxury-serif text-bg-primary font-bold tracking-[0.2em] text-sm uppercase">Join the Legacy</h4>
            <p className="text-bg-primary text-sm font-bold leading-relaxed">
              Subscribe to receive updates on our latest collections and exclusive invitations.
            </p>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="YOUR EMAIL"
                className="w-full bg-white border border-gold-primary/50 px-6 py-4 rounded-full text-xs tracking-widest luxury-serif text-bg-primary placeholder:text-bg-primary/60 outline-none focus:border-primary-red transition-all duration-300 shadow-sm"
              />
              <button className="w-full bg-gold-primary text-white py-4 rounded-full text-xs tracking-[0.3em] font-bold luxury-serif hover:bg-text-primary transition-all duration-300 shadow-lg hover:shadow-primary-red/20 transform hover:-translate-y-1">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>

        {/* Contact section */}
        <div className="border-y border-gold-primary/10 py-12 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 rounded-full border border-gold-primary/20 flex items-center justify-center text-gold-primary group-hover:bg-primary-red group-hover:text-white transition-all duration-300">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-bg-primary font-black text-[10px] tracking-widest luxury-serif mb-2">EMAIL</p>
                <p className="text-bg-primary text-sm font-medium">moraajewel@gmail.com</p>
              </div>
            </div>
            <a href="tel:+917877937350" className="flex items-start gap-6 group cursor-pointer hover:text-gold-primary transition-colors">
              <div className="w-12 h-12 rounded-full border border-gold-primary/20 flex items-center justify-center text-gold-primary group-hover:bg-primary-red group-hover:text-white transition-all duration-300">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-bg-primary font-black text-[10px] tracking-widest luxury-serif mb-2">PHONE</p>
                <p className="text-bg-primary text-sm font-medium">+91 78779 37350</p>
              </div>
            </a>
            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 rounded-full border border-gold-primary/20 flex items-center justify-center text-gold-primary group-hover:bg-primary-red group-hover:text-white transition-all duration-300">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-bg-primary font-black text-[10px] tracking-widest luxury-serif mb-2">LOCATION</p>
                <p className="text-bg-primary text-sm font-medium">Pahadiya chowk, Jaipur 302002</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="text-center">
          <p className="text-bg-primary text-[10px] tracking-[0.2em] uppercase luxury-serif font-bold">
            &copy; {new Date().getFullYear()} MORAA JEWELS. CRAFTED BY <span className="text-gold-primary font-black">PRECISION</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
