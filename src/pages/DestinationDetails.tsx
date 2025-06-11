
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Navigation, Pencil } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import AudioPlayer from '@/components/AudioPlayer';

interface Destination {
  id: number;
  name: string;
  description: string;
  image: string;
  google_maps_url: string;
  district?: string;
  detailed_info?: string;
  audio_file?: string;
}

const DestinationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDestination = async () => {
      if (!id) return;
      
      setIsLoading(true);
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('id', parseInt(id)) // Convert string id to number
        .single();

      if (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить информацию о направлении",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setDestination(data);
      setIsLoading(false);
    };

    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        setIsAdmin(data?.role === 'admin');
      }
    };

    fetchDestination();
    checkAdminStatus();
  }, [id, navigate, toast]);

  const handleVisitLocation = () => {
    if (destination?.google_maps_url) {
      window.open(destination.google_maps_url, '_blank');
    }
  };

  const handleEditDetailedInfo = () => {
    navigate(`/admin/destinations/edit/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Загрузка...</p>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-lg mb-4">Направление не найдено</p>
        <Button onClick={() => navigate('/')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Вернуться на главную
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')} 
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Назад
          </Button>

          {destination.audio_file && (
            <AudioPlayer audioUrl={destination.audio_file} autoPlay={false} />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-lg overflow-hidden h-[400px]">
              <img 
                src={destination?.image} 
                alt={destination?.name} 
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <div className="flex items-center mb-2">
                <MapPin className="w-5 h-5 mr-2 text-turkestan-gold" />
                <h1 className="text-3xl font-bold">{destination?.name}</h1>
              </div>
              
              {destination?.district && (
                <div className="bg-turkestan-gold/80 text-white text-sm px-3 py-1 rounded-full w-fit mb-4">
                  {destination.district}
                </div>
              )}

              <p className="text-gray-700 mb-6">{destination?.description}</p>

              <Button 
                className="bg-turkestan-gold hover:bg-turkestan-gold/90 text-white flex items-center gap-2"
                onClick={handleVisitLocation}
              >
                <Navigation className="h-4 w-4" /> Посетить на картах
              </Button>
              
              {isAdmin && (
                <Button 
                  variant="outline"
                  className="mt-4 border-turkestan-purple text-turkestan-purple hover:bg-turkestan-purple hover:text-white"
                  onClick={handleEditDetailedInfo}
                >
                  <Pencil className="h-4 w-4 mr-2" /> Редактировать информацию
                </Button>
              )}
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Подробная информация</h2>
            {destination?.detailed_info ? (
              <div className="prose max-w-none">
                {destination.detailed_info}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                {isAdmin 
                  ? "Подробная информация отсутствует. Вы можете добавить её, нажав на кнопку 'Редактировать информацию'."
                  : "Подробная информация отсутствует."
                }
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DestinationDetails;
