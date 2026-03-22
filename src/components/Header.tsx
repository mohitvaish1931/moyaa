import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Cart from './Cart';
import Wishlist from './Wishlist';
import SearchModal from './SearchModal';

const Header = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollectionsDropdownOpen, setIsCollectionsDropdownOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUserClick = () => {
    if (state.user) navigate('/profile');
    else dispatch({ type: 'TOGGLE_SIGNIN', payload: true });
  };

  const navItems = [
    { label: 'HOME', path: '/' },
    { label: 'COLLECTIONS', path: '/products' },
    { label: 'TRACK ORDER', path: '/track-order' },
    { label: 'CONTACT', path: '/contact' },
    ...(state.user?.role === 'admin' ? [{ label: 'ADMIN', path: '/admin' }] : []),
  ];

  return (
    <>
      {/* Announcement Banner removed to eliminate top gap */}
      <div className="hidden">
        <span>ESTABLISHED 2026 • FINE JEWELRY • WORLDWIDE SHIPPING</span>
      </div>

      {/* Main Header Nav */}
      <header className={`fixed top-0 left-0 z-50 transition-all duration-500 w-full`}>
        <nav className={`${(isHomePage && scrollY < 50) ? 'bg-transparent border-transparent' : 'bg-text-primary/95 shadow-2xl border-white/5'} backdrop-blur-md transition-all duration-500 px-6 py-2 sm:py-3`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo Left-aligned group */}
            <div className="flex items-center gap-12 lg:gap-20">
              <Link to="/" className="flex items-center transition-transform hover:scale-105 flex-shrink-0">
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="h-10 sm:h-14 lg:h-20 w-auto object-contain brightness-110" 
                />
              </Link>

              <div className="hidden lg:flex items-center gap-10">
                <Link to="/" className="text-white text-[11px] font-bold tracking-[0.2em] hover:text-gold-primary transition-colors duration-300">HOME</Link>
                
                {/* Collections Dropdown */}
                <div 
                  className="relative group py-4"
                  onMouseEnter={() => setIsCollectionsDropdownOpen(true)}
                  onMouseLeave={() => setIsCollectionsDropdownOpen(false)}
                >
                  <button className="flex items-center gap-2 text-white text-[11px] font-bold tracking-[0.2em] hover:text-gold-primary transition-colors duration-300 uppercase">
                    COLLECTIONS
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isCollectionsDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className={`absolute top-full left-0 w-64 bg-text-primary/95 backdrop-blur-3xl border border-white/10 rounded-xl py-6 shadow-3xl transition-all duration-300 ${
                    isCollectionsDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
                  }`}>
                    <div className="grid grid-cols-1 gap-1 px-4">
                      {[
                        { label: 'ALL PRODUCTS', path: '/products' },
                        { label: 'EARRINGS', path: '/earrings' },
                        { label: 'BRACELETS', path: '/bracelets' },
                        { label: 'NECKLACES', path: '/necklaces' },
                        { label: 'HAND CHAINS', path: '/hand-chains' },
                        { label: 'JEWELRY SETS', path: '/sets' }
                      ].map((item) => (
                        <Link
                          key={item.label}
                          to={item.path}
                          className="px-4 py-3 text-[10px] text-white/80 hover:text-gold-primary hover:bg-white/5 rounded-lg transition-all tracking-[0.2em] font-medium"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {navItems.filter(item => !['HOME', 'COLLECTIONS'].includes(item.label)).map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className="text-white text-[11px] font-bold tracking-[0.2em] hover:text-gold-primary transition-colors duration-300 relative group"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-primary group-hover:w-full transition-all duration-300" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Actions Divider & Actions Area */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <div className="h-4 w-px bg-white/20 hidden sm:block mr-2" />
              
              <div className="flex items-center gap-1 sm:gap-2 text-white">
                <button onClick={() => setIsSearchOpen(true)} className="p-1.5 text-white hover:text-gold-primary transition-colors">
                  <Search className="w-4 h-4 sm:w-5 h-5" />
                </button>
                
                <button onClick={handleUserClick} className="p-1.5 text-white hover:text-gold-primary transition-colors relative text-center">
                  <User className="w-4 h-4 sm:w-5 h-5" />
                  {state.user && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-gold-primary rounded-full" />}
                </button>
                
                <button onClick={() => setIsWishlistOpen(true)} className="p-1.5 text-white hover:text-primary-red transition-colors relative">
                  <Heart className="w-4 h-4 sm:w-5 h-5" />
                  {state.wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-red text-white text-[8px] rounded-full h-3.5 w-3.5 flex items-center justify-center font-bold">
                      {state.wishlist.length}
                    </span>
                  )}
                </button>

                <button onClick={() => setIsCartOpen(true)} className="p-1.5 text-white hover:text-gold-primary transition-colors relative">
                  <ShoppingBag className="w-4 h-4 sm:w-5 h-5" />
                  {state.cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gold-primary text-text-primary text-[8px] rounded-full h-3.5 w-3.5 flex items-center justify-center font-bold">
                      {state.cart.length}
                    </span>
                  )}
                </button>

                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-1.5 text-white hover:text-gold-primary transition-colors">
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Sidebar Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] bg-text-primary/60 backdrop-blur-md animate-fade-in lg:hidden">
          <div className="absolute top-0 left-0 h-full w-80 bg-luxury-dark shadow-2xl border-r border-gold-primary/20 p-8 flex flex-col">
            <div className="flex items-center justify-between mb-12">
              <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-text-primary hover:text-primary-red transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`block text-text-primary text-sm font-bold tracking-[0.2em] luxury-serif hover:text-primary-red transition-colors ${item.label === 'COLLECTIONS' ? 'text-primary-red' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pl-4 pt-2 space-y-4 border-l border-gold-primary/20">
                 {[
                   { n: 'ALL PRODUCTS', p: '/products' },
                   { n: 'EARRINGS', p: '/earrings' },
                   { n: 'BRACELETS', p: '/bracelets' },
                   { n: 'NECKLACES', p: '/necklaces' },
                   { n: 'HAND CHAINS', p: '/hand-chains' },
                   { n: 'JEWELRY SETS', p: '/sets' }
                 ].map(cat => (
                   <Link 
                    key={cat.n} 
                    to={cat.p}
                    onClick={() => setIsSidebarOpen(false)}
                    className="block text-[11px] text-text-muted hover:text-gold-primary tracking-widest font-bold"
                   >
                     {cat.n}
                   </Link>
                 ))}
              </div>
            </nav>
            <div className="mt-auto space-y-6 pt-8 border-t border-gold-primary/20">
              <button onClick={handleUserClick} className="flex items-center gap-4 text-text-primary text-sm font-bold tracking-widest">
                <User className="w-5 h-5" /> {state.user ? 'MY ACCOUNT' : 'SIGN IN'}
              </button>
              <Link to="/track-order" className="flex items-center gap-4 text-text-primary text-sm font-bold tracking-widest">
                <ShoppingBag className="w-5 h-5" /> TRACK ORDER
              </Link>
            </div>
          </div>
        </div>
      )}

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Wishlist isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;
