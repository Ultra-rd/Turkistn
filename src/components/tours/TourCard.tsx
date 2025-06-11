
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Trash2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface TourCardProps {
  tour: {
    id: number;
    title: string;
    description: string;
    duration: string;
    group_size: string;
    start_dates: string;
    price: string;
    image: string;
    featured?: boolean;
  };
  isAdmin: boolean;
  onBook: (tourId: number) => void;
  onDelete: (id: number, e: React.MouseEvent) => void;
}

export const TourCard: React.FC<TourCardProps> = ({ 
  tour, 
  isAdmin, 
  onBook, 
  onDelete 
}) => {
  return (
    <Card className="overflow-hidden border border-gray-200 hover:border-turkestan-purple transition-colors relative">
      {isAdmin && (
        <Button 
          variant="destructive" 
          size="sm"
          className="absolute top-2 right-2 z-10 opacity-80 hover:opacity-100"
          onClick={(e) => onDelete(tour.id, e)}
        >
          <span className="sr-only">Delete tour</span>
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
      <div className="relative h-48">
        <img 
          src={tour.image} 
          alt={tour.title}
          className="w-full h-full object-cover"
        />
        {tour.featured && (
          <Badge className="absolute top-2 left-2 bg-turkestan-gold">
            Популярное
          </Badge>
        )}
      </div>
      <CardContent className="pt-6">
        <h3 className="text-xl font-bold mb-2 text-turkestan-dark">{tour.title}</h3>
        <p className="text-gray-600 mb-4">{tour.description}</p>
        <div className="flex flex-col gap-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-turkestan-purple" />
            <span>Продолжительность: {tour.duration}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-turkestan-purple" />
            <span>Размер группы: {tour.group_size}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-turkestan-purple" />
            <span>Даты: {tour.start_dates}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t border-gray-200 pt-4">
        <div>
          <span className="text-sm text-gray-500">От</span>
          <span className="text-xl font-bold text-turkestan-purple ml-1">{tour.price}</span>
        </div>
        <Button 
          className="bg-turkestan-purple hover:bg-turkestan-blue"
          onClick={() => onBook(tour.id)}
        >
          Забронировать
        </Button>
      </CardFooter>
    </Card>
  );
};
