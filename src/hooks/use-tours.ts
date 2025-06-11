
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Tour {
  id: number;
  title: string;
  description: string;
  duration: string;
  group_size: string;
  start_dates: string;
  price: string;
  image: string;
  featured?: boolean;
}

export const useTours = (showAllByDefault = false) => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [visibleTours, setVisibleTours] = useState<Tour[]>([]);
  const [showAllTours, setShowAllTours] = useState(showAllByDefault);
  const [isAdmin, setIsAdmin] = useState(false);
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
    if (data) {
      if (showAllByDefault) {
        setVisibleTours(data);
      } else {
        const featured = data.filter(tour => tour.featured);
        setVisibleTours(featured.length >= 3 ? featured : data.slice(0, 3));
      }
    }
  };

  const handleDeleteTour = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Вы уверены, что хотите удалить этот тур?')) {
      return;
    }
    
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

  const handleShowAllTours = () => {
    setShowAllTours(true);
    setVisibleTours(tours);
  };

  useEffect(() => {
    fetchTours();
    checkAdminStatus();
  }, [showAllByDefault]);

  return {
    tours,
    visibleTours,
    showAllTours,
    isAdmin,
    handleDeleteTour,
    handleShowAllTours,
  };
};
