import React from 'react';
import Hero from '../components/Hero';
import DynamicBanners from '../components/DynamicBanners';
import ShopByCategory from '../components/ShopByCategory';
import NewArrivals from '../components/NewArrivals';
import PromoPopup from '../components/PromoPopup';
import ShowcaseVideos from '../components/ShowcaseVideos';
import Reviews from '../components/Reviews';
import BogoBanner from '../components/BogoBanner';
import ImageMarquee from '../components/ImageMarquee';
import { useSEO } from '../utils/useSEO';

const Home = () => {
  useSEO({
    title: 'MORAA JEWELS - Premium Luxury Jewelry Collection | Shop Now',
    description: 'Discover MORAA JEWELS\' exquisite luxury jewelry collection. Premium earrings, necklaces, bracelets & more. Timeless elegance with finest craftsmanship. Shop 100% authentic jewelry today.',
    keywords: 'luxury jewelry, premium jewelry collection, earrings, necklaces, bracelets, luxury accessories, designer jewelry, fine jewelry, authentic jewelry',
    image: 'https://moraajewles.com/logo.png',
    url: 'https://moraajewles.com/',
    type: 'website'
  });

  return (
    <>
      <Hero />
      <DynamicBanners />
      <ShopByCategory />
      <NewArrivals />
      <BogoBanner />
      <ImageMarquee />
      <PromoPopup />
      <ShowcaseVideos />
      <Reviews />
    </>
  );
};

export default Home;
