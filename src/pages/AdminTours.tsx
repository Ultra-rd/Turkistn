
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

interface AdminToursProps {
  inDashboard?: boolean;
}

const AdminTours: React.FC<AdminToursProps> = ({ inDashboard = false }) => {
  const [tours, setTours] = useState<any[]>([]);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTours();
    if (!inDashboard) {
      checkAdmin();
    }
  }, [inDashboard]);

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

  const fetchTours = async () => {
    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .order('id');
    
    if (error) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    
    setTours(data || []);
    
    // Initialize form data
    const initialFormData: { [key: string]: any } = {};
    data?.forEach(tour => {
      initialFormData[tour.id] = { ...tour };
    });
    setFormData(initialFormData);
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

  const handleUpdate = async (id: number) => {
    const { error } = await supabase
      .from('tours')
      .update(formData[id])
      .eq('id', id);

    if (error) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Успех",
      description: "Тур успешно обновлен",
    });
    fetchTours();
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from('tours')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Успех",
      description: "Тур успешно удален",
    });
    fetchTours();
  };

  const handleCreateNewTour = () => {
    navigate('/admin/tours/new');
  };

  return (
    <div className={`${inDashboard ? '' : 'container mx-auto py-8'}`}>
      {!inDashboard && (
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Управление турами</h1>
          <div className="flex gap-4">
            <Button 
              onClick={handleCreateNewTour}
              className="bg-turkestan-purple flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Добавить новый тур
            </Button>
            <Button onClick={() => navigate('/')}>
              Вернуться на главную
            </Button>
          </div>
        </div>
      )}
      
      {inDashboard && (
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">Управление турами</h2>
          <Button 
            onClick={handleCreateNewTour}
            className="bg-turkestan-purple flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Добавить новый тур
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <Card key={tour.id} className="overflow-hidden">
            <img 
              src={formData[tour.id]?.image || ''} 
              alt={formData[tour.id]?.title || ''} 
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Название тура</label>
                <Input
                  value={formData[tour.id]?.title || ''}
                  onChange={(e) => handleInputChange(tour.id, 'title', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Цена</label>
                <Input
                  value={formData[tour.id]?.price || ''}
                  onChange={(e) => handleInputChange(tour.id, 'price', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Продолжительность</label>
                <Input
                  value={formData[tour.id]?.duration || ''}
                  onChange={(e) => handleInputChange(tour.id, 'duration', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Размер группы</label>
                <Input
                  value={formData[tour.id]?.group_size || ''}
                  onChange={(e) => handleInputChange(tour.id, 'group_size', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Даты</label>
                <Input
                  value={formData[tour.id]?.start_dates || ''}
                  onChange={(e) => handleInputChange(tour.id, 'start_dates', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Описание</label>
                <Textarea
                  value={formData[tour.id]?.description || ''}
                  onChange={(e) => handleInputChange(tour.id, 'description', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">URL изображения</label>
                <Input
                  value={formData[tour.id]?.image || ''}
                  onChange={(e) => handleInputChange(tour.id, 'image', e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="destructive" 
                className="flex items-center gap-2"
                onClick={() => handleDelete(tour.id)}
              >
                <Trash2 className="h-4 w-4" />
                Удалить
              </Button>
              <Button onClick={() => handleUpdate(tour.id)}>
                Сохранить
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {tours.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Туры не найдены</p>
          <Button onClick={handleCreateNewTour}>
            Добавить первый тур
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminTours;
