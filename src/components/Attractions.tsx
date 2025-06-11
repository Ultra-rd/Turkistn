
import React, { useState } from 'react';
import { Landmark, Route, Map, Camera, Plus, Filter, GalleryVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAttractions, Attraction } from '@/hooks/use-attractions';
import AttractionDialog from '@/components/AttractionDialog';
import AttractionForm from '@/components/AttractionForm';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const attractionCategories = [
  {
    id: 1,
    name: 'Исторические места',
    description: 'Исследуйте древние города, мавзолеи и археологические памятники',
    icon: <Landmark className="h-8 w-8" />,
    color: 'bg-blue-100 text-blue-700'
  },
  {
    id: 2,
    name: 'Природные чудеса',
    description: 'Откройте для себя завораживающие пейзажи и природные заповедники',
    icon: <Map className="h-8 w-8" />,
    color: 'bg-green-100 text-green-700'
  },
  {
    id: 3,
    name: 'Культурный опыт',
    description: 'Погрузитесь в богатую культуру и традиции Туркестанской области',
    icon: <Camera className="h-8 w-8" />,
    color: 'bg-yellow-100 text-yellow-700'
  },
  {
    id: 4,
    name: 'Туристические маршруты',
    description: 'Следуйте по проверенным маршрутам для незабываемых приключений',
    icon: <Route className="h-8 w-8" />,
    color: 'bg-purple-100 text-purple-700'
  }
];

const Attractions = () => {
  const { 
    attractions, 
    isAdmin, 
    activeCategory,
    createAttraction, 
    updateAttraction, 
    deleteAttraction,
    filterAttractionsByCategory,
    getRelatedAttractions
  } = useAttractions();
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAttraction, setEditingAttraction] = useState<Attraction | undefined>(undefined);

  const handleDetailsClick = (attraction: Attraction) => {
    setSelectedAttraction(attraction);
    setIsDialogOpen(true);
  };

  const handleCategoryClick = (categoryId: number | undefined) => {
    filterAttractionsByCategory(categoryId);
  };

  const handleOpenAddForm = () => {
    setEditingAttraction(undefined);
    setIsFormOpen(true);
  };

  const handleEditAttraction = (attraction: Attraction) => {
    setEditingAttraction(attraction);
    setIsDialogOpen(false);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: Omit<Attraction, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingAttraction && editingAttraction.id) {
      return await updateAttraction(editingAttraction.id, data);
    } else {
      return await createAttraction(data);
    }
  };

  return (
    <section id="attractions" className="py-16 bg-turkestan-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-turkestan-blue mb-4">
            Удивительные достопримечательности
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Откройте для себя богатство культурного и природного наследия Туркестана
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Tabs 
              defaultValue={activeCategory?.toString() || "all"} 
              className="w-full max-w-lg"
              onValueChange={(value) => handleCategoryClick(value === "all" ? undefined : parseInt(value))}
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
            
            {isAdmin && (
              <Button 
                className="bg-turkestan-purple hover:bg-turkestan-blue flex items-center gap-2"
                onClick={handleOpenAddForm}
              >
                <Plus className="h-4 w-4" /> Добавить
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {attractions.length > 0 ? attractions.map((attraction) => (
              <div 
                key={attraction.id}
                onClick={() => handleDetailsClick(attraction)}
                className="group cursor-pointer relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={attraction.image} 
                    alt={attraction.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                    <div className="p-3 w-full">
                      <h3 className="text-white font-semibold text-sm truncate">{attraction.title}</h3>
                      <p className="text-white/80 text-xs line-clamp-1">{attraction.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">Нет достопримечательностей для выбранной категории</p>
                {isAdmin && (
                  <Button 
                    onClick={handleOpenAddForm}
                    className="mt-4 bg-turkestan-purple hover:bg-turkestan-blue"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Добавить достопримечательность
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attraction Detail Dialog */}
      <AttractionDialog 
        attraction={selectedAttraction}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isAdmin={isAdmin}
        onEdit={handleEditAttraction}
        onDelete={deleteAttraction}
        relatedAttractions={selectedAttraction ? getRelatedAttractions(selectedAttraction.id) : []}
      />

      {/* Attraction Form Dialog */}
      <AttractionForm 
        attraction={editingAttraction}
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
      />
    </section>
  );
};

export default Attractions;
