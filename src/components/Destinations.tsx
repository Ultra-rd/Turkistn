import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  ArrowRight, 
  Navigation, 
  Filter,
  Info,
  Locate
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDestinations } from '@/hooks/use-destinations';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface DestinationsProps {
  showAllByDefault?: boolean;
}

const DISTRICTS = [
  'Все районы',
  'Арысь',
  'Байдибек',
  'Жетысай',
  'Казыгурт',
  'Келес',
  'Кентау',
  'Мактаарал',
  'Ордабасы',
  'Отрар',
  'Сайрам',
  'Сарыагаш',
  'Созак',
  'Тулеби',
  'Туркестан',
  'Тюлькубас',
  'Шардара'
];

interface Coordinates {
  lat: number;
  lng: number;
}

const parseCoordinates = (googleMapsUrl: string): Coordinates | null => {
  try {
    const regex = /@([-\d.]+),([-\d.]+)/;
    const match = googleMapsUrl.match(regex);
    
    if (match && match.length >= 3) {
      return {
        lat: parseFloat(match[1]),
        lng: parseFloat(match[2])
      };
    }
    return null;
  } catch (error) {
    console.error("Error parsing coordinates:", error);
    return null;
  }
};

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
};

const Destinations: React.FC<DestinationsProps> = ({ showAllByDefault = false }) => {
  const { destinations, isAdmin } = useDestinations();
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(showAllByDefault);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Все районы');
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [nearestDestination, setNearestDestination] = useState<number | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const { toast } = useToast();
  
  // Filter destinations by district
  const filteredDestinations = destinations.filter(destination => 
    selectedDistrict === 'Все районы' || destination.district === selectedDistrict
  );
  
  // Show only 4 destinations initially, unless showAllByDefault is true
  const visibleDestinations = showAll ? filteredDestinations : filteredDestinations.slice(0, 4);

  const handleVisitLocation = (googleMapsUrl: string) => {
    window.open(googleMapsUrl, '_blank');
  };

  const handleViewDetails = (destinationId: number) => {
    navigate(`/destination/${destinationId}`);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const findNearestDestination = () => {
    setIsLoadingLocation(true);
    setNearestDestination(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userCoords);
          
          // Calculate distances and find the nearest destination
          let nearestId: number | null = null;
          let shortestDistance = Infinity;
          
          destinations.forEach(destination => {
            const destCoords = parseCoordinates(destination.google_maps_url);
            if (destCoords) {
              const distance = calculateDistance(
                userCoords.lat, 
                userCoords.lng, 
                destCoords.lat, 
                destCoords.lng
              );
              
              if (distance < shortestDistance) {
                shortestDistance = distance;
                nearestId = destination.id;
              }
            }
          });
          
          if (nearestId !== null) {
            setNearestDestination(nearestId);
            const nearestDest = destinations.find(d => d.id === nearestId);
            toast({
              title: "Ближайшее место найдено",
              description: `${nearestDest?.name} (${Math.round(shortestDistance)} км от вас)`,
            });
          } else {
            toast({
              title: "Не удалось найти ближайшее место",
              description: "Не удалось определить координаты из Google Maps URL",
              variant: "destructive",
            });
          }
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast({
            title: "Ошибка геолокации",
            description: "Не удалось определить ваше местоположение. Пожалуйста, разрешите доступ к геолокации.",
            variant: "destructive",
          });
          setIsLoadingLocation(false);
        }
      );
    } else {
      toast({
        title: "Геолокация не поддерживается",
        description: "Ваш браузер не поддерживает геолокацию",
        variant: "destructive",
      });
      setIsLoadingLocation(false);
    }
  };

  return (
    <section id="destinations" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-turkestan-blue mb-4">
            Популярные направления
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Изучите самые красивые и исторически значимые места Туркестанской области
          </p>
          {isAdmin && (
            <Button 
              className="bg-turkestan-purple hover:bg-turkestan-blue mt-4"
              onClick={() => navigate('/admin/destinations')}
            >
              Управление направлениями
            </Button>
          )}
        </div>

        <div className="mb-6 flex flex-col sm:flex-row justify-center items-center gap-4">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 max-w-md">
            <Filter className="h-5 w-5 text-turkestan-purple hidden sm:block" />
            <Select 
              value={selectedDistrict} 
              onValueChange={setSelectedDistrict}
            >
              <SelectTrigger className="w-full sm:w-[240px]">
                <SelectValue placeholder="Выберите район" />
              </SelectTrigger>
              <SelectContent>
                {DISTRICTS.map(district => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button
            variant="outline"
            className="border-turkestan-purple text-turkestan-purple hover:bg-turkestan-purple hover:text-white flex items-center gap-2"
            onClick={findNearestDestination}
            disabled={isLoadingLocation}
          >
            <Locate className="h-4 w-4" />
            {isLoadingLocation ? 'Определение местоположения...' : 'Рядом со мной'}
          </Button>
        </div>

        {filteredDestinations.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Направления не найдены для выбранного района</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleDestinations.map((destination) => (
              <div 
                key={destination.id} 
                className={`destination-card h-80 group ${nearestDestination === destination.id ? 'ring-2 ring-turkestan-gold' : ''}`}
              >
                <Card className="border-none h-full overflow-hidden">
                  <CardContent className="p-0 h-full relative">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6 flex flex-col justify-end">
                      <div className="flex items-center text-white mb-2">
                        <MapPin className="w-5 h-5 mr-2 text-turkestan-gold" />
                        <p className="font-medium">{destination.name}</p>
                      </div>
                      {destination.district && (
                        <div className="bg-turkestan-gold/80 text-white text-xs px-2 py-1 rounded-full w-fit mb-2">
                          {destination.district}
                        </div>
                      )}
                      {nearestDestination === destination.id && (
                        <div className="bg-turkestan-purple text-white text-xs px-2 py-1 rounded-full w-fit mb-2">
                          Ближайшее к вам
                        </div>
                      )}
                      <p className="text-white/80 text-sm">{destination.description}</p>
                      
                      <div className="flex gap-2 mt-4">
                        <Button 
                          variant="secondary"
                          className="bg-turkestan-gold/90 hover:bg-turkestan-gold text-white border-none flex items-center gap-2"
                          onClick={() => handleVisitLocation(destination.google_maps_url)}
                        >
                          <Navigation className="h-4 w-4" /> Посетить
                        </Button>
                        <Button 
                          variant="outline"
                          className="bg-white/90 hover:bg-white text-turkestan-blue border-none flex items-center gap-2"
                          onClick={() => handleViewDetails(destination.id)}
                        >
                          <Info className="h-4 w-4" /> Подробнее
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}

        {!showAll && filteredDestinations.length > 4 && (
          <div className="text-center mt-10">
            <Button 
              variant="outline" 
              className="border-turkestan-purple text-turkestan-purple hover:bg-turkestan-purple hover:text-white"
              onClick={toggleShowAll}
            >
              {showAll ? 'Показать меньше' : 'Показать все направления'} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Destinations;
