import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import Carousel from "../components/Carousel";
import TopRestaurants from "../components/TopRestaurants";
import TopMenuItems from "../components/TopMenuItems";

const features = [
  {
    title: "Browse Restaurants",
    description: "Find top-rated restaurants in your area and browse their menus.",
    image: "/Dukamo coffee, Addis Ababa, Ethiopia_.jpeg",
  },
  {
    title: "Place Your Order",
    description: "Customize your meals, pay online or on delivery. Easy and quick!",
    image: "/The Migrant Kitchen Ep_ 1_ Chirmol - Life & Thyme.jpeg",
  },
  {
    title: "Fast Delivery",
    description: "Get your favorite dishes delivered hot and fresh in no time.",
    image: "/Food delivery drivers are driving to deliver products for customers who order online_ The impact of the epidemic has increased online purchases.jpeg",
  },
];

const FeatureCard = ({ title, description, image }: { title: string; description: string; image: string }) => (
  <Card className="overflow-hidden transition-shadow hover:shadow-lg pt-0">
    <img
      src={image}
      alt={title}
      className="w-full h-48 object-cover "
    />
    <CardContent className="p-6 text-left ">
      <CardTitle className="mb-2">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardContent>
  </Card>
);

const Home: React.FC = () => {
  return (
    <>
      <Carousel />

      <section id="restaurants" className="py-20 bg-gray-200">
        <div className="max-w-6xl mx-auto px-6 ">
          <h2 className="text-4xl font-bold mb-10">Top Rated Restaurants</h2>
          <TopRestaurants />
        </div>
      </section>

      <section id="dishes" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 ">
          <h2 className="text-4xl font-bold mb-10">Popular Dishes</h2>
          <TopMenuItems />
        </div>
      </section>

      <section className="py-20 bg-gray-200">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">How EnatBet Works</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            Explore our seamless food delivery process — from browsing to enjoying your favorite meals.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>


      <section id="join" className="py-24 bg-gradient-to-br from-red-500 to-red-600 text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">Partner With EnatBet</h2>
          <p className="text-lg mb-8">
            Join our growing network of restaurants and delivery heroes. Reach thousands of hungry customers daily!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup">
              <Button variant="secondary" className="text-red-500 font-semibold px-8 py-3">
                Signup
              </Button>
            </Link>
            <Link to="/signin">
              <Button variant="secondary" className="text-red-500 font-semibold px-8 py-3">
                Signin
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
