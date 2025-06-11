import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Trash2, 
  Navigation, 
  Pencil,
  MapPin,
  Upload
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useDestinations, Destination } from '@/hooks/use-destinations';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdminDestinationsProps {
  inDashboard?: boolean;
}

const DISTRICTS = [
  'Туркестан',
  'Тюлькубас',
  'Байдибек',
  'Арыс',
  'Кентау',
  'Сайрам',
  'Шардара'
];

const AdminDestinations: React.FC<AdminDestinationsProps> = ({ inDashboard = false }) => {
  const [formData, setFormData] = useState<{ [key: string]: Partial<Destination> }>({});
  const [newDestination, setNewDestination] = useState<Omit<Destination, 'id'>>({
    name: '',
    description: '',
    image: '',
    google_maps_url: '',
    district: 'Туркестан',
    audio_file: ''
  });
  const [showNewForm, setShowNewForm] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { 
    destinations, 
    isAdmin, 
    isLoading, 
    handleDeleteDestination, 
    handleUpdateDestination, 
    handleCreateDestination 
  } = useDestinations();

  useEffect(() => {
    if (!inDashboard) {
      checkAdmin();
    }
    // Initialize form data from destinations
    const initialFormData: { [key: string]: Partial<Destination> } = {};
    destinations.forEach(dest => {
      initialFormData[dest.id] = { ...dest };
    });
    setFormData(initialFormData);
  }, [destinations, inDashboard]);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (data?.role !== 'admin') {
        navigate('/');
        toast({
          title: "Доступ запрещен",
          description: "У вас нет прав администратора",
          variant: "destructive",
        });
      }
    } else {
      navigate('/auth');
    }
  };

  const handleInputChange = (id: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleNewDestinationChange = (field: string, value: string) => {
    setNewDestination(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreate = async () => {
    // Validate required fields
    if (!newDestination.name || !newDestination.description || 
        !newDestination.image || !newDestination.google_maps_url || !newDestination.district) {
      toast({
        title: "Ошибка",
        description: "Все поля обязательны для заполнения",
        variant: "destructive",
      });
      return;
    }

    const success = await handleCreateDestination(newDestination);
    if (success) {
      setNewDestination({
        name: '',
        description: '',
        image: '',
        google_maps_url: '',
        district: 'Туркестан',
        audio_file: ''
      });
      setShowNewForm(false);
    }
  };

  const handleUpdate = async (id: number) => {
    await handleUpdateDestination(id, formData[id]);
  };

  const handleTestGoogleMaps = (url: string) => {
    window.open(url, '_blank');
  };

  const handleTestAudio = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  if (isLoading) {
    return <div className={`${inDashboard ? '' : 'container mx-auto py-8'} text-center`}>Загрузка...</div>;
  }

  return (
    <div className={`${inDashboard ? '' : 'container mx-auto py-8'}`}>
      {!inDashboard && (
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Управление направлениями</h1>
          <div className="flex gap-4">
            <Button 
              onClick={() => setShowNewForm(!showNewForm)}
              className="bg-turkestan-purple flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {showNewForm ? 'Отменить' : 'Добавить новое направление'}
            </Button>
            <Button onClick={() => navigate('/')}>
              Вернуться на главную
            </Button>
          </div>
        </div>
      )}
      
      {inDashboard && (
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">Управление направлениями</h2>
          <Button 
            onClick={() => setShowNewForm(!showNewForm)}
            className="bg-turkestan-purple flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {showNewForm ? 'Отменить' : 'Добавить новое направление'}
          </Button>
        </div>
      )}
      
      {showNewForm && (
        <Card className="mb-8 border-2 border-turkestan-purple">
          <CardContent className="p-4 space-y-4">
            <h2 className="text-xl font-semibold">Новое направление</h2>
            
            <div>
              <label className="block text-sm font-medium mb-1">Название</label>
              <Input
                value={newDestination.name}
                onChange={(e) => handleNewDestinationChange('name', e.target.value)}
                placeholder="Введите название направления"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Описание</label>
              <Textarea
                value={newDestination.description}
                onChange={(e) => handleNewDestinationChange('description', e.target.value)}
                placeholder="Введите описание направления"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Район</label>
              <Select
                value={newDestination.district}
                onValueChange={(value) => handleNewDestinationChange('district', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите район" />
                </SelectTrigger>
                <SelectContent>
                  {DISTRICTS.map((district) => (
                    <SelectItem key={district} value={district}>{district}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">URL изображения</label>
              <Input
                value={newDestination.image}
                onChange={(e) => handleNewDestinationChange('image', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Ссылка на Google Maps</label>
              <div className="flex gap-2">
                <Input
                  value={newDestination.google_maps_url}
                  onChange={(e) => handleNewDestinationChange('google_maps_url', e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                  className="flex-1"
                />
                {newDestination.google_maps_url && (
                  <Button
                    variant="outline"
                    onClick={() => handleTestGoogleMaps(newDestination.google_maps_url)}
                    className="flex items-center gap-1"
                  >
                    <Navigation className="h-4 w-4" /> Проверить
                  </Button>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Аудио файл (MP3 URL)</label>
              <div className="flex gap-2">
                <Input
                  value={newDestination.audio_file || ''}
                  onChange={(e) => handleNewDestinationChange('audio_file', e.target.value)}
                  placeholder="https://example.com/audio.mp3"
                  className="flex-1"
                />
                {newDestination.audio_file && (
                  <Button
                    variant="outline"
                    onClick={() => handleTestAudio(newDestination.audio_file || '')}
                    className="flex items-center gap-1"
                  >
                    <Upload className="h-4 w-4" /> Проверить
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end p-4 pt-0">
            <Button onClick={handleCreate}>
              Создать направление
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((destination) => (
          <Card key={destination.id} className="overflow-hidden">
            <div className="h-48 relative">
              <img 
                src={formData[destination.id]?.image || ''}
                alt={formData[destination.id]?.name || ''}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleDeleteDestination(destination.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Название</label>
                <Input
                  value={formData[destination.id]?.name || ''}
                  onChange={(e) => handleInputChange(destination.id, 'name', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Описание</label>
                <Textarea
                  value={formData[destination.id]?.description || ''}
                  onChange={(e) => handleInputChange(destination.id, 'description', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Район</label>
                <Select
                  value={formData[destination.id]?.district || 'Туркестан'}
                  onValueChange={(value) => handleInputChange(destination.id, 'district', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите район" />
                  </SelectTrigger>
                  <SelectContent>
                    {DISTRICTS.map((district) => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">URL изображения</label>
                <Input
                  value={formData[destination.id]?.image || ''}
                  onChange={(e) => handleInputChange(destination.id, 'image', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Ссылка на Google Maps</label>
                <div className="flex gap-2">
                  <Input
                    value={formData[destination.id]?.google_maps_url || ''}
                    onChange={(e) => handleInputChange(destination.id, 'google_maps_url', e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={() => handleTestGoogleMaps(formData[destination.id]?.google_maps_url || '')}
                    className="flex items-center gap-1"
                  >
                    <Navigation className="h-4 w-4" /> Тест
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Аудио файл (MP3 URL)</label>
                <div className="flex gap-2">
                  <Input
                    value={formData[destination.id]?.audio_file || ''}
                    onChange={(e) => handleInputChange(destination.id, 'audio_file', e.target.value)}
                    className="flex-1"
                    placeholder="https://example.com/audio.mp3"
                  />
                  {formData[destination.id]?.audio_file && (
                    <Button
                      variant="outline"
                      onClick={() => handleTestAudio(formData[destination.id]?.audio_file || '')}
                      className="flex items-center gap-1"
                    >
                      <Upload className="h-4 w-4" /> Тест
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={() => handleUpdate(destination.id)}
                className="flex items-center gap-2"
              >
                <Pencil className="h-4 w-4" />
                Сохранить
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {destinations.length === 0 && !showNewForm && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Направления не найдены</p>
          <Button onClick={() => setShowNewForm(true)}>
            Добавить первое направление
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminDestinations;
