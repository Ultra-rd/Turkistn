
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const AdminNewTour = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    group_size: '',
    start_dates: '',
    image: '',
    featured: false
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.price || !formData.duration || !formData.image) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }
    
    const { error } = await supabase
      .from('tours')
      .insert([formData]);

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
      description: "Новый тур успешно создан",
    });
    navigate('/admin/tours');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Добавление нового тура</h1>
        <Button onClick={() => navigate('/admin/tours')}>
          Вернуться к списку туров
        </Button>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Информация о туре</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Название тура *</label>
              <Input
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Введите название тура"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Описание *</label>
              <Textarea
                required
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Опишите детали тура"
                rows={4}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Цена *</label>
              <Input
                required
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="Например: 30 000 ₸"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Продолжительность *</label>
                <Input
                  required
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="Например: 2 дня"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Размер группы</label>
                <Input
                  value={formData.group_size}
                  onChange={(e) => handleInputChange('group_size', e.target.value)}
                  placeholder="Например: 2-15 человек"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Даты</label>
              <Input
                value={formData.start_dates}
                onChange={(e) => handleInputChange('start_dates', e.target.value)}
                placeholder="Например: Еженедельно"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">URL изображения *</label>
              <Input
                required
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                placeholder="Введите URL изображения"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="featured" 
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange('featured', checked)}
              />
              <label 
                htmlFor="featured" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Популярный тур
              </label>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-turkestan-purple">
              Создать тур
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminNewTour;
