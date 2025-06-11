
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TourCard } from './TourCard';
import { useTours } from '@/hooks/use-tours';
import BookingDialog from '../BookingDialog';

interface ToursProps {
  showAllByDefault?: boolean;
}

const Tours: React.FC<ToursProps> = ({ showAllByDefault = false }) => {
  const [selectedTourId, setSelectedTourId] = useState<number | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const navigate = useNavigate();
  const { 
    visibleTours, 
    showAllTours, 
    isAdmin, 
    handleDeleteTour, 
    handleShowAllTours,
    tours 
  } = useTours(showAllByDefault);

  const handleBooking = (tourId: number) => {
    setSelectedTourId(tourId);
    setIsBookingOpen(true);
  };

  return (
    <section id="tours" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-turkestan-blue mb-4">
            Популярные туры
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Исследуйте Туркестанскую область с нашими тщательно подобранными маршрутами
          </p>
          {isAdmin && (
            <Button 
              className="bg-turkestan-purple hover:bg-turkestan-blue mt-4 flex items-center gap-2 mx-auto"
              onClick={() => navigate('/admin/tours')}
            >
              <Plus className="h-4 w-4" />
              Управление турами
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleTours.map((tour) => (
            <TourCard
              key={tour.id}
              tour={tour}
              isAdmin={isAdmin}
              onBook={handleBooking}
              onDelete={handleDeleteTour}
            />
          ))}
        </div>

        {!showAllTours && tours.length > visibleTours.length && (
          <div className="text-center mt-10">
            <Button
              variant="outline"
              className="border-turkestan-purple text-turkestan-purple hover:bg-turkestan-purple hover:text-white"
              onClick={handleShowAllTours}
            >
              Все туры <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {selectedTourId && (
        <BookingDialog
          isOpen={isBookingOpen}
          onClose={() => {
            setIsBookingOpen(false);
            setSelectedTourId(null);
          }}
          tourId={selectedTourId}
        />
      )}
    </section>
  );
};

export default Tours;
