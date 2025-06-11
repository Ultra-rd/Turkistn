
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit, Trash, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Attraction } from '@/hooks/use-attractions';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface AttractionDialogProps {
  attraction: Attraction | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin: boolean;
  onEdit?: (attraction: Attraction) => void;
  onDelete?: (id: string) => void;
  relatedAttractions?: Attraction[];
}

const AttractionDialog: React.FC<AttractionDialogProps> = ({
  attraction,
  isOpen,
  onOpenChange,
  isAdmin,
  onEdit,
  onDelete,
  relatedAttractions = [],
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const allImages = attraction ? 
    [attraction.image, ...(relatedAttractions.map(a => a.image))] : 
    [];

  if (!attraction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{attraction.title}</DialogTitle>
          {isAdmin && (
            <div className="flex gap-2 absolute right-10 top-6">
              <Button variant="outline" size="sm" onClick={() => onEdit && onEdit(attraction)}>
                <Edit className="h-4 w-4 mr-1" />
                Редактировать
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete && onDelete(attraction.id)}>
                <Trash className="h-4 w-4 mr-1" />
                Удалить
              </Button>
            </div>
          )}
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {allImages.length > 1 ? (
            <Carousel>
              <CarouselContent>
                {allImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[300px] md:h-[400px] overflow-hidden rounded-lg">
                      <img 
                        src={image} 
                        alt={index === 0 ? attraction.title : `Дополнительное изображение ${index}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          ) : (
            <div className="relative h-[300px] md:h-[400px] overflow-hidden rounded-lg">
              <img 
                src={attraction.image} 
                alt={attraction.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <DialogDescription className="text-lg leading-relaxed">
            {attraction.description}
          </DialogDescription>
          
          {relatedAttractions.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Связанные достопримечательности</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {relatedAttractions.map((related) => (
                  <div key={related.id} className="rounded-lg overflow-hidden">
                    <img 
                      src={related.image} 
                      alt={related.title} 
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-2 text-sm font-medium">{related.title}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttractionDialog;
