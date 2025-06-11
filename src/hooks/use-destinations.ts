
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Destination {
  id: number;
  name: string;
  description: string;
  image: string;
  google_maps_url: string;
  district: string;
  detailed_info?: string;
  audio_file?: string;
}

export const useDestinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  const fetchDestinations = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .order('id');
    
    if (error) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    setDestinations(data || []);
    setIsLoading(false);
  };

  const handleDeleteDestination = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить это направление?')) {
      return;
    }
    
    const { error } = await supabase
      .from('destinations')
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
      description: "Направление успешно удалено",
    });
    
    fetchDestinations();
  };

  const handleUpdateDestination = async (id: number, updates: Partial<Destination>) => {
    const { error } = await supabase
      .from('destinations')
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
      description: "Направление успешно обновлено",
    });
    
    fetchDestinations();
    return true;
  };

  const handleCreateDestination = async (destination: Omit<Destination, 'id'>) => {
    const { error } = await supabase
      .from('destinations')
      .insert([destination]);

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
      description: "Направление успешно создано",
    });
    
    fetchDestinations();
    return true;
  };

  useEffect(() => {
    fetchDestinations();
    checkAdminStatus();
  }, []);

  return {
    destinations,
    isAdmin,
    isLoading,
    fetchDestinations,
    handleDeleteDestination,
    handleUpdateDestination,
    handleCreateDestination
  };
};
