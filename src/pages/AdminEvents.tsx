
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Calendar, Clock, MapPin, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useEvents, Event } from '@/hooks/use-events';

interface AdminEventsProps {
  inDashboard?: boolean;
}

const AdminEvents: React.FC<AdminEventsProps> = ({ inDashboard = false }) => {
  const [formData, setFormData] = useState<{ [key: string]: Partial<Event> }>({});
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    name: '',
    description: '',
    date: '',
    time: '',
    location: ''
  });
  const [showNewForm, setShowNewForm] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { 
    events, 
    isAdmin, 
    isLoading, 
    handleDeleteEvent, 
    handleUpdateEvent, 
    handleCreateEvent 
  } = useEvents();

  useEffect(() => {
    if (!inDashboard) {
      checkAdmin();
    }
    // Initialize form data from events
    const initialFormData: { [key: string]: Partial<Event> } = {};
    events.forEach(event => {
      initialFormData[event.id] = { ...event };
    });
    setFormData(initialFormData);
  }, [events, inDashboard]);

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

  const handleNewEventChange = (field: string, value: string) => {
    setNewEvent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreate = async () => {
    // Validate required fields
    if (!newEvent.name || !newEvent.description || 
        !newEvent.date || !newEvent.time || !newEvent.location) {
      toast({
        title: "Ошибка",
        description: "Все поля обязательны для заполнения",
        variant: "destructive",
      });
      return;
    }

    const success = await handleCreateEvent(newEvent);
    if (success) {
      setNewEvent({
        name: '',
        description: '',
        date: '',
        time: '',
        location: ''
      });
      setShowNewForm(false);
    }
  };

  const handleUpdate = async (id: number) => {
    await handleUpdateEvent(id, formData[id]);
  };

  if (isLoading) {
    return <div className={`${inDashboard ? '' : 'container mx-auto py-8'} text-center`}>Загрузка...</div>;
  }

  return (
    <div className={`${inDashboard ? '' : 'container mx-auto py-8'}`}>
      {!inDashboard && (
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Управление мероприятиями</h1>
          <div className="flex gap-4">
            <Button 
              onClick={() => setShowNewForm(!showNewForm)}
              className="bg-turkestan-purple hover:bg-purple-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {showNewForm ? 'Отменить' : 'Добавить новое мероприятие'}
            </Button>
            <Button onClick={() => navigate('/')}>
              Вернуться на главную
            </Button>
          </div>
        </div>
      )}
      
      {!inDashboard && showNewForm && (
        <Card className="mb-8 border-2 border-turkestan-purple">
          <CardContent className="p-4 space-y-4">
            <h2 className="text-xl font-semibold">Новое мероприятие</h2>
            
            <div>
              <label className="block text-sm font-medium mb-1">Название</label>
              <Input
                value={newEvent.name}
                onChange={(e) => handleNewEventChange('name', e.target.value)}
                placeholder="Введите название мероприятия"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Описание</label>
              <Textarea
                value={newEvent.description}
                onChange={(e) => handleNewEventChange('description', e.target.value)}
                placeholder="Введите описание мероприятия"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Дата</label>
              <div className="flex gap-2">
                <Input
                  value={newEvent.date}
                  onChange={(e) => handleNewEventChange('date', e.target.value)}
                  placeholder="15 мая 2025"
                  className="flex-1"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Время</label>
              <div className="flex gap-2">
                <Input
                  value={newEvent.time}
                  onChange={(e) => handleNewEventChange('time', e.target.value)}
                  placeholder="10:00 - 18:00"
                  className="flex-1"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Место проведения</label>
              <div className="flex gap-2">
                <Input
                  value={newEvent.location}
                  onChange={(e) => handleNewEventChange('location', e.target.value)}
                  placeholder="Центральная площадь, Туркестан"
                  className="flex-1"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end p-4 pt-0">
            <Button onClick={handleCreate}>
              Создать мероприятие
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {inDashboard && (
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">Управление мероприятиями</h2>
          <Button 
            onClick={() => setShowNewForm(!showNewForm)}
            className="bg-turkestan-purple hover:bg-purple-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {showNewForm ? 'Отменить' : 'Добавить новое мероприятие'}
          </Button>
        </div>
      )}
      
      {inDashboard && showNewForm && (
        <Card className="mb-8 border-2 border-turkestan-purple">
          <CardContent className="p-4 space-y-4">
            <h2 className="text-xl font-semibold">Новое мероприятие</h2>
            
            <div>
              <label className="block text-sm font-medium mb-1">Название</label>
              <Input
                value={newEvent.name}
                onChange={(e) => handleNewEventChange('name', e.target.value)}
                placeholder="Введите название мероприятия"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Описание</label>
              <Textarea
                value={newEvent.description}
                onChange={(e) => handleNewEventChange('description', e.target.value)}
                placeholder="Введите описание мероприятия"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Дата</label>
              <div className="flex gap-2">
                <Input
                  value={newEvent.date}
                  onChange={(e) => handleNewEventChange('date', e.target.value)}
                  placeholder="15 мая 2025"
                  className="flex-1"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Время</label>
              <div className="flex gap-2">
                <Input
                  value={newEvent.time}
                  onChange={(e) => handleNewEventChange('time', e.target.value)}
                  placeholder="10:00 - 18:00"
                  className="flex-1"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Место проведения</label>
              <div className="flex gap-2">
                <Input
                  value={newEvent.location}
                  onChange={(e) => handleNewEventChange('location', e.target.value)}
                  placeholder="Центральная площадь, Туркестан"
                  className="flex-1"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end p-4 pt-0">
            <Button onClick={handleCreate}>
              Создать мероприятие
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Название</label>
                <Input
                  value={formData[event.id]?.name || ''}
                  onChange={(e) => handleInputChange(event.id, 'name', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Описание</label>
                <Textarea
                  value={formData[event.id]?.description || ''}
                  onChange={(e) => handleInputChange(event.id, 'description', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Дата</label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <Input
                    value={formData[event.id]?.date || ''}
                    onChange={(e) => handleInputChange(event.id, 'date', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Время</label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <Input
                    value={formData[event.id]?.time || ''}
                    onChange={(e) => handleInputChange(event.id, 'time', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Место проведения</label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <Input
                    value={formData[event.id]?.location || ''}
                    onChange={(e) => handleInputChange(event.id, 'location', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="destructive" 
                className="flex items-center gap-2"
                onClick={() => handleDeleteEvent(event.id)}
              >
                <Trash2 className="h-4 w-4" />
                Удалить
              </Button>
              <Button 
                onClick={() => handleUpdate(event.id)}
                className="flex items-center gap-2"
              >
                <Pencil className="h-4 w-4" />
                Сохранить
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {events.length === 0 && !showNewForm && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Мероприятия не найдены</p>
          <Button onClick={() => setShowNewForm(true)}>
            Добавить первое мероприятие
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
