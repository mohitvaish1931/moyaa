import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import SignInModal from './components/SignInModal';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import AllProducts from './pages/AllProducts';
import Earrings from './pages/Earrings';
import Bracelets from './pages/Bracelets';
import Necklaces from './pages/Necklaces';
import HandChains from './pages/HandChains';
import Sets from './pages/Sets';
import TrackOrder from './pages/TrackOrder';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import Admin from './pages/Admin';
import EditProduct from './pages/EditProduct';
import Profile from './pages/Profile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import JewelleryCareGuide from './pages/JewelleryCareGuide';
import AboutUs from './pages/AboutUs';
import TermsConditions from './pages/TermsConditions';
import FAQ from './pages/FAQ';
import Accessibility from './pages/Accessibility';


const AppContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-dark via-luxury-secondary to-luxury-tertiary overflow-x-hidden">
      <Header />
      <main className={`${isHomePage ? 'pt-0' : 'pt-20 lg:pt-28'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/earrings" element={<Earrings />} />
          <Route path="/bracelets" element={<Bracelets />} />
          <Route path="/necklaces" element={<Necklaces />} />
          <Route path="/hand-chains" element={<HandChains />} />
          <Route path="/sets" element={<Sets />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/edit-product/:id" element={<EditProduct />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/jewellery-care-guide" element={<JewelleryCareGuide />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/accessibility" element={<Accessibility />} />
        </Routes>
      </main>

      <Footer />
      <SignInModal />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <AppContent />
      </Router>
    </AppProvider>
  );
};

export default App;
