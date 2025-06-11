
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TourAgent {
  id: number;
  name: string;
  logo: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}

export const useTourAgents = (limit?: number) => {
  const [tourAgents, setTourAgents] = useState<TourAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
    fetchTourAgents();
  }, []);

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

  const fetchTourAgents = async () => {
    try {
      let query = supabase
        .from('tour_agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTourAgents(data || []);
    } catch (error) {
      console.error('Error fetching tour agents:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список турагентов",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteTourAgent = async (id: number) => {
    try {
      const { error } = await supabase
        .from('tour_agents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTourAgents(prev => prev.filter(agent => agent.id !== id));
      toast({
        title: "Успешно",
        description: "Турагент удален",
      });
    } catch (error) {
      console.error('Error deleting tour agent:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить турагента",
        variant: "destructive",
      });
    }
  };

  return {
    tourAgents,
    loading,
    isAdmin,
    deleteTourAgent,
    refetch: fetchTourAgents
  };
};
