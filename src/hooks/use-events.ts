
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  created_at?: string;
  updated_at?: string;
}

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
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

  const fetchEvents = async () => {
    setIsLoading(true);
    
    // Use the correct table name and properly type the response
    const { data, error } = await supabase
      .from('events')
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

    // Make sure we handle the data correctly
    setEvents(data as Event[]);
    setIsLoading(false);
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить это мероприятие?')) {
      return;
    }
    
    const { error } = await supabase
      .from('events')
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
      description: "Мероприятие успешно удалено",
    });
    
    fetchEvents();
  };

  const handleUpdateEvent = async (id: number, updates: Partial<Event>) => {
    const { error } = await supabase
      .from('events')
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
      description: "Мероприятие успешно обновлено",
    });
    
    fetchEvents();
    return true;
  };

  const handleCreateEvent = async (event: Omit<Event, 'id'>) => {
    const { error } = await supabase
      .from('events')
      .insert([event]);

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
      description: "Мероприятие успешно создано",
    });
    
    fetchEvents();
    return true;
  };

  useEffect(() => {
    fetchEvents();
    checkAdminStatus();
  }, []);

  return {
    events,
    isAdmin,
    isLoading,
    fetchEvents,
    handleDeleteEvent,
    handleUpdateEvent,
    handleCreateEvent
  };
};
