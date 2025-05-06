import React from 'react';
import FeatureCard from '../components/FeatureCard';
import Carousel from '../components/Carousel';
import { Link } from 'react-router-dom';
import TopRestaurants from '../components/TopRestaurants';
import TopMenuItems from '../components/TopMenuItems';

const Home: React.FC = () => {
  return (
    <>
      <Carousel />

      <section className="py-16 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-8">How EnatBet Works</h2>
        <div className="grid md:grid-cols-3 gap-6 px-4  mx-auto">
          <FeatureCard
            image="/Dukamo coffee, Addis Ababa, Ethiopia_.jpeg"
            title="Browse Restaurants"
            description="Find top-rated restaurants in your area and browse their menus."
          />
          <FeatureCard
            image="/The Migrant Kitchen Ep_ 1_ Chirmol - Life & Thyme.jpeg"
            title="Place Your Order"
            description="Customize your meals, pay online or on delivery. Easy and quick!"
          />
          <FeatureCard
            image="/Food delivery drivers are driving to deliver products for customers who order online_ The impact of the epidemic has increased online purchases.jpeg"
            title="Fast Delivery"
            description="Get your favorite dishes delivered hot and fresh in no time."
          />
        </div>
      </section>

      <section id="restaurants" className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Top Rated Restaurants</h2>
        <TopRestaurants />
      </section>

      <section id="dishes" className="py-16 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10">Popular Dishes</h2>
        <TopMenuItems />
      </section>

      <section id="join" className="py-20 px-6 text-white bg-red-500 text-center">
        <h2 className="text-3xl font-bold mb-6">Partner With EnatBet</h2>
        <p className="max-w-xl mx-auto mb-8">
          Join our growing network of restaurants and delivery heroes. Reach thousands of hungry customers daily!
        </p>
        <div className="space-x-4">
          <Link to="/signup" className="bg-white text-red-500 px-6 py-3 font-semibold rounded-full shadow-md hover:bg-gray-100">
            Signup
          </Link>
          <Link to="/signin" className="bg-white text-red-500 px-6 py-3 font-semibold rounded-full shadow-md hover:bg-gray-100">
            Signin
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
