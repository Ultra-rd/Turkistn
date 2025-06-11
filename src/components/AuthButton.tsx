
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LogIn, UserRound, Calendar, LayoutDashboard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

const AuthButton = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
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
    checkUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из системы",
    });
    navigate('/');
  };

  return (
    <div className="flex items-center gap-2">
      {isAdmin && (
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2"
        >
          <LayoutDashboard className="h-4 w-4" />
          Панель администратора
        </Button>
      )}
      <Button 
        onClick={handleLogout}
        className="flex items-center gap-2"
      >
        <LogIn className="h-4 w-4" />
        Выйти
      </Button>
    </div>
  );
};

export default AuthButton;
