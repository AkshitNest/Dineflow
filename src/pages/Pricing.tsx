
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Pricing Plans
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
              Choose the plan that's right for your needs
            </p>
          </div>
          
          <div className="text-center py-12">
            <p className="text-lg">Detailed pricing information coming soon</p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Pricing;
