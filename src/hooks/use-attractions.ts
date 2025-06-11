
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Attraction {
  id: string;
  category_id: number;
  title: string;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
}

export const useAttractions = (categoryId?: number) => {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [filteredAttractions, setFilteredAttractions] = useState<Attraction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | undefined>(categoryId);
  const { toast } = useToast();

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

  const fetchAttractions = async () => {
    setIsLoading(true);
    let query = supabase.from('attractions').select('*');
    
    if (activeCategory !== undefined) {
      query = query.eq('category_id', activeCategory);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    setAttractions(data || []);
    setFilteredAttractions(data || []);
    setIsLoading(false);
  };

  const createAttraction = async (attraction: Omit<Attraction, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('attractions')
      .insert([attraction])
      .select();

    if (error) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Успех",
      description: "Достопримечательность добавлена",
    });
    
    fetchAttractions();
    return true;
  };

  const updateAttraction = async (id: string, updates: Partial<Omit<Attraction, 'id' | 'created_at' | 'updated_at'>>) => {
    const { error } = await supabase
      .from('attractions')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Успех",
      description: "Достопримечательность обновлена",
    });
    
    fetchAttractions();
    return true;
  };

  const deleteAttraction = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту достопримечательность?')) {
      return false;
    }
    
    const { error } = await supabase
      .from('attractions')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Успех",
      description: "Достопримечательность удалена",
    });
    
    fetchAttractions();
    return true;
  };

  const filterAttractionsByCategory = (categoryId?: number) => {
    setActiveCategory(categoryId);
    if (categoryId === undefined) {
      setFilteredAttractions(attractions);
    } else {
      setFilteredAttractions(attractions.filter(a => a.category_id === categoryId));
    }
  };

  const getRelatedAttractions = (attractionId: string, limit = 3) => {
    const currentAttraction = attractions.find(a => a.id === attractionId);
    if (!currentAttraction) return [];
    
    return attractions
      .filter(a => a.id !== attractionId && a.category_id === currentAttraction.category_id)
      .slice(0, limit);
  };

  useEffect(() => {
    fetchAttractions();
    checkAdminStatus();
  }, [activeCategory]);

  return {
    attractions: filteredAttractions,
    isLoading,
    isAdmin,
    activeCategory,
    fetchAttractions,
    createAttraction,
    updateAttraction,
    deleteAttraction,
    filterAttractionsByCategory,
    getRelatedAttractions
  };
};
