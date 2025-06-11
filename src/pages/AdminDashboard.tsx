
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, MapPin, Compass, LayoutDashboard, Landmark, Users, UserCog } from 'lucide-react';

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const adminPages = [
    {
      title: "Пользователи",
      description: "Управление пользователями и их ролями",
      icon: UserCog,
      path: "/admin/users"
    },
    {
      title: "Мероприятия",
      description: "Управление мероприятиями и событиями",
      icon: Calendar,
      path: "/admin/events"
    },
    {
      title: "Туры",
      description: "Управление турами и экскурсиями",
      icon: Compass,
      path: "/admin/tours"
    },
    {
      title: "Направления",
      description: "Управление туристическими направлениями",
      icon: MapPin,
      path: "/admin/destinations"
    },
    {
      title: "Достопримечательности",
      description: "Управление достопримечательностями",
      icon: Landmark,
      path: "/admin/attractions"
    },
    {
      title: "Турагенты",
      description: "Управление турагентствами",
      icon: Users,
      path: "/admin/tour-agents"
    },
    {
      title: "Бронирования",
      description: "Просмотр и управление бронированиями",
      icon: LayoutDashboard,
      path: "/admin/bookings"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Панель администратора</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Вернуться на главную
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminPages.map((page) => (
            <Card 
              key={page.path} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(page.path)}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-turkestan-purple bg-opacity-10 p-3 rounded-full">
                  <page.icon className="h-6 w-6 text-turkestan-purple" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{page.title}</h2>
                  <p className="text-gray-500">{page.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
