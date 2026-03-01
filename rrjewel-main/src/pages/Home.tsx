import React from 'react';
import Hero from '../components/Hero';
import ShopByCategory from '../components/ShopByCategory';
import NewArrivals from '../components/NewArrivals';
import ShowcaseVideos from '../components/ShowcaseVideos';
import Reviews from '../components/Reviews';

const Home = () => {
  return (
    <>
      <Hero />
      <ShopByCategory />
      <NewArrivals />
      <ShowcaseVideos />
      <Reviews />
    </>
  );
};

export default Home;