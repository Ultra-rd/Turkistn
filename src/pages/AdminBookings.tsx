
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useBookings } from '@/hooks/use-bookings';
import { BookingsTable } from '@/components/bookings/BookingsTable';
import { BookingsSearch } from '@/components/bookings/BookingsSearch';
import { Loader2 } from 'lucide-react';

const AdminBookings = () => {
  const { bookings, fetchBookings, handleDelete, isAdmin, isLoading } = useBookings();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: string | null,
    direction: 'ascending' | 'descending'
  }>({
    key: 'created_at',
    direction: 'descending'
  });
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
      } else {
        console.log("Admin access confirmed, fetching bookings");
        fetchBookings(); // Fetch bookings after confirming admin rights
      }
    } else {
      navigate('/auth');
    }
  };

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredBookings = bookings.filter(booking => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      booking.full_name.toLowerCase().includes(searchTermLower) ||
      booking.phone.toLowerCase().includes(searchTermLower) ||
      (booking.tours?.title || '').toLowerCase().includes(searchTermLower)
    );
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const key = sortConfig.key as keyof typeof a;
    
    let aValue, bValue;
    
    if (key === 'tours') {
      aValue = a.tours?.title || '';
      bValue = b.tours?.title || '';
    } else {
      aValue = a[key];
      bValue = b[key];
    }

    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление бронированиями</h1>
        <div className="flex gap-4">
          <Button onClick={() => navigate('/admin/tours')}>
            Управление турами
          </Button>
          <Button onClick={() => navigate('/')}>
            Вернуться на главную
          </Button>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <BookingsSearch 
          value={searchTerm}
          onChange={setSearchTerm}
        />
        
        <Button 
          onClick={() => fetchBookings()} 
          variant="outline"
          className="ml-2"
        >
          Обновить данные
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-turkestan-purple" />
        </div>
      ) : sortedBookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-md">
          <p className="text-gray-500">Бронирования не найдены</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => fetchBookings()}
          >
            Обновить
          </Button>
        </div>
      ) : (
        <BookingsTable 
          bookings={sortedBookings}
          onDelete={handleDelete}
          onSort={requestSort}
          sortConfig={sortConfig}
        />
      )}
    </div>
  );
};

export default AdminBookings;
