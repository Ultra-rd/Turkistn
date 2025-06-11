
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Phone, Mail, Globe, MapPin, Calendar, Clock, Users, DollarSign } from 'lucide-react';
import TourAgentManagement from '@/components/TourAgentManagement';
import { TourAgent } from '@/hooks/use-tour-agents';

interface TourAgentPhoto {
  id: string;
  photo_url: string;
  caption: string | null;
  created_at: string;
}

interface TourAgentPost {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface Tour {
  id: number;
  title: string;
  description: string;
  duration: string;
  group_size: string;
  start_dates: string;
  price: string;
  image: string;
  featured: boolean | null;
}

const TourAgentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agent, setAgent] = useState<TourAgent | null>(null);
  const [photos, setPhotos] = useState<TourAgentPhoto[]>([]);
  const [posts, setPosts] = useState<TourAgentPost[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchAgentDetails();
    }
  }, [id]);

  const fetchAgentDetails = async () => {
    if (!id) return;

    try {
      // Получаем данные турагента
      const { data: agentData, error: agentError } = await supabase
        .from('tour_agents')
        .select('*')
        .eq('id', parseInt(id))
        .single();

      if (agentError) throw agentError;
      setAgent(agentData);

      // Получаем фотографии
      const { data: photosData, error: photosError } = await supabase
        .from('tour_agent_photos')
        .select('*')
        .eq('tour_agent_id', parseInt(id))
        .order('created_at', { ascending: false });

      if (photosError) throw photosError;
      setPhotos(photosData || []);

      // Получаем посты
      const { data: postsData, error: postsError } = await supabase
        .from('tour_agent_posts')
        .select('*')
        .eq('tour_agent_id', parseInt(id))
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;
      setPosts(postsData || []);

      // Получаем туры
      const { data: toursData, error: toursError } = await supabase
        .from('tours')
        .select('*')
        .eq('tour_agent_id', parseInt(id))
        .order('featured', { ascending: false });

      if (toursError) throw toursError;
      setTours(toursData || []);

    } catch (error) {
      console.error('Error fetching agent details:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить данные турагента",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Турагент не найден</h1>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Вернуться на главную
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Назад
            </Button>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-6">
            <img
              src={agent.logo}
              alt={agent.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-turkestan-blue mb-2">{agent.name}</h1>
              {agent.description && (
                <p className="text-gray-600 mb-4">{agent.description}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {agent.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{agent.phone}</span>
                  </div>
                )}
                {agent.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{agent.email}</span>
                  </div>
                )}
                {agent.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <a 
                      href={agent.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-turkestan-purple hover:underline"
                    >
                      Веб-сайт
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Фотографии и Посты */}
          <div className="lg:col-span-2 space-y-8">
            {/* Фотографии */}
            <section>
              <h2 className="text-2xl font-bold text-turkestan-blue mb-6">Фотографии</h2>
              {photos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {photos.map((photo) => (
                    <Card key={photo.id} className="overflow-hidden">
                      <img
                        src={photo.photo_url}
                        alt={photo.caption || 'Фото'}
                        className="w-full h-48 object-cover"
                      />
                      {photo.caption && (
                        <CardContent className="p-3">
                          <p className="text-sm text-gray-600">{photo.caption}</p>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white rounded-lg">
                  <p className="text-gray-500">Фотографии не добавлены</p>
                </div>
              )}
            </section>

            {/* Посты */}
            <section>
              <h2 className="text-2xl font-bold text-turkestan-blue mb-6">Посты</h2>
              {posts.length > 0 ? (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <Card key={post.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{post.title}</CardTitle>
                        <p className="text-sm text-gray-500">
                          {formatDate(post.created_at)}
                        </p>
                      </CardHeader>
                      <CardContent>
                        {post.image_url && (
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-64 object-cover rounded-lg mb-4"
                          />
                        )}
                        <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white rounded-lg">
                  <p className="text-gray-500">Посты не добавлены</p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar - Туры */}
          <div className="lg:col-span-1">
            <section className="sticky top-8">
              <h2 className="text-2xl font-bold text-turkestan-blue mb-6">Наши туры</h2>
              {tours.length > 0 ? (
                <div className="space-y-4">
                  {tours.map((tour) => (
                    <Card key={tour.id} className="hover:shadow-lg transition-shadow">
                      <div className="relative h-32">
                        <img 
                          src={tour.image} 
                          alt={tour.title}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                        {tour.featured && (
                          <span className="absolute top-2 left-2 bg-turkestan-gold text-white text-xs px-2 py-1 rounded">
                            Популярное
                          </span>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-sm mb-2 text-turkestan-dark">{tour.title}</h3>
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{tour.description}</p>
                        <div className="space-y-1 text-xs text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-turkestan-purple" />
                            <span>{tour.duration}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1 text-turkestan-purple" />
                            <span>{tour.group_size}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-turkestan-purple" />
                            <span>{tour.start_dates}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-turkestan-purple">{tour.price}</span>
                          <Button 
                            size="sm"
                            className="bg-turkestan-purple hover:bg-turkestan-blue text-xs"
                          >
                            Подробнее
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white rounded-lg">
                  <p className="text-gray-500">Туры не добавлены</p>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Компонент управления для турагентов */}
        <TourAgentManagement tourAgentId={agent?.id || 0} />
      </div>
    </div>
  );
};

export default TourAgentDetails;
