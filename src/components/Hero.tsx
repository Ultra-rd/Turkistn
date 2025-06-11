
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1466442929976-97f336a657be"
          alt="Туркестан"
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-turkestan-blue/60 via-turkestan-blue/40 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
          Откройте для себя <br />
          <span className="text-turkestan-gold">Туркестан</span>
        </h1>
        <p className="text-xl md:text-2xl text-white max-w-2xl mb-8">
          Исследуйте исторические достопримечательности, удивительную природу и богатую культуру Туркестанской области
        </p>
        <Button size="lg" className="bg-turkestan-gold hover:bg-turkestan-gold/90 text-white text-lg px-8 py-6">
          Исследовать туры <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Hero;
