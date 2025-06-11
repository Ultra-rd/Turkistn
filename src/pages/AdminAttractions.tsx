
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Plus, Edit, Trash, Filter, GalleryVertical } from 'lucide-react';
import { useAttractions, Attraction } from '@/hooks/use-attractions';
import AttractionForm from '@/components/AttractionForm';
import { attractionCategories } from '@/components/Attractions';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminAttractions = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { 
    attractions, 
    isLoading, 
    createAttraction, 
    updateAttraction, 
    deleteAttraction,
    filterAttractionsByCategory,
    activeCategory
  } = useAttractions();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAttraction, setEditingAttraction] = useState<Attraction | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'grid' | 'gallery'>('grid');

  useEffect(() => {
    checkAdmin();
  }, []);

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

  const handleAddNew = () => {
    setEditingAttraction(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (attraction: Attraction) => {
    setEditingAttraction(attraction);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: Omit<Attraction, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingAttraction && editingAttraction.id) {
      return await updateAttraction(editingAttraction.id, data);
    } else {
      return await createAttraction(data);
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = attractionCategories.find(c => c.id === categoryId);
    return category ? category.name : 'Неизвестная категория';
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'gallery' : 'grid');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Управление достопримечательностями</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Назад к панели
            </Button>
            <Button 
              onClick={handleAddNew}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Добавить
            </Button>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Tabs 
            defaultValue={activeCategory?.toString() || "all"} 
            className="w-full max-w-lg"
            onValueChange={(value) => filterAttractionsByCategory(value === "all" ? undefined : parseInt(value))}
          >
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="all" className="text-xs md:text-sm">
                <Filter className="h-4 w-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">Все</span>
              </TabsTrigger>
              {attractionCategories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id.toString()} className="text-xs md:text-sm">
                  {cat.icon}
                  <span className="hidden md:inline ml-1">{cat.name.split(' ')[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Button 
            variant="outline" 
            onClick={toggleViewMode}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <GalleryVertical className="h-4 w-4" />
            {viewMode === 'grid' ? 'Вид галереи' : 'Вид карточек'}
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p>Загрузка...</p>
          </div>
        ) : attractions.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <p className="text-gray-500">Нет достопримечательностей. Добавьте первую!</p>
              <Button 
                onClick={handleAddNew} 
                className="mt-4 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Добавить достопримечательность
              </Button>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions.map((attraction) => (
              <Card key={attraction.id} className="overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={attraction.image} 
                    alt={attraction.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="pt-4">
                  <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full w-fit mb-2">
                    {getCategoryName(attraction.category_id)}
                  </div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{attraction.title}</h3>
                  <p className="text-gray-600 line-clamp-2">{attraction.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(attraction)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Редактировать
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteAttraction(attraction.id)}>
                    <Trash className="h-4 w-4 mr-1" />
                    Удалить
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {attractions.map((attraction) => (
              <div key={attraction.id} className="group relative">
                <div className="aspect-square rounded-md overflow-hidden">
                  <img 
                    src={attraction.image} 
                    alt={attraction.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2 p-2">
                    <p className="text-white text-sm font-medium text-center">{attraction.title}</p>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(attraction)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" className="h-8 w-8 p-0" onClick={() => deleteAttraction(attraction.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mt-1 px-1">
                  <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    {getCategoryName(attraction.category_id)}
                  </span>
                </div>
              </div>
            ))}
            <div 
              className="aspect-square rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={handleAddNew}
            >
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        )}
      </div>

      {/* Attraction Form Dialog */}
      <AttractionForm 
        attraction={editingAttraction}
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default AdminAttractions;
