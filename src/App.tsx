import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import TrackOrder from './pages/TrackOrder';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import Admin from './pages/Admin';

function App() {
  return (
    <AppProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <div className="min-h-screen bg-gradient-to-b from-luxury-dark via-luxury-secondary to-luxury-tertiary">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<AllProducts />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/earrings" element={<Earrings />} />
            <Route path="/bracelets" element={<Bracelets />} />
            <Route path="/necklaces" element={<Necklaces />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <Footer />
          <SignInModal />
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;