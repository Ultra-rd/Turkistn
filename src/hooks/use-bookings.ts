
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type Booking = {
  id: string;
  full_name: string;
  phone: string;
  created_at: string;
  tour_id: number;
  user_id: string;
  tours?: {
    title: string;
  };
};

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
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

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Ошибка",
          description: "Пользователь не авторизован",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Check if user is admin
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      const isUserAdmin = profileData?.role === 'admin';
      setIsAdmin(isUserAdmin);
      
      // Fetch bookings based on user role
      let { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*');
        
      // Filter bookings only if the user is not an admin
      if (!isUserAdmin) {
        bookingsData = bookingsData?.filter(booking => booking.user_id === user.id) || [];
      }

      if (bookingsError) {
        console.error("Error fetching bookings:", bookingsError);
        toast({
          title: "Ошибка",
          description: bookingsError.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      console.log("Fetched bookings:", bookingsData?.length || 0, "User is admin:", isUserAdmin);

      // For each booking, fetch the tour title
      const bookingsWithTours = await Promise.all((bookingsData || []).map(async (booking) => {
        const { data: tourData, error: tourError } = await supabase
          .from('tours')
          .select('title')
          .eq('id', booking.tour_id)
          .single();
        
        if (tourError) {
          console.error("Error fetching tour data:", tourError);
        }
        
        return {
          ...booking,
          tours: tourData ? { title: tourData.title } : { title: 'Тур не найден' }
        };
      }));

      setBookings(bookingsWithTours);
    } catch (error) {
      console.error("Unexpected error in fetchBookings:", error);
      toast({
        title: "Ошибка",
        description: "Произошла непредвиденная ошибка при загрузке бронирований",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить это бронирование?')) {
      return;
    }
    
    const { error } = await supabase
      .from('bookings')
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
      description: "Бронирование успешно удалено",
    });
    fetchBookings();
  };

  return {
    bookings,
    fetchBookings,
    handleDelete,
    isAdmin,
    isLoading,
  };
};
