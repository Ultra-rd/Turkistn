
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: 'user' | 'admin' | 'tour_agent';
  created_at: string;
  tour_agents?: { id: number; name: string; }[];
}

interface UserTourAgentRelation {
  user_id: string;
  tour_agents: {
    id: number;
    name: string;
  } | null;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
    fetchUsers();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Используем новую функцию для проверки роли
      const { data, error } = await supabase.rpc('get_current_user_role');
      if (!error && data) {
        setIsAdmin(data === 'admin');
      }
    }
  };

  const fetchUsers = async () => {
    try {
      // Получаем профили пользователей с email
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Получаем связи пользователей с турагентами
      const { data: userTourAgents, error: utaError } = await supabase
        .from('user_tour_agents')
        .select(`
          user_id,
          tour_agents (
            id,
            name
          )
        `);

      if (utaError) throw utaError;

      // Создаем список пользователей с email из таблицы profiles
      const usersWithEmails = profiles?.map(profile => {
        const userAgents = (userTourAgents as UserTourAgentRelation[])?.filter(uta => uta.user_id === profile.id)
          .map(uta => uta.tour_agents)
          .filter((agent): agent is { id: number; name: string } => agent !== null) || [];
        
        return {
          ...profile,
          email: profile.email || 'Email не указан', // Теперь используем email из profiles
          tour_agents: userAgents
        };
      }) || [];

      setUsers(usersWithEmails);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список пользователей",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'user' | 'admin' | 'tour_agent') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: "Успешно",
        description: "Роль пользователя обновлена",
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить роль пользователя",
        variant: "destructive",
      });
    }
  };

  const assignTourAgent = async (userId: string, tourAgentId: number) => {
    try {
      const { error } = await supabase
        .from('user_tour_agents')
        .insert([{ user_id: userId, tour_agent_id: tourAgentId }]);

      if (error) throw error;

      await fetchUsers(); // Перезагружаем данные
      toast({
        title: "Успешно",
        description: "Пользователь назначен турагентом",
      });
    } catch (error) {
      console.error('Error assigning tour agent:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось назначить пользователя турагентом",
        variant: "destructive",
      });
    }
  };

  const removeTourAgent = async (userId: string, tourAgentId: number) => {
    try {
      const { error } = await supabase
        .from('user_tour_agents')
        .delete()
        .eq('user_id', userId)
        .eq('tour_agent_id', tourAgentId);

      if (error) throw error;

      await fetchUsers(); // Перезагружаем данные
      toast({
        title: "Успешно",
        description: "Пользователь удален из турагентов",
      });
    } catch (error) {
      console.error('Error removing tour agent:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить пользователя из турагентов",
        variant: "destructive",
      });
    }
  };

  return {
    users,
    loading,
    isAdmin,
    updateUserRole,
    assignTourAgent,
    removeTourAgent,
    refetch: fetchUsers
  };
};
