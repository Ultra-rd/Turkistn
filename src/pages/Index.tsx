
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Destinations from '@/components/Destinations';
import Attractions from '@/components/Attractions';
import Tours from '@/components/tours/Tours';
import TourAgents from '@/components/TourAgents';
import Events from '@/components/Events';
import PlanTrip from '@/components/PlanTrip';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  // Scroll to the top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Back to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Destinations />
      <Attractions />
      <Tours />
      <TourAgents />
      <Events />
      <PlanTrip />
      <About />
      <Contact />
      <Footer />
      
      {/* Back to top button */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-turkestan-purple hover:bg-turkestan-blue text-white p-3 rounded-full shadow-lg transition-colors z-50"
        aria-label="Наверх"
      >
        <ArrowRight className="h-6 w-6 rotate-[-90deg]" />
      </button>
    </div>
  );
};

export default Index;
