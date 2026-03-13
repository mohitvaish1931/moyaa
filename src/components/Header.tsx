import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, ChevronDown, Menu, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Cart from './Cart';
import Wishlist from './Wishlist';
import SearchModal from './SearchModal';

const Header = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUserClick = () => {
    if (state.user) {
      navigate('/profile');
    } else {
      dispatch({ type: 'TOGGLE_SIGNIN', payload: true });
    }
  };

  const navItems = [
    { label: 'HOME', path: '/' },
    { label: 'COLLECTIONS', path: '/products' },
    { label: 'EARRINGS', path: '/earrings' },
    { label: 'BRACELETS', path: '/bracelets' },
    { label: 'NECKLACES', path: '/necklaces' },
    { label: 'TRACK ORDER', path: '/track-order' },
    { label: 'CONTACT', path: '/contact' },
  ];

  return (
    <>
      {/* Premium announcement banner with gradient */}
      <div className="bg-gradient-to-r from-gold-primary/30 via-ruby-luxury/20 to-gold-primary/30 text-text-primary text-center py-3 sm:py-4 px-3 sm:px-4 text-xs tracking-widest luxury-serif border-b border-gold-primary/40 shadow-[0_0_30px_rgba(255,215,0,0.2)] overflow-hidden w-full">
        <span className="block sm:inline">✨ ELEVATE YOUR LUXURY • FINEST CRAFTSMANSHIP • TIMELESS ELEGANCE ✨</span>
        <Link
          to="/products"
          className="ml-3 text-gold-highlight hover:text-gold-primary transition-all duration-300 font-semibold animate-pulse"
        >
          Explore Collection →
        </Link>
      </div>

      {/* Floating luxury navigation with premium styling */}
      <header className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[calc(100%-1rem)] sm:w-auto max-w-[calc(100%-2rem)] sm:max-w-none ${scrollY > 100 ? 'top-2' : 'top-4'
        }`}>
        <nav className="glass-card px-3 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded-full shadow-premium border border-gold-primary/40 bg-luxury-dark/70 backdrop-blur-2xl">
          <div className="flex items-center justify-between lg:justify-start lg:gap-6">
            {/* Logo with luxury styling */}
            <Link
              to="/"
              className="flex items-center pr-3 sm:pr-4 lg:pr-5 border-r border-gold-primary/30 hover:text-gold-primary transition-all duration-300 group flex-shrink-0"
            >
              <img src="/logo.png" alt="Logo" className="h-8 sm:h-10 lg:h-14 w-auto object-contain max-w-[80px] sm:max-w-[120px] lg:max-w-[200px]" />
            </Link>

            {/* Navigation links with premium hover - Desktop only */}
            <div className="hidden lg:flex items-center gap-6">
              <Link
                to="/"
                className="text-platinum text-xs luxury-serif tracking-widest hover:text-gold-primary transition-all duration-300 relative group"
              >
                HOME
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold-primary to-ruby-luxury group-hover:w-full transition-all duration-300" />
              </Link>

              {/* Collections Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-platinum text-xs luxury-serif tracking-widest hover:text-gold-primary transition-all duration-300">
                  COLLECTIONS
                  <ChevronDown className="h-3 w-3 group-hover:text-gold-primary transition-all" />
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold-primary to-ruby-luxury group-hover:w-full transition-all duration-300" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="glass-card-emerald shadow-glow-emerald rounded-lg p-3 border border-emerald-luxury/40">
                  <Link
                    to="/products"
                    className="block px-4 py-3 text-xs text-platinum hover:text-gold-primary hover:bg-emerald-luxury/20 rounded transition-all duration-300"
                  >
                    All Products
                  </Link>
                  <Link
                    to="/earrings"
                    className="block px-4 py-3 text-xs text-platinum hover:text-gold-primary hover:bg-emerald-luxury/20 rounded transition-all duration-300"
                  >
                    ✨ Earrings
                  </Link>
                  <Link
                    to="/bracelets"
                    className="block px-4 py-3 text-xs text-platinum hover:text-gold-primary hover:bg-emerald-luxury/20 rounded transition-all duration-300"
                  >
                    ✨ Bracelets
                  </Link>
                  <Link
                    to="/necklaces"
                    className="block px-4 py-3 text-xs text-platinum hover:text-gold-primary hover:bg-emerald-luxury/20 rounded transition-all duration-300"
                  >
                    ✨ Necklaces
                  </Link>
                  </div>
                </div>
              </div>

              <Link
                to="/track-order"
                className="text-platinum text-xs luxury-serif tracking-widest hover:text-gold-primary transition-all duration-300 relative group"
              >
                TRACK ORDER
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold-primary to-ruby-luxury group-hover:w-full transition-all duration-300" />
              </Link>

              <Link
                to="/contact"
                className="text-platinum text-xs luxury-serif tracking-widest hover:text-gold-primary transition-all duration-300 relative group"
              >
                CONTACT
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold-primary to-ruby-luxury group-hover:w-full transition-all duration-300" />
              </Link>
            </div>

            {/* Spacer for desktop */}
            <div className="hidden lg:block flex-1" />

            {/* User actions with jewel tone accents */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 lg:gap-5 pl-3 sm:pl-4 lg:pl-5 border-l border-gold-primary/30">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-platinum hover:text-gold-primary transition-all duration-300 hover-gold-glow p-1 sm:p-1.5 rounded-lg hover:bg-gold-primary/10"
                title="Search"
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              <button
                onClick={handleUserClick}
                className="text-platinum hover:text-gold-primary transition-all duration-300 hover-gold-glow relative p-1 sm:p-1.5 rounded-lg hover:bg-gold-primary/10"
                title={state.user ? `Signed in as ${state.user.name}` : 'Sign in'}
              >
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                {state.user && (
                  <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-luxury rounded-full animate-pulse" />
                )}
              </button>

              <button
                onClick={() => setIsWishlistOpen(true)}
                className="text-platinum hover:text-ruby-luxury transition-all duration-300 hover-ruby-glow relative p-1 sm:p-1.5 rounded-lg hover:bg-ruby-luxury/10"
                title="Wishlist"
              >
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                {state.wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-ruby-luxury text-platinum text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold text-[10px]">
                    {state.wishlist.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="text-platinum hover:text-gold-primary transition-all duration-300 hover-gold-glow relative p-1 sm:p-1.5 rounded-lg hover:bg-gold-primary/10"
                title="Shopping Bag"
              >
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                {state.cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gold-primary text-luxury-dark text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold shadow-glow text-[10px]">
                    {state.cart.length}
                  </span>
                )}
              </button>

              {state.user && state.user.email === 'admin@moraa.com' && (
                <Link
                  to="/admin"
                  className="text-gold-primary hover:text-sapphire-luxury font-semibold text-xs transition-all duration-300 hover-sapphire-glow hidden md:block"
                >
                  ADMIN
                </Link>
              )}

              {/* Hamburger menu button - Mobile/Tablet */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden text-platinum hover:text-gold-primary transition-all duration-300 relative p-1 sm:p-1.5 rounded-lg hover:bg-gold-primary/10 ml-1 sm:ml-2"
                title="Menu"
              >
                {isSidebarOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Sidebar Navigation Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-screen w-72 glass-card shadow-premium border-r border-gold-primary/40 z-50 transform transition-transform duration-300 overflow-y-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="p-6">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gold-primary/30">
            <img src="/logo.png" alt="Logo" className="h-16 sm:h-20 w-auto object-contain max-w-[240px]" />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-platinum hover:text-gold-primary transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className="block px-4 py-3 text-platinum text-sm luxury-serif tracking-widest hover:text-gold-primary hover:bg-gold-primary/10 rounded transition-all duration-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Divider */}
          <div className="my-6 border-t border-gold-primary/30" />

          {/* Additional Menu Items */}
          <div className="space-y-2">
            {state.user ? (
              <>
                <div className="px-4 py-3 text-platinum text-xs">
                  <div className="font-semibold mb-1">Signed in as:</div>
                  <div className="text-gold-primary">{state.user.name}</div>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setIsSidebarOpen(false)}
                  className="block px-4 py-3 text-platinum text-sm luxury-serif tracking-widest hover:text-gold-primary hover:bg-emerald-luxury/10 rounded transition-all duration-300 text-left"
                >
                  MY PROFILE
                </Link>
                <button
                  onClick={() => {
                    dispatch({ type: 'LOGOUT' });
                    setIsSidebarOpen(false);
                  }}
                  className="w-full px-4 py-3 text-platinum text-sm luxury-serif tracking-widest hover:text-gold-primary hover:bg-ruby-luxury/10 rounded transition-all duration-300 text-left"
                >
                  SIGN OUT
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  dispatch({ type: 'TOGGLE_SIGNIN', payload: true });
                  setIsSidebarOpen(false);
                }}
                className="w-full px-4 py-3 text-platinum text-sm luxury-serif tracking-widest hover:text-gold-primary hover:bg-emerald-luxury/10 rounded transition-all duration-300 text-left"
              >
                SIGN IN
              </button>
            )}

            <Link
              to="/track-order"
              onClick={() => setIsSidebarOpen(false)}
              className="block px-4 py-3 text-platinum text-sm luxury-serif tracking-widest hover:text-gold-primary hover:bg-sapphire-luxury/10 rounded transition-all duration-300"
            >
              TRACK ORDER
            </Link>

            {state.user && state.user.email === 'admin@moraa.com' && (
              <Link
                to="/admin"
                onClick={() => setIsSidebarOpen(false)}
                className="block px-4 py-3 text-gold-primary text-sm luxury-serif tracking-widest hover:bg-gold-primary/10 rounded transition-all duration-300 font-semibold"
              >
                🛠️ ADMIN PANEL
              </Link>
            )}
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-gold-primary/30" />

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gold-primary/10 rounded p-3 text-center">
              <div className="text-gold-primary text-lg font-semibold">{state.cart.length}</div>
              <div className="text-platinum text-xs">Cart Items</div>
            </div>
            <div className="bg-ruby-luxury/10 rounded p-3 text-center">
              <div className="text-ruby-luxury text-lg font-semibold">{state.wishlist.length}</div>
              <div className="text-platinum text-xs">Wishlist</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Wishlist isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;
