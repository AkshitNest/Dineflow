
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Check, Star, Clock, Users } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Optimize Your Restaurant Flow
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-200">
                Real-time occupancy insights for faster dining.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button size="lg" className="btn-accent">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/features">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative animate-slide-up">
              <div className="glass-card overflow-hidden p-6 relative">
                <img 
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop"
                  alt="Restaurant interior" 
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="mt-4 p-4 bg-white/10 backdrop-blur-md rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold">Bistro Nouveau</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span>4.8</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>34 / 50 seats occupied</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>~15 min wait time</span>
                    </div>
                  </div>
                  <div className="w-full bg-white/20 h-2 rounded-full mt-3">
                    <div className="bg-dineflow-orange h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 glass-card py-2 px-4 shadow-lg">
                <span className="text-lg font-semibold">Real-time updates</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Dineflow?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform connects diners with restaurants to provide real-time occupancy information for a better dining experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-dineflow-purple/10 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-dineflow-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Occupancy</h3>
              <p className="text-gray-600">
                Get live updates on restaurant capacity and availability to plan your dining experience.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-dineflow-purple/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-dineflow-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Wait Time Estimates</h3>
              <p className="text-gray-600">
                Know exactly how long you'll wait before you arrive at the restaurant.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-dineflow-purple/10 rounded-full flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-dineflow-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Recommendations</h3>
              <p className="text-gray-600">
                Discover new restaurants based on your preferences and current availability.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Dineflow Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our simple process helps you find and enjoy restaurants without the wait.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm h-full">
                <div className="flex items-center justify-center w-12 h-12 bg-dineflow-orange text-white rounded-full font-semibold text-xl mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Search Restaurants</h3>
                <p className="text-gray-600">
                  Browse through our extensive collection of restaurants and filter by cuisine, location, or current availability.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                <ArrowRight className="h-8 w-8 text-gray-300" />
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm h-full">
                <div className="flex items-center justify-center w-12 h-12 bg-dineflow-orange text-white rounded-full font-semibold text-xl mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Check Occupancy</h3>
                <p className="text-gray-600">
                  View real-time seat availability and estimated wait times before deciding where to eat.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                <ArrowRight className="h-8 w-8 text-gray-300" />
              </div>
            </div>
            
            {/* Step 3 */}
            <div>
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm h-full">
                <div className="flex items-center justify-center w-12 h-12 bg-dineflow-orange text-white rounded-full font-semibold text-xl mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Book or Walk In</h3>
                <p className="text-gray-600">
                  Make a reservation directly through our app or simply walk in at the right time to avoid waiting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that's right for you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
              <h3 className="font-semibold text-xl mb-4">Basic</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Search restaurants</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>View real-time occupancy</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Basic restaurant details</span>
                </li>
              </ul>
              <Link to="/signup">
                <Button variant="outline" className="w-full">Sign Up Free</Button>
              </Link>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-dineflow-purple text-white p-8 rounded-xl shadow-md hover:shadow-lg transform scale-105 transition-all">
              <div className="absolute -top-4 right-12 bg-dineflow-orange text-white text-sm px-3 py-1 rounded-full font-medium">
                Popular
              </div>
              <h3 className="font-semibold text-xl mb-4">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-gray-200 ml-2">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-300 mr-2" />
                  <span>All Basic features</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-300 mr-2" />
                  <span>Reservation priority</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-300 mr-2" />
                  <span>Occupancy trend history</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-300 mr-2" />
                  <span>Personalized recommendations</span>
                </li>
              </ul>
              <Link to="/signup">
                <Button className="w-full bg-white text-dineflow-purple hover:bg-gray-100">Get Started</Button>
              </Link>
            </div>
            
            {/* Business Plan */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
              <h3 className="font-semibold text-xl mb-4">Business</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$29.99</span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>All Pro features</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Restaurant analytics</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Customer insights</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>API access</span>
                </li>
              </ul>
              <Link to="/signup">
                <Button variant="outline" className="w-full">Contact Sales</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-dineflow-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to optimize your dining experience?</h2>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Join thousands of users who are already enjoying a wait-free dining experience with Dineflow.
          </p>
          <Link to="/signup">
            <Button size="lg" className="btn-accent">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default HomePage;
